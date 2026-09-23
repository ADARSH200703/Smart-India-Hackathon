export const missionHtml = `
<section id="view-mission" class="pipeline-view-container" style="display: none;">
          <div class="panel-header">
            <div>
              <span class="panel-title" style="font-size: 1.3rem;"><span class="material-symbols-outlined">flight_takeoff</span> MISSION PROFILE</span>
              <p style="font-size: 0.8rem; color: var(--text-muted);">UAV Flight parameters, altitude profile, fuel consumption audit, and mission report export.</p>
            </div>
            <button class="hud-btn" id="btn-export-logs">
              <span class="material-symbols-outlined">download</span>
              <span>Export Report</span>
            </button>
          </div>

          <div class="kpi-row">
            <div class="kpi-card">
              <span class="kpi-title">ALTITUDE</span>
              <div class="flight-time-val">15,420 <span style="font-size: 0.8rem; color: var(--text-muted);">FT</span></div>
              <span class="flight-time-sub">BAROMETRIC PRESSURE</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-title">AIRSPEED</span>
              <div class="flight-time-val">118 <span style="font-size: 0.8rem; color: var(--text-muted);">KTAS</span></div>
              <span class="flight-time-sub">TRUE AIRSPEED</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-title">FUEL REMAINING</span>
              <div class="flight-time-val" style="color: var(--status-warning);">42.8 <span style="font-size: 0.8rem; color: var(--text-muted);">L</span></div>
              <span class="flight-time-sub">EST. 04H 20M ENDURANCE</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-title">MISSION HEALTH INDEX</span>
              <div class="reliability-val" style="color: var(--status-normal);">94.6%</div>
              <span class="reliability-sub">SATISFACTORY</span>
            </div>
          </div>
        </section>
`;
