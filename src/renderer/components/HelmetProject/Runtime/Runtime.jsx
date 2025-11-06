import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip'
import { renderToStaticMarkup } from 'react-dom/server';
import { CopyIcon } from '../../../icons';
import RunStatus from './RunStatus/RunStatus.jsx';
import { SCENARIO_STATUS_STATE } from '../../../../enums.js';
import { useHelmetModelContext } from '../../../context/HelmetModelContext';

const _ = window.electronAPI._;

const Runtime = ({
  projectPath,
  scenarios = [], // Default to an empty array
  scenarioIDsToRun = [], // Default to an empty array
  runningScenarioID,
  openScenarioID,
  deleteScenario,
  setOpenScenarioID,
  reloadScenarios,
  handleClickScenarioToActive,
  handleClickNewScenario,
  handleClickStartStop,
  logArgs,
  duplicateScenario,
  scenarioListHeight,
  setScenarioListHeight,
}) => {
  const { majorVersion } = useHelmetModelContext();
  const visibleTooltipProperties = [
    'emme_project_file_path',
    'first_scenario_id',
    'first_matrix_id',
    'forecast_data_folder_path',
    'save_matrices_in_emme',
    'end_assignment_only',
    'delete_strategy_files',
    'id',
    'name',
    'iterations',
    'separate_emme_scenarios',
    'use_fixed_transit_cost',
    'overriddenProjectSettings',
  ];

  const areGlobalSettingsOverridden = (settings) => {
    return settings && Object.values(settings).some((value) => value != null);
  };

  const getPropertyForDisplayString = (settingProperty) => {
    const [key, value] = settingProperty;

    if (typeof value === 'string') {
      const trimmedStringValue =
        value.length > 30 ? '...' + value.substring(value.length - 30) : value;
      return `${key} : ${trimmedStringValue}`;
    }

    return `${key} : ${value}`;
  };

  const parseDemandConvergenceLogMessage = (message, currentIteration) => {
    // Example message: "Demand model convergence: Max gap: 10.0000, Relative gap: 0.00010 "
    if (majorVersion && majorVersion >= 5) {
      const maxGapMatch = message.match(/Max gap:\s*([0-9.eE+-]+)/);
      const relGapMatch = message.match(/Relative gap:\s*([0-9.eE+-]+)/);

      const parsed = {
        iteration: currentIteration + 1,
        rel_gap: relGapMatch ? parseFloat(relGapMatch[1]) : undefined,
        max_gap: maxGapMatch ? parseFloat(maxGapMatch[1]) : undefined
      };
      return parsed;
    } else {
      const stringMsgArray = message.split(' ');
      return { iteration: stringMsgArray[stringMsgArray.length - 3], value: stringMsgArray[stringMsgArray.length - 1]};
    }
  };

  const activeScenarios = Array.isArray(scenarios)
    ? scenarios.filter((scenario) => scenarioIDsToRun.includes(scenario.id))
    : [];

  const runningScenario = activeScenarios.find(
    (scenario) => scenario.id === runningScenarioID
  );

  const getResultsPathFromLogfilePath = (logfilePath) => {
    return logfilePath.replace(/\/[^\/]+$/, '');
  }

  //Parse log contents into the currently running scenario so we can show each one individually
  const parseLogArgs = (runStatus, logArgs) => {
    // console.log(`Parsing logArgs: ${JSON.stringify(logArgs)}`);
    if (logArgs.status) {
      runStatus.statusIterationsTotal = logArgs.status['total'];
      runStatus.statusIterationsCurrent = logArgs.status['current'];
      runStatus.statusIterationsCompleted = logArgs.status['completed'];
      runStatus.statusIterationsFailed = logArgs.status['failed'];
      runStatus.statusState = logArgs.status['state'];
      runStatus.statusLogfilePath = logArgs.status['log'];

      if (logArgs.status.state === SCENARIO_STATUS_STATE.FINISHED) {
        runStatus.statusReadyScenariosLogfiles = { name: logArgs.status.name, logfile: logArgs.status.log, resultsPath: getResultsPathFromLogfilePath(logArgs.status.log) }
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
      // console.log(`Parsing logArgs message: ${logArgs.message}`);
      if(majorVersion>=5 && logArgs.message.includes('Demand model convergence')) {
        const currentIteration = runStatus.demandConvergenceArray ? runStatus.demandConvergenceArray.length : 0;
        const currentDemandConvergenceValueAndIteration = parseDemandConvergenceLogMessage(logArgs.message, currentIteration);
        // console.log(`Parsed demand convergence value: ${JSON.stringify(currentDemandConvergenceValueAndIteration)}`);
        runStatus.demandConvergenceArray = [
          ...(runStatus.demandConvergenceArray || []),
          currentDemandConvergenceValueAndIteration
        ];
        // console.log(`Updated demand convergence array: ${JSON.stringify(runStatus.demandConvergenceArray)}`);
      } else if(logArgs.message.includes('Demand model convergence in')) {
        const currentDemandConvergenceValueAndIteration = parseDemandConvergenceLogMessage(logArgs.message);
        // console.log(`Parsed demand convergence value: ${JSON.stringify(currentDemandConvergenceValueAndIteration)}`);
        runStatus.demandConvergenceArray = [...runStatus.demandConvergenceArray, currentDemandConvergenceValueAndIteration];
      }
    }
  }

  if( runningScenario?.runStatus && logArgs ) {
    // console.log(`[Runtime] Running scenario (${runningScenario})`);
    parseLogArgs(runningScenario.runStatus, logArgs);
  }

  const renderableScenarios = activeScenarios.map((activeScenario) => {
    if (activeScenario.id === runningScenario?.id) {
      return runningScenario;
    }
    return activeScenario;
  });

  const RunStatusList = () => {
    const scenariosWithStatus = renderableScenarios.filter(
      s => s.runStatus && (s.runStatus.statusState || s.runStatus.demandConvergenceArray?.length > 0)
    );

    if (scenariosWithStatus.length === 0) return <div />;

    return (
      <div>
        {renderableScenarios.map((scenarioToRender) => (
          <RunStatus
            key={scenarioToRender.id}
            isScenarioRunning={scenarioToRender.id === runningScenarioID}
            statusIterationsTotal={scenarioToRender.runStatus?.statusIterationsTotal || 0}
            statusIterationsCompleted={scenarioToRender.runStatus?.statusIterationsCompleted || 0}
            statusReadyScenariosLogfiles={scenarioToRender.runStatus?.statusReadyScenariosLogfiles || []}
            statusRunStartTime={scenarioToRender.runStatus?.statusRunStartTime || null}
            statusRunFinishTime={scenarioToRender.runStatus?.statusRunFinishTime || null}
            statusState={scenarioToRender.runStatus?.statusState || null}
            demandConvergenceArray={scenarioToRender.runStatus?.demandConvergenceArray || []}
          />
        ))}
      </div>
    );return <div />;
  };

  useEffect(() => {
    const resizableDiv = document.getElementById("resizableDiv");
    if (scenarioListHeight) {
      resizableDiv.style.height = scenarioListHeight;
    } else {
      resizableDiv.style.height = '300px';
    }
  });

  let mousePosition;
  const resize = (e) => {
    if (e.buttons === 0) {
      // No mouse button is pressed, release event listener
      document.body.style = "user-select: auto;"
      document.removeEventListener("mousemove", resize, false);
    }
    const yDimension = mousePosition - e.y;
    mousePosition = e.y;
    const resizableDiv = document.getElementById("resizableDiv");

    const newHeight = (parseInt(getComputedStyle(resizableDiv, '').height) - yDimension) + "px";
    resizableDiv.style.height = newHeight;
    setScenarioListHeight(newHeight);
  }

  const onMouseDown = (e) => {
    if (e.pageY > (e.target.offsetTop + e.target.offsetHeight)) {
      mousePosition = e.y;
      document.body.style = "user-select: none;"
      document.addEventListener("mousemove", resize, false);
    }
  }

  const onMouseUp = () => {
    document.body.style = "user-select: auto;"
    document.removeEventListener("mousemove", resize, false);
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

      <div className="Runtime__scenarios-controls" id="resizableDiv">
      <div className="Runtime__scenarios-heading">Ladatut skenaariot</div>
      <div className="Runtime__scenarios" id="scenarioList">
        {scenarios && scenarios.length > 0 ? (
          scenarios.map((s, index) => {
            // Component for the tooltip showing scenario settings
            const tooltipContent = (scenario) => {
              const filteredScenarioSettings = Object.fromEntries(
                Object.entries(scenario).filter(([key]) => visibleTooltipProperties.includes(key))
              );

              return (
                <div key={index}>
                  {Object.entries(filteredScenarioSettings).map((property, index) => {
                    if (property[0] === 'overriddenProjectSettings') {
                      return areGlobalSettingsOverridden(property[1]) ? (
                        <div key={index}>
                          <h3>Overridden settings:</h3>
                          {Object.entries(property[1]).map((overrideSetting, index) => {
                            return overrideSetting[1] != null ? (
                              <p key={index} style={{ marginLeft: '1rem', overflow: 'hidden' }}>
                                {getPropertyForDisplayString(overrideSetting)}
                              </p>
                            ) : (
                              ''
                            );
                          })}
                        </div>
                      ) : (
                        ''
                      );
                    }

                    return <p key={index}>{getPropertyForDisplayString(property)}</p>;
                  })}
                </div>
              );
            };

            return (
              <div
                className="Runtime__scenario"
                key={s.id}
                data-tooltip-id="scenario-tooltip"
                data-tooltip-place="bottom"
                data-tooltip-html={renderToStaticMarkup(tooltipContent(s))}
                data-tooltip-delay-show={200}
              >
                <span className="Runtime__scenario-name">
                  {s.name ? s.name : `Unnamed project (${s.id})`}
                </span>
                &nbsp;
                <input
                  className={
                    'Runtime__scenario-activate-checkbox' +
                    (scenarioIDsToRun.includes(s.id)
                      ? ' Runtime__scenario-activate-checkbox--active'
                      : '')
                  }
                  type="checkbox"
                  checked={scenarioIDsToRun.includes(s.id)}
                  disabled={runningScenarioID}
                  onChange={(e) => handleClickScenarioToActive(s)}
                />
                &nbsp;
                <div
                  className={
                    'Runtime__scenario-open-config' +
                    (openScenarioID === s.id ? ' Runtime__scenario-open-config-btn--active' : '')
                  }
                  onClick={(e) => (runningScenarioID ? undefined : setOpenScenarioID(s.id))}
                ></div>
                &nbsp;
                <div
                  className={'Runtime__scenario-delete'}
                  onClick={(e) => (runningScenarioID ? undefined : deleteScenario(s))}
                ></div>
                <Tooltip
                  id="scenario-tooltip"
                  style={{ borderRadius: '1rem', maxWidth: '40rem', marginLeft: '-50px', zIndex: 2 }}
                />
                &nbsp;
                <div className={'Runtime__scenario-clone'} onClick={(e) => duplicateScenario(s)}>
                  <CopyIcon />
                </div>
              </div>
            );
          })
        ) : (
          <p>Ei määritettyjä skenaarioita.</p>
        )}
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
      <div className="Runtime__scenarios_controls_drag_handle" onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
      
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

export default Runtime;