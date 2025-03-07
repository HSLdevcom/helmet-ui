import React from 'react';
import path from "path";
const {dialog} = require('@electron/remote');

const CostBenefitAnalysis = ({
  resultsPath, cbaOptions, setCbaOptions, runCbaScript
}) => {
  return (
    <div className="CBA">
      <div className="CBA__heading">Hy&ouml;ty-kustannusanalyysi</div>
      <div className="CBA_instructions-container">
        <p>Hyöty-kustannusanalyysiä varten syötetään vertailuvaihtoehdon (ve0) ja hankevaihtoehdon (ve1) tuloskansio (Tulosten tallennuspolku\Skenaarion nimi).
           Jos ennusteita on ajettu kahdelle vuodelle (esim. 2040 ja 2060), vertailuvaihtoehto ja hankevaihtoehto on mahdollista määrittää kahdelle ennustevuodelle.
           Tulokset tulostuvat Excel-tiedostoon tuloskansiossa.</p>
      </div>
      <table className="CBA__choices">
        <tbody>
          <tr>
            {/* Baseline scenario results folder */}
            <td>
              <span className="CBA__pseudo-label">Vertailuvaihtoehto</span>
              <label className="CBA__pseudo-file-select" htmlFor="baseline-scenario-results-folder-select" title={cbaOptions.baseline_scenario_path}>
                {cbaOptions.baseline_scenario_path ? path.basename(cbaOptions.baseline_scenario_path) : "Valitse.."}
              </label>
              <input className="CBA__hidden-input"
                     id="baseline-scenario-results-folder-select"
                     type="text"
                     onClick={()=>{
                       dialog.showOpenDialog({
                         defaultPath: resultsPath,
                         properties: ['openDirectory']
                       }).then((e)=>{
                         if (!e.canceled) {
                           const target_path = e.filePaths[0];
                           setCbaOptions(prevOptions => {
                             return {...prevOptions, baseline_scenario_path: target_path};
                           });
                         }
                       })
                     }}
              />
            </td>
            {/* Projected scenario results folder */}
            <td>
              <span className="CBA__pseudo-label">Hankevaihtoehto</span>
              <label className="CBA__pseudo-file-select" htmlFor="projected-scenario-results-folder-select" title={cbaOptions.projected_scenario_path}>
                {cbaOptions.projected_scenario_path ? path.basename(cbaOptions.projected_scenario_path) : "Valitse.."}
              </label>
              <input className="CBA__hidden-input"
                     id="projected-scenario-results-folder-select"
                     type="text"
                     onClick={()=>{
                       dialog.showOpenDialog({
                        defaultPath: resultsPath,
                         properties: ['openDirectory']
                       }).then((e)=>{
                         if (!e.canceled) {
                           const target_path = e.filePaths[0];
                           setCbaOptions(prevOptions => {
                             return {...prevOptions, projected_scenario_path: target_path};
                           });
                         }
                       })
                     }}
              />
            </td>
          </tr>
          <tr>
            {/* Baseline scenario 2 results folder */}
            <td>
              <span className="CBA__pseudo-label">Vertailuvaihtoehto vuosi 2 (valinnainen)</span>
              <label className="CBA__pseudo-file-select" htmlFor="baseline-scenario-2-results-folder-select" title={cbaOptions.baseline_scenario_2_path}>
                {cbaOptions.baseline_scenario_2_path ? path.basename(cbaOptions.baseline_scenario_2_path) : "Valitse.."}
              </label>
              <input className="CBA__hidden-input"
                     id="baseline-scenario-2-results-folder-select"
                     type="text"
                     onClick={()=>{
                       dialog.showOpenDialog({
                        defaultPath: resultsPath,
                         properties: ['openDirectory']
                       }).then((e)=>{
                         if (!e.canceled) {
                           const target_path = e.filePaths[0];
                           setCbaOptions(prevOptions => {
                             return {...prevOptions, baseline_scenario_2_path: target_path};
                           });
                         }
                       })
                     }}
              />
            </td>
            {/* Projected scenario 2 results folder */}
            <td>
              <span className="CBA__pseudo-label">Hankevaihtoehto vuosi 2 (valinnainen)</span>
              <label className="CBA__pseudo-file-select" htmlFor="projected-scenario-2-results-folder-select" title={cbaOptions.projected_scenario_2_path}>
                {cbaOptions.projected_scenario_2_path ? path.basename(cbaOptions.projected_scenario_2_path) : "Valitse.."}
              </label>
              <input className="CBA__hidden-input"
                     id="projected-scenario-2-results-folder-select"
                     type="text"
                     onClick={()=>{
                       dialog.showOpenDialog({
                        defaultPath: resultsPath,
                         properties: ['openDirectory']
                       }).then((e)=>{
                         if (!e.canceled) {
                           const target_path = e.filePaths[0];
                           setCbaOptions(prevOptions => {
                             return {...prevOptions, projected_scenario_2_path: target_path};
                           });
                         }
                       })
                     }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="CBA__run">
        <button onClick={(e) => {runCbaScript()}}>Aja hy&ouml;ty-kustannusanalyysi</button>
      </div>
    </div>
  );
};
