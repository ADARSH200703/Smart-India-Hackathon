export const hardwareHtml = `
<section id="view-hardware" class="pipeline-view-container" style="display: none;">
          <!-- Section Header -->
          <div class="panel-header">
            <div>
              <span class="panel-title" style="font-size: 1.3rem;">
                <span class="material-symbols-outlined" style="color: var(--primary);">developer_board</span>
                HARDWARE CONNECTION &amp; TELEMETRY GATEWAY
              </span>
              <p style="font-size: 0.8rem; color: var(--text-muted);">
                Physical Motor Prototype (3&times;18650 &rarr; ACS712 &rarr; L298N &rarr; DC Motor) &rarr; Arduino Uno (USB Serial Bridge) / ESP32 &rarr; AERIS-TWIN Backend.
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span id="hw-overall-badge" class="hw-status-pill disconnected">DISCONNECTED</span>
              <button class="hud-btn" id="btn-hw-check-sync" title="Query Backend for Active Telemetry Gateway Link">
                <span class="material-symbols-outlined" style="font-size: 16px;">sync</span>
                <span>Sync Status</span>
              </button>
            </div>
          </div>

          <!-- Mode Status Banners -->
          <div id="hw-mode-banner-sim" class="sim-mode-banner" style="display: none; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="material-symbols-outlined" style="color: var(--status-warning); font-size: 18px;">science</span>
              <span><strong>MODE: SIMULATION / TEST</strong> &mdash; Physical hardware telemetry is <strong>INACTIVE</strong>. System is evaluating synthetic engine models and fault trajectories.</span>
            </div>
            <button class="rate-btn" id="btn-hw-switch-live" style="color: var(--primary); border-color: var(--primary);">Switch to LIVE Mode</button>
          </div>

          <div id="hw-mode-banner-replay" class="sim-mode-banner" style="display: none; margin-bottom: 1rem; border-color: var(--accent-cyan);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="material-symbols-outlined" style="color: var(--accent-cyan); font-size: 18px;">history</span>
              <span><strong>MODE: REPLAY</strong> &mdash; Telemetry is sourced from historical mission flight records. Physical hardware bridge is in standby.</span>
            </div>
          </div>

          <div id="hw-mode-banner-live" class="live-not-connected-banner" style="display: none; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="material-symbols-outlined" style="color: #EF4444; font-size: 18px;" id="hw-live-banner-icon">wifi_off</span>
              <span id="hw-live-banner-text"><strong>LIVE TELEMETRY: WAITING FOR HARDWARE</strong> &mdash; Transmit physical motor prototype frames from Arduino Uno (serial_bridge.py) or ESP32 to <code>/api/telemetry/hardware</code>.</span>
            </div>
          </div>

          <!-- Top 4 Hardware KPI / Status Cards -->
          <div class="kpi-row" style="margin-bottom: 1.25rem;">
            <!-- Device ID & Gateway -->
            <div class="kpi-card">
              <span class="kpi-title">DEVICE IDENTITY</span>
              <div class="flight-time-val" id="hw-kpi-device-id" style="font-size: 1.35rem; color: var(--primary);">--</div>
              <span class="flight-time-sub" id="hw-kpi-gateway-source">SOURCE: --</span>
            </div>

            <!-- Hardware State -->
            <div class="kpi-card">
              <span class="kpi-title">HARDWARE STATE</span>
              <div class="status-kpi-badge" id="hw-kpi-state-badge" style="font-size: 1.35rem; color: var(--status-offline);">
                <span class="material-symbols-outlined" id="hw-kpi-state-icon" style="font-size: 20px;">power_off</span>
                <span id="hw-kpi-state-text">Waiting for hardware</span>
              </div>
              <span class="status-kpi-sub" id="hw-kpi-state-sub">No active packet stream</span>
            </div>

            <!-- Ingestion Frequency -->
            <div class="kpi-card">
              <span class="kpi-title">STREAM RATE</span>
              <div class="flight-time-val" id="hw-kpi-rate" style="font-size: 1.35rem;">-- <span style="font-size: 0.8rem; color: var(--text-muted);">Hz</span></div>
              <span class="flight-time-sub" id="hw-kpi-target-rate">TARGET: 10.0 Hz</span>
            </div>

            <!-- Backend Connection -->
            <div class="kpi-card">
              <span class="kpi-title">BACKEND LINK</span>
              <div class="reliability-val" id="hw-kpi-backend" style="font-size: 1.35rem; color: var(--status-normal);">CONNECTING</div>
              <span class="reliability-sub" id="hw-kpi-latency">LATENCY: -- ms</span>
            </div>
          </div>

          <!-- Real-Time Physical Motor Prototype Sensor Readout Grid -->
          <div class="info-card" style="margin-bottom: 1.25rem;">
            <div class="panel-header" style="margin-bottom: 0.75rem;">
              <span class="panel-title">
                <span class="material-symbols-outlined" style="color: var(--primary);">electric_meter</span>
                PHYSICAL PROTOTYPE SENSOR TELEMETRY (MOTOR_PROTOTYPE)
              </span>
              <span id="hw-profile-badge" style="font-size: 0.70rem; font-family: var(--font-mono); color: var(--accent-cyan); background: rgba(56, 189, 248, 0.1); border: 1px solid var(--accent-cyan); padding: 2px 8px; border-radius: 4px;">
                PROFILE: MOTOR_PROTOTYPE
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
              
              <!-- RPM -->
              <div class="rt-summary-pill" style="flex-direction: column; align-items: flex-start; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 4px;">
                  <span class="rt-sum-label" style="font-size: 0.70rem; color: var(--text-muted);">MOTOR RPM</span>
                  <span class="material-symbols-outlined" style="font-size: 14px; color: #2DD4BF;">speed</span>
                </div>
                <div id="hw-val-rpm" style="font-size: 1.25rem; font-family: var(--font-mono); font-weight: 700; color: #2DD4BF;">--</div>
                <div style="font-size: 0.65rem; color: var(--text-dim);">Optical / Hall Sensor</div>
              </div>

              <!-- Current (A) -->
              <div class="rt-summary-pill" style="flex-direction: column; align-items: flex-start; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 4px;">
                  <span class="rt-sum-label" style="font-size: 0.70rem; color: var(--text-muted);">CURRENT</span>
                  <span class="material-symbols-outlined" style="font-size: 14px; color: #38BDF8;">offline_bolt</span>
                </div>
                <div id="hw-val-current" style="font-size: 1.25rem; font-family: var(--font-mono); font-weight: 700; color: #38BDF8;">-- A</div>
                <div style="font-size: 0.65rem; color: var(--text-dim);">ACS712 Hall Sensor</div>
              </div>

              <!-- Voltage (V) -->
              <div class="rt-summary-pill" style="flex-direction: column; align-items: flex-start; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 4px;">
                  <span class="rt-sum-label" style="font-size: 0.70rem; color: var(--text-muted);">BUS VOLTAGE</span>
                  <span class="material-symbols-outlined" style="font-size: 14px; color: #F59E0B;">battery_charging_full</span>
                </div>
                <div id="hw-val-voltage" style="font-size: 1.25rem; font-family: var(--font-mono); font-weight: 700; color: #F59E0B;">-- V</div>
                <div style="font-size: 0.65rem; color: var(--text-dim);">3&times;18650 Battery Pack</div>
              </div>

              <!-- Power (W) -->
              <div class="rt-summary-pill" style="flex-direction: column; align-items: flex-start; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 4px;">
                  <span class="rt-sum-label" style="font-size: 0.70rem; color: var(--text-muted);">ELECTRICAL POWER</span>
                  <span class="material-symbols-outlined" style="font-size: 14px; color: #EC4899;">bolt</span>
                </div>
                <div id="hw-val-power" style="font-size: 1.25rem; font-family: var(--font-mono); font-weight: 700; color: #EC4899;">-- W</div>
                <div style="font-size: 0.65rem; color: var(--text-dim);">V &times; I Computed</div>
              </div>

              <!-- Temperature (°C) -->
              <div class="rt-summary-pill" style="flex-direction: column; align-items: flex-start; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 4px;">
                  <span class="rt-sum-label" style="font-size: 0.70rem; color: var(--text-muted);">TEMPERATURE</span>
                  <span class="material-symbols-outlined" style="font-size: 14px; color: #EF4444;">thermostat</span>
                </div>
                <div id="hw-val-temp" style="font-size: 1.25rem; font-family: var(--font-mono); font-weight: 700; color: #EF4444;">-- °C</div>
                <div style="font-size: 0.65rem; color: var(--text-dim);">Motor / Driver Temp</div>
              </div>

              <!-- Vibration -->
              <div class="rt-summary-pill" style="flex-direction: column; align-items: flex-start; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 4px;">
                  <span class="rt-sum-label" style="font-size: 0.70rem; color: var(--text-muted);">VIBRATION</span>
                  <span class="material-symbols-outlined" style="font-size: 14px; color: #A855F7;">vibration</span>
                </div>
                <div id="hw-val-vib" style="font-size: 1.25rem; font-family: var(--font-mono); font-weight: 700; color: #A855F7;">---</div>
                <div style="font-size: 0.65rem; color: var(--text-dim);">Motor Accelerometer</div>
              </div>

              <!-- Motor Load (%) -->
              <div class="rt-summary-pill" style="flex-direction: column; align-items: flex-start; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 4px;">
                  <span class="rt-sum-label" style="font-size: 0.70rem; color: var(--text-muted);">MOTOR LOAD</span>
                  <span class="material-symbols-outlined" style="font-size: 14px; color: #2DD4BF;">tune</span>
                </div>
                <div id="hw-val-load" style="font-size: 1.25rem; font-family: var(--font-mono); font-weight: 700; color: #2DD4BF;">-- %</div>
                <div style="font-size: 0.65rem; color: var(--text-dim);">PWM Duty / Torque</div>
              </div>

            </div>
          </div>

          <!-- Main 2-Column Grid: Device Configuration & Real-Time Ingestion Specs -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;">
            
            <!-- Column 1: Hardware Connection & Interface Config -->
            <div class="info-card">
              <div class="panel-header" style="margin-bottom: 0.75rem;">
                <span class="panel-title"><span class="material-symbols-outlined" style="color: var(--primary);">cable</span> DEVICE SPECS &amp; TELEMETRY LINK</span>
                <span style="font-size: 0.70rem; font-family: var(--font-mono); color: var(--text-dim);">ESP32 Rig</span>
              </div>

              <!-- Device Specs Grid -->
              <div class="model-specs-grid" style="margin-top: 0.75rem;">
                <div class="spec-box">
                  <span class="spec-box-label">Device</span>
                  <span class="spec-box-val" id="hw-spec-device" style="color: var(--primary);">ESP32</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Device ID</span>
                  <span class="spec-box-val" id="hw-spec-device-id" style="color: var(--primary);">--</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Profile</span>
                  <span class="spec-box-val" id="hw-spec-profile-val" style="color: var(--accent-cyan);">MOTOR_PROTOTYPE</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Firmware Version</span>
                  <span class="spec-box-val" id="hw-spec-firmware">--</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Signal (Wi-Fi RSSI)</span>
                  <span class="spec-box-val" id="hw-spec-rssi">--</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Sampling Rate</span>
                  <span class="spec-box-val" id="hw-spec-sampling">10 Hz (100ms)</span>
                </div>
              </div>
            </div>

            <!-- Column 2: Backend Telemetry Ingestion State -->
            <div class="info-card">
              <div class="panel-header" style="margin-bottom: 0.75rem;">
                <span class="panel-title"><span class="material-symbols-outlined" style="color: var(--secondary);">cloud_sync</span> BACKEND TELEMETRY INGESTION</span>
                <span style="font-size: 0.70rem; font-family: var(--font-mono); color: var(--text-dim);">Live Ingest Stream</span>
              </div>

              <div class="model-specs-grid" style="margin-bottom: 1rem;">
                <div class="spec-box">
                  <span class="spec-box-label">REST Endpoint</span>
                  <span class="spec-box-val" style="font-size: 0.75rem; color: var(--primary);">POST /api/telemetry/hardware</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">WebSocket Broadcast</span>
                  <span class="spec-box-val" style="font-size: 0.75rem; color: var(--secondary);">WS /ws/telemetry</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Last Packet Received</span>
                  <span class="spec-box-val" id="hw-spec-last-packet">-- ms ago</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Packet Loss Rate</span>
                  <span class="spec-box-val" id="hw-spec-loss" style="color: var(--status-normal);">0.0%</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Total Ingested Frames</span>
                  <span class="spec-box-val" id="hw-spec-total-frames">0</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Hardware Authentication</span>
                  <span class="spec-box-val" style="color: var(--status-normal);">X-Device-API-Key Active</span>
                </div>
              </div>

              <div style="background: rgba(0, 0, 0, 0.35); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-dim);">PROTOTYPE SENSORS:</span>
                  <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--primary);">REAL HARDWARE CHANNELS</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.72rem; font-family: var(--font-mono);">
                  <span style="background: var(--surface); padding: 2px 6px; border-radius: 3px; border: 1px solid var(--border); color: #38BDF8;">ACS712 (Current)</span>
                  <span style="background: var(--surface); padding: 2px 6px; border-radius: 3px; border: 1px solid var(--border); color: #F59E0B;">3&times;18650 (Voltage)</span>
                  <span style="background: var(--surface); padding: 2px 6px; border-radius: 3px; border: 1px solid var(--border); color: #2DD4BF;">RPM Pulse</span>
                  <span style="background: var(--surface); padding: 2px 6px; border-radius: 3px; border: 1px solid var(--border); color: #EC4899;">V&times;I (Power)</span>
                  <span style="background: var(--surface); padding: 2px 6px; border-radius: 3px; border: 1px solid var(--border); color: #EF4444;">Thermistor</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom: End-to-End Physical Architecture Flow Visual -->
          <div class="info-card">
            <div class="panel-header" style="margin-bottom: 0.75rem;">
              <span class="panel-title"><span class="material-symbols-outlined" style="color: var(--accent-cyan);">hub</span> PHYSICAL TELEMETRY DATA ARCHITECTURE</span>
              <span style="font-size: 0.70rem; font-family: var(--font-mono); color: var(--text-dim);">ESP32 Standalone Prototype v1</span>
            </div>

            <div class="landing-core-pipeline-flow" style="margin: 0.5rem 0;">
              <div class="pipeline-flow-card">
                <div class="pipeline-card-step">01</div>
                <div class="pipeline-card-icon-wrap"><span class="material-symbols-outlined">sensors</span></div>
                <div class="pipeline-card-name" style="font-size: 0.75rem;">MOTOR PROTOTYPE</div>
                <div style="font-size: 0.65rem; color: var(--text-dim); margin-top: 2px;">3&times;18650 &rarr; ACS712 &rarr; L298N &rarr; DC Motor</div>
              </div>

              <div class="pipeline-flow-arrow" aria-hidden="true"><span class="material-symbols-outlined">east</span></div>

              <div class="pipeline-flow-card">
                <div class="pipeline-card-step">02</div>
                <div class="pipeline-card-icon-wrap"><span class="material-symbols-outlined">wifi</span></div>
                <div class="pipeline-card-name" style="font-size: 0.75rem;">ESP32 GATEWAY</div>
                <div style="font-size: 0.65rem; color: var(--text-dim); margin-top: 2px;">ADC Sampling &amp; JSON Telemetry</div>
              </div>

              <div class="pipeline-flow-arrow" aria-hidden="true"><span class="material-symbols-outlined">east</span></div>

              <div class="pipeline-flow-card">
                <div class="pipeline-card-step">03</div>
                <div class="pipeline-card-icon-wrap"><span class="material-symbols-outlined">dns</span></div>
                <div class="pipeline-card-name" style="font-size: 0.75rem;">FASTAPI INGEST</div>
                <div style="font-size: 0.65rem; color: var(--text-dim); margin-top: 2px;">/api/telemetry/hardware &amp; Auth</div>
              </div>

              <div class="pipeline-flow-arrow" aria-hidden="true"><span class="material-symbols-outlined">east</span></div>

              <div class="pipeline-flow-card">
                <div class="pipeline-card-step">04</div>
                <div class="pipeline-card-icon-wrap"><span class="material-symbols-outlined">network_check</span></div>
                <div class="pipeline-card-name" style="font-size: 0.75rem;">WEBSOCKET</div>
                <div style="font-size: 0.65rem; color: var(--text-dim); margin-top: 2px;">/ws/telemetry Real-Time Broadcast</div>
              </div>

              <div class="pipeline-flow-arrow" aria-hidden="true"><span class="material-symbols-outlined">east</span></div>

              <div class="pipeline-flow-card pipeline-flow-card-accent">
                <div class="pipeline-card-step">05</div>
                <div class="pipeline-card-icon-wrap"><span class="material-symbols-outlined">dashboard</span></div>
                <div class="pipeline-card-name" style="font-size: 0.75rem;">HARDWARE HUD</div>
                <div style="font-size: 0.65rem; color: var(--primary); margin-top: 2px;">Live Motor Prototype Readings</div>
              </div>
            </div>

            <div style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.3); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
              <div style="color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 16px; color: var(--primary);">info</span>
                <span>Physical motor prototype telemetry displays in real-time when the ESP32 transmits to the backend.</span>
              </div>
              <div style="font-family: var(--font-mono); color: var(--text-dim);">
                Docs: <code>hardware/README.md</code>
              </div>
            </div>
          </div>
        </section>
`;
