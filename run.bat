@echo off
title UAV Aero Piston Engine Digital Twin Launcher
echo =========================================================================
echo  AI-Enabled Real-Time Digital Twin System for MALE UAV Aero Piston Engines
echo =========================================================================
echo.
echo Starting AERIS-TWIN Unified Engine & Dashboard Server on port 8000...
echo.
echo =========================================================================
echo  System is running!
echo  - Web Application: http://localhost:8000/
echo  - Backend REST API: http://localhost:8000/docs
echo  - WebSocket Stream: ws://localhost:8000/ws/telemetry
echo =========================================================================
echo.
start http://localhost:8000/
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000

