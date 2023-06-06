import React, {useState} from 'react';
import path from 'path';
import { isNull } from 'util';
const {dialog} = require('@electron/remote');

const HelmetScenario = ({projectPath, scenario, updateScenario, closeScenario, existingOtherNames, inheritedGlobalProjectSettings}) => {

  const [nameError, setNameError] = useState("");

  return (
    <div className="Scenario" key={scenario.id}>

      <div className="Scenario__close"
              onClick={(e) => {
                closeScenario();
              }}
      ></div>

      <div className="Scenario__section Scenario__heading">
        Skenaarion asetukset
      </div>

      {/* Name field (updates the filename live as well) */}
      <div className="Scenario__section">
        <label className="Scenario__pseudo-label"
               htmlFor="scenario-name">Skenaarion nimi</label>
        <input id="scenario-name"
               className="Scenario__name"
               type="text"
               placeholder="esim. 2030_v1"
               value={scenario.name}
               onChange={(e) => {
                 const newName = e.target.value;
                 if (!existingOtherNames.includes(newName)) {
                   updateScenario({...scenario, name: newName});
                   setNameError("");
                 } else {
                   setNameError(`Invalid name. Scenario "${newName}" already exists.`);
                 }
               }}
        />
        {nameError ? <span className="Scenario__name-error">{nameError}</span> : ""}
      </div>

      {/* File path to EMME project reference-file (generally same in all scenarios of a given HELMET project) */}
      <div className="Scenario__section">
        <span className="Scenario__pseudo-label">Emme-projekti (.emp)</span>
        <label className="Scenario__pseudo-file-select" htmlFor="emme-project-file-select" title={scenario.emme_project_file_path}>
          {scenario.emme_project_file_path ? path.basename(scenario.emme_project_file_path) : "Valitse.."}
        </label>
        <input className="Scenario__hidden-input"
               id="emme-project-file-select"
               type="text"
               onClick={()=>{
                 dialog.showOpenDialog({
                   defaultPath: scenario.emme_project_file_path ? scenario.emme_project_file_path : projectPath,
                   filters: [
                     { name: 'Emme Project file', extensions: ['emp'] },
                     { name: 'All Files', extensions: ['*'] }
                   ],
                   properties: ['openFile']
                 }).then((e)=>{
                   if (!e.canceled) {
                     updateScenario({...scenario, emme_project_file_path: e.filePaths[0]});
                   }
                 })
               }}
        />
      </div>

      {/* Number of first EMME-scenario ID (of 4) - NOTE: EMME-scenario is different from HELMET-scenario (ie. this config) */}
      <div className="Scenario__section">
        <label className="Scenario__pseudo-label"
               htmlFor="first-scenario-id">Liikenneverkon sis&auml;lt&auml;v&auml; Emme-skenaario</label>
        <input id="first-scenario-id"
               className="Scenario__number"
               type="number"
               min="1"
               max="999"
               step="1"
               value={scenario.first_scenario_id}
               onChange={(e) => {
                 updateScenario({...scenario, first_scenario_id: e.target.value});
               }}
        />
      </div>

      {/* Folder path to variable input data (input data with variables sent to EMME) */}
      <div className="Scenario__section">
        <span className="Scenario__pseudo-label">Sy&ouml;tt&ouml;tiedot</span>
        <label className="Scenario__pseudo-file-select" htmlFor="data-folder-select" title={scenario.forecast_data_folder_path}>
          {scenario.forecast_data_folder_path ? path.basename(scenario.forecast_data_folder_path) : "Valitse.."}
        </label>
        <input className="Scenario__hidden-input"
               id="data-folder-select"
               type="text"
               onClick={()=>{
                 dialog.showOpenDialog({
                   defaultPath: scenario.forecast_data_folder_path ? scenario.forecast_data_folder_path : projectPath,
                   properties: ['openDirectory']
                 }).then((e)=>{
                   if (!e.canceled) {
                     updateScenario({...scenario, forecast_data_folder_path: e.filePaths[0]});
                   }
                 })
               }}
        />
      </div>

      <div className="Scenario__section">
        {/* Number of iterations to run */}
        <label className="Scenario__pseudo-label"
               htmlFor="iterations">Iteraatioiden enimm&auml;ism&auml;&auml;r&auml;</label>
        <input id="iterations"
               className="Scenario__number Scenario__inline"
               type="number"
               min="1"
               max="99"
               step="1"
               disabled={scenario.end_assignment_only}
               value={scenario.iterations}
               onChange={(e) => {
                 updateScenario({...scenario, iterations: e.target.value});
               }}
        />

        {/* Choice whether to delete strategy files at the end of a model run */}
        <label className="Scenario__pseudo-label  Scenario__inline Scenario__pseudo-label--inline Scenario__pseudo-label--right"
               htmlFor="end-assignment-only">
          <input id="end-assignment-only"
                 type="checkbox"
                 checked={scenario.end_assignment_only}
                 onChange={(e) => {
                   updateScenario({...scenario, end_assignment_only: e.target.checked});
                 }}
          />
          <span>Aja vain loppusijoittelu</span>
        </label>
      </div>

      <div className="Scenario__section Scenario__title">
        Lisävalinnat
      </div>

      {/* Choice whether to use pre-calculated transit cost matrices (instead of calculating them mid-run) */}
      <div className="Scenario__section">
      <label className="Scenario__pseudo-label Scenario__pseudo-label--inline"
             htmlFor="fixed-transit-cost">
          <input id="fixed-transit-cost"
                 type="checkbox"
                 checked={scenario.use_fixed_transit_cost}
                 onChange={(e) => {
                   updateScenario({...scenario, use_fixed_transit_cost: !scenario.use_fixed_transit_cost});
                 }}
          />
        <span>K&auml;yt&auml; esilaskettua joukkoliikenteen kustannusmatriisia</span>
      </label>
      </div>

      {/* Choice whether to delete strategy files at the end of a model run */}
      <div className="Scenario__section">
      <label className="Scenario__pseudo-label Scenario__pseudo-label--inline"
             htmlFor="delete-strategy-files">
          <input id="delete-strategy-files"
                 type="checkbox"
                 /* If flag is not written to JSON (= null), box is checked (= true). */
                 checked={scenario.delete_strategy_files == true | scenario.delete_strategy_files == null}
                 onChange={(e) => {
                   updateScenario({...scenario, delete_strategy_files: e.target.checked});
                 }}
          />
        <span>Poista sijoittelun strategiatiedostot malliajon j&auml;lkeen</span>
      </label>
      </div>

      {/* Choice whether to save matrices in Emme */}
      <div className="Scenario__section">
      <label className="Scenario__pseudo-label Scenario__pseudo-label--inline"
             htmlFor="separate-emme-scenarios">
          <input id="separate-emme-scenarios"
                 type="checkbox"
                 /* If flag is not written to JSON (= null), box is unchecked (= false). */
                 checked={scenario.separate_emme_scenarios == true}
                 onChange={(e) => {
                   updateScenario({...scenario, separate_emme_scenarios: e.target.checked});
                 }}
          />
        <span>Tallenna ajanjaksot erillisiin Emme-skenaarioihin {parseInt(scenario.first_scenario_id) + 1}&ndash;{parseInt(scenario.first_scenario_id) + 4}</span>
      </label>
      </div>

      {/* Choice whether to save matrices in Emme */}
      <div className="Scenario__section">
      <label className="Scenario__pseudo-label Scenario__pseudo-label--inline"
             htmlFor="save-matrices-in-emme">
          <input id="save-matrices-in-emme"
                 type="checkbox"
                 /* If flag is not written to JSON (= null), box is unchecked (= false). */
                 checked={scenario.save_matrices_in_emme == true}
                 onChange={(e) => {
                   updateScenario({...scenario, save_matrices_in_emme: e.target.checked});
                 }}
          />
        <span>Tallenna ajanjaksojen matriisit Emme-projektin Database-kansioon</span>
      </label>

      {/* Number of first matrix ID */}
      <div className="Scenario__section Scenario__section--indentation">
        <label className="Scenario__pseudo-label"
               style={{color: scenario.save_matrices_in_emme == false ? "#666666" : "inherit"}}
               htmlFor="first-matrix-id">Matriisit tallennetaan numeroille</label>
        <input id="first-matrix-id"
               className="Scenario__number Scenario__inline"
               type="number"
               min="1"
               max="999"
               step="1"
               disabled={!scenario.save_matrices_in_emme}
               /* If value is not written to JSON (= null), write default value 100. */
               value={scenario.first_matrix_id == null ? 100 : scenario.first_matrix_id}
               onChange={(e) => {
                 updateScenario({...scenario, first_matrix_id: e.target.value});
               }}
        />
        <span style={{color: !scenario.save_matrices_in_emme ? "#666666" : "inherit"}}
              className=" Scenario__inline">&ndash;{parseInt(scenario.first_matrix_id == null ? 100 : scenario.first_matrix_id) + 299}</span>
      </div>

      {/* Choice whether to delete strategy files at the end of a model run */}
      <div className="Scenario__section">
      <label className="Scenario__pseudo-label Scenario__pseudo-label--inline">
          <input id="open-project-override-settings"
                 type="checkbox"
                 checked={scenario.overrideProjectSettingsForScenario}
                 onChange={(e) => {
                   updateScenario({...scenario, overrideProjectSettingsForScenario: e.target.checked});
                 }}
          />
        <span>Yliaja projektiasetuksia</span>
      </label>
      </div>
      {
        scenario.overrideProjectSettingsForScenario && 
          <div className="Scenario__section">
          <label className="Scenario__pseudo-label Scenario__pseudo-label--inline project-override-setting">
          <span>EMME Python path</span>
          <label className="Settings__pseudo-file-select override-file-select-input" htmlFor="hidden-input-helmet-scripts-path" title={'Emme python path'}>
              {scenario.overriddenProjectSettings.emmePythonPath ? scenario.overriddenProjectSettings.emmePythonPath : inheritedGlobalProjectSettings.emmePythonPath}
            </label>
              <input id="override-emme-python-path"
                    type="text"
                    hidden={true}
                    placeholder={inheritedGlobalProjectSettings.emmePythonPath}
                    onClick={()=>{
                      dialog.showOpenDialog({
                        defaultPath: scenario.overriddenProjectSettings.emmePythonPath ? scenario.overriddenProjectSettings.emmePythonPath : inheritedGlobalProjectSettings.emmePythonPath,
                        properties: ['openDirectory']
                      }).then((e)=>{
                        if (!e.canceled) {
                          updateScenario({...scenario, overriddenProjectSettings: {...overriddenProjectSettings, emmePythonPath: e.filePaths[0]} });
                        }
                      })
                    }}
              />
          </label>
          </div>
      }
      </div>
    </div>
  )
};
