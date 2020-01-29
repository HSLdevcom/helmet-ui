import React from 'react';
import path from 'path';

class HelmetScenario extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Scenario">

        {/* Un-links the configuration from file system */}
        <button className="Scenario__delete-btn"
                onClick={(e) => this.props.deleteScenario(this.props.scenario)}
        >
          Poista
        </button>

        {/* Name field (updates the filename live as well) */}
        <div className="Scenario__section">
          <input className="Scenario__name"
                 type="text"
                 placeholder="Skenaarion nimi"
                 value={this.props.scenario.name}
                 onChange={(e) => {
                   this.props.updateScenario({...this.props.scenario, name: e.target.value});
                 }}
          />
        </div>

        {/* File path to EMME project reference-file (generally same in all scenarios of a given HELMET project) */}
        <div className="Scenario__section">
          <span className="Scenario__pseudo-label">EMME projekti (.emp)</span>
          <label className="Scenario__pseudo-file-select" htmlFor="emme-project-file-select">
            {this.props.scenario.emme_project_file_path ? path.basename(this.props.scenario.emme_project_file_path) : "Valitse.."}
          </label>
          <input className="Scenario__hidden-input"
                 id="emme-project-file-select"
                 type="file"
                 accept=".emp"
                 onChange={(e) => {
                   this.props.updateScenario({...this.props.scenario, emme_project_file_path: e.target.files[0].path});
                 }}
          />
        </div>

        {/* Folder path to variable input data (matrices with variables sent to EMME) */}
        <div className="Scenario__section">
          <span className="Scenario__pseudo-label">Data-kansio (matriisit)</span>
          <label className="Scenario__pseudo-file-select" htmlFor="data-folder-select">
            {this.props.scenario.data_folder_path ? path.basename(this.props.scenario.data_folder_path) : "Valitse.."}
          </label>
          <input className="Scenario__hidden-input"
                 id="data-folder-select"
                 type="file"
                 webkitdirectory=""
                 directory=""
                 onChange={(e) => {
                   this.props.updateScenario({...this.props.scenario, data_folder_path: e.target.files[0].path});
                 }}
          />
        </div>

        {/* Choice whether to use pre-calculated transit cost matrices (instead of calculating them mid-run) */}
        <div className="Scenario__section">
          <span className="Scenario__pseudo-label">K&auml;yt&auml; esilaskettuja matka-aikoja:</span>
          <label className="Scenario__radio-input">
            Kyll&auml;&nbsp;
            <input type="radio"
                   name="fixed-transit-cost"
                   value="true"
                   checked={this.props.scenario.use_fixed_transit_cost}
                   onChange={(e) => {
                     this.props.updateScenario({...this.props.scenario, use_fixed_transit_cost: true});
                   }}
            />
          </label>
          <label className="Scenario__radio-input">
            Ei&nbsp;
            <input type="radio"
                   name="fixed-transit-cost"
                   value="false"
                   checked={!this.props.scenario.use_fixed_transit_cost}
                   onChange={(e) => {
                     this.props.updateScenario({...this.props.scenario, use_fixed_transit_cost: false});
                   }}
            />
          </label>
        </div>

        {/* Number of iterations to run */}
        <div className="Scenario__section">
          <label className="Scenario__pseudo-label Scenario__pseudo-label--inline" htmlFor="iterations">Iteraatiot:</label>
          <input id="iterations"
                 type="number"
                 min="1"
                 max="99"
                 step="1"
                 value={this.props.scenario.iterations}
                 onChange={(e) => {
                   this.props.updateScenario({...this.props.scenario, iterations: e.target.value});
                 }}
          />
        </div>
      </div>
    )
  }
}
