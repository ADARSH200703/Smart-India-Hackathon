export const threedHtml = `
<section id="view-threed" class="three-viewport-container" style="display: none;">
          <div class="three-canvas-holder" id="canvas-container">
            
            <!-- Top 3D Camera & View Control Bar -->
            <div class="three-top-toolbar">
              <div class="camera-preset-group">
                <span class="toolbar-label"><span class="material-symbols-outlined">videocam</span> CAMERA:</span>
                <button class="hud-mini-btn active" id="btn-cam-iso" title="Isometric Perspective">Iso</button>
                <button class="hud-mini-btn" id="btn-cam-front" title="Front View">Front</button>
                <button class="hud-mini-btn" id="btn-cam-rear" title="Rear View">Rear</button>
                <button class="hud-mini-btn" id="btn-cam-left" title="Left View">Left</button>
                <button class="hud-mini-btn" id="btn-cam-right" title="Right View">Right</button>
                <button class="hud-mini-btn" id="btn-cam-top" title="Top Down Planform">Top</button>
                <button class="hud-mini-btn" id="btn-cam-bottom" title="Ventral Belly View">Bottom</button>
                <button class="hud-mini-btn" id="btn-cam-engine" title="Close-Up Engine Inspection View" style="color: var(--accent-cyan); border-color: var(--border-bright);">Engine 🔍</button>
              </div>

              <div class="camera-action-group">
                <button class="hud-mini-btn" id="btn-zoom-in" title="Zoom In"><span class="material-symbols-outlined" style="font-size:14px;">zoom_in</span></button>
                <button class="hud-mini-btn" id="btn-zoom-out" title="Zoom Out"><span class="material-symbols-outlined" style="font-size:14px;">zoom_out</span></button>
                <button class="hud-mini-btn" id="btn-cam-reset" title="Reset View Target"><span class="material-symbols-outlined" style="font-size:14px;">restart_alt</span> Reset</button>
                <button class="hud-mini-btn" id="btn-fullscreen-toggle" title="Toggle Fullscreen Viewport"><span class="material-symbols-outlined" style="font-size:14px;">fullscreen</span></button>
              </div>
            </div>

            <!-- 3D HUD Flight Overlays -->
            <div class="three-overlay-hud">
              <div class="hud-pill">
                <span class="material-symbols-outlined" style="color: #2DD4BF;">speed</span>
                <span>RPM: <strong id="hud-rpm-val">4215 RPM</strong></span>
              </div>
              <div class="hud-pill">
                <span class="material-symbols-outlined" style="color: #EF4444;">thermostat</span>
                <span>CHT: <strong id="hud-temp-val">78.4 °C</strong></span>
              </div>
              <div class="hud-pill">
                <span class="material-symbols-outlined" style="color: #38BDF8;">opacity</span>
                <span>Oil: <strong id="hud-oil-val">4.3 Bar</strong></span>
              </div>
              <div class="hud-pill">
                <span class="material-symbols-outlined" style="color: #F59E0B;">vibration</span>
                <span>Vib: <strong id="hud-vib-val">1.6 mm/s</strong></span>
              </div>
            </div>

            <!-- Digital Twin Live Status Badge (Top Right Overlay) -->
            <div class="three-live-status-pill">
              <span class="live-pulse-dot"></span>
              <span>SYNC: <strong id="twin-sync-status" style="color: var(--status-normal);">10 Hz LIVE</strong></span>
              <span class="pill-divider">|</span>
              <span>HEALTH: <strong id="twin-health-badge" style="color: var(--status-normal);">92%</strong></span>
              <span class="pill-divider">|</span>
              <span class="rul-badge-tag" id="twin-rul-tag">RUL: 1200h</span>
            </div>

            <!-- Bottom 3D Viewport Controls & Inspection Bar -->
            <div class="three-controls-bottom">
              <div class="hierarchy-button-group">
                <button class="three-control-btn active" id="btn-mode-solid" title="Solid Alloy Surface">Solid Alloy</button>
                <button class="three-control-btn" id="btn-mode-hologram" title="Wireframe Hologram Mesh">Hologram</button>
                <button class="three-control-btn" id="btn-mode-thermal" title="Thermal Heatmap Shader">Thermal Heatmap</button>
              </div>
              
              <span style="width: 1px; height: 20px; background: var(--border-subtle); margin: 0 4px;"></span>
              
              <button class="three-control-btn" id="btn-engine-inspect-toggle" title="Focus Camera on Engine &amp; Make Airframe Translucent">
                <span class="material-symbols-outlined" style="font-size:14px; vertical-align:middle; margin-right:3px;">biotech</span>
                <span>Engine Focus</span>
              </button>
              
              <button class="three-control-btn" id="btn-explode-toggle" title="Smoothly Displace Sub-Assemblies for Cutaway View">
                <span class="material-symbols-outlined" style="font-size:14px; vertical-align:middle; margin-right:3px;">unfold_more</span>
                <span>Exploded View</span>
              </button>

              <button class="three-control-btn active" id="btn-toggle-sensors" title="Toggle 3D Sensor Markers Visibility">
                <span class="material-symbols-outlined" style="font-size:14px; vertical-align:middle; margin-right:3px;">sensors</span>
                <span>Show Sensors</span>
              </button>
            </div>
          </div>

          <!-- Right Side Component & Evaluator Evidence Inspector -->
          <div class="engine-component-inspector">
            <div class="panel-header">
              <div>
                <span class="panel-title"><span class="material-symbols-outlined">search</span> COMPONENT INSPECTOR</span>
                <div style="font-size: 0.68rem; color: var(--text-muted);">State-Space Subsystem Diagnostics</div>
              </div>
              <span class="ai-header-badge" id="inspected-part-badge">ROTAX 914 POWERPLANT</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.25rem;">
              <div style="font-size: 1.05rem; color: #fff; font-weight: 700;" id="inspected-part-title">Rotax 914 Turbocharged Aero Engine</div>
              <span class="status-pill-badge" id="inspected-status-pill" style="background: rgba(16, 185, 129, 0.18); color: var(--status-normal); border: 1px solid var(--status-normal);">HEALTHY</span>
            </div>
            <p style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.4; margin-top: 0.25rem;" id="inspected-part-desc">4-cylinder horizontally opposed 4-stroke engine with integrated turbocharger and dual electronic ignition.</p>

            <!-- Component Health, Status & RUL Matrix -->
            <div class="component-spec-grid">
              <div class="spec-box">
                <span class="spec-box-label">Health</span>
                <span class="spec-box-val" id="inspect-health" style="color: var(--status-normal);">92.4%</span>
              </div>
              <div class="spec-box">
                <span class="spec-box-label">Operating CHT</span>
                <span class="spec-box-val" id="inspect-temp">78.4 °C</span>
              </div>
              <div class="spec-box">
                <span class="spec-box-label">Estimated RUL</span>
                <span class="spec-box-val" id="inspect-rul" style="color: var(--accent-cyan);">1200 h</span>
              </div>
              <div class="spec-box">
                <span class="spec-box-label">Vibration Residual</span>
                <span class="spec-box-val" id="inspect-stress">+0.12 σ</span>
              </div>
            </div>

            <!-- Active Fault & AI Diagnostic Box -->
            <div class="inspector-fault-box" id="inspect-fault-box">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">ACTIVE DIAGNOSIS</span>
                <span id="inspect-confidence-tag" style="font-size: 0.70rem; color: var(--accent-cyan); font-family: var(--font-mono);">Confidence: 94%</span>
              </div>
              <div id="inspect-fault-desc" style="font-size: 0.85rem; color: #fff; font-weight: 700; margin-top: 2px;">Nominal Combustion &amp; Bearing Dynamics</div>
            </div>

            <!-- Evaluator "Why is this Unhealthy?" Action Button -->
            <button class="hud-btn hud-btn-evidence" id="btn-why-unhealthy" style="width: 100%; margin: 0.6rem 0; justify-content: center; background: rgba(56, 189, 248, 0.1); border-color: var(--border-bright);">
              <span class="material-symbols-outlined" style="font-size: 16px; color: var(--accent-cyan);">help_center</span>
              <span>Why is this Component Flagged / Unhealthy?</span>
            </button>

            <!-- Component Selection Buttons Tree -->
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.6rem; flex: 1; overflow-y: auto;">
              <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 0.4rem;">Select Subsystem or Sensor:</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem;">
                <button class="hud-btn component-pick-btn active" data-comp="engine"><span class="material-symbols-outlined" style="font-size:13px;">settings</span> Engine Core</button>
                <button class="hud-btn component-pick-btn" data-comp="bearings"><span class="material-symbols-outlined" style="font-size:13px;">radio_button_checked</span> Main Bearings</button>
                <button class="hud-btn component-pick-btn" data-comp="cylinder_1"><span class="material-symbols-outlined" style="font-size:13px;">view_in_ar</span> Cylinder #1</button>
                <button class="hud-btn component-pick-btn" data-comp="cylinder_2"><span class="material-symbols-outlined" style="font-size:13px;">view_in_ar</span> Cylinder #2</button>
                <button class="hud-btn component-pick-btn" data-comp="cylinder_3"><span class="material-symbols-outlined" style="font-size:13px;">view_in_ar</span> Cylinder #3</button>
                <button class="hud-btn component-pick-btn" data-comp="cylinder_4"><span class="material-symbols-outlined" style="font-size:13px;">view_in_ar</span> Cylinder #4</button>
                <button class="hud-btn component-pick-btn" data-comp="crankshaft"><span class="material-symbols-outlined" style="font-size:13px;">sync</span> Crankshaft</button>
                <button class="hud-btn component-pick-btn" data-comp="oil_system"><span class="material-symbols-outlined" style="font-size:13px;">water_drop</span> Oil Sump</button>
                <button class="hud-btn component-pick-btn" data-comp="fuel_system"><span class="material-symbols-outlined" style="font-size:13px;">local_gas_station</span> Fuel Injection</button>
                <button class="hud-btn component-pick-btn" data-comp="cooling_system"><span class="material-symbols-outlined" style="font-size:13px;">ac_unit</span> Cooling Sump</button>
                <button class="hud-btn component-pick-btn" data-comp="propeller"><span class="material-symbols-outlined" style="font-size:13px;">rotate_right</span> Propeller Hub</button>
                <button class="hud-btn component-pick-btn" data-comp="airframe"><span class="material-symbols-outlined" style="font-size:13px;">flight</span> Airframe</button>
                <button class="hud-btn component-pick-btn" data-comp="ecu"><span class="material-symbols-outlined" style="font-size:13px;">memory</span> Dual ECU</button>
                <button class="hud-btn component-pick-btn" data-comp="telemetry_gateway"><span class="material-symbols-outlined" style="font-size:13px;">router</span> Telemetry</button>
              </div>
            </div>
          </div>
        </section>
`;
