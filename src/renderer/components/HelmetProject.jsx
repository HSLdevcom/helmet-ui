import React, {useState, useEffect} from 'react';

const {ipcRenderer} = require('electron');

// vex-js imported globally in index.html, since we cannot access webpack config in electron-forge

const HelmetProject = ({scenarios, runningScenarioID, openScenarioID, createNewScenario, runAllActiveScenarios, cancelRunning, setOpenScenarioId}) => {
  const [scenarioIDsToRun, setScenarioIDsToRun] = useState([]);
  const [statusIterationsTotal, setStatusIterationsTotal] = useState(null);
  const [statusIterationsCurrent, setStatusIterationsCurrent] = useState(0);
  const [statusIterationsCompleted, setStatusIterationsCompleted] = useState(0);
  const [statusIterationsFailed, setStatusIterationsFailed] = useState(0);
  const [statusState, setStatusState] = useState(null);
  const [statusLogfilePath, setStatusLogfilePath] = useState(null);
  const [statusReadyScenariosLogfiles, setStatusReadyScenariosLogfiles] = useState([]); // [{name: .., logfile: ..}]

  // Electron IPC event listeners
  const onLoggableEvent = (event, args) => {
    if (args.status) {
      setStatusIterationsTotal(args.status['total']);
      setStatusIterationsCurrent(args.status['current']);
      setStatusIterationsCompleted(args.status['completed']);
      setStatusIterationsFailed(args.status['failed']);
      setStatusState(args.status['state']);
      setStatusLogfilePath(args.status['log']);

      if (args.status.state === 'finished') {
        setStatusReadyScenariosLogfiles(statusReadyScenariosLogfiles.concat({
          name: args.status.name,
          logfile: args.status.log
        }))
      }
    }
  };

  const _handleClickScenarioToActive = (scenario) => {
    scenarioIDsToRun.includes(scenario.id) ?
      // If scenario exists in scenarios to run, remove it
      setScenarioIDsToRun(scenarioIDsToRun.filter((id) => id !== scenario.id))
      :
      // Else add it
      setScenarioIDsToRun(scenarioIDsToRun.concat(scenario.id));
  };

  const _handleClickNewScenario = () => {
    const promptCreation = (previousError) => {
      vex.dialog.prompt({
        message: (previousError ? previousError : "") + "Anna uuden skenaarion nimike:",
        placeholder: '',
        callback: (inputScenarioName) => {
          let error = "";
          // Check for cancel button press
          if (inputScenarioName === false) {
            return;
          }
          // Check input for initial errors
          if (inputScenarioName === "") {
            error = "Nimike on pakollinen, tallennettavaa tiedostonime\u00e4 varten. ";
          }
          if (scenarios.map((s) => s.name).includes(inputScenarioName)) {
            error = "Nimike on jo olemassa, valitse toinen nimi tai poista olemassa oleva ensin. ";
          }
          // Handle recursively any input errors (mandated by the async library since prompt isn't natively supported in Electron)
          if (error) {
            promptCreation(error);
          } else {
            createNewScenario(inputScenarioName);
          }
        }
      });
    };
    promptCreation();
  };

  const _handleClickStartStop = () => {
    runningScenarioID === null ?
      runAllActiveScenarios(scenarioIDsToRun)
      :
      cancelRunning();
  };

  useEffect(() => {
    // Attach Electron IPC event listeners (to worker => UI events)
    ipcRenderer.on('loggable-event', onLoggableEvent);
    return () => {
      // Detach Electron IPC event listeners
      ipcRenderer.removeListener('loggable-event', onLoggableEvent);
    }
  }, []);

  return (
    <div className="Project">
      <div className="Project__heading">Lis&auml;&auml; skenaario(t) ajettavaksi, tai luo uusi skenaario</div>
      <div className="Project__saved-scenarios">
        {/* Create table of all scenarios "<Button-To-Add-As-Runnable> <Button-To-Open-Configuration>" */}
        {scenarios.map((s) => {
          return <div className="Project__scenario" key={s.id}>
            <button className={"Project__scenario-run-btn" + (
              scenarioIDsToRun.includes(s.id) ?
                " Project__scenario-run-btn--active"
                :
                ""
            )}
                    disabled={runningScenarioID !== null}
                    onClick={(e) => _handleClickScenarioToActive(s)}
            >
              Ajettavaksi
            </button>
            &nbsp;
            <button className={"Project__scenario-name-config-btn" + (
              openScenarioID === s.id ? " Project__scenario-name-config-btn--active" : ""
            )}
                    disabled={runningScenarioID !== null}
                    onClick={(e) => setOpenScenarioId(s.id)}
            >
              {s.name}
            </button>
          </div>;
        })}
        <div className="Project__saved-scenarios-footer">
          <button className="Project__add-new-scenario-btn"
                  disabled={runningScenarioID !== null}
                  onClick={(e) => _handleClickNewScenario()}
          >
            Uusi skenaario
          </button>
        </div>
      </div>
      <hr className="Project__separator"/>
      <div className="Project__start-stop-controls">
        <p className="Project__start-stop-description">
          {scenarioIDsToRun.length ?
            <span>
              Ajettavana:
              <span className="Project__start-stop-scenarios">
                {scenarios.filter((s) => scenarioIDsToRun.includes(s.id)).map((s) => s.name).join(', ')}
              </span>
            </span>
            :
            "Ei ajettavaksi valittuja skenaarioita"
          }
        </p>
        <div className="Project__run-status">
          {runningScenarioID ?
            statusIterationsTotal ?
              <div>
                <div className="Project__run-status-percentage-ready"
                     style={{
                       background: (
                         `linear-gradient(`
                         + `to right, `
                         + `#99cfff 0%, `
                         + `#99cfff ${Math.round(statusIterationsCompleted / statusIterationsTotal * 100)}%, `
                         + `transparent ${Math.round(statusIterationsCompleted / statusIterationsTotal * 100)}%, `
                         + `transparent 100%)`
                       )
                     }}
                >
                  Valmiina
                  &nbsp;
                  <strong>{statusIterationsCompleted}</strong>
                  &nbsp;
                  /
                  &nbsp;
                  <strong>{statusIterationsTotal}</strong>
                  &nbsp;
                  (<strong>{Math.round(statusIterationsCompleted / statusIterationsTotal * 100)}%</strong>)
                </div>
              </div>
              :
              "Setting up python-shell . . ."
            :
            ""
          }
          {statusReadyScenariosLogfiles.map((readyScenario) => {
            return <p className="Project__run-status-scenario-ready" key={readyScenario.name}>
              {readyScenario.name} valmis
              &nbsp;
              <a className="Project__run-status-logfile-link"
                 href={readyScenario.logfile}
                 target="_blank"
              >
                lokit
              </a>
            </p>
          })}
        </div>
        <button className="Project__start-stop-btn"
                onClick={(e) => _handleClickStartStop()}
        >
          {runningScenarioID === null ?
            `K\u00e4ynnist\u00e4 (${scenarioIDsToRun.length}) skenaariota`
            :
            `Keskeyt\u00e4 loput skenaariot`
          }
        </button>
      </div>
    </div>
  )
};
