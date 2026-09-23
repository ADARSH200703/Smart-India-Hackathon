export const pipelineHtml = `
<section id="view-pipeline" class="pipeline-view-container" style="display: none;">
          <div class="panel-header">
            <div>
              <span class="panel-title" style="font-size: 1.3rem;"><span class="material-symbols-outlined">hub</span> SYSTEM ARCHITECTURE &amp; PIPELINE</span>
              <p style="font-size: 0.8rem; color: var(--text-muted);">From physical UAV propulsion hardware to Edge Ingestion, Virtual Physics Twin, ML Prognostics, and GCS Closed-Loop Control.</p>
            </div>
          </div>

          <div class="pipeline-diagram">
            <!-- Stage 1 -->
            <div class="pipeline-stage-card" data-stage="1">
              <span class="stage-badge">STAGE 1</span>
              <div class="stage-title">1. REAL UAV ENGINE</div>
              <div class="stage-sub">Rotax 914 Turbocharged Aero Engine</div>
              <ul class="stage-details-list">
                <li><span class="material-symbols-outlined">chevron_right</span> 4-Cylinder Horizontally Opposed</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Crankshaft &amp; Main Bearings</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Turbocharger &amp; Wastegate</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Dual Electronic Ignition</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Lubrication Sump &amp; Radiator</li>
              </ul>
            </div>

            <!-- Stage 2 -->
            <div class="pipeline-stage-card" data-stage="2">
              <span class="stage-badge">STAGE 2</span>
              <div class="stage-title">2. SENSORS &amp; TELEMETRY</div>
              <div class="stage-sub">Continuous Data Collection</div>
              <ul class="stage-details-list">
                <li><span class="material-symbols-outlined">chevron_right</span> CHT Temperature (°C)</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Propeller Shaft RPM</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Hydrodynamic Oil Pressure (Bar)</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Casing Vibration Accelerometer (mm/s)</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Fuel Flow Turbine (L/h)</li>
              </ul>
            </div>

            <!-- Stage 3 -->
            <div class="pipeline-stage-card" data-stage="3">
              <span class="stage-badge">STAGE 3</span>
              <div class="stage-title">3. SENSOR TRUST ENGINE</div>
              <div class="stage-sub">Signal Quality Validation</div>
              <ul class="stage-details-list">
                <li><span class="material-symbols-outlined">chevron_right</span> Range &amp; Out-of-bounds Check</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Frozen Signal &amp; Stuck Rejection</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Noise Variance &amp; Jump Detection</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Sensor Calibration Drift Tracker</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Weighted Aggregate Trust Score</li>
              </ul>
            </div>

            <!-- Stage 4 -->
            <div class="pipeline-stage-card" data-stage="4">
              <span class="stage-badge">STAGE 4</span>
              <div class="stage-title">4. PHYSICS DIGITAL TWIN</div>
              <div class="stage-sub">Thermodynamic State Model</div>
              <ul class="stage-details-list">
                <li><span class="material-symbols-outlined">check</span> Mean-Value Physics Model</li>
                <li><span class="material-symbols-outlined">check</span> ISA Atmosphere Compensation</li>
                <li><span class="material-symbols-outlined">check</span> Expected Telemetry Computation</li>
                <li><span class="material-symbols-outlined">check</span> Normalized Residuals (Δ, σ, slope)</li>
                <li><span class="material-symbols-outlined">check</span> 3D Kinematic Model Synchronization</li>
              </ul>
            </div>

            <!-- Stage 5 -->
            <div class="pipeline-stage-card" data-stage="5">
              <span class="stage-badge">STAGE 5</span>
              <div class="stage-title">5. AI / ML PROGNOSTICS</div>
              <div class="stage-sub">Intelligence &amp; Prediction</div>
              <ul class="stage-details-list">
                <li><span class="material-symbols-outlined">chevron_right</span> Isolation Forest Anomaly Detection</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Multi-Class Physics Fault Classifier</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Degradation Velocity (dD/dt)</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Remaining Useful Life (RUL) Hours</li>
                <li><span class="material-symbols-outlined">chevron_right</span> Multi-Source Consensus Engine</li>
              </ul>
            </div>

            <!-- Stage 6 -->
            <div class="pipeline-stage-card" data-stage="6">
              <span class="stage-badge">STAGE 6</span>
              <div class="stage-title">6. GROUND STATION &amp; ALERTS</div>
              <div class="stage-sub">Operator Decision Support</div>
              <ul class="stage-details-list">
                <li><span class="material-symbols-outlined">check</span> Propulsion Health Index</li>
                <li><span class="material-symbols-outlined">check</span> Debounced Multi-Level Alerts</li>
                <li><span class="material-symbols-outlined">check</span> Explainable "Why?" Evidence Chains</li>
                <li><span class="material-symbols-outlined">check</span> Mission Risk &amp; Maintenance Actions</li>
                <li><span class="material-symbols-outlined">check</span> Closed-Loop Uplink Commands</li>
              </ul>
            </div>
          </div>

          <!-- Feedback Closed Loop -->
          <div class="feedback-arrow-bar">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="material-symbols-outlined" style="color: var(--accent-cyan); font-size: 22px;">arrow_left_circle</span>
              <span><strong>CLOSED-LOOP FEEDBACK:</strong> Ground station operator and automated mitigation telecommands transmitted via uplink to engine controller.</span>
            </div>
            <span style="font-size: 0.7rem; color: var(--text-dim);">Uplink Telecommand Frequency: 10 Hz</span>
          </div>

          <!-- Project Overview & Tech Stack -->
          <div class="info-cards-grid" style="margin-top: 1.5rem;">
            <div class="info-card">
              <h3><span class="material-symbols-outlined" style="color: var(--accent-cyan);">code</span> TECHNOLOGIES USED</h3>
              <div class="tech-badges-grid">
                <div class="tech-pill"><span class="material-symbols-outlined" style="color: #38BDF8;">terminal</span><span>Python 3.12</span></div>
                <div class="tech-pill"><span class="material-symbols-outlined" style="color: #2DD4BF;">bolt</span><span>FastAPI / WebSocket</span></div>
                <div class="tech-pill"><span class="material-symbols-outlined" style="color: #38BDF8;">psychology</span><span>scikit-learn &middot; NumPy &middot; SciPy</span></div>
                <div class="tech-pill"><span class="material-symbols-outlined" style="color: #F59E0B;">database</span><span>SQLite &middot; Pydantic</span></div>
                <div class="tech-pill"><span class="material-symbols-outlined" style="color: #2DD4BF;">bar_chart</span><span>Three.js &middot; Chart.js</span></div>
                <div class="tech-pill"><span class="material-symbols-outlined" style="color: #EF4444;">dashboard</span><span>HTML5 &middot; Vanilla CSS</span></div>
              </div>
            </div>

            <div class="info-card">
              <h3><span class="material-symbols-outlined" style="color: var(--status-normal);">emoji_events</span> SYSTEM OBJECTIVES</h3>
              <ul class="bullet-check-list">
                <li><span class="material-symbols-outlined">check_circle</span> Early in-flight detection of mechanical, thermal, and lubrication degradation</li>
                <li><span class="material-symbols-outlined">check_circle</span> Prevention of critical uncontained engine failures during MALE UAV sorties</li>
                <li><span class="material-symbols-outlined">check_circle</span> Condition-based maintenance scheduling backed by explainable physics evidence</li>
              </ul>
            </div>
          </div>
        </section>
`;
