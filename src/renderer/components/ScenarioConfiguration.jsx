import React from 'react';
import 'path';

class ScenarioConfiguration extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="ScenarioConfiguration">

      <button className="ScenarioConfiguration__delete-btn"
              onClick={(e) => {
                this.props.deleteScenario(this.props.scenario);
              }}
      >Poista</button>

      <div className="ScenarioConfiguration__section">
        <input className="ScenarioConfiguration__name"
               type="text"
               placeholder="Skenaarion nimi"
               value={this.props.scenario.name}
               onChange={(e) => {
                 this.props.updateScenario({...this.props.scenario, name: e.target.value});
               }}
        />
      </div>

      <div className="ScenarioConfiguration__section">
        <span className="ScenarioConfiguration__pseudo-label">EMME projekti (.emp)</span>
        <label className="ScenarioConfiguration__pseudo-file-select" htmlFor="emme-project-file-select">
          {this.props.scenario.emme_project_file_path ? path.basename(this.props.scenario.emme_project_file_path) : "Valitse.."}
        </label>
        <input className="ScenarioConfiguration__hidden-input"
               id="emme-project-file-select"
               type="file"
               accept=".emp"
               onChange={(e) => {
                 this.props.updateScenario({...this.props.scenario, emme_project_file_path: e.target.files[0].path});
               }}
        />
      </div>

      <div className="ScenarioConfiguration__section">
        <span className="ScenarioConfiguration__pseudo-label">Data-kansio (matriisit)</span>
        <label className="ScenarioConfiguration__pseudo-file-select" htmlFor="data-folder-select">
          {this.props.scenario.data_folder_path ? path.basename(this.props.scenario.data_folder_path) : "Valitse.."}
        </label>
        <input className="ScenarioConfiguration__hidden-input"
               id="data-folder-select"
               type="file"
               webkitdirectory=""
               directory=""
               onChange={(e) => {
                 this.props.updateScenario({...this.props.scenario, data_folder_path: e.target.files[0].path});
               }}
        />
      </div>

      <div className="ScenarioConfiguration__section">
        <span className="ScenarioConfiguration__pseudo-label">K&auml;yt&auml; esilaskettuja matka-aikoja:</span>
        <label className="ScenarioConfiguration__radio-input">
          Kyll&auml;
          <input type="radio"
                 name="fixed-transit-cost"
                 value="true"
                 checked={this.props.scenario.use_fixed_transit_cost}
                 onChange={(e) => {
                   this.props.updateScenario({...this.props.scenario, use_fixed_transit_cost: true});
                 }}
          />
        </label>
        <label className="ScenarioConfiguration__radio-input">
          Ei
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

      <div className="ScenarioConfiguration__section">
        <label className="ScenarioConfiguration__pseudo-label ScenarioConfiguration__pseudo-label--inline" htmlFor="iterations">Iteraatiot</label>
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
    </div>;
  }
}
