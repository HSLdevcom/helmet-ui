import React from 'react';
import fs from 'fs';
import path from 'path';
import Store from 'electron-store';

class Configurations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenarios: [],
      open_scenario_id: null,
    };
    this.configStores = {}; // Initialized in componentDidMount
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
        setOpenScenarioId={(scenario_id) => this.setState({open_scenario_id: scenario_id})}
        createNewScenario={(name) => this._createNewScenario(name)}
      />
      {this.state.open_scenario_id !== null ?
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
