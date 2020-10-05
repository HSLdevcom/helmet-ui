import React, {useState, useEffect, useRef} from 'react';
import uuidv4 from "uuid/v4";
import Store from "electron-store";
import fs from "fs";
import path from "path";

const {ipcRenderer} = require('electron');

// vex-js imported globally in index.html, since we cannot access webpack config in electron-forge

const HelmetProject = ({
  emmePythonPath, helmetScriptsPath, projectPath, basedataPath, resultsPath,
  signalProjectRunning,
}) => {
  // HELMET Project -specific settings
  const [scenarios, setScenarios] = useState([]); // HELMET Scenarios under currently selected HELMET Project
  const [openScenarioID, setOpenScenarioID] = useState(null); // currently open HELMET Scenario configuration

  // Runtime controls & -logging
  const [scenarioIDsToRun, setScenarioIDsToRun] = useState([]); // selected active scenarios ready to run sequentially
  const [runningScenarioID, setRunningScenarioID] = useState(null); // currently running HELMET Scenario, indicates if running
  const [runningScenarioIDsQueued, setRunningScenarioIDsQueued] = useState([]); // queued ("remaining") HELMET Scenarios
  const [logContents, setLogContents] = useState([]); // project runtime log-contents
  const [isLogOpened, setLogOpened] = useState(false); // whether runtime log is open

  // Runtime status
  const [statusIterationsTotal, setStatusIterationsTotal] = useState(null);
  const [statusIterationsCurrent, setStatusIterationsCurrent] = useState(0);
  const [statusIterationsCompleted, setStatusIterationsCompleted] = useState(0);
  const [statusIterationsFailed, setStatusIterationsFailed] = useState(0);
  const [statusState, setStatusState] = useState(null);
  const [statusLogfilePath, setStatusLogfilePath] = useState(null);
  const [statusReadyScenariosLogfiles, setStatusReadyScenariosLogfiles] = useState([]); // [{name: .., logfile: ..}]

  // Cost-Benefit Analysis (CBA) controls
  const [cbaOptions, setCbaOptions] = useState({});

  // Scenario-specific settings under currently selected HELMET Project
  const configStores = useRef({});

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
            _createScenario(inputScenarioName);
          }
        }
      });
    };
    promptCreation();
  };

  const _handleClickStartStop = () => {
    runningScenarioID === null ?
      _runAllActiveScenarios(scenarioIDsToRun)
      :
      _cancelRunning();
  };

  const _loadProjectScenarios = (projectFilepath) => {
    // Load all .json files from project dir, and check if their keys match scenarios' keys. Match? -> add to scenarios.
    const configPath = projectFilepath;
    const foundScenarios = [];
    fs.readdirSync(configPath).forEach((fileName) => {
      if (fileName.endsWith(".json")) {
        const obj = JSON.parse(fs.readFileSync(path.join(configPath, fileName), 'utf8'));
        if ("id" in obj
          && "name" in obj
          && "use_fixed_transit_cost" in obj
          && "iterations" in obj
        ) {
          configStores.current[obj.id] = new Store({cwd: configPath, name: fileName.slice(0, -5)});
          foundScenarios.push(obj);
        }
      }
    });
    setScenarios(foundScenarios);
    // Reset state of project related properties
    setOpenScenarioID(null);
    setScenarioIDsToRun([]);
    setRunningScenarioID(null);
    setRunningScenarioIDsQueued([]);
    setLogContents([]);
    setLogOpened(false);
  };

  const _createScenario = (newScenarioName) => {
    // Generate new (unique) ID for new scenario
    const newId = uuidv4();
    const newScenario = {
      id: newId,
      name: newScenarioName,
      emme_project_file_path: null,
      first_scenario_id: 19,
      forecast_data_folder_path: null,
      use_fixed_transit_cost: false,
      iterations: 10,
    };
    // Create the new scenario in "scenarios" array first
    setScenarios(scenarios.concat(newScenario));
    configStores.current[newId] = new Store({cwd: projectPath, name: newScenarioName});
    configStores.current[newId].set(newScenario);
    // Then set scenario as open by id (Why id? Having open_scenario as reference causes sub-elements to be bugged because of different object reference)
    setOpenScenarioID(newId);
  };

  const _updateScenario = (newValues) => {
    // Update newValues to matching .id in this.state.scenarios
    setScenarios(scenarios.map((s) => (s.id === newValues.id ? {...s, ...newValues} : s)));
    // If name changed, rename file and change reference
    if (configStores.current[newValues.id].get('name') !== newValues.name) {
      // If name was set empty - use ID instead
      const newName = newValues.name ? newValues.name : newValues.id;
      fs.renameSync(
        configStores.current[newValues.id].path,
        path.join(projectPath, `${newName}.json`)
      );
      configStores.current[newValues.id] = new Store({
        cwd: projectPath,
        name: newName
      });
    }
    // And persist all changes in file
    configStores.current[newValues.id].set(newValues);
  };

  const _deleteScenario = (scenario) => {
    if (confirm(`Oletko varma skenaarion ${scenario.name} poistosta?`)) {
      setOpenScenarioID(null);
      setScenarios(scenarios.filter((s) => s.id !== scenario.id));
      fs.unlinkSync(path.join(projectPath, `${scenario.name}.json`));
      window.location.reload();  // Vex-js dialog input gets stuck otherwise
    }
  };

  const _runAllActiveScenarios = (activeScenarioIDs) => {
    const scenariosToRun = scenarios.filter((s) => activeScenarioIDs.includes(s.id));

    // Check required global parameters are set
    if (!emmePythonPath) {
      alert("Python -sijaintia ei ole asetettu!");
      return;
    }
    if (!helmetScriptsPath) {
      alert("Helmet Scripts -kansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }
    if (!projectPath) {
      alert("Projektin kotikansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }
    if (!basedataPath) {
      alert("L\u00E4ht\u00F6datan kansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }
    if (!resultsPath) {
      alert("Tulosdatan kansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }

    // For each active scenario, check required scenario-specific parameters are set
    for (let scenario of scenariosToRun) {
      const store = configStores.current[scenario.id];
      const iterations = store.get('iterations');
      if (!store.get('emme_project_file_path')) {
        alert(`Emme-projektia ei ole valittu skenaariossa "${scenario.name}"`);
        return;
      }
      if (!store.get('forecast_data_folder_path')) {
        alert(`Ennustedata-kansiota ei ole valittu skenaariossa "${scenario.name}"`);
        return;
      }
      if (iterations < 0 || iterations > 99) {
        alert(`Aseta iteraatiot väliltä 0 - 99 skenaariossa "${scenario.name}"`);
        return;
      }
    }

    // Perform UI changes to indicate "initializing run of active scenarios"
    setOpenScenarioID(null); // Close any open scenario configuration
    setLogContents([
      {
        level: "UI-event",
        message: `Initializing run of scenarios: ${scenariosToRun.map((s) => s.name).join(', ')}`
      }
    ]);
    setLogOpened(true); // Keep log open even after run finishes (or is cancelled)
    setRunningScenarioID(activeScenarioIDs[0]); // Disable controls
    setRunningScenarioIDsQueued(activeScenarioIDs.slice(1));
    signalProjectRunning(true); // Let App-component know too
    ipcRenderer.send(
      'message-from-ui-to-run-scenarios',
      scenariosToRun.map((s) => {
        // Run parameters per each run (enrich with global settings' paths to EMME python & HELMET model system)
        return {
          ...s,
          emme_python_path: emmePythonPath,
          helmet_scripts_path: helmetScriptsPath,
          base_data_folder_path: basedataPath,
          results_data_folder_path: resultsPath,
          log_level: 'DEBUG',
        }
      })
    );
  };

  const _cancelRunning = () => {
    setLogContents(previousLog => [...previousLog, {level: "UI-event", message: "Cancelling remaining scenarios."}]);
    setRunningScenarioIDsQueued([]);
    ipcRenderer.send('message-from-ui-to-cancel-scenarios');
  };

  const _runCbaScript = () => {
    // Check required global parameters are set
    if (!emmePythonPath) {
      alert("Python -sijaintia ei ole asetettu!");
      return;
    }
    if (!helmetScriptsPath) {
      alert("Helmet Scripts -kansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }

    // Check required CBA parameters are set
    if (!cbaOptions.baseline_scenario_path) {
      alert(`Baseline skenaariota ei ole valittu`);
      return;
    }
    if (!cbaOptions.projected_scenario_path) {
      alert(`Projektoitua skenaariota ei ole valittu`);
      return;
    }

    // Perform UI changes to indicate "initializing run of script"
    setOpenScenarioID(null); // Close any open scenario configuration
    setLogContents([
      {
        level: "UI-event",
        message: `Initializing run CBA Script`
      }
    ]);
    setLogOpened(true); // Keep log open even after run finishes (or is cancelled)
    signalProjectRunning(true); // Let App-component know too
    ipcRenderer.send(
      'message-from-ui-to-run-cba-script',
      {
          ...cbaOptions,
          emme_python_path: emmePythonPath,
          helmet_scripts_path: helmetScriptsPath,
          results_path: resultsPath,
      });
  };

  // Electron IPC event listeners
  const onLoggableEvent = (event, args) => {
    setLogContents(previousLog => [...previousLog, args]);
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
  const onScenarioComplete = (event, args) => {
    setRunningScenarioID(args.next.id);
    setRunningScenarioIDsQueued(runningScenarioIDsQueued.filter((id) => id !== args.completed.id));
    setLogContents(previousLog => [...previousLog, {level: 'NEWLINE', message: ''}]);
  };
  const onAllScenariosComplete = (event, args) => {
    setRunningScenarioID(null); // Re-enable controls
    setRunningScenarioIDsQueued([]);
    signalProjectRunning(false); // Let App-component know too
  };

  useEffect(() => {
    // Attach Electron IPC event listeners (to worker => UI events)
    ipcRenderer.on('loggable-event', onLoggableEvent);
    ipcRenderer.on('scenario-complete', onScenarioComplete);
    ipcRenderer.on('all-scenarios-complete', onAllScenariosComplete);

    _loadProjectScenarios(projectPath);

    return () => {
      // Detach Electron IPC event listeners
      ipcRenderer.removeListener('loggable-event', onLoggableEvent);
      ipcRenderer.removeListener('scenario-complete', onScenarioComplete);
      ipcRenderer.removeListener('all-scenarios-complete', onAllScenariosComplete);
    }
  }, [projectPath]);

  return (
    <div className="Project">

      {/* Panel for primary view and controls */}
      <div className="Project__runtime">
        <Runtime
          projectPath={projectPath}
          reloadScenarios={() => _loadProjectScenarios(projectPath)}
          scenarios={scenarios}
          scenarioIDsToRun={scenarioIDsToRun}
          runningScenarioID={runningScenarioID}
          openScenarioID={openScenarioID}
          setOpenScenarioID={setOpenScenarioID}
          deleteScenario={(scenario) => {_deleteScenario(scenario)}}
          handleClickScenarioToActive={_handleClickScenarioToActive}
          handleClickNewScenario={_handleClickNewScenario}
          handleClickStartStop={_handleClickStartStop}
          statusIterationsTotal={statusIterationsTotal}
          statusIterationsCompleted={statusIterationsCompleted}
          statusReadyScenariosLogfiles={statusReadyScenariosLogfiles}
        />
        <hr/>
        <CostBenefitAnalysis
          cbaOptions={cbaOptions}
          setCbaOptions={setCbaOptions}
          runCbaScript={_runCbaScript}
        />
      </div>

      {/* Panel for secondary view(s) and controls */}
      <div className="Project__selected-details">
        {/* show log if, either scenario is running, or log is manually opened (outside running) */
          (runningScenarioID || isLogOpened) ?
            <RunLog
              entries={logContents.map((entry, i) => {return {...entry, id: i};})}
              isScenarioRunning={runningScenarioID}
              closeRunLog={() => setLogOpened(false)}
            />
            :
            /* while no scenarios running, and log hidden (log has precedence), allow showing open scenario config */
            openScenarioID !== null ?
              <HelmetScenario
                scenario={scenarios.find((s) => s.id === openScenarioID)}
                updateScenario={_updateScenario}
                closeScenario={() => setOpenScenarioID(null)}
                existingOtherNames={scenarios.filter(s => s.id !== openScenarioID).map(s => s.name)}
              />
              :
              ""
        }
      </div>
    </div>
  )
};
