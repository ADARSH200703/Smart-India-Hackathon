export const dashboardHtml = `
<section id="view-dashboard" class="dashboard-grid">

          <!-- Live Mode Disconnected Warning Banner -->
          <div id="live-not-connected-banner" class="live-not-connected-banner" style="display: none;">
            <div style="display:flex; align-items:center; gap: 8px;">
              <span class="material-symbols-outlined" style="color: #EF4444; font-size: 20px;">wifi_off</span>
              <span><strong>LIVE DATA: NOT CONNECTED</strong> — Waiting for incoming continuous telemetry stream on <code>/api/telemetry/live</code> or WebSocket...</span>
            </div>
            <button class="rate-btn" id="btn-switch-to-sim" style="background: rgba(245, 158, 11, 0.2); color: var(--status-warning); border-color: var(--status-warning);">Switch to Test Mode</button>
          </div>

          <!-- Simulation Test Mode Active Banner -->
          <div id="sim-mode-banner" class="sim-mode-banner" style="display: none;">
            <div style="display:flex; align-items:center; gap: 8px;">
              <span class="material-symbols-outlined" style="color: var(--status-warning); font-size: 18px;">science</span>
              <span><strong>SIMULATION MODE ACTIVE</strong> — Evaluating synthetic engine dynamics and controlled fault injections. <strong style="color:#fff;">[SIMULATED DATA]</strong></span>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="rate-btn" id="btn-quick-inject-bearing" style="color: #F87171;">Bearing Fault</button>
              <button class="rate-btn" id="btn-quick-inject-thermal" style="color: #FBBF24;">Overheat</button>
              <button class="rate-btn" id="btn-quick-reset-sim">Reset Sim</button>
            </div>
          </div>

          <!-- ── PRIMARY SECTION 1: SYSTEM HEALTH & OPERATING STATUS (Immediate Viewport) ── -->
          <div class="kpi-row">
            <!-- Propulsion Health Card -->
            <div class="kpi-card" id="kpi-health-card">
              <span class="kpi-title">PROPULSION HEALTH</span>
              <div class="health-gauge-container">
                <svg class="health-gauge-svg" viewBox="0 0 100 100">
                  <circle class="gauge-bg" cx="50" cy="50" r="40" stroke-dasharray="251.2" stroke-dashoffset="0"/>
                  <circle id="health-gauge-circle" class="gauge-progress" cx="50" cy="50" r="40"/>
                </svg>
                <div class="health-gauge-value">
                  <div class="val" id="kpi-health-val">92%</div>
                  <div class="sub" id="kpi-health-sub">NOMINAL</div>
                </div>
              </div>
            </div>

            <!-- Engine State & Anomaly Score -->
            <div class="kpi-card">
              <span class="kpi-title">ENGINE STATE &amp; ANOMALY</span>
              <div class="status-kpi-badge" id="kpi-status-badge">
                <span class="material-symbols-outlined" id="status-badge-icon">check_circle</span>
                <span id="kpi-status-val">NORMAL</span>
              </div>
              <span class="status-kpi-sub" id="kpi-status-sub">Anomaly score: 0.024 (Nominal)</span>
            </div>

            <!-- Mission Flight Time Clock -->
            <div class="kpi-card">
              <span class="kpi-title">SORTIE FLIGHT TIME</span>
              <div class="flight-time-val" id="kpi-flight-time">02:45:18</div>
              <span class="flight-time-sub">MISSION CLOCK</span>
            </div>

            <!-- Mission Reliability & Sensor Trust -->
            <div class="kpi-card">
              <span class="kpi-title">MISSION RELIABILITY</span>
              <div class="reliability-val" id="kpi-reliability-val">94%</div>
              <span class="reliability-sub" id="kpi-reliability-sub">SENSOR TRUST: 98%</span>
            </div>
          </div>

          <!-- ── PRIMARY SECTION 2: 6-CHANNEL TELEMETRY INSTRUMENTS (Click to Inspect) ── -->
          <div class="cockpit-sensor-strip">
            <!-- RPM -->
            <div class="telemetry-readout-card" id="param-rpm-card" data-sensor="rpm" title="Click to inspect Engine RPM channel details">
              <div class="tro-header">
                <span class="tro-label"><span class="material-symbols-outlined" style="font-size:14px; color:#2DD4BF;">speed</span> RPM</span>
                <span class="tro-ref">Nom: 4,215</span>
              </div>
              <div class="tro-body">
                <span class="tro-val" id="val-rpm">4,215</span>
                <span class="tro-unit">RPM</span>
              </div>
            </div>

            <!-- CHT -->
            <div class="telemetry-readout-card" id="param-temp-card" data-sensor="temperature" title="Click to inspect Cylinder Head Temp channel details">
              <div class="tro-header">
                <span class="tro-label"><span class="material-symbols-outlined" style="font-size:14px; color:#EF4444;">thermostat</span> CHT</span>
                <span class="tro-ref">Nom: 78.4°C</span>
              </div>
              <div class="tro-body">
                <span class="tro-val" id="val-temp">78.4</span>
                <span class="tro-unit">°C</span>
              </div>
            </div>

            <!-- Oil Pressure -->
            <div class="telemetry-readout-card" id="param-oil-card" data-sensor="oilPressure" title="Click to inspect Oil Pressure channel details">
              <div class="tro-header">
                <span class="tro-label"><span class="material-symbols-outlined" style="font-size:14px; color:#38BDF8;">water_drop</span> OIL PRESS</span>
                <span class="tro-ref">Nom: 4.30 Bar</span>
              </div>
              <div class="tro-body">
                <span class="tro-val" id="val-oil">4.30</span>
                <span class="tro-unit">Bar</span>
              </div>
            </div>

            <!-- Vibration -->
            <div class="telemetry-readout-card" id="param-vib-card" data-sensor="vibration" title="Click to inspect Casing Vibration channel details">
              <div class="tro-header">
                <span class="tro-label"><span class="material-symbols-outlined" style="font-size:14px; color:#F59E0B;">vibration</span> VIBRATION</span>
                <span class="tro-ref">Nom: 1.60 mm/s</span>
              </div>
              <div class="tro-body">
                <span class="tro-val" id="val-vib">1.60</span>
                <span class="tro-unit">mm/s</span>
              </div>
            </div>

            <!-- Fuel Flow -->
            <div class="telemetry-readout-card" id="param-fuel-card" data-sensor="fuelFlow" title="Click to inspect Fuel Flow Rate channel details">
              <div class="tro-header">
                <span class="tro-label"><span class="material-symbols-outlined" style="font-size:14px; color:#38BDF8;">local_gas_station</span> FUEL FLOW</span>
                <span class="tro-ref">Nom: 5.20 L/h</span>
              </div>
              <div class="tro-body">
                <span class="tro-val" id="val-fuel">5.20</span>
                <span class="tro-unit">L/h</span>
              </div>
            </div>

            <!-- Engine Load -->
            <div class="telemetry-readout-card" id="param-load-card" data-sensor="engineLoad" title="Click to inspect Engine Load Demand channel details">
              <div class="tro-header">
                <span class="tro-label"><span class="material-symbols-outlined" style="font-size:14px; color:#2DD4BF;">bolt</span> LOAD</span>
                <span class="tro-ref">Nom: 62%</span>
              </div>
              <div class="tro-body">
                <span class="tro-val" id="val-load">62</span>
                <span class="tro-unit">%</span>
              </div>
            </div>
          </div>

          <!-- ── PRIMARY SECTION 3: DIGITAL TWIN RESIDUALS & AI ASSESSMENT ── -->
          <div class="cockpit-main-layout">
            
            <!-- LEFT COLUMN: Digital Twin Physics Residuals Table -->
            <div class="cockpit-telemetry-col">
              <div class="info-card" id="residuals-table-card">
                <div class="panel-header" style="margin-bottom: 0.5rem;">
                  <span class="panel-title"><span class="material-symbols-outlined" style="color: var(--accent-cyan);">compare_arrows</span> DIGITAL TWIN RESIDUALS</span>
                  <span style="font-size: 0.70rem; font-family: var(--font-mono); color: var(--text-dim);">Mean-Value Physics Baseline</span>
                </div>
                <div style="overflow-x: auto;">
                  <table class="residuals-table">
                    <thead>
                      <tr>
                        <th>Channel</th>
                        <th>Actual</th>
                        <th>Expected</th>
                        <th>Δ Residual</th>
                        <th>Normalized σ</th>
                        <th>Trend Slope</th>
                        <th>Trust</th>
                      </tr>
                    </thead>
                    <tbody id="residuals-table-body">
                      <tr>
                        <td><strong>RPM</strong></td>
                        <td id="res-val-rpm">4,215</td>
                        <td id="res-exp-rpm">4,215</td>
                        <td id="res-delta-rpm">0.0</td>
                        <td id="res-sigma-rpm" style="color: var(--status-normal);">+0.00σ</td>
                        <td id="res-slope-rpm">0.00/s</td>
                        <td><span id="res-trust-rpm" style="color: var(--status-normal);">99%</span></td>
                      </tr>
                      <tr>
                        <td><strong>CHT (°C)</strong></td>
                        <td id="res-val-cht">78.4</td>
                        <td id="res-exp-cht">78.0</td>
                        <td id="res-delta-cht">+0.4</td>
                        <td id="res-sigma-cht" style="color: var(--status-normal);">+0.15σ</td>
                        <td id="res-slope-cht">0.00/s</td>
                        <td><span id="res-trust-temp" style="color: var(--status-normal);">96%</span></td>
                      </tr>
                      <tr>
                        <td><strong>Oil (Bar)</strong></td>
                        <td id="res-val-oil">4.30</td>
                        <td id="res-exp-oil">4.30</td>
                        <td id="res-delta-oil">0.00</td>
                        <td id="res-sigma-oil" style="color: var(--status-normal);">+0.00σ</td>
                        <td id="res-slope-oil">0.00/s</td>
                        <td><span id="res-trust-oil" style="color: var(--status-normal);">98%</span></td>
                      </tr>
                      <tr>
                        <td><strong>Vib (mm/s)</strong></td>
                        <td id="res-val-vib">1.60</td>
                        <td id="res-exp-vib">1.50</td>
                        <td id="res-delta-vib">+0.10</td>
                        <td id="res-sigma-vib" style="color: var(--status-normal);">+0.12σ</td>
                        <td id="res-slope-vib">0.00/s</td>
                        <td><span id="res-trust-vib" style="color: var(--status-normal);">98%</span></td>
                      </tr>
                      <tr>
                        <td><strong>Fuel (L/h)</strong></td>
                        <td id="res-val-fuel">5.20</td>
                        <td id="res-exp-fuel">5.10</td>
                        <td id="res-delta-fuel">+0.10</td>
                        <td id="res-sigma-fuel" style="color: var(--status-normal);">+0.08σ</td>
                        <td id="res-slope-fuel">0.00/s</td>
                        <td><span id="res-trust-fuel" style="color: var(--status-normal);">97%</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Real-Time Telemetry Trends Chart -->
              <div class="trends-panel" style="margin-top: 1rem;">
                <div class="panel-header">
                  <span class="panel-title"><span class="material-symbols-outlined">ssid_chart</span> REAL-TIME TELEMETRY TRENDS</span>
                  <div class="chart-legend">
                    <div class="legend-item"><span class="legend-color" style="background: #2DD4BF;"></span> RPM</div>
                    <div class="legend-item"><span class="legend-color" style="background: #EF4444;"></span> CHT</div>
                    <div class="legend-item"><span class="legend-color" style="background: #38BDF8;"></span> Oil</div>
                    <div class="legend-item"><span class="legend-color" style="background: #F59E0B;"></span> Vib</div>
                  </div>
                </div>
                <div class="chart-wrapper">
                  <canvas id="telemetry-chart"></canvas>
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN: AI Evidence, Prognostics & Active Alerts -->
            <div class="cockpit-ai-col">
              <!-- AI Assessment & Evidence Card -->
              <div class="evidence-card" id="primary-evidence-card">
                <div class="panel-header" style="margin-bottom: 6px;">
                  <span class="panel-title"><span class="material-symbols-outlined" style="color: var(--accent-cyan);">psychology</span> AI DIAGNOSTICS &amp; EVIDENCE</span>
                  <span class="ai-header-badge" id="ai-evidence-badge">VERIFIED</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin: 4px 0 8px 0; font-size:0.75rem; font-family:var(--font-mono);">
                  <span>RISK: <strong id="evidence-risk-label" style="color: var(--status-normal);">LOW</strong></span>
                  <span>CONFIDENCE: <strong id="evidence-conf-val" style="color: var(--accent-cyan);">94%</strong></span>
                  <span>TRUST: <strong id="evidence-trust-val" style="color: var(--secondary);">98%</strong></span>
                </div>
                <div style="font-size:0.70rem; color:var(--text-dim); font-family:var(--font-mono); margin-bottom: 4px;">EVIDENCE REASONING:</div>
                <ul class="evidence-bullet-list" id="primary-evidence-list">
                  <li>Operating within nominal thermodynamic and kinematic envelope</li>
                  <li>Isolation Forest score: 0.024 (Within 95% nominal cluster)</li>
                  <li>Sensor trust score: 98% (Transducer quality check valid)</li>
                  <li>Digital twin consensus confidence: 94%</li>
                </ul>
              </div>

              <!-- AI Prognostics & RUL Card -->
              <div class="ai-prediction-panel">
                <div class="panel-header">
                  <span class="panel-title"><span class="material-symbols-outlined">auto_awesome</span> PROGNOSTICS &amp; RUL</span>
                  <span class="ai-header-badge" id="ai-header-badge-mode">EVALUATION</span>
                </div>

                <div class="prediction-block">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="prediction-label">Operating State</span>
                    <span class="risk-badge low" id="ai-risk-badge">LOW RISK</span>
                  </div>
                  <span class="prediction-issue" id="ai-possible-issue">Nominal Cruise Operation</span>
                </div>

                <div class="confidence-container">
                  <div class="confidence-header">
                    <span>Confidence Level</span>
                    <span id="ai-confidence-val" style="color: var(--accent-cyan); font-weight: 700;">94%</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" id="ai-confidence-bar" style="width: 94%;"></div>
                  </div>
                </div>

                <div class="time-to-fault-block">
                  <div>
                    <div class="prediction-label">Remaining Useful Life (RUL)</div>
                    <div style="font-size: 0.68rem; color: var(--text-dim);" id="ai-rul-interval-label">Interval: [1000h, 1400h] · D_fail=0.75</div>
                  </div>
                  <div class="time-to-fault-val" id="ai-time-to-fault">1200.0 h</div>
                </div>

                <div class="action-btn-group" style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 4px;">
                  <button class="action-btn action-btn-primary" id="btn-execute-mitigation" title="Advisory Decision Support — Simulates operator advisory acknowledgment without autonomous control">
                    <span class="material-symbols-outlined">recommend</span>
                    <span>Simulated Advisory Action (Decision Support)</span>
                  </button>
                  <div style="font-size: 0.65rem; color: var(--text-dim); text-align: center; font-family: var(--font-mono);">
                    Advisory Decision Support — Non-Flight-Critical Demonstrator
                  </div>
                </div>
              </div>

              <!-- Active Debounced Alerts Panel -->
              <div class="alerts-panel">
                <div class="panel-header">
                  <span class="panel-title"><span class="material-symbols-outlined" style="color: var(--status-warning);">warning</span> ACTIVE ALERTS</span>
                  <span id="alert-counter-badge" style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--status-warning); background: rgba(245, 158, 11, 0.15); padding: 2px 8px; border-radius: 10px;">0 ACTIVE</span>
                </div>
                <div class="alert-stream" id="alerts-container">
                  <div class="alert-item ok" style="color: var(--text-dim); font-size: 0.75rem; padding: 8px;">
                    <span><span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle; margin-right: 4px; color: var(--status-normal);">check_circle</span> No active fault alerts. All subsystems nominal.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- ── SECONDARY SECTION 4: STREAM PERFORMANCE METRICS STRIP ── -->
          <div class="stream-metrics-bar" style="margin-top: 0.5rem;">
            <div class="stream-metric-box">
              <span class="stream-metric-label">INGESTION RATE</span>
              <span class="stream-metric-val" id="metric-ingest-rate">10.0 Hz</span>
            </div>
            <div class="stream-metric-box">
              <span class="stream-metric-label">PROCESSING RATE</span>
              <span class="stream-metric-val" id="metric-proc-rate">450 Hz</span>
            </div>
            <div class="stream-metric-box">
              <span class="stream-metric-label">LATENCY</span>
              <span class="stream-metric-val" id="metric-eval-latency" style="color: var(--secondary);">2.4 ms</span>
            </div>
            <div class="stream-metric-box">
              <span class="stream-metric-label">DATA AGE</span>
              <span class="stream-metric-val" id="metric-data-age" style="color: var(--accent-cyan);">18 ms</span>
            </div>
            <div class="stream-metric-box">
              <span class="stream-metric-label">DROPPED SAMPLES</span>
              <span class="stream-metric-val" id="metric-dropped-count">0</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-dim);">ROLLING WINDOW:</span>
              <div class="rate-btn-group">
                <button class="rate-btn active" data-window="30">30s</button>
                <button class="rate-btn" data-window="60">60s</button>
                <button class="rate-btn" data-window="120">120s</button>
              </div>
            </div>
          </div>

          <!-- 10-Stage Pipeline Flow Strip -->
          <div class="evaluator-pipeline-strip" id="evaluator-pipeline-strip" style="margin-top: 0.5rem;">
            <div class="evaluator-pipeline-header">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 14px; color: var(--accent-cyan);">hub</span>
                <span style="font-weight: 700; color: #fff;">10-STAGE CONTINUOUS EVALUATION PIPELINE</span>
              </div>
              <div style="display: flex; gap: 12px;">
                <span>Processed: <strong id="pipeline-total-frames" style="color: var(--accent-cyan);">0</strong> samples</span>
                <span>Health: <strong id="pipeline-health-badge" style="color: var(--status-normal);">NOMINAL</strong></span>
              </div>
            </div>
            <div class="pipeline-flow-track">
              <div class="pipeline-flow-step active" id="pipe-step-1"><span class="step-num">1</span><span class="step-name">Source</span></div>
              <div class="pipeline-flow-step active" id="pipe-step-2"><span class="step-num">2</span><span class="step-name">Ingest</span></div>
              <div class="pipeline-flow-step active" id="pipe-step-3"><span class="step-num">3</span><span class="step-name">Validation</span></div>
              <div class="pipeline-flow-step active" id="pipe-step-4"><span class="step-num">4</span><span class="step-name">Trust</span></div>
              <div class="pipeline-flow-step active" id="pipe-step-5"><span class="step-num">5</span><span class="step-name">Twin</span></div>
              <div class="pipeline-flow-step active" id="pipe-step-6"><span class="step-num">6</span><span class="step-name">Residuals</span></div>
              <div class="pipeline-flow-step active" id="pipe-step-7"><span class="step-num">7</span><span class="step-name">Anomaly IF</span></div>
              <div class="pipeline-flow-step active" id="pipe-step-8"><span class="step-num">8</span><span class="step-name">Fault Risk</span></div>
              <div class="pipeline-flow-step active" id="pipe-step-9"><span class="step-num">9</span><span class="step-name">Health Calc</span></div>
              <div class="pipeline-flow-step active" id="pipe-step-10"><span class="step-num">10</span><span class="step-name">Alerts</span></div>
            </div>
          </div>

        </section>
`;
