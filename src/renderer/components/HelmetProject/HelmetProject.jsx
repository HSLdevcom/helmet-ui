import React, {useState, useEffect, useRef} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Store from "electron-store";
import fs from "fs";
import path from "path";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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
  const [logArgs, setLogArgs] = useState({});

  // Runtime status
  const [statusIterationsTotal, setStatusIterationsTotal] = useState(null);
  const [statusIterationsCurrent, setStatusIterationsCurrent] = useState(0);
  const [statusIterationsCompleted, setStatusIterationsCompleted] = useState(0);
  const [statusIterationsFailed, setStatusIterationsFailed] = useState(0);
  const [statusState, setStatusState] = useState(null);
  const [statusLogfilePath, setStatusLogfilePath] = useState(null);
  const [statusReadyScenariosLogfiles, setStatusReadyScenariosLogfiles] = useState([]); // [{name: .., logfile: ..}]
  const [statusRunStartTime, setStatusRunStartTime] = useState(null); //Updated when receiving "starting" message
  const [statusRunFinishTime, setStatusRunFinishTime] = useState(null); //Updated when receiving "finished" message
  const [demandConvergenceArray, setDemandConvergenceArray] = useState([]); // Add convergence values to array every iteration

  // User-set scenario list height in the Scenarios tab
  const [scenarioListHeight, setScenarioListHeight] = useState(null);

  // Cost-Benefit Analysis (CBA) controls
  const [cbaOptions, setCbaOptions] = useState({});

  // Scenario-specific settings under currently selected HELMET Project
  const configStores = useRef({});

  const _handleClickScenarioToActive = (scenario) => {
    if(scenarioIDsToRun.includes(scenario.id)) {
      // If scenario exists in scenarios to run, remove it
      setScenarioIDsToRun(scenarioIDsToRun.filter((id) => id !== scenario.id))
    } else {
      // Else add it
      setScenarioIDsToRun(scenarioIDsToRun.concat(scenario.id));
    }
  };

  const _handleClickNewScenario = () => {
    ipcRenderer.send('focus-fix');
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

    //If scenarios don't have runstatus properties (ie. are older scenarios), adding them here to prevent wonky behaviour
    const decoratedFoundScenarios = foundScenarios.map(scenario => {
      if(scenario.runStatus === undefined) {
        return addRunStatusProperties(scenario);
      }
      return scenario;
    })

    setScenarios(decoratedFoundScenarios);
    // Reset state of project related properties
    setOpenScenarioID(null);
    setScenarioIDsToRun([]);
    setRunningScenarioID(null);
    setRunningScenarioIDsQueued([]);
    setLogContents([]);
    setLogOpened(false);
  };

  const addRunStatusProperties = (scenario) => {
    return {
      ...scenario,
      runStatus: {
        statusIterationsTotal: null,
        statusIterationsCurrent: 0,
        statusIterationsCompleted: 0,
        statusIterationsFailed: 0,
        statusState: null,
        statusLogfilePath: null,
        statusReadyScenariosLogfiles: [],
        statusRunStartTime: null,
        statusRunFinishTime: null,
        demandConvergenceArray: []
      }
    }
  }

  const _createScenario = (newScenarioName) => {
    // Generate new (unique) ID for new scenario
    const newId = uuidv4();
    const newScenario = {
      id: newId,
      name: newScenarioName,
      emme_project_file_path: null,
      first_scenario_id: 1,
      forecast_data_folder_path: null,
      delete_strategy_files: true,
      separate_emme_scenarios: false,
      save_matrices_in_emme: false,
      first_matrix_id: 100,
      use_fixed_transit_cost: false,
      end_assignment_only: false,
      iterations: 15,
      overriddenProjectSettings: {
        emmePythonPath: null,
        helmetScriptsPath: null,
        projectPath: null,
        basedataPath: null,
        resultsPath: null,
      },
      runStatus: {
        statusIterationsTotal: null,
        statusIterationsCurrent: 0,
        statusIterationsCompleted: 0,
        statusIterationsFailed: 0,
        statusState: null,
        statusLogfilePath: null,
        statusReadyScenariosLogfiles: null,
        statusRunStartTime: null,
        statusRunFinishTime: null,
        demandConvergenceArray: []
      }
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
      ipcRenderer.send('focus-fix');
    } else {
       ipcRenderer.send('focus-fix');
    }
  };

  const duplicateScenario = (scenario) => {
    var duplicatedScenario = structuredClone(scenario);
    //Change ID and rename the scenario to avoid conflicts.
    duplicatedScenario.id = uuidv4();
    duplicatedScenario.name += `(${duplicatedScenario.id.split('-')[0]})`;
    setScenarios(scenarios.concat(duplicatedScenario));
    configStores.current[duplicatedScenario.id] = new Store({cwd: projectPath, name: duplicatedScenario.name});
    configStores.current[duplicatedScenario.id].set(duplicatedScenario);
  }

  const _runAllActiveScenarios = (activeScenarioIDs) => {
    const scenariosToRun = scenarios.filter((s) => activeScenarioIDs.includes(s.id)).sort((a, b) => scenarioIDsToRun.indexOf(a.id) - scenarioIDsToRun.indexOf(b.id));

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
      if (iterations < 1 || iterations > 99) {
        alert(`Aseta iteraatiot väliltä 1 - 99 skenaariossa "${scenario.name}"`);
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
        // Run parameters per each run (enrich with global settings' paths to EMME python & HELMET model system

        return {
          ...s,
          emme_python_path: s.overriddenProjectSettings.emmePythonPath !== null && s.overriddenProjectSettings.emmePythonPath !== emmePythonPath ? s.overriddenProjectSettings.emmePythonPath : emmePythonPath,
          helmet_scripts_path: s.overriddenProjectSettings.helmetScriptsPath !== null && s.overriddenProjectSettings.helmetScriptsPath !== helmetScriptsPath ? s.overriddenProjectSettings.helmetScriptsPath : helmetScriptsPath,
          base_data_folder_path: s.overriddenProjectSettings.basedataPath !== null && s.overriddenProjectSettings.basedataPath !== basedataPath ? s.overriddenProjectSettings.basedataPath : basedataPath,
          results_data_folder_path: s.overriddenProjectSettings.resultsPath !== null && s.overriddenProjectSettings.resultsPath !== resultsPath ? s.overriddenProjectSettings.resultsPath : resultsPath,
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
    setLogArgs(args);
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
        <Tabs className="tab-container">
          <TabList className="tab-list">
            <Tab selectedClassName="selected-tab" className="tab-list-item tab-item-name"> 
              Skenaariot
            </Tab>
            <Tab selectedClassName="selected-tab" className="tab-list-item tab-item-name">
              CBA
            </Tab>
          </TabList>

          <TabPanel className="runtime-tab">
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
              logArgs={logArgs}
              duplicateScenario={duplicateScenario}
              scenarioListHeight={scenarioListHeight}
              setScenarioListHeight={setScenarioListHeight}
            />
          </TabPanel>
          <TabPanel>
            <CostBenefitAnalysis
              resultsPath={resultsPath}
              cbaOptions={cbaOptions}
              setCbaOptions={setCbaOptions}
              runCbaScript={_runCbaScript}
            />
          </TabPanel>
        </Tabs>
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
                projectPath={projectPath}  
                scenario={scenarios.find((s) => s.id === openScenarioID)}
                updateScenario={_updateScenario}
                closeScenario={() => setOpenScenarioID(null)}
                existingOtherNames={scenarios.filter(s => s.id !== openScenarioID).map(s => s.name)}
                inheritedGlobalProjectSettings={{
                  emmePythonPath,
                  helmetScriptsPath,
                  projectPath,
                  basedataPath,
                  resultsPath
                }}
              />
              :
              ""
        }
      </div>
    </div>
  )
};