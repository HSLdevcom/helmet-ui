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
      <div className="Runtime__heading">Projektin alustaminen</div>
      <p className="Runtime__project-path">
        Helmet-skenaarioiden tallennuspolku: {projectPath}
      </p>
      <div>
        <button className="Runtime__reload-scenarios-btn"
                onClick={(e) => reloadScenarios()}
                disabled={runningScenarioID}
        >
          Lataa uudelleen projektin skenaariot
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
              <input className={"Runtime__scenario-activate-checkbox" + (
                            scenarioIDsToRun.includes(s.id) ?
                              " Runtime__scenario-activate-checkbox--active"
                              :
                              ""
                          )}
                     type="checkbox"
                     checked={scenarioIDsToRun.includes(s.id)}
                     disabled={runningScenarioID}
                     onChange={(e) => handleClickScenarioToActive(s)}
              />
              &nbsp;
              <div className={"Runtime__scenario-open-config" + (
                        openScenarioID === s.id ? " Runtime__scenario-open-config-btn--active" : ""
                      )}
                      onClick={(e) => runningScenarioID ? undefined : setOpenScenarioID(s.id)}
              ></div>
              &nbsp;
              <div className={"Runtime__scenario-delete"}
                      onClick={(e) => runningScenarioID ? undefined : deleteScenario(s)}
              ></div>
            </div>
          )
        })}
      </div>
      <div className="Runtime__scenarios-footer">
        <button className="Runtime__add-new-scenario-btn"
                disabled={runningScenarioID}
                onClick={(e) => handleClickNewScenario()}
        >
          <span className="Runtime__add-icon">Uusi Helmet-skenaario</span>
        </button>
      </div>
      </div>
      
      <div className="Runtime__start-stop-controls">
        <div className="Runtime__heading">Ajettavana</div>
        <p className="Runtime__start-stop-description">
          {scenarioIDsToRun.length ?
                <span className="Runtime__start-stop-scenarios">
                  {scenarios.filter((s) => scenarioIDsToRun.includes(s.id)).map((s) => s.name).join(', ')}
                </span>
            :
            <span>Ei ajettavaksi valittuja skenaarioita</span>
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
