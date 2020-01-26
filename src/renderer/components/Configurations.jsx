import React from 'react';
import fs from 'fs';
import path from 'path';
import Store from 'electron-store';

const {ipcRenderer} = require('electron');

class Configurations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenarios: [],
      open_scenario_id: null,
      running_scenario_id: null,
      running_scenario_ids_queued: [],
      log_contents: [],
      is_log_opened: false,
    };

    this.configStores = {}; // Initialized in componentDidMount

    // Electron IPC events (from worker window)
    ipcRenderer.on('loggable-event', (event, args) => {
      this.setState({log_contents: this.state.log_contents.concat(args)});
    });
    ipcRenderer.on('scenario-complete', (event, args) => {
      this.setState({
        running_scenario_id: args.next.id,
        running_scenario_ids_queued: this.state.running_scenario_ids_queued.filter((id) => id !== args.completed.id),
        log_contents: this.state.log_contents.concat({level: 'NEWLINE', message: ''})
      });
    });
    ipcRenderer.on('all-scenarios-complete', (event, args) => {
      this.setState({
        running_scenario_id: null, // Re-enable controls
        running_scenario_ids_queued: []
      });
    });
  }

  _createNewScenario(name) {
    // Get next available running ID
    const newId = this.state.scenarios.length ?
      Math.max.apply(null, this.state.scenarios.map((s) => s.id)) + 1
      :
      0;
    const newScenario = {
      id: newId,
      name: name,
      emme_project_file_path: null,
      data_folder_path: null,
      use_fixed_transit_cost: false,
      iterations: 10,
    };
    // Create the new scenario in "scenarios" array first
    this.setState({
      scenarios: this.state.scenarios.concat(newScenario)
    });
    this.configStores[newId] = new Store({cwd: this.props.helmet_ui_app_config.store.saveDir, name: name});
    this.configStores[newId].set(newScenario);
    // Then set scenario as open by id (Why id? Having open_scenario as reference causes sub-elements to be bugged because of different object reference)
    this.setState({
      open_scenario_id: newId
    })
  }

  _updateScenario(newValues) {
    // Update newValues to matching .id in this.state.scenarios
    this.setState({
      scenarios: this.state.scenarios.map((s) => {
        return s.id === newValues.id ? {...s, ...newValues} : s
      })
    });
    // If name changed, rename file and change reference
    if (this.configStores[newValues.id].get('name') !== newValues.name) {
      fs.renameSync(this.configStores[newValues.id].path, path.join(this.props.helmet_ui_app_config.store.saveDir, `${newValues.name}.json`));
      this.configStores[newValues.id] = new Store({
        cwd: this.props.helmet_ui_app_config.store.saveDir,
        name: newValues.name
      });
    }
    // And persist changes in file
    this.configStores[newValues.id].set(newValues);
  }

  _deleteScenario(scenario) {
    if (confirm(`Oletko varma skenaarion ${scenario.name} poistosta?`)) {
      this.setState({
        open_scenario_id: null,
        scenarios: this.state.scenarios.filter((s) => s.id !== scenario.id)
      });
      fs.unlinkSync(path.join(this.props.helmet_ui_app_config.store.saveDir, `${scenario.name}.json`));
      window.location.reload();  // Vex-js dialog input gets stuck otherwise
    }
  }

  _runAllActiveScenarios(activeScenarioIDs) {
    const scenariosToRun = this.state.scenarios.filter((s) => activeScenarioIDs.includes(s.id));

    // Check required global parameters are set
    if (!this.props.emme_python_path) {
      alert("Python -sijaintia ei ole asetettu!");
      return;
    }
    if (!this.props.helmet_scripts_path) {
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
    this.props.runAll(
      scenariosToRun.map((s) => {
        // Run parameters per each run
        return {
          ...s,
          emme_python_path: this.props.emme_python_path,
          helmet_scripts_path: this.props.helmet_scripts_path,
          log_level: 'DEBUG'
        }
      })
    );
  }

  _cancelRunning() {
    this.setState({
      log_contents: this.state.log_contents.concat({level: "UI-event", message: "Cancelling remaining scenarios."}),
      running_scenario_ids_queued: []
    });
    this.props.cancelAll();
    this.setState({
      running_scenario_id: null // Re-enable controls
    });
  }

  componentDidMount() {
    /**
     * Load all .json files from saveDir, and check if their keys match scenarios' keys.
     * If keys match -> set file as a configStore, and add contents to this.state.scenarios
     */
    const configPath = this.props.helmet_ui_app_config.store.saveDir;
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

  render() {
    return <div className="ConfigurationsWrapper">
      <RunConfiguration
        scenarios={this.state.scenarios}
        open_scenario_id={this.state.open_scenario_id}
        running_scenario_id={this.state.running_scenario_id}
        running_scenario_ids_queued={this.state.running_scenario_ids_queued}
        setOpenScenarioId={(scenario_id) => this.setState({open_scenario_id: scenario_id})}
        createNewScenario={(name) => this._createNewScenario(name)}
        runAllActiveScenarios={(ids) => this._runAllActiveScenarios(ids)}
        cancelRunning={() => this._cancelRunning()}
      />
      {this.state.running_scenario_id || this.state.is_log_opened ?
        <RunLog
          log_contents={this.state.log_contents.map((entry, i) => {return {...entry, id: i};})}
          is_scenario_running={this.state.running_scenario_id !== null}
          closeRunLog={() => this.setState({is_log_opened: false})}
        />
        :
        this.state.open_scenario_id !== null ?
          <ScenarioConfiguration
            scenario={this.state.scenarios.find((s) => s.id === this.state.open_scenario_id)}
            updateScenario={(newValues) => this._updateScenario(newValues)}
            deleteScenario={(scenario) => this._deleteScenario(scenario)}
          />
          :
          ""
      }
    </div>;
  }
}
