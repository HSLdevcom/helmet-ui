import React from 'react';
import Store from 'electron-store';
import uuidv4 from "uuid/v4";
import fs from "fs";
import path from "path";

const {ipcRenderer} = require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Global settings
      is_settings_open: false, // whether Settings -dialog is open
      emme_python_path: undefined, // file path to EMME python executable
      helmet_scripts_path: undefined, // folder path to HELMET model system scripts

      // HELMET Project -specific settings
      scenarios: [], // HELMET Scenarios under currently selected HELMET Project
      open_scenario_id: null, // currently open HELMET Scenario configuration

      // Runtime
      running_scenario_id: null, // currently running HELMET Scenario, indicates if running
      running_scenario_ids_queued: [], // queued ("remaining") HELMET Scenarios
      log_contents: [], // project runtime log-contents
      is_log_opened: false, // whether runtime log is open
    };

    // Global settings store contains "emme_python_path" and "helmet_scripts_path", which are same in every scenario.
    this.globalSettingsStore = new Store();

    // Scenario-specific settings under currently selected HELMET Project
    this.configStores = {};

    // Electron IPC event listeners
    this.onLoggableEvent = (event, args) => {
      this.setState({log_contents: this.state.log_contents.concat(args)});
    };
    this.onScenarioComplete = (event, args) => {
      this.setState({
        running_scenario_id: args.next.id,
        running_scenario_ids_queued: this.state.running_scenario_ids_queued.filter((id) => id !== args.completed.id),
        log_contents: this.state.log_contents.concat({level: 'NEWLINE', message: ''})
      });
    };
    this.onAllScenariosComplete = (event, args) => {
      this.setState({
        running_scenario_id: null, // Re-enable controls
        running_scenario_ids_queued: []
      });
    };
  }

  _setEMMEPythonPath = (newPath) => {
    this.setState({emme_python_path: newPath});
    this.globalSettingsStore.set('emme_python_path', newPath);
  };

  _setHelmetScriptsPath = (newPath) => {
    this.setState({helmet_scripts_path: newPath});
    this.globalSettingsStore.set('helmet_scripts_path', newPath);
  };

  _createNewScenario = (name) => {
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
    this.setState({scenarios: this.state.scenarios.concat(newScenario)});
    this.configStores[newId] = new Store({cwd: this.props.config.store.saveDir, name: name});
    this.configStores[newId].set(newScenario);
    // Then set scenario as open by id (Why id? Having open_scenario as reference causes sub-elements to be bugged because of different object reference)
    this.setState({open_scenario_id: newId});
  };

  _updateScenario = (newValues) => {
    // Update newValues to matching .id in this.state.scenarios
    this.setState({
      scenarios: this.state.scenarios.map((s) => {
        return s.id === newValues.id ? {...s, ...newValues} : s
      })
    });
    // If name changed, rename file and change reference
    if (this.configStores[newValues.id].get('name') !== newValues.name) {
      // If name was set empty - use ID instead
      const newName = newValues.name ? newValues.name : newValues.id;
      fs.renameSync(
        this.configStores[newValues.id].path,
        path.join(this.props.config.store.saveDir, `${newName}.json`)
      );
      this.configStores[newValues.id] = new Store({
        cwd: this.props.config.store.saveDir,
        name: newName
      });
    }
    // And persist all changes in file
    this.configStores[newValues.id].set(newValues);
  };

  _deleteScenario = (scenario) => {
    if (confirm(`Oletko varma skenaarion ${scenario.name} poistosta?`)) {
      this.setState({
        open_scenario_id: null,
        scenarios: this.state.scenarios.filter((s) => s.id !== scenario.id)
      });
      fs.unlinkSync(path.join(this.props.config.store.saveDir, `${scenario.name}.json`));
      window.location.reload();  // Vex-js dialog input gets stuck otherwise
    }
  };

  _runAllActiveScenarios = (activeScenarioIDs) => {
    const scenariosToRun = this.state.scenarios.filter((s) => activeScenarioIDs.includes(s.id));

    // Check required global parameters are set
    if (!this.state.emme_python_path) {
      alert("Python -sijaintia ei ole asetettu!");
      return;
    }
    if (!this.state.helmet_scripts_path) {
      alert("Helmet Scripts -kansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }

    // For each active scenario, check required scenario-specific parameters are set
    for (let scenario of scenariosToRun) {
      const store = this.configStores[scenario.id];
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
    this.setState({
      open_scenario_id: null, // Close any open scenario configuration
      log_contents: [
        {
          level: "UI-event",
          message: `Initializing run of scenarios: ${scenariosToRun.map((s) => s.name).join(', ')}`
        }
      ],
      is_log_opened: true, // Keep log open even after run finishes (or is cancelled)
      running_scenario_id: activeScenarioIDs[0], // Disable controls
      running_scenario_ids_queued: activeScenarioIDs.slice(1)
    });
    ipcRenderer.send(
      'message-from-ui-to-run-scenarios',
      scenariosToRun.map((s) => {
        // Run parameters per each run
        return {
          ...s,
          emme_python_path: this.state.emme_python_path,
          helmet_scripts_path: this.state.helmet_scripts_path,
          log_level: 'DEBUG'
        }
      })
    );
  };

  _cancelRunning = () => {
    this.setState({
      log_contents: this.state.log_contents.concat({level: "UI-event", message: "Cancelling remaining scenarios."}),
      running_scenario_ids_queued: []
    });
    ipcRenderer.send('message-from-ui-to-cancel-scenarios');
    this.setState({
      running_scenario_id: null // Re-enable controls
    });
  };

  componentDidMount() {
    // Attach Electron IPC event listeners (to worker => UI events)
    ipcRenderer.on('all-scenarios-complete', this.onAllScenariosComplete);
    ipcRenderer.on('loggable-event', this.onLoggableEvent);
    ipcRenderer.on('scenario-complete', this.onScenarioComplete);
    ipcRenderer.on('all-scenarios-complete', this.onAllScenariosComplete);

    // Search for EMME's Python if not set in global store (default win path is %APPDATA%, should remain there [hidden from user])
    if (!this.globalSettingsStore.get('emme_python_path')) {
      const [found, pythonPath] = this.props.searchEMMEPython();
      if (found) {
        if (confirm(`Python ${this.props.config.emme.pythonVersion} löytyi sijainnista:\n\n${pythonPath}\n\nHaluatko käyttää tätä sijaintia?`)) {
          this.globalSettingsStore.set('emme_python_path', pythonPath);
        }
      } else {
        alert(`Emme ${this.props.config.emme.version} ja Python ${this.props.config.emme.pythonVersion} eivät löytyneet oletetusta sijainnista.\n\nMääritä Pythonin sijainti Asetukset-dialogissa.`);
      }
    }
    // Copy existing global store values to state
    this.setState({
      emme_python_path: this.globalSettingsStore.get('emme_python_path'),
      helmet_scripts_path: this.globalSettingsStore.get('helmet_scripts_path')
    });

    // Load all .json files from saveDir, and check if their keys match scenarios' keys.
    // If keys match -> set file as a configStore, and add contents to this.state.scenarios
    const configPath = this.props.config.store.saveDir;
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
          this.configStores[obj.id] = new Store({cwd: configPath, name: fileName.slice(0, -5)});
          foundScenarios.push(obj);
        }
      }
    });
    this.setState({scenarios: foundScenarios});
  }

  componentWillUnmount() {
    // Detach Electron IPC event listeners
    ipcRenderer.removeListener('all-scenarios-complete', this.onAllScenariosComplete);
    ipcRenderer.removeListener('loggable-event', this.onLoggableEvent);
    ipcRenderer.removeListener('scenario-complete', this.onScenarioComplete);
    ipcRenderer.removeListener('all-scenarios-complete', this.onAllScenariosComplete);
  }

  render() {
    return (
      <div className={"App" + (this.state.running_scenario_id !== null ? " App--busy" : "")}>

        {/* Pop-up settings dialog with overlay behind it */}
        <div className="App__settings" style={{display: this.state.is_settings_open ? "block" : "none"}}>
          <Settings
            helmet_scripts_path={this.state.helmet_scripts_path}
            closeSettings={() => this.setState({is_settings_open: false})}
            setEMMEPythonPath={this._setEMMEPythonPath}
            setHelmetScriptsPath={this._setHelmetScriptsPath}
          />
        </div>

        {/* UI title bar, app-version, etc. */}
        <div className="App__header">
          Helmet 4.0
          &nbsp;
          <span className="App__header-version">{`UI v${this.props.helmetUIVersion}`}</span>
          <button className="App__open-settings-btn"
                  style={{display: this.state.is_settings_open ? "none" : "block"}}
                  onClick={(e) => this.setState({is_settings_open: true})}
                  disabled={this.state.running_scenario_id !== null}
          >
            Asetukset
          </button>
        </div>

        {/* Main content of the app */}
        <div className="App__body">

          {/* Panel for primary view and controls */}
          <div className="App__main">
            <HelmetProject
              scenarios={this.state.scenarios}
              open_scenario_id={this.state.open_scenario_id}
              running_scenario_id={this.state.running_scenario_id}
              running_scenario_ids_queued={this.state.running_scenario_ids_queued}
              setOpenScenarioId={(id) => this.setState({open_scenario_id: id})}
              createNewScenario={this._createNewScenario}
              runAllActiveScenarios={this._runAllActiveScenarios}
              cancelRunning={this._cancelRunning}
            />
          </div>

          {/* Panel for secondary view(s) and controls */}
          <div className="App__aside">
            {this.state.running_scenario_id || this.state.is_log_opened ?
              <RunLog
                log_contents={this.state.log_contents.map((entry, i) => {return {...entry, id: i};})}
                is_scenario_running={this.state.running_scenario_id !== null}
                closeRunLog={() => this.setState({is_log_opened: false})}
              />
              :
              this.state.open_scenario_id !== null ?
                <HelmetScenario
                  scenario={this.state.scenarios.find((s) => s.id === this.state.open_scenario_id)}
                  updateScenario={this._updateScenario}
                  deleteScenario={this._deleteScenario}
                />
                :
                ""
            }
          </div>
        </div>
      </div>
    )
  }
}
