import React, {useState, useEffect, useRef} from 'react';
import Store from 'electron-store';
import uuidv4 from "uuid/v4";
import fs from "fs";
import path from "path";

const {ipcRenderer} = require('electron');

const App = ({helmetUIVersion, config, searchEMMEPython}) => {

  // Global settings
  const [isSettingsOpen, setSettingsOpen] = useState(false); // whether Settings -dialog is open
  const [emmePythonPath, setEmmePythonPath] = useState(undefined); // file path to EMME python executable
  const [helmetScriptsPath, setHelmetScriptsPath] = useState(undefined); // folder path to HELMET model system scripts

  // HELMET Project -specific settings
  const [scenarios, setScenarios] = useState([]); // HELMET Scenarios under currently selected HELMET Project
  const [openScenarioID, setOpenScenarioID] = useState(null); // currently open HELMET Scenario configuration

  // Runtime
  const [runningScenarioID, setRunningScenarioID] = useState(null); // currently running HELMET Scenario, indicates if running
  const [runningScenarioIDsQueued, setRunningScenarioIDsQueued] = useState([]); // queued ("remaining") HELMET Scenarios
  const [logContents, setLogContents] = useState([]); // project runtime log-contents
  const [isLogOpened, setLogOpened] = useState(false); // whether runtime log is open

  // Global settings store contains "emme_python_path" and "helmet_scripts_path", which are same in every scenario.
  const globalSettingsStore = useRef(new Store());

  // Scenario-specific settings under currently selected HELMET Project
  const configStores = useRef({});

  // Electron IPC event listeners
  const onLoggableEvent = (event, args) => {
    setLogContents(logContents.concat(args));
  };
  const onScenarioComplete = (event, args) => {
    setRunningScenarioID(args.next.id);
    setRunningScenarioIDsQueued(runningScenarioIDsQueued.filter((id) => id !== args.completed.id));
    setLogContents(logContents.concat({level: 'NEWLINE', message: ''}));
  };
  const onAllScenariosComplete = (event, args) => {
    setRunningScenarioID(null); // Re-enable controls
    setRunningScenarioIDsQueued([]);
  };

  const _setEMMEPythonPath = (newPath) => {
    setEmmePythonPath(newPath);
    globalSettingsStore.current.set('emme_python_path', newPath);
  };

  const _setHelmetScriptsPath = (newPath) => {
    setHelmetScriptsPath(newPath);
    globalSettingsStore.current.set('helmet_scripts_path', newPath);
  };

  const _createNewScenario = (name) => {
    // Generate new (unique) ID for new scenario
    const newId = uuidv4();
    const newScenario = {
      id: newId,
      name: name,
      emme_project_file_path: null,
      data_folder_path: null,
      use_fixed_transit_cost: false,
      iterations: 10,
    };
    // Create the new scenario in "scenarios" array first
    setScenarios(scenarios.concat(newScenario));
    configStores.current[newId] = new Store({cwd: config.store.saveDir, name: name});
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
        path.join(config.store.saveDir, `${newName}.json`)
      );
      configStores.current[newValues.id] = new Store({
        cwd: config.store.saveDir,
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
      fs.unlinkSync(path.join(config.store.saveDir, `${scenario.name}.json`));
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

    // For each active scenario, check required scenario-specific parameters are set
    for (let scenario of scenariosToRun) {
      const store = configStores.current[scenario.id];
      const iterations = store.get('iterations');
      if (!store.get('emme_project_file_path')) {
        alert(`Emme-projektia ei ole valittu skenaariossa "${scenario.name}"`);
        return;
      }
      if (!store.get('data_folder_path')) {
        alert(`Data-kansiota ei ole valittu skenaariossa "${scenario.name}"`);
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
    ipcRenderer.send(
      'message-from-ui-to-run-scenarios',
      scenariosToRun.map((s) => {
        // Run parameters per each run (enrich with global settings' paths to EMME python & HELMET model system)
        return {
          ...s,
          emme_python_path: emmePythonPath,
          helmet_scripts_path: helmetScriptsPath,
          log_level: 'DEBUG'
        }
      })
    );
  };

  const _cancelRunning = () => {
    setLogContents(logContents.concat({level: "UI-event", message: "Cancelling remaining scenarios."}));
    setRunningScenarioIDsQueued([]);
    ipcRenderer.send('message-from-ui-to-cancel-scenarios');
    setRunningScenarioID(null); // Re-enable controls
  };

  useEffect(() => {
    // Attach Electron IPC event listeners (to worker => UI events)
    ipcRenderer.on('all-scenarios-complete', onAllScenariosComplete);
    ipcRenderer.on('loggable-event', onLoggableEvent);
    ipcRenderer.on('scenario-complete', onScenarioComplete);
    ipcRenderer.on('all-scenarios-complete', onAllScenariosComplete);

    // Search for EMME's Python if not set in global store (default win path is %APPDATA%, should remain there [hidden from user])
    if (!globalSettingsStore.current.get('emme_python_path')) {
      const [found, pythonPath] = searchEMMEPython();
      if (found) {
        if (confirm(`Python ${config.emme.pythonVersion} löytyi sijainnista:\n\n${pythonPath}\n\nHaluatko käyttää tätä sijaintia?`)) {
          globalSettingsStore.current.set('emme_python_path', pythonPath);
        }
      } else {
        alert(`Emme ${config.emme.version} ja Python ${config.emme.pythonVersion} eivät löytyneet oletetusta sijainnista.\n\nMääritä Pythonin sijainti Asetukset-dialogissa.`);
      }
    }
    // Copy existing global store values to state
    setEmmePythonPath(globalSettingsStore.current.get('emme_python_path'));
    setHelmetScriptsPath(globalSettingsStore.current.get('helmet_scripts_path'));

    // Load all .json files from saveDir, and check if their keys match scenarios' keys.
    // If keys match -> set file as a configStore, and add contents to this.state.scenarios
    const configPath = config.store.saveDir;
    const foundScenarios = [];
    fs.readdirSync(configPath).forEach((fileName) => {
      if (fileName.endsWith(".json")) {
        const obj = JSON.parse(fs.readFileSync(path.join(configPath, fileName), 'utf8'));
        if ("id" in obj
          && "name" in obj
          && "emme_project_file_path" in obj
          && "data_folder_path" in obj
          && "use_fixed_transit_cost" in obj
          && "iterations" in obj
        ) {
          configStores.current[obj.id] = new Store({cwd: configPath, name: fileName.slice(0, -5)});
          foundScenarios.push(obj);
        }
      }
    });
    setScenarios(foundScenarios);

    return () => {
      // Detach Electron IPC event listeners
      ipcRenderer.removeListener('all-scenarios-complete', onAllScenariosComplete);
      ipcRenderer.removeListener('loggable-event', onLoggableEvent);
      ipcRenderer.removeListener('scenario-complete', onScenarioComplete);
      ipcRenderer.removeListener('all-scenarios-complete', onAllScenariosComplete);
    }
  }, []);

  return (
    <div className={"App" + (runningScenarioID !== null ? " App--busy" : "")}>

      {/* Pop-up settings dialog with overlay behind it */}
      <div className="App__settings" style={{display: isSettingsOpen ? "block" : "none"}}>
        <Settings
          emmePythonPath={emmePythonPath}
          helmetScriptsPath={helmetScriptsPath}
          closeSettings={() => setSettingsOpen(false)}
          setEMMEPythonPath={_setEMMEPythonPath}
          setHelmetScriptsPath={_setHelmetScriptsPath}
        />
      </div>

      {/* UI title bar, app-version, etc. */}
      <div className="App__header">
        Helmet 4.0
        &nbsp;
        <span className="App__header-version">{`UI v${helmetUIVersion}`}</span>
        <button className="App__open-settings-btn"
                style={{display: isSettingsOpen ? "none" : "block"}}
                onClick={(e) => setSettingsOpen(true)}
                disabled={runningScenarioID !== null}
        >
          Asetukset
        </button>
      </div>

      {/* Main content of the app */}
      <div className="App__body">

        {/* Panel for primary view and controls */}
        <div className="App__main">
          <HelmetProject
            scenarios={scenarios}
            openScenarioID={openScenarioID}
            runningScenarioID={runningScenarioID}
            running_scenario_ids_queued={runningScenarioIDsQueued}
            setOpenScenarioId={(id) => setOpenScenarioID(id)}
            createNewScenario={_createNewScenario}
            runAllActiveScenarios={_runAllActiveScenarios}
            cancelRunning={_cancelRunning}
          />
        </div>

        {/* Panel for secondary view(s) and controls */}
        <div className="App__aside">
          {runningScenarioID || isLogOpened ?
            <RunLog
              logContents={logContents.map((entry, i) => {return {...entry, id: i};})}
              isScenarioRunning={runningScenarioID !== null}
              closeRunLog={() => setLogOpened(false)}
            />
            :
            openScenarioID !== null ?
              <HelmetScenario
                scenario={scenarios.find((s) => s.id === openScenarioID)}
                updateScenario={_updateScenario}
                deleteScenario={_deleteScenario}
              />
              :
              ""
          }
        </div>
      </div>
    </div>
  )
};
