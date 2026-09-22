"""
FastAPI Server & WebSocket Telemetry Gateway
AERIS-TWIN — Real-Time Continuous Telemetry Evaluation & Evidence Backend
Supports LIVE (Arduino Uno USB-Serial + Network Sources) and SIMULATION/TEST modes.
"""
import asyncio
import json
import os
import time
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional

import serial
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from .database import (
    init_db, log_event, get_db_connection,
    get_recent_telemetry_rows
)
from .simulation.aero_simulator import AeroEngineSimulator
from .simulation.replay_engine import ReplayEngine
from .simulation.sources import (
    LiveStreamSource, SimulationSource, FileReplaySource, MAVLinkSource
)
from .twin_service import TwinUpdateService
from .validation.experiment_runner import ExperimentRunner
from .evaluator.questions_registry import EVALUATOR_QUESTIONS
from .evaluator.limitations import SYSTEM_LIMITATIONS
from .models.telemetry import (
    ScenarioRequest, ParameterOverrideRequest,
    FaultInjectionRequest, WhatIfRequest, TelemetryPacket,
    MotorPrototypePacket, PROFILE_AERO_ENGINE, PROFILE_MOTOR_PROTOTYPE
)

# Initialize core subsystems
init_db()
simulator = AeroEngineSimulator(seed=42)
twin_service = TwinUpdateService()
replay_engine = ReplayEngine(twin_service=twin_service)
experiment_runner = ExperimentRunner()

# Multi-source telemetry abstractions
live_source = LiveStreamSource(stale_timeout_sec=3.0, disconnect_timeout_sec=6.0)
mavlink_source = MAVLinkSource()

# Arduino USB-Serial Ingestion Configuration
ARDUINO_PORT = os.getenv("ARDUINO_PORT", "COM5")  
ARDUINO_BAUD = int(os.getenv("ARDUINO_BAUD", "115200"))

# System Mode & Frequency State
class SystemState:
    mode: str = "LIVE"  # "LIVE" or "SIMULATION"
    target_rate_hz: float = 10.0  # 1.0, 5.0, 10.0, 20.0
    is_paused: bool = False

system_state = SystemState()

# Request schemas for endpoints
class ModeRequest(BaseModel):
    mode: str = Field(..., description="LIVE or SIMULATION")

class RateRequest(BaseModel):
    rate_hz: float = Field(..., ge=1.0, le=50.0, description="Target evaluation frequency in Hz")

class ReplaySeekRequest(BaseModel):
    frame_index: Optional[int] = Field(None, ge=0)
    position: Optional[float] = Field(None, ge=0.0)

class ReplaySpeedRequest(BaseModel):
    speed: float = Field(..., ge=0.1, le=20.0)

class FlightTimeResetRequest(BaseModel):
    seconds: int = Field(0, ge=0, description="Target seconds to reset mission flight time to")

class StreamPauseRequest(BaseModel):
    is_paused: Optional[bool] = Field(None, description="Explicit boolean pause state or toggle if None")


# Connected WebSocket clients manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        disconnected = []
        for conn in self.active_connections:
            try:
                await conn.send_json(message)
            except Exception:
                disconnected.append(conn)
        for dead in disconnected:
            self.disconnect(dead)

manager = ConnectionManager()

# ==============================================================================
# ARDUINO USB SERIAL INGESTION TASK
# ==============================================================================
async def arduino_serial_reader_loop():
    """
    Background worker that connects to the Arduino Uno USB Serial port,
    reads raw JSON telemetry lines, normalizes them, and feeds live_source.
    """
    ser: Optional[serial.Serial] = None

    while True:
        try:
            if system_state.mode == "LIVE":
                if ser is None or not ser.is_open:
                    try:
                        ser = serial.Serial(ARDUINO_PORT, ARDUINO_BAUD, timeout=0.2)
                        log_event(f"Arduino Uno Connected on {ARDUINO_PORT} at {ARDUINO_BAUD} baud", "info", "SerialBridge")
                    except Exception:
                        ser = None
                        await asyncio.sleep(2.0)
                        continue

                if ser and ser.in_waiting > 0:
                    raw_bytes = ser.readline()
                    line = raw_bytes.decode("utf-8", errors="ignore").strip()

                    if line.startswith("{") and line.endswith("}"):
                        try:
                            packet_dict = json.loads(line)
                            packet_dict["source"] = "ARDUINO_UNO"
                            packet_dict["device_id"] = "AERIS-UNO-PROTOTYPE"

                            normalized = normalize_telemetry_packet(packet_dict)
                            live_source.push_frame(normalized)
                        except json.JSONDecodeError:
                            pass
            else:
                # If switched to simulation, release or sleep port
                if ser and ser.is_open:
                    ser.close()
                    ser = None
                await asyncio.sleep(1.0)

        except (serial.SerialException, OSError) as err:
            log_event(f"Serial Connection Error on {ARDUINO_PORT}: {str(err)}", "warning", "SerialBridge")
            if ser:
                try:
                    ser.close()
                except Exception:
                    pass
            ser = None
            await asyncio.sleep(2.0)
        except Exception as e:
            log_event(f"Unexpected Serial Loop Error: {str(e)}", "error", "SerialBridge")
            await asyncio.sleep(1.0)

        await asyncio.sleep(0.01)


# ==============================================================================
# TELEMETRY BROADCAST LOOP
# ==============================================================================
async def telemetry_broadcast_loop():
    while True:
        try:
            if not system_state.is_paused:
                if system_state.mode == "LIVE":
                    status_info = live_source.get_status()
                    if live_source.is_connected():
                        raw_frame = live_source.get_frame()
                        if raw_frame is not None:
                            raw_frame["source"] = raw_frame.get("source", "LIVE")
                            raw_frame["is_simulated"] = False
                            pipeline_out = twin_service.process_telemetry_frame(raw_frame)
                            
                            payload = {
                                "type": "TELEMETRY_UPDATE",
                                "mode": "LIVE",
                                "connected": True,
                                "status": "LIVE" if not live_source.is_stale() else "STALE",
                                "data": pipeline_out,
                                "state": raw_frame,
                                "history": simulator.history,
                                "inference": pipeline_out["inference"],
                                "twin_state": pipeline_out["twin_state"],
                                "dashboard_view": pipeline_out["dashboard_view"],
                                "residuals": pipeline_out["residuals"],
                                "expected_physics": pipeline_out["expected_physics"],
                                "sensor_trust": pipeline_out["sensor_trust"],
                                "alerts": pipeline_out.get("alerts", []),
                                "events": pipeline_out.get("events", []),
                                "primary_evidence": pipeline_out.get("primary_evidence", []),
                                "stream_metrics": status_info,
                                "target_rate_hz": system_state.target_rate_hz,
                                "is_paused": system_state.is_paused,
                            }
                            await manager.broadcast(payload)
                        elif live_source.is_stale():
                            payload = {
                                "type": "LIVE_STREAM_STATUS",
                                "mode": "LIVE",
                                "connected": True,
                                "status": "STALE",
                                "message": f"LIVE DATA: STALE ({status_info.get('data_age_ms')} ms)",
                                "status_details": status_info,
                                "target_rate_hz": system_state.target_rate_hz,
                                "is_paused": system_state.is_paused,
                                "timestamp": time.time(),
                            }
                            await manager.broadcast(payload)
                    else:
                        payload = {
                            "type": "LIVE_STREAM_STATUS",
                            "mode": "LIVE",
                            "connected": False,
                            "status": status_info.get("status", "NOT_CONNECTED"),
                            "message": "NO LIVE DATA — ARDUINO / SOURCE DISCONNECTED",
                            "status_details": status_info,
                            "target_rate_hz": system_state.target_rate_hz,
                            "is_paused": system_state.is_paused,
                            "timestamp": time.time(),
                        }
                        await manager.broadcast(payload)

                else:
                    # SIMULATION / TEST MODE
                    if replay_engine.is_playing:
                        raw_frame = replay_engine.step()
                        if raw_frame is None:
                            raw_frame = simulator.step()
                    else:
                        raw_frame = simulator.step()

                    raw_frame["source"] = "SIMULATION"
                    raw_frame["is_simulated"] = True
                    
                    pipeline_out = twin_service.process_telemetry_frame(raw_frame)
                    
                    payload = {
                        "type": "TELEMETRY_UPDATE",
                        "mode": "SIMULATION",
                        "connected": True,
                        "data": pipeline_out,
                        "state": raw_frame,
                        "history": simulator.history,
                        "inference": pipeline_out["inference"],
                        "twin_state": pipeline_out["twin_state"],
                        "dashboard_view": pipeline_out["dashboard_view"],
                        "residuals": pipeline_out["residuals"],
                        "expected_physics": pipeline_out["expected_physics"],
                        "sensor_trust": pipeline_out["sensor_trust"],
                        "alerts": pipeline_out.get("alerts", []),
                        "events": pipeline_out.get("events", []),
                        "primary_evidence": pipeline_out.get("primary_evidence", []),
                        "stream_metrics": pipeline_out.get("stream_metrics", {}),
                        "target_rate_hz": system_state.target_rate_hz,
                        "is_paused": system_state.is_paused,
                    }
                    await manager.broadcast(payload)

        except Exception as e:
            log_event(f"Broadcast Loop Exception: {str(e)}", "error", "TelemetryBroadcast")

        sleep_sec = 1.0 / max(1.0, min(50.0, system_state.target_rate_hz))
        await asyncio.sleep(sleep_sec)

# Lifespan background tasks
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Launch both the telemetry broadcast loop and the Arduino serial bridge
    asyncio.create_task(telemetry_broadcast_loop())
    asyncio.create_task(arduino_serial_reader_loop())
    log_event("AERIS-TWIN Gateway & Arduino Serial Bridge Started", "info", "Lifespan")
    yield

app = FastAPI(
    title="AERIS-TWIN — Evaluator Intelligence & Evidence Backend",
    description="Research-Grade Digital Twin Intelligence Layer with Arduino Uno HIL Bridge",
    version="2.5.1",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# 1. CORE SYSTEM, HEALTH & MODE CONFIG
# ==============================================================================
@app.get("/api/health")
@app.get("/health")
def get_system_health():
    return {
        "status": "ok",
        "service": "AERIS-TWIN Evaluator Intelligence & Evidence Backend",
        "version": "2.5.1",
        "pipeline_stages": 16,
        "mode": system_state.mode,
        "target_rate_hz": system_state.target_rate_hz,
        "live_connected": live_source.is_connected(),
        "arduino_port": ARDUINO_PORT,
        "edge_native": True
    }

@app.get("/api/mode")
def get_evaluator_mode():
    return {
        "mode": system_state.mode,
        "target_rate_hz": system_state.target_rate_hz,
        "live_status": live_source.get_status(),
        "is_paused": system_state.is_paused,
    }

@app.post("/api/mode")
def set_evaluator_mode(req: ModeRequest):
    req_mode = req.mode.upper()
    if req_mode not in ["LIVE", "SIMULATION", "TEST"]:
        raise HTTPException(status_code=400, detail="Mode must be 'LIVE' or 'SIMULATION'")
    if req_mode == "TEST":
        req_mode = "SIMULATION"
    system_state.mode = req_mode
    twin_service.reset()
    log_event(f"Evaluator Mode Switched to: {req_mode}", "info", "ModeManager")
    return {
        "status": "mode_updated",
        "mode": system_state.mode,
        "live_status": live_source.get_status(),
    }

@app.get("/api/rate")
def get_target_rate():
    return {"target_rate_hz": system_state.target_rate_hz}

@app.post("/api/rate")
def set_target_rate(req: RateRequest):
    system_state.target_rate_hz = req.rate_hz
    log_event(f"Target Ingestion Frequency Set to {req.rate_hz} Hz", "info", "RateManager")
    return {"status": "rate_updated", "target_rate_hz": system_state.target_rate_hz}

@app.post("/api/stream/pause")
@app.post("/api/stream/toggle-pause")
def toggle_stream_pause(req: Optional[StreamPauseRequest] = None):
    if req and req.is_paused is not None:
        system_state.is_paused = req.is_paused
    else:
        system_state.is_paused = not system_state.is_paused
    log_event(f"Telemetry Stream {'Paused' if system_state.is_paused else 'Resumed'}", "info", "StreamManager")
    return {
        "status": "stream_pause_updated",
        "is_paused": system_state.is_paused,
        "mode": system_state.mode
    }

@app.get("/api/stream/metrics")
def get_stream_metrics():
    last_view = twin_service.last_dashboard_view or {}
    stream_m = last_view.get("stream_metrics", {})
    live_stat = live_source.get_status()
    return {
        "mode": system_state.mode,
        "target_rate_hz": system_state.target_rate_hz,
        "live_status": live_stat,
        "stream_metrics": stream_m,
        "link_status": twin_service.gateway.get_link_status(),
    }

@app.get("/api/alerts/active")
def get_active_alerts():
    return {
        "system_state": twin_service.alert_engine.current_system_state,
        "active_alerts_count": len(twin_service.alert_engine.active_alerts),
        "alerts": [a.to_dict() for a in twin_service.alert_engine.active_alerts.values()],
        "recent_transitions": list(twin_service.alert_engine.transition_history),
    }

@app.get("/api/events/timeline")
def get_events_timeline(limit: int = 50):
    events = list(twin_service.alert_engine.event_timeline)[:limit]
    return {
        "total_events": len(twin_service.alert_engine.event_timeline),
        "events": events,
    }

@app.get("/api/events")
def get_system_events(limit: int = 50):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM system_events ORDER BY timestamp DESC LIMIT ?", (limit,))
    db_events = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {
        "active_alerts": [a.to_dict() for a in twin_service.alert_engine.active_alerts.values()],
        "transition_timeline": list(twin_service.alert_engine.transition_history)[:limit],
        "event_timeline": list(twin_service.alert_engine.event_timeline)[:limit],
        "log_events": db_events
    }

# ==============================================================================
# 2. TELEMETRY NORMALIZATION (UPDATED FOR ARDUINO)
# ==============================================================================
AERIS_DEVICE_API_KEY = os.getenv("AERIS_DEVICE_API_KEY", "").strip()

def verify_device_authentication(request: Request = None, raw_packet: Optional[Dict[str, Any]] = None):
    expected_key = (AERIS_DEVICE_API_KEY or os.getenv("AERIS_DEVICE_API_KEY", "")).strip()
    if not expected_key:
        return True

    provided_key = ""
    if request is not None:
        auth_header = (
            request.headers.get("X-Device-API-Key")
            or request.headers.get("X-API-Key")
            or request.headers.get("Authorization", "")
        )
        if auth_header.startswith("Bearer "):
            provided_key = auth_header[7:].strip()
        else:
            provided_key = auth_header.strip()

    if not provided_key and raw_packet:
        provided_key = str(raw_packet.get("api_key", "")).strip()

    if provided_key != expected_key:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Invalid device API key"
        )
    return True


def normalize_telemetry_packet(raw_packet: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalizes telemetry packet based on profile.
    Explicitly accepts Arduino Uno telemetry fields (vibration_g, temp_c, rpm_throttle).
    """
    packet = dict(raw_packet)

    profile = packet.get("profile")
    if (
        profile == PROFILE_MOTOR_PROTOTYPE 
        or "current_a" in packet 
        or "vibration_g" in packet 
        or "rpm_throttle" in packet 
        or ("oil_pressure" not in packet and "cht" not in packet and "fuel_flow" not in packet)
    ):
        profile = PROFILE_MOTOR_PROTOTYPE
    else:
        profile = PROFILE_AERO_ENGINE

    packet["profile"] = profile

    if profile == PROFILE_MOTOR_PROTOTYPE:
        # RPM / Throttle Normalization
        if "rpm" in packet and packet["rpm"] is not None:
            try:
                packet["rpm"] = max(0.0, float(packet["rpm"]))
            except (ValueError, TypeError):
                packet["rpm"] = None
        elif "rpm_throttle" in packet and packet["rpm_throttle"] is not None:
            try:
                # Estimate prototype motor RPM (~0 to 3000 RPM based on 0-100% throttle)
                packet["rpm"] = round(float(packet["rpm_throttle"]) * 30.0, 1)
            except (ValueError, TypeError):
                packet["rpm"] = 0.0
        else:
            packet["rpm"] = None

        # Motor Load (%)
        load = packet.get("motor_load_pct", packet.get("motor_load", packet.get("rpm_throttle")))
        if load is not None:
            try:
                packet["motor_load_pct"] = max(0.0, min(100.0, float(load)))
            except (ValueError, TypeError):
                packet["motor_load_pct"] = None
        else:
            packet["motor_load_pct"] = None

        # Temperature (°C)
        temp = packet.get("temperature_c", packet.get("temp_c", packet.get("temp")))
        if temp is not None:
            try:
                packet["temperature_c"] = float(temp)
            except (ValueError, TypeError):
                packet["temperature_c"] = None
        else:
            packet["temperature_c"] = None

        # Vibration (converts dynamic vibration_g to mm/s equivalent for pipeline)
        vib = packet.get("vibration", packet.get("vibration_mms"))
        if vib is None and "vibration_g" in packet:
            try:
                # Approximate translation: 1.0 G peak dynamic ~ 9.81 mm/s RMS for pipeline
                packet["vibration"] = round(float(packet["vibration_g"]) * 9.81, 3)
            except (ValueError, TypeError):
                packet["vibration"] = 0.0
        elif vib is not None:
            try:
                packet["vibration"] = max(0.0, float(vib))
            except (ValueError, TypeError):
                packet["vibration"] = None
        else:
            packet["vibration"] = None

        # Humidity (%)
        if "humidity" in packet and packet["humidity"] is not None:
            try:
                packet["humidity"] = float(packet["humidity"])
            except (ValueError, TypeError):
                packet["humidity"] = None

        # Power / Voltage / Current Defaults
        packet["current_a"] = packet.get("current_a", 0.45)
        packet["voltage_v"] = packet.get("voltage_v", 11.8)
        packet["power_w"] = round(packet["current_a"] * packet["voltage_v"], 2)

        # Metadata
        packet["device_id"] = packet.get("device_id", "AERIS-UNO-PROTOTYPE")
        packet["source"] = packet.get("source", "ARDUINO_UNO")
        packet["is_simulated"] = False
        if "timestamp" not in packet or not packet["timestamp"]:
            packet["timestamp"] = time.time()
        if "sequence_number" not in packet:
            packet["sequence_number"] = packet.get("seq", 0)

        return packet

    # AERO ENGINE Normalization (Rotax 914)
    if "rpm" in packet and packet["rpm"] is not None:
        try:
            packet["rpm"] = float(packet["rpm"])
        except (ValueError, TypeError):
            packet["rpm"] = 0.0

    if "cht" in packet and "temperature" not in packet:
        packet["temperature"] = float(packet["cht"]) if packet["cht"] is not None else 78.4
    elif "cht_c" in packet and "temperature" not in packet:
        packet["temperature"] = float(packet["cht_c"]) if packet["cht_c"] is not None else 78.4

    if "oil_pressure" in packet and "oilPressure" not in packet:
        packet["oilPressure"] = float(packet["oil_pressure"]) if packet["oil_pressure"] is not None else 4.3

    if "vibration_mms" in packet and "vibration" not in packet:
        packet["vibration"] = float(packet["vibration_mms"]) if packet["vibration_mms"] is not None else 1.6

    if "fuel_flow" in packet and "fuelFlow" not in packet:
        packet["fuelFlow"] = float(packet["fuel_flow"]) if packet["fuel_flow"] is not None else 5.2

    if "engine_load" in packet and "engineLoad" not in packet:
        packet["engineLoad"] = float(packet["engine_load"]) if packet["engine_load"] is not None else 62.0

    packet["source"] = packet.get("source", "AERO_ENGINE")
    packet["device_id"] = packet.get("device_id", "AERIS-PROTOTYPE-01")
    packet["is_simulated"] = False
    if "timestamp" not in packet or not packet["timestamp"]:
        packet["timestamp"] = time.time()

    return packet


@app.get("/api/telemetry/status")
def get_telemetry_status():
    status = live_source.get_status()
    status["arduino_port"] = ARDUINO_PORT
    return status

@app.post("/api/telemetry/live")
@app.post("/telemetry/live")
def ingest_live_telemetry(raw_packet: Dict[str, Any], request: Request = None):
    verify_device_authentication(request, raw_packet)
    normalized = normalize_telemetry_packet(raw_packet)
    pushed = live_source.push_frame(normalized)
    pipeline_out = twin_service.process_telemetry_frame(pushed)
    return {
        "status": "ingested",
        "mode": "LIVE",
        "profile": pushed.get("profile", "MOTOR_PROTOTYPE"),
        "latency_ms": pipeline_out["twin_state"]["processing_latency_ms"]
    }

@app.post("/api/telemetry")
def ingest_telemetry_standard(payload: Dict[str, Any]):
    if system_state.mode == "LIVE":
        payload["source"] = payload.get("source", "LIVE")
        payload["is_simulated"] = False
        normalized = normalize_telemetry_packet(payload)
        pushed = live_source.push_frame(normalized)
        pipeline_out = twin_service.process_telemetry_frame(pushed)
    else:
        payload["source"] = payload.get("source", "SIMULATION")
        payload["is_simulated"] = True
        pipeline_out = twin_service.process_telemetry_frame(payload)
        
    return {
        "status": "processed",
        "mode": system_state.mode,
        "latency_ms": pipeline_out["twin_state"].get("processing_latency_ms", 0.0),
        "health_index": pipeline_out["twin_state"].get("health_state", {}).get("value", {}).get("health_index", 100.0),
        "anomaly_score": pipeline_out["inference"].get("anomalyScore", 0.0),
        "fault_class": pipeline_out["inference"].get("possibleIssue", "NOMINAL"),
        "twin_state": pipeline_out["twin_state"],
        "dashboard_view": pipeline_out["dashboard_view"]
    }

@app.get("/api/telemetry")
def get_current_telemetry_compat():
    if not twin_service.last_dashboard_view:
        twin_service.process_telemetry_frame(simulator.state)
    return {
        "state": simulator.state,
        "history": simulator.history,
        "inference": twin_service.last_twin_state["fault_state"]["value"] if twin_service.last_twin_state else {},
        "twin_state": twin_service.last_twin_state,
        "dashboard_view": twin_service.last_dashboard_view,
        "mode": system_state.mode,
        "stream_metrics": twin_service.last_dashboard_view.get("stream_metrics", {}) if twin_service.last_dashboard_view else {}
    }

@app.get("/api/evaluations/latest")
def get_evaluations_latest():
    if not twin_service.last_dashboard_view:
        twin_service.process_telemetry_frame(simulator.state)
    return {
        "timestamp": time.time(),
        "mode": system_state.mode,
        "is_simulated": system_state.mode == "SIMULATION",
        "twin_state": twin_service.last_twin_state,
        "dashboard_view": twin_service.last_dashboard_view,
        "residuals": twin_service.last_dashboard_view.get("residuals", {}) if twin_service.last_dashboard_view else {},
        "sensor_trust": twin_service.last_dashboard_view.get("sensor_trust", {}) if twin_service.last_dashboard_view else {},
        "alerts": twin_service.last_dashboard_view.get("alerts", []) if twin_service.last_dashboard_view else [],
        "stream_metrics": twin_service.last_dashboard_view.get("stream_metrics", {}) if twin_service.last_dashboard_view else {}
    }

@app.get("/api/evaluations/history")
def get_evaluations_history(limit: int = 50):
    limit = max(1, min(200, limit))
    recent = list(twin_service.state_history)[-limit:]
    return {"count": len(recent), "history": recent}

# ==============================================================================
# 3. 3D VISUALIZATION & TWIN STATE
# ==============================================================================
@app.get("/twin/state")
def get_digital_twin_full_state():
    if not twin_service.last_twin_state:
        twin_service.process_telemetry_frame(simulator.state)
    return twin_service.last_twin_state

@app.get("/visualization/state/{uav_id}")
def get_visualization_state(uav_id: str):
    if not twin_service.last_twin_state:
        twin_service.process_telemetry_frame(simulator.state)
        
    ts = twin_service.last_twin_state
    db = twin_service.last_dashboard_view or {}
    op = ts.get("operating_state", {}).get("value", {})
    therm = ts.get("thermal_state", {}).get("value", {})
    mech = ts.get("mechanical_state", {}).get("value", {})
    comb = ts.get("combustion_state", {}).get("value", {})
    lub = ts.get("lubrication_state", {}).get("value", {})
    deg = ts.get("degradation_state", {}).get("value", {})
    health = ts.get("health_state", {}).get("value", {})
    fault = ts.get("fault_state", {}).get("value", {})
    rul = ts.get("rul_state", {}).get("value", {})
    risk = ts.get("mission_risk", {})
    sensors = ts.get("sensor_state", {}).get("value", {}).get("sensors", {})
    
    sub_deg = deg.get("subsystem_degradations", {})
    mech_health = round(100.0 * (1.0 - sub_deg.get("mechanical", 0.05)), 1)
    therm_health = round(100.0 * (1.0 - sub_deg.get("thermal", 0.05)), 1)
    lub_health = round(100.0 * (1.0 - sub_deg.get("lubrication", 0.05)), 1)
    comb_health = round(100.0 * (1.0 - sub_deg.get("combustion", 0.05)), 1)
    
    def status_for_health(h):
        return "HEALTHY" if h >= 85 else ("WARNING" if h >= 70 else ("DEGRADED" if h >= 50 else "FAULT"))
    
    components = {
        "engine": {
            "name": "Rotax 914 Turbocharged / HIL Motor Prototype",
            "type": "POWERPLANT",
            "health": round(float(health.get("health_index", 92.0)), 1),
            "status": db.get("status", "NORMAL"),
            "confidence": ts.get("confidence", {}).get("overall", 0.92),
            "metrics": {
                "rpm": op.get("rpm", 4215),
                "cht_c": therm.get("cht_c", 78.4),
                "oil_pressure_bar": lub.get("oil_pressure_bar", 4.3),
                "vibration_mms": mech.get("vibration_mms", 1.6),
            },
            "fault": fault.get("fault", "NOMINAL")
        }
    }
    
    return {
        "timestamp": ts.get("timestamp", time.time()),
        "uav_id": uav_id,
        "system_status": db.get("status", "NORMAL"),
        "overall_health": round(float(health.get("health_index", 92.0)), 1),
        "confidence": ts.get("confidence", {}).get("overall", 0.92),
        "mode": system_state.mode,
        "is_simulated": system_state.mode == "SIMULATION",
        "components": components,
        "sensors": sensors,
        "prognostics": {
            "rul_hours": rul.get("rul_estimate_hours", 1200.0),
            "confidence": rul.get("confidence", 0.92),
            "label": "SIMULATION-BASED RUL" if system_state.mode == "SIMULATION" else "LIVE RUL ESTIMATE"
        },
        "faults": [fault] if fault.get("fault") != "NOMINAL" else [],
        "mission_risk": risk,
        "alerts": ts.get("alerts", []),
        "stream_metrics": ts.get("stream_metrics", {})
    }

# ==============================================================================
# 4. WEBSOCKET GATEWAY & TELECOMMANDS
# ==============================================================================
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                action = msg.get("action", "")

                if action == "SET_MODE":
                    mode = msg.get("mode", "LIVE").upper()
                    if mode in ["LIVE", "SIMULATION"]:
                        system_state.mode = mode
                elif action == "SET_RATE":
                    rate = float(msg.get("rate_hz", 10.0))
                    system_state.target_rate_hz = max(1.0, min(50.0, rate))
                elif action == "PAUSE_STREAM":
                    system_state.is_paused = not system_state.is_paused
                elif action == "SET_SCENARIO":
                    simulator.set_scenario(msg.get("scenario", "cruise"))
                elif action == "INJECT_FAULT":
                    simulator.inject_fault(
                        fault=msg.get("fault", "BEARING_DEGRADATION"),
                        severity=float(msg.get("severity", 0.5)),
                        start_time=float(msg.get("start_time", 0.0)),
                        progression_rate=float(msg.get("progression_rate", 0.002))
                    )
                elif action == "MITIGATE":
                    simulator.execute_mitigation()
                elif action == "REPLAY_START":
                    replay_engine.start()
                elif action == "REPLAY_PAUSE":
                    replay_engine.pause()
                elif action == "REPLAY_RESET":
                    replay_engine.reset()
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Static files and frontend SPA mount
_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DIST_DIR = os.path.join(_BASE_DIR, "dist")
_SRC_DIR = os.path.join(_BASE_DIR, "src")
_INDEX_FILE = os.path.join(_BASE_DIR, "index.html")

if os.path.exists(_DIST_DIR):
    app.mount("/", StaticFiles(directory=_DIST_DIR, html=True), name="static")
elif os.path.exists(_SRC_DIR) and os.path.exists(_INDEX_FILE):
    app.mount("/src", StaticFiles(directory=_SRC_DIR), name="src")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(request: Request, full_path: str):
        # Allow API, docs, and websocket endpoints to be handled cleanly
        if full_path.startswith("api/") or full_path.startswith("ws/") or full_path.startswith("twin/") or full_path.startswith("visualization/") or full_path in ["docs", "openapi.json", "redoc"]:
            raise HTTPException(status_code=404, detail="Not Found")
        target_file = os.path.join(_BASE_DIR, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(_INDEX_FILE)