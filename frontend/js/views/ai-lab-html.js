export const ai_labHtml = `
<section id="view-ai-lab" class="pipeline-view-container" style="display: none;">
          <!-- Section Header -->
          <div class="panel-header" style="margin-bottom: 1.25rem;">
            <div>
              <span class="panel-title" style="font-size: 1.4rem;">
                <span class="material-symbols-outlined" style="color: var(--accent-cyan);">psychology</span>
                AI &amp; ML PROGNOSTICS LAB
              </span>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
                Multi-variate physics residual anomaly detection, 2D latent-space cluster mapping, multi-class failure diagnosis, and degradation RUL forecasting.
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="ai-header-badge" id="ai-lab-model-ver" style="font-size: 0.72rem; padding: 4px 10px; border-radius: var(--radius-sm); background: rgba(56, 189, 248, 0.12); color: var(--accent-cyan); border: 1px solid var(--border-bright);">
                AERIS-IF-Anom-v2.1 &middot; XGBoost-v2.3
              </div>
              <span class="ai-header-badge" id="lab-header-badge-mode" style="font-size: 0.72rem; padding: 4px 10px; border-radius: var(--radius-sm); background: rgba(34, 197, 94, 0.15); color: var(--status-normal); border: 1px solid rgba(34, 197, 94, 0.3);">
                CONTINUOUS EVALUATION
              </span>
            </div>
          </div>

          <!-- ── ROW 1: PRIMARY AI SUMMARY CARDS (Large, Prominent Aerospace Instruments) ── -->
          <div class="ai-summary-cards-row">
            <!-- Card 1: AI Anomaly Status & Operating Cluster -->
            <div class="ai-summary-card" id="card-ai-anomaly-status">
              <div class="ai-card-head">
                <span class="ai-card-title"><span class="material-symbols-outlined" style="color: var(--accent-cyan);">crisis_alert</span> AI ANOMALY ASSESSMENT</span>
                <span class="risk-badge low" id="lab-risk-badge">LOW RISK</span>
              </div>
              <div class="ai-primary-val-row">
                <span class="ai-big-value" id="ai-anomaly-status-val" style="color: var(--status-normal);">NOMINAL</span>
                <span class="ai-cluster-tag" id="lab-cluster-id">Cluster C0 (Nominal Envelope)</span>
              </div>
              <p class="ai-card-sub" id="ai-anomaly-desc">Operating within nominal multi-variate thermodynamic and kinematic envelope.</p>
              
              <div class="ai-metric-strip">
                <div class="ai-metric-item">
                  <span class="ai-m-label">Reconstruction Error</span>
                  <span class="ai-m-val" id="lab-anomaly-score" style="color: var(--accent-cyan);">0.024</span>
                </div>
                <div class="ai-metric-item">
                  <span class="ai-m-label">Threshold</span>
                  <span class="ai-m-val" id="label-sensitivity" style="color: var(--text-dim);">0.045</span>
                </div>
                <div class="ai-metric-item">
                  <span class="ai-m-label">Severity</span>
                  <span class="ai-m-val" id="lab-severity-badge" style="color: var(--status-normal);">LOW</span>
                </div>
              </div>
              <div class="progress-bar-bg" style="margin-top: 0.5rem;"><div id="lab-anomaly-bar" class="progress-bar-fill" style="width: 2.4%; background: var(--accent-cyan);"></div></div>
            </div>

            <!-- Card 2: Fault Classifier (Multi-Class Probabilities) -->
            <div class="ai-summary-card" id="card-ai-fault-classifier">
              <div class="ai-card-head">
                <span class="ai-card-title"><span class="material-symbols-outlined" style="color: var(--secondary);">pie_chart</span> FAULT CLASSIFIER (XGBoost)</span>
                <span class="ai-confidence-pill">Confidence: <strong id="lab-confidence-val" style="color: var(--accent-cyan);">94%</strong></span>
              </div>
              <div class="ai-primary-val-row">
                <span class="ai-big-value" id="lab-possible-issue" style="font-size: 1.35rem; color: #fff;">Nominal Cruise</span>
              </div>
              
              <div class="ai-prob-bars-stack">
                <div class="prob-row">
                  <div class="prob-row-labels"><span>Nominal Cruise</span><span id="prob-nominal" style="color: var(--status-normal); font-weight:700;">96%</span></div>
                  <div class="progress-bar-bg"><div id="prob-nominal-bar" class="progress-bar-fill" style="width:96%; background:var(--status-normal);"></div></div>
                </div>
                <div class="prob-row">
                  <div class="prob-row-labels"><span>Lubrication Loss</span><span id="prob-lube" style="color: var(--status-warning);">1%</span></div>
                  <div class="progress-bar-bg"><div id="prob-lube-bar" class="progress-bar-fill" style="width:1%;"></div></div>
                </div>
                <div class="prob-row">
                  <div class="prob-row-labels"><span>Bearing Wear</span><span id="prob-bearing" style="color: var(--status-warning);">1%</span></div>
                  <div class="progress-bar-bg"><div id="prob-bearing-bar" class="progress-bar-fill" style="width:1%;"></div></div>
                </div>
                <div class="prob-row">
                  <div class="prob-row-labels"><span>Thermal Overheat</span><span id="prob-thermal" style="color: var(--status-warning);">1%</span></div>
                  <div class="progress-bar-bg"><div id="prob-thermal-bar" class="progress-bar-fill" style="width:1%;"></div></div>
                </div>
                <div class="prob-row">
                  <div class="prob-row-labels"><span>Spark Misfire</span><span id="prob-misfire">1%</span></div>
                  <div class="progress-bar-bg"><div id="prob-misfire-bar" class="progress-bar-fill" style="width:1%;"></div></div>
                </div>
              </div>
            </div>

            <!-- Card 3: Prognostics & Remaining Useful Life (RUL) -->
            <div class="ai-summary-card" id="card-ai-prognostics-rul">
              <div class="ai-card-head">
                <span class="ai-card-title"><span class="material-symbols-outlined" style="color: var(--accent-cyan);">timer</span> PROGNOSTICS &amp; RUL</span>
                <span class="ai-model-tag">Weibull-LSTM</span>
              </div>
              <div class="ai-primary-val-row">
                <span class="ai-big-value" id="lab-rul-val" style="font-size: 2.1rem; color: var(--accent-cyan); font-family: var(--font-tech);">1200.0 h</span>
                <span class="ai-time-label">TO D_fail=0.75</span>
              </div>
              
              <div class="ai-metric-strip">
                <div class="ai-metric-item">
                  <span class="ai-m-label">Hazard Rate</span>
                  <span class="ai-m-val" id="lab-hazard-rate">0.0034 / hr</span>
                </div>
                <div class="ai-metric-item">
                  <span class="ai-m-label">Degradation Rate</span>
                  <span class="ai-m-val" id="lab-deg-velocity" style="color: var(--status-normal);">+0.0002 / hr</span>
                </div>
              </div>
              <div style="font-size: 0.72rem; color: var(--text-dim); font-family: var(--font-mono); margin-top: 0.4rem;" id="lab-rul-interval-label">
                Confidence Interval (90% PI): [1000h, 1400h]
              </div>
              <span id="lab-time-to-fault" style="display: none;">1200.0 h</span>
              <div class="progress-bar-bg" style="margin-top: 0.5rem;"><div id="lab-confidence-bar" class="progress-bar-fill" style="width: 94%; background: var(--accent-cyan);"></div></div>
            </div>

            <!-- Card 4: Mitigation & Closed-Loop Action -->
            <div class="ai-summary-card" id="card-ai-mitigation-actions">
              <div class="ai-card-head">
                <span class="ai-card-title"><span class="material-symbols-outlined" style="color: var(--status-normal);">shield_check</span> MITIGATION &amp; CLOSED-LOOP</span>
                <span class="ai-status-pill">Active</span>
              </div>
              <div style="font-size: 0.72rem; color: var(--text-dim); font-family: var(--font-mono); margin-bottom: 4px;">OPERATOR ACTION ADVISORY:</div>
              <div id="lab-mitigation-box" class="ai-mitigation-advisory-box">
                &bull; All propulsion parameters within nominal envelope.<br>
                &bull; Continue planned waypoint flight profile at current throttle demand.
              </div>
              <ul class="action-list" id="ai-action-list" style="display: none;">
                <li>Maintain nominal flight trajectory</li>
              </ul>
              <div class="action-btn-group" style="margin-top: auto; padding-top: 0.6rem;">
                <button class="action-btn action-btn-primary" id="lab-btn-execute-mitigation" style="width: 100%;">
                  <span class="material-symbols-outlined">send</span>
                  <span>Transmit Mitigation Telecommand</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ── ROW 2: LARGE DEDICATED VISUALIZATIONS (Cluster Map & Trend Analysis) ── -->
          <div class="ai-visualizations-row">
            <!-- Left Column: Large Dedicated Operating Cluster & Latent Space Canvas -->
            <div class="info-card ai-viz-card" id="cluster-map-card">
              <div class="panel-header" style="margin-bottom: 0.6rem;">
                <div>
                  <span class="panel-title" style="font-size: 1.05rem;">
                    <span class="material-symbols-outlined" style="color: var(--accent-cyan);">scatter_plot</span>
                    OPERATING CLUSTER &amp; LATENT SPACE MAP
                  </span>
                  <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px;">
                    Multi-variate state mapping into 2D latent space with 4 calibrated operating regimes (C0..C3).
                  </div>
                </div>
                <span class="ai-header-badge" id="lab-cluster-status" style="font-size: 0.72rem; padding: 3px 10px; border-radius: var(--radius-sm); background: rgba(34, 197, 94, 0.15); color: var(--status-normal); border: 1px solid rgba(34, 197, 94, 0.3);">
                  CLUSTER C0: NOMINAL
                </span>
              </div>

              <!-- Large High-Resolution Cluster Canvas Frame -->
              <div class="latent-space-large-frame">
                <canvas id="latent-space-canvas" width="600" height="300" style="width: 100%; height: 300px; display: block;"></canvas>
              </div>

              <!-- Axis Labels & Sensitivity Control Toolbar -->
              <div class="cluster-toolbar-strip">
                <div class="cluster-axis-labels">
                  <span><strong>X-Axis:</strong> Latent Feature z₁ (Kinematic / Mechanical Residuals: RPM &middot; Vibration)</span>
                  <span><strong>Y-Axis:</strong> Latent Feature z₂ (Thermodynamic / Fluid Residuals: CHT &middot; Oil &middot; Fuel)</span>
                </div>
                <div class="cluster-sensitivity-control">
                  <span>Sensitivity (Threshold):</span>
                  <input type="range" id="slider-sensitivity" min="0.01" max="0.08" step="0.005" value="0.045" style="flex:1; accent-color: var(--accent-cyan); cursor:pointer;">
                </div>
              </div>
            </div>

            <!-- Right Column: Real-Time AI Diagnostics & Prognostics Trend Analysis -->
            <div class="info-card ai-viz-card" id="ai-trend-card">
              <div class="panel-header" style="margin-bottom: 0.6rem;">
                <div>
                  <span class="panel-title" style="font-size: 1.05rem;">
                    <span class="material-symbols-outlined" style="color: var(--secondary);">ssid_chart</span>
                    PROGNOSTICS &amp; ANOMALY SIGNAL TRENDS
                  </span>
                  <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px;">
                    Real-time rolling evolution of anomaly scores, residual magnitudes, and health degradation.
                  </div>
                </div>
                <div class="chart-legend" style="font-size: 0.72rem;">
                  <div class="legend-item"><span class="legend-color" style="background: #38BDF8;"></span> Anomaly Score</div>
                  <div class="legend-item"><span class="legend-color" style="background: #2DD4BF;"></span> Health %</div>
                  <div class="legend-item"><span class="legend-color" style="background: #EF4444;"></span> Max σ</div>
                  <div class="legend-item"><span class="legend-color" style="background: #F59E0B;"></span> Hazard</div>
                </div>
              </div>

              <div class="ai-trend-wrapper" style="height: 300px; position: relative;">
                <canvas id="ai-trend-chart"></canvas>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.6rem; font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-dim);">
                <span>Sampling Window: 300 Telemetry Frames (30s @ 10Hz)</span>
                <span>Detection Boundary: 0.045 Anomaly Score</span>
              </div>
            </div>
          </div>

          <!-- ── ROW 3: EXPLAINABLE EVIDENCE & MODEL INTEGRITY DETAILS ── -->
          <div class="ai-details-row">
            <!-- Left: "Why This Result?" Explainable AI Evidence -->
            <div class="info-card" id="ai-why-result-card">
              <div class="panel-header" style="margin-bottom: 0.5rem;">
                <span class="panel-title" style="font-size: 0.95rem;">
                  <span class="material-symbols-outlined" style="color: var(--accent-cyan);">help_center</span>
                  WHY DID THE AI REACH THIS CONCLUSION?
                </span>
                <span class="ai-header-badge" id="lab-evidence-badge">EVIDENCE VERIFIED</span>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.6rem;">
                Multi-perspective deterministic and probabilistic evidence tracing from physics residual models to unsupervised Isolation Forest:
              </p>
              <ul class="evidence-bullet-list" id="ai-lab-evidence-list">
                <li>Physics Model: Operating within nominal indicated brake torque and thermal balance envelope.</li>
                <li>Sensor Trust Score: 98% (All 6 primary transducers valid, zero variance/freeze or drift anomaly).</li>
                <li>Isolation Forest: Multi-variate reconstruction error within standard 1.5σ nominal cluster boundary (C0).</li>
                <li>Digital Twin Consensus: 94% confidence across physics, sensor trust, and machine learning pipelines.</li>
              </ul>
            </div>

            <!-- Right: Model Performance & Architecture Details -->
            <div class="info-card" id="ai-model-details-card">
              <div class="panel-header" style="margin-bottom: 0.5rem;">
                <span class="panel-title" style="font-size: 0.95rem;">
                  <span class="material-symbols-outlined" style="color: var(--secondary);">verified</span>
                  MODEL VERIFICATION &amp; INTEGRITY SPECS
                </span>
                <span style="font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-dim);">DRDO MALE UAV Spec</span>
              </div>

              <div class="model-specs-grid">
                <div class="spec-box">
                  <span class="spec-box-label">Anomaly Model</span>
                  <span class="spec-box-val" style="font-size: 0.82rem; color: var(--accent-cyan);">Isolation Forest (100 Trees)</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Fault Classifier</span>
                  <span class="spec-box-val" style="font-size: 0.82rem; color: var(--secondary);">Gradient Boost (5-Class)</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Validation Accuracy</span>
                  <span class="spec-box-val" style="color: var(--status-normal);">98.4%</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">F1 Classification Score</span>
                  <span class="spec-box-val" style="color: var(--status-normal);">0.979</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">Consensus Engine</span>
                  <span class="spec-box-val" style="font-size: 0.82rem;">Triple-Redundant Voting</span>
                </div>
                <div class="spec-box">
                  <span class="spec-box-label">RUL Model</span>
                  <span class="spec-box-val" style="font-size: 0.82rem; color: var(--accent-cyan);">Weibull Hazard (β=2.4)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
`;
