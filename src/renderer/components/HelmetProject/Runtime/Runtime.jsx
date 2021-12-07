import React from 'react';

const Runtime = ({
  projectPath, scenarios, scenarioIDsToRun, runningScenarioID, openScenarioID, deleteScenario,
  setOpenScenarioID,
  reloadScenarios,
  handleClickScenarioToActive, handleClickNewScenario,
  statusIterationsTotal, statusIterationsCompleted, statusReadyScenariosLogfiles,
  handleClickStartStop,
}) => {
  return (
    <div className="Runtime">

      <div className="Runtime__helmet-project-controls">
      <div className="Runtime__heading">Lis&auml;&auml; HELMET-skenaario(t) ajettavaksi, tai luo uusi HELMET-skenaario</div>
      <p className="Runtime__project-path">
        HELMET-skenaarioiden tallennuspolku: {projectPath}
      </p>
      <div>
        <button className="Runtime__reload-scenarios-btn"
                onClick={(e) => reloadScenarios()}
                disabled={runningScenarioID}
        >
          Uudelleenlataa HELMET-projektin skenaariot
        </button>
      </div>
      </div>

      <div className="Runtime__scenarios-controls">
      <div className="Runtime__scenarios-heading">Ladatut skenaariot</div>
      <div className="Runtime__scenarios">
        {/* Create table of all scenarios "<Button-To-Add-As-Runnable> <Button-To-Open-Configuration>" */}
        {scenarios.map((s) => {
          return (
            <div className="Runtime__scenario" key={s.id}>
              <span className="Runtime__scenario-name">
                {s.name ? s.name : `Unnamed project (${s.id})`}
              </span>
              &nbsp;
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
                Muokkaa
              </button>
              &nbsp;
              <button className={"Runtime__scenario-delete-btn"}
                      disabled={runningScenarioID}
                      onClick={(e) => deleteScenario(s)}
              >
                Poista
              </button>
            </div>
          )
        })}
      </div>
      <div className="Runtime__scenarios-footer">
        <button className="Runtime__add-new-scenario-btn"
                disabled={runningScenarioID}
                onClick={(e) => handleClickNewScenario()}
        >
          Uusi skenaario
        </button>
      </div>
      </div>
      
      <div className="Runtime__start-stop-controls">
        <p className="Runtime__start-stop-description">
          {scenarioIDsToRun.length ?
            <span>
                Ajettavana:&nbsp;
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
                disabled={scenarioIDsToRun.length === 0}
                onClick={(e) => handleClickStartStop()}
        >
          {!runningScenarioID ? `K\u00e4ynnist\u00e4 (${scenarioIDsToRun.length}) skenaariota` : `Keskeyt\u00e4 loput skenaariot`}
        </button>
      </div>
    </div>
  );
};
