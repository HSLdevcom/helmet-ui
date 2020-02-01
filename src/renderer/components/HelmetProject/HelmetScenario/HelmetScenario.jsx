import React from 'react';
import path from 'path';

const HelmetScenario = ({scenario, deleteScenario, updateScenario}) => {

  return (
    <div className="Scenario" key={scenario.id}>

      {/* Un-links the configuration from file system */}
      <button className="Scenario__delete-btn"
              onClick={(e) => deleteScenario(scenario)}
      >
        Poista
      </button>

      {/* Name field (updates the filename live as well) */}
      <div className="Scenario__section">
        <input className="Scenario__name"
               type="text"
               placeholder="Skenaarion nimi"
               value={scenario.name}
               onChange={(e) => {
                 updateScenario({...scenario, name: e.target.value});
               }}
        />
      </div>

      {/* File path to EMME project reference-file (generally same in all scenarios of a given HELMET project) */}
      <div className="Scenario__section">
        <span className="Scenario__pseudo-label">EMME projekti (.emp)</span>
        <label className="Scenario__pseudo-file-select" htmlFor="emme-project-file-select">
          {scenario.emme_project_file_path ? path.basename(scenario.emme_project_file_path) : "Valitse.."}
        </label>
        <input className="Scenario__hidden-input"
               id="emme-project-file-select"
               type="file"
               accept=".emp"
               onChange={(e) => {
                 updateScenario({...scenario, emme_project_file_path: e.target.files[0].path});
               }}
        />
      </div>

      {/* Number of first EMME-scenario ID (of 4) - NOTE: EMME-scenario is different from HELMET-scenario (ie. this config) */}
      <div className="Scenario__section">
        <label className="Scenario__pseudo-label Scenario__pseudo-label--inline"
               htmlFor="first-scenario-id">Ensimm&auml;isen skenaarion numero:</label>
        <input id="first-scenario-id"
               type="number"
               step="1"
               value={scenario.first_scenario_id}
               onChange={(e) => {
                 updateScenario({...scenario, first_scenario_id: e.target.value});
               }}
        />
      </div>

      {/* Folder path to variable input data (matrices with variables sent to EMME) */}
      <div className="Scenario__section">
        <span className="Scenario__pseudo-label">Data-kansio (matriisit)</span>
        <label className="Scenario__pseudo-file-select" htmlFor="data-folder-select">
          {scenario.data_folder_path ? path.basename(scenario.data_folder_path) : "Valitse.."}
        </label>
        <input className="Scenario__hidden-input"
               id="data-folder-select"
               type="file"
               webkitdirectory=""
               directory=""
               onChange={(e) => {
                 updateScenario({...scenario, data_folder_path: e.target.files[0].path});
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
                 checked={scenario.use_fixed_transit_cost}
                 onChange={(e) => {
                   updateScenario({...scenario, use_fixed_transit_cost: true});
                 }}
          />
        </label>
        <label className="Scenario__radio-input">
          Ei&nbsp;
          <input type="radio"
                 name="fixed-transit-cost"
                 value="false"
                 checked={!scenario.use_fixed_transit_cost}
                 onChange={(e) => {
                   updateScenario({...scenario, use_fixed_transit_cost: false});
                 }}
          />
        </label>
      </div>

      {/* Number of iterations to run */}
      <div className="Scenario__section">
        <label className="Scenario__pseudo-label Scenario__pseudo-label--inline"
               htmlFor="iterations">Iteraatiot:</label>
        <input id="iterations"
               type="number"
               min="1"
               max="99"
               step="1"
               value={scenario.iterations}
               onChange={(e) => {
                 updateScenario({...scenario, iterations: e.target.value});
               }}
        />
      </div>
    </div>
  )
};
