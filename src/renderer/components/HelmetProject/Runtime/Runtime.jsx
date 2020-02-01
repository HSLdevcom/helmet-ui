import React from 'react';

const Runtime = ({
  projectPath, scenarios, scenarioIDsToRun, runningScenarioID, openScenarioID,
  setOpenScenarioID,
  reloadScenarios,
  handleClickScenarioToActive, handleClickNewScenario,
  statusIterationsTotal, statusIterationsCompleted, statusReadyScenariosLogfiles,
  handleClickStartStop,
}) => {
  return (
    <div className="Runtime">
      <div className="Runtime__heading">Lis&auml;&auml; skenaario(t) ajettavaksi, tai luo uusi skenaario</div>
      <p className="Runtime__project-path">
        Skenaarioiden tallennuspolku: {projectPath}
        <button className="Runtime__reload-scenarios-btn"
                onClick={(e) => reloadScenarios()}
                disabled={runningScenarioID}
        >
          Uudelleenlataa skenaariot
        </button>
      </p>
      <div className="Runtime__scenarios">
        {/* Create table of all scenarios "<Button-To-Add-As-Runnable> <Button-To-Open-Configuration>" */}
        {scenarios.map((s) => {
          return (
            <div className="Runtime__scenario" key={s.id}>
              <button className={"Runtime__scenario-activate-btn" + (
                        scenarioIDsToRun.includes(s.id) ?
                          " Runtime__scenario-activate-btn--active"
                          :
                          ""
                      )}
                      disabled={runningScenarioID}
                      onClick={(e) => handleClickScenarioToActive(s)}
              >
                Ajettavaksi
              </button>
              &nbsp;
              <button className={"Runtime__scenario-open-config-btn" + (
                        openScenarioID === s.id ? " Runtime__scenario-open-config-btn--active" : ""
                      )}
                      disabled={runningScenarioID}
                      onClick={(e) => setOpenScenarioID(s.id)}
              >
                {s.name ? s.name : `Unnamed project (${s.id})`}
              </button>
            </div>
          )
        })}
        <div className="Runtime__scenarios-footer">
          <button className="Runtime__add-new-scenario-btn"
                  disabled={runningScenarioID}
                  onClick={(e) => handleClickNewScenario()}
          >
            Uusi skenaario
          </button>
        </div>
      </div>
      <hr className="Runtime__control-group-separator"/>
      <div className="Runtime__start-stop-controls">
        <p className="Runtime__start-stop-description">
          {scenarioIDsToRun.length ?
            <span>
                Ajettavana:
                <span className="Runtime__start-stop-scenarios">
                  {scenarios.filter((s) => scenarioIDsToRun.includes(s.id)).map((s) => s.name).join(', ')}
                </span>
              </span>
            :
            "Ei ajettavaksi valittuja skenaarioita"
          }
        </p>
        <RunStatus
          isScenarioRunning={runningScenarioID}
          statusIterationsTotal={statusIterationsTotal}
          statusIterationsCompleted={statusIterationsCompleted}
          statusReadyScenariosLogfiles={statusReadyScenariosLogfiles}
        />
        <button className="Runtime__start-stop-btn"
                onClick={(e) => handleClickStartStop()}
        >
          {!runningScenarioID ? `K\u00e4ynnist\u00e4 (${scenarioIDsToRun.length}) skenaariota` : `Keskeyt\u00e4 loput skenaariot`}
        </button>
      </div>
    </div>
  );
};
