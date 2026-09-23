export const historyHtml = `
<section id="view-history" class="pipeline-view-container" style="display:none;">
          <div class="panel-header">
            <div>
              <span class="panel-title" style="font-size:1.3rem;"><span class="material-symbols-outlined">description</span> HISTORY &amp; TELEMETRY LOGS</span>
              <p style="font-size:0.8rem;color:var(--text-muted);">Session statistics, event timeline with severity filters, and component health degradation logs.</p>
            </div>
            <div style="display:flex;gap:0.6rem;">
              <button class="hud-btn" id="hist-filter-all" onclick="window._histFilter('all')" style="border-color:var(--accent-cyan);color:var(--accent-cyan);">All Events</button>
              <button class="hud-btn" id="hist-filter-warning" onclick="window._histFilter('warning')">Warnings</button>
              <button class="hud-btn" id="hist-filter-critical" onclick="window._histFilter('critical')">Critical</button>
              <button class="hud-btn" id="btn-export-csv" style="margin-left:0.5rem;"><span class="material-symbols-outlined">download</span><span>Export CSV</span></button>
            </div>
          </div>

          <!-- Deterministic Replay & Scrubbing Toolbar -->
          <div class="replay-toolbar" id="replay-toolbar">
            <button class="rate-btn active" id="replay-play-pause-btn" style="min-width: 80px;">
              <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">pause</span> Pause
            </button>
            <span style="color: var(--text-dim);">SEEK:</span>
            <input type="range" id="replay-seek-slider" min="0" max="100" value="0" style="flex: 1; accent-color: var(--accent-cyan);" title="Scrub through recorded telemetry frames">
            <span id="replay-time-display" style="color: var(--accent-cyan); min-width: 60px;">00:00:00</span>
            <span style="color: var(--text-dim); margin-left: 8px;">SPEED:</span>
            <select id="replay-speed-select" class="scenario-select" style="padding: 3px 8px; font-size: 0.75rem;">
              <option value="0.5">0.5x</option>
              <option value="1.0" selected>1.0x (Real-time)</option>
              <option value="2.0">2.0x</option>
              <option value="5.0">5.0x</option>
              <option value="10.0">10.0x</option>
            </select>
          </div>

          <!-- Session Statistics Grid -->
          <div class="info-card" style="margin-bottom:1rem;">
            <h3><span class="material-symbols-outlined" style="color:var(--accent-cyan);">bar_chart</span> SESSION STATISTICS — MIN / AVG / MAX</h3>
            <div id="hist-stats-grid" class="hist-stats-grid">
              <div style="color:var(--text-dim);font-size:0.8rem;">Loading statistics…</div>
            </div>
          </div>

          <!-- Event Timeline + Component Table side by side -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <!-- Event Timeline -->
            <div class="info-card" style="max-height:520px;display:flex;flex-direction:column;">
              <h3><span class="material-symbols-outlined" style="color:var(--accent-cyan);">schedule</span> EVENT TIMELINE</h3>
              <div id="hist-timeline" class="hist-timeline" style="flex:1;overflow-y:auto;margin-top:0.5rem;">
                <div class="hist-empty">No events recorded yet.</div>
              </div>
            </div>

            <!-- Component Health Degradation Table -->
            <div class="info-card" style="max-height:520px;display:flex;flex-direction:column;">
              <h3><span class="material-symbols-outlined" style="color:var(--accent-cyan);">memory</span> COMPONENT HEALTH STATUS</h3>
              <div style="flex:1;overflow-y:auto;margin-top:0.5rem;">
                <table class="hist-comp-table">
                  <thead>
                    <tr><th>Component</th><th>Health</th><th>Status</th><th>Wear / Load</th><th>Live Reading</th></tr>
                  </thead>
                  <tbody id="hist-comp-table-body">
                    <tr><td colspan="5" style="color:var(--text-dim);text-align:center;padding:1rem;">Loading…</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
`;
