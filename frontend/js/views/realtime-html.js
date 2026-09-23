export const realtimeHtml = `
<section id="view-realtime" class="pipeline-view-container" style="display:none;">
          <div class="panel-header">
            <div>
              <span class="panel-title" style="font-size:1.3rem;"><span class="material-symbols-outlined">show_chart</span> REAL-TIME 6-CHANNEL TELEMETRY</span>
              <p style="font-size:0.8rem;color:var(--text-muted);">Live sensor readings with calibrated threshold bands, status indicators, and 5-minute rolling sparklines.</p>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <div style="font-size:0.72rem;font-family:var(--font-mono);color:var(--text-dim);text-align:right;">
                <div>STATUS: <span id="rt-data-rate" style="color:var(--accent-cyan);">SOURCE: DISCONNECTED &middot; DATA AGE: --</span></div>
                <div>HEALTH: <span id="rt-health-val" style="color:var(--status-normal);">--</span></div>
              </div>
              <span id="rt-summary-status" class="rt-overall-badge offline">NO LIVE DATA</span>
            </div>
          </div>

          <!-- Quick Summary Strip -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:1rem;">
            <div class="rt-summary-pill"><span class="rt-sum-label">RPM</span><span id="rt-summary-rpm" class="rt-sum-val">N/A</span></div>
            <div class="rt-summary-pill"><span class="rt-sum-label">TEMP</span><span id="rt-summary-temp" class="rt-sum-val">N/A</span></div>
            <div class="rt-summary-pill"><span class="rt-sum-label">OIL</span><span id="rt-summary-oil" class="rt-sum-val">N/A</span></div>
            <div class="rt-summary-pill"><span class="rt-sum-label">VIB</span><span id="rt-summary-vib" class="rt-sum-val">N/A</span></div>
          </div>

          <!-- 6-Chart Grid -->
          <div class="rt-charts-grid">

            <!-- RPM -->
            <div class="rt-chart-card" data-sensor="rpm" title="Click to inspect Engine RPM channel details">
              <div class="rt-chart-header">
                <div>
                  <div class="rt-chart-title"><span class="material-symbols-outlined" style="font-size: 14px; color: #2DD4BF;">speed</span> ENGINE RPM</div>
                  <div class="rt-chart-subtitle">Nominal: 4,215 RPM &middot; Warn: 5,000 &middot; Crit: 5,500</div>
                </div>
                <div class="rt-readout-group">
                  <span class="rt-big-val" id="rt-val-rpm">N/A</span>
                  <span class="rt-unit">RPM</span>
                  <span id="rt-badge-rpm" class="rt-status-badge offline">NO DATA</span>
                </div>
              </div>
              <div class="rt-bar-wrap"><div class="rt-range-bar"><div id="rt-bar-rpm" class="rt-range-fill" style="width:0%;background:#2DD4BF;"></div></div></div>
              <div class="rt-chart-canvas-wrap"><canvas id="rt-chart-rpm"></canvas></div>
            </div>

            <!-- Temperature -->
            <div class="rt-chart-card" data-sensor="temperature" title="Click to inspect Cylinder Head Temp channel details">
              <div class="rt-chart-header">
                <div>
                  <div class="rt-chart-title"><span class="material-symbols-outlined" style="font-size: 14px;color:#EF4444;">thermostat</span> CYLINDER CHT</div>
                  <div class="rt-chart-subtitle">Nominal: 78.4 °C &middot; Warn: 84 &middot; Crit: 92</div>
                </div>
                <div class="rt-readout-group">
                  <span class="rt-big-val" id="rt-val-temperature">N/A</span>
                  <span class="rt-unit">°C</span>
                  <span id="rt-badge-temperature" class="rt-status-badge offline">NO DATA</span>
                </div>
              </div>
              <div class="rt-bar-wrap"><div class="rt-range-bar"><div id="rt-bar-temperature" class="rt-range-fill" style="width:0%;background:#EF4444;"></div></div></div>
              <div class="rt-chart-canvas-wrap"><canvas id="rt-chart-temp"></canvas></div>
            </div>

            <!-- Oil Pressure -->
            <div class="rt-chart-card" data-sensor="oilPressure" title="Click to inspect Oil Pressure channel details">
              <div class="rt-chart-header">
                <div>
                  <div class="rt-chart-title"><span class="material-symbols-outlined" style="font-size: 14px;color:#38BDF8;">water_drop</span> OIL PRESSURE</div>
                  <div class="rt-chart-subtitle">Nominal: 4.3 Bar &middot; Warn &lt;3.6 &middot; Crit &lt;2.8</div>
                </div>
                <div class="rt-readout-group">
                  <span class="rt-big-val" id="rt-val-oilPressure">N/A</span>
                  <span class="rt-unit">Bar</span>
                  <span id="rt-badge-oilPressure" class="rt-status-badge offline">NO DATA</span>
                </div>
              </div>
              <div class="rt-bar-wrap"><div class="rt-range-bar"><div id="rt-bar-oilPressure" class="rt-range-fill" style="width:0%;background:#38BDF8;"></div></div></div>
              <div class="rt-chart-canvas-wrap"><canvas id="rt-chart-oil"></canvas></div>
            </div>

            <!-- Vibration -->
            <div class="rt-chart-card" data-sensor="vibration" title="Click to inspect Casing Vibration channel details">
              <div class="rt-chart-header">
                <div>
                  <div class="rt-chart-title"><span class="material-symbols-outlined" style="font-size: 14px;color:#F59E0B;">vibration</span> CASING VIBRATION</div>
                  <div class="rt-chart-subtitle">Nominal: 1.6 mm/s &middot; Warn: 2.4 &middot; Crit: 3.8</div>
                </div>
                <div class="rt-readout-group">
                  <span class="rt-big-val" id="rt-val-vibration">N/A</span>
                  <span class="rt-unit">mm/s</span>
                  <span id="rt-badge-vibration" class="rt-status-badge offline">NO DATA</span>
                </div>
              </div>
              <div class="rt-bar-wrap"><div class="rt-range-bar"><div id="rt-bar-vibration" class="rt-range-fill" style="width:0%;background:#F59E0B;"></div></div></div>
              <div class="rt-chart-canvas-wrap"><canvas id="rt-chart-vib"></canvas></div>
            </div>

            <!-- Fuel Flow -->
            <div class="rt-chart-card" data-sensor="fuelFlow" title="Click to inspect Fuel Flow Rate channel details">
              <div class="rt-chart-header">
                <div>
                  <div class="rt-chart-title"><span class="material-symbols-outlined" style="font-size: 14px;color:#38BDF8;">local_gas_station</span> FUEL FLOW RATE</div>
                  <div class="rt-chart-subtitle">Nominal: 5.2 L/h &middot; Warn: 7.5 &middot; Crit: 9.0</div>
                </div>
                <div class="rt-readout-group">
                  <span class="rt-big-val" id="rt-val-fuelFlow">N/A</span>
                  <span class="rt-unit">L/h</span>
                  <span id="rt-badge-fuelFlow" class="rt-status-badge offline">NO DATA</span>
                </div>
              </div>
              <div class="rt-bar-wrap"><div class="rt-range-bar"><div id="rt-bar-fuelFlow" class="rt-range-fill" style="width:0%;background:#38BDF8;"></div></div></div>
              <div class="rt-chart-canvas-wrap"><canvas id="rt-chart-fuel"></canvas></div>
            </div>

            <!-- Engine Load -->
            <div class="rt-chart-card" data-sensor="engineLoad" title="Click to inspect Engine Load Demand channel details">
              <div class="rt-chart-header">
                <div>
                  <div class="rt-chart-title"><span class="material-symbols-outlined" style="font-size: 14px;color:#2DD4BF;">bolt</span> ENGINE LOAD DEMAND</div>
                  <div class="rt-chart-subtitle">Nominal: 62% &middot; Warn: 85% &middot; Crit: 95%</div>
                </div>
                <div class="rt-readout-group">
                  <span class="rt-big-val" id="rt-val-engineLoad">N/A</span>
                  <span class="rt-unit">%</span>
                  <span id="rt-badge-engineLoad" class="rt-status-badge offline">NO DATA</span>
                </div>
              </div>
              <div class="rt-bar-wrap"><div class="rt-range-bar"><div id="rt-bar-engineLoad" class="rt-range-fill" style="width:62%;background:#2DD4BF;"></div></div></div>
              <div class="rt-chart-canvas-wrap"><canvas id="rt-chart-load"></canvas></div>
            </div>

          </div>
        </section>
`;
