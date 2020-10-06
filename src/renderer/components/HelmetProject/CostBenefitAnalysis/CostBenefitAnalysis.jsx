import React from 'react';
import path from "path";

const CostBenefitAnalysis = ({
  cbaOptions, setCbaOptions, runCbaScript
}) => {
  return (
    <div className="CBA">
      <div className="CBA__heading">Hy&ouml;ty-kustannus-analyysi</div>
      <table className="CBA__choices">
        <tr>
            {/* Baseline scenario results folder */}
            <td>
              <span className="CBA__pseudo-label">Vertailuvaihtoehto</span>
              <label className="CBA__pseudo-file-select" htmlFor="baseline-scenario-results-folder-select">
                {cbaOptions.baseline_scenario_path ? path.basename(cbaOptions.baseline_scenario_path) : "Valitse.."}
              </label>
              <input className="CBA__hidden-input"
                     id="baseline-scenario-results-folder-select"
                     type="file"
                     directory=""
                     webkitdirectory=""
                     onChange={(e) => {
                       const target_path = e.target.files[0].path;
                       setCbaOptions(prevOptions => {
                         return {...prevOptions, baseline_scenario_path: target_path};
                       });
                     }}
              />
            </td>
            {/* Projected scenario results folder */}
            <td>
              <span className="CBA__pseudo-label">Hankevaihtoehto</span>
              <label className="CBA__pseudo-file-select" htmlFor="projected-scenario-results-folder-select">
                {cbaOptions.projected_scenario_path ? path.basename(cbaOptions.projected_scenario_path) : "Valitse.."}
              </label>
              <input className="CBA__hidden-input"
                     id="projected-scenario-results-folder-select"
                     type="file"
                     directory=""
                     webkitdirectory=""
                     onChange={(e) => {
                       const target_path = e.target.files[0].path;
                       setCbaOptions(prevOptions => {
                         return {...prevOptions, projected_scenario_path: target_path};
                       });
                     }}
              />
            </td>
        </tr>
        <tr>
            {/* Baseline scenario 2 results folder */}
            <td>
              <span className="CBA__pseudo-label">Vertailuvaihtoehto vuosi 2 (valinnainen)</span>
              <label className="CBA__pseudo-file-select" htmlFor="baseline-scenario-2-results-folder-select">
                {cbaOptions.baseline_scenario_2_path ? path.basename(cbaOptions.baseline_scenario_2_path) : "Valitse.."}
              </label>
              <input className="CBA__hidden-input"
                     id="baseline-scenario-2-results-folder-select"
                     type="file"
                     directory=""
                     webkitdirectory=""
                     onChange={(e) => {
                       const target_path = e.target.files[0].path;
                       setCbaOptions(prevOptions => {
                         return {...prevOptions, baseline_scenario_2_path: target_path};
                       });
                     }}
              />
            </td>
            {/* Projected scenario 2 results folder */}
            <td>
              <span className="CBA__pseudo-label">Hankevaihtoehto vuosi 2 (valinnainen)</span>
              <label className="CBA__pseudo-file-select" htmlFor="projected-scenario-2-results-folder-select">
                {cbaOptions.projected_scenario_2_path ? path.basename(cbaOptions.projected_scenario_2_path) : "Valitse.."}
              </label>
              <input className="CBA__hidden-input"
                     id="projected-scenario-2-results-folder-select"
                     type="file"
                     directory=""
                     webkitdirectory=""
                     onChange={(e) => {
                       const target_path = e.target.files[0].path;
                       setCbaOptions(prevOptions => {
                         return {...prevOptions, projected_scenario_2_path: target_path};
                       });
                     }}
              />
            </td>
        </tr>
      </table>
      <div className="CBA__run">
        <button onClick={(e) => {runCbaScript()}}>Aja H/K analyysi</button>
      </div>
    </div>
  );
};
