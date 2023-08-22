import React from 'react';
import { Tooltip } from 'react-tooltip'
import { renderToStaticMarkup } from 'react-dom/server';
import { TimeSeriesScale } from 'chart.js';
const _ = require('lodash');

const Runtime = ({
  projectPath, scenarios, scenarioIDsToRun, runningScenarioID, openScenarioID, deleteScenario,
  setOpenScenarioID,
  reloadScenarios,
  handleClickScenarioToActive, handleClickNewScenario,
  handleClickStartStop, logArgs, duplicateScenario
}) => {

  const visibleTooltipProperties = [
      'emme_project_file_path',
      'first_scenario_id',
      'forecast_data_folder_path',
      'save_matrices_in_emme',
      'end_assignment_only',
      'overriddenProjectSettings'
  ];

  const areGlobalSettingsOverridden = (settings) => {
    return _.filter(settings, settingValue => settingValue != null).length > 0;
  }

  const getPropertyForDisplayString = (settingProperty) => {
    const [key, value] = settingProperty

    if(typeof value === 'string') {
      const trimmedStringValue = value.length > 30 ? "..." + value.substring(value.length-30) : value;
      return `${key} : ${trimmedStringValue}`
    }

    return `${key} : ${value}`

  const parseDemandConvergenceLogMessage = (message) => {
    const stringMsgArray = message.split(' ');
    return { iteration: stringMsgArray[stringMsgArray.length - 3], value: stringMsgArray[stringMsgArray.length - 1]};
  };

  //Parse log contents into the currently running scenario so we can show each one individually
  const parseLogArgs = (runStatus, logArgs) => {
    if (logArgs.status) {
      runStatus.statusIterationsTotal = logArgs.status['total'];
      runStatus.statusIterationsCurrent = logArgs.status['current'];
      runStatus.statusIterationsCompleted = logArgs.status['completed'];
      runStatus.statusIterationsFailed = logArgs.status['failed'];
      runStatus.statusState = logArgs.status['state'];
      runStatus.statusLogfilePath = logArgs.status['log'];

    if (logArgs.status.state === SCENARIO_STATUS_STATE.FINISHED) {
      runStatus.statusReadyScenariosLogfiles = { name: logArgs.status.name, logfile: logArgs.status.log }
      runStatus.statusRunFinishTime = logArgs.time;
    }

    if (logArgs.status.state === SCENARIO_STATUS_STATE.STARTING) {
      runStatus.statusRunStartTime = logArgs.time;
      runStatus.statusRunFinishTime = logArgs.time; 
      runStatus.demandConvergenceArray = [];
      runStatus.statusIterationsTotal = 0;
    }
  }
  if(logArgs.level === 'INFO') {
    if(logArgs.message.includes('Demand model convergence in')) {
      const currentDemandConvergenceValueAndIteration = parseDemandConvergenceLogMessage(logArgs.message);
      runStatus.demandConvergenceArray = [...runStatus.demandConvergenceArray, currentDemandConvergenceValueAndIteration];
      }
    }
  }

  const activeScenarios = scenarios.filter((scenario) => scenarioIDsToRun.includes(scenario.id))
  const runningScenario = activeScenarios.filter((scenario) => scenario.id === runningScenarioID);

  if(runningScenario.length > 0) {
  const runStatus = runningScenario[0].runStatus;
  parseLogArgs(runStatus, logArgs);
  }

  const renderableScenarios = activeScenarios.map(activeScenario => {
        if (activeScenario.id === runningScenario.id) {
          return runningScenario;
        }
        return activeScenario;
      })

  const RunStatusList = () => {
    if(renderableScenarios.length > 0) {
      return (
        <div>
          { 
           renderableScenarios.map(scenarioToRender => {
            return (
              <RunStatus
                isScenarioRunning={scenarioToRender.id === runningScenarioID}
                statusIterationsTotal={scenarioToRender.runStatus.statusIterationsTotal}
                statusIterationsCompleted={scenarioToRender.runStatus.statusIterationsCompleted}
                statusReadyScenariosLogfiles={scenarioToRender.runStatus.statusReadyScenariosLogfiles}
                statusRunStartTime={scenarioToRender.runStatus.statusRunStartTime}
                statusRunFinishTime={scenarioToRender.runStatus.statusRunFinishTime}
                statusState={scenarioToRender.runStatus.statusState}
                demandConvergenceArray={scenarioToRender.runStatus.demandConvergenceArray}
              />)
           })
          }
        </div>
      )
    }
    return <div/>
  }

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
          // Component for the tooltip showing scenario settings
          const tooltipContent = (scenario) => {
            const filteredScenarioSettings = _.pickBy(scenario, (settingValue, settingKey) => {
              return visibleTooltipProperties.includes(settingKey);
            })
            return (
              <div>
                {
                  Object.entries(filteredScenarioSettings).map((property) => {
                    
                    if(property[0] === 'overriddenProjectSettings') {

                      return areGlobalSettingsOverridden(property[1]) 
                       ?
                        <div>
                          <h3>Overridden settings:</h3>
                          { 
                            Object.entries(property[1]).map(overrideSetting => {
                              return overrideSetting[1] != null 
                              ? <p style={{ marginLeft: "1rem", overflow: "hidden" }}>{getPropertyForDisplayString(overrideSetting)}</p>
                              : ""
                            })
                          }
                        </div>
                      : ""; // Return empty if global settings are all default
                    }

                    return(
                      <p>{getPropertyForDisplayString(property)}</p>
                    )})}
              </div>
            )
          }

          return (
            <div className="Runtime__scenario" key={s.id} 
              data-tooltip-id="scenario-tooltip" 
              data-tooltip-place="right" 
              data-tooltip-html={renderToStaticMarkup(tooltipContent(s))}
              data-tooltip-delay-show={200}
              data-tooltip-hidden={openScenarioID !== null}
            >
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
              <Tooltip id="scenario-tooltip" style={{ borderRadius: "1rem", maxWidth: "40rem" }}/>

              &nbsp;
              <div className={"Runtime__scenario-clone"}
                      onClick={(e) => duplicateScenario(s)}
              >
              <CopyIcon/>
              </div>

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
                  {scenarios.filter((s) => scenarioIDsToRun.includes(s.id)).sort((a, b) => scenarioIDsToRun.indexOf(a.id) - scenarioIDsToRun.indexOf(b.id)).map((s) => s.name).join(', ')}
                </span>
            :
            <span>Ei ajettavaksi valittuja skenaarioita</span>
          }
        </p>
        <button className="Runtime__start-stop-btn"
                disabled={scenarioIDsToRun.length === 0}
                onClick={(e) => handleClickStartStop()}
        >
          {!runningScenarioID ? `K\u00e4ynnist\u00e4 (${scenarioIDsToRun.length}) skenaariota` : `Keskeyt\u00e4 loput skenaariot`}
        </button>
          <RunStatusList />
      </div>
    </div>
  );
};
