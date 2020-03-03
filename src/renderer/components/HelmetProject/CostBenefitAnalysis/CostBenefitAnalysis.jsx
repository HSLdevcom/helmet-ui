import React from 'react';
import path from "path";

const CostBenefitAnalysis = ({
  cbaOptions, setCbaOptions, runCbaScript
}) => {
  return (
    <div className="CBA">
      <div className="CBA__heading">Hy&ouml;ty-kustannus-analyysi</div>
      <div>
        {/* Baseline scenario results folder */}
        <div>
          <span className="CBA__pseudo-label">L&auml;ht&ouml;skenaario</span>
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
        </div>
      </div>
      <div>
        {/* Projected scenario results folder */}
        <div>
          <span className="CBA__pseudo-label">Projektoitu skenaario</span>
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
        </div>
      </div>
      <div>
        {/* Evaluation year, 1 or 2 */}
        <p className="CBA__radio-label">Evaluointivuosi</p>
        <label>
          1
          <input type="radio"
                 name="evaluation-year"
                 value="1"
                 checked={cbaOptions.evaluation_year ? cbaOptions.evaluation_year === 1 : false}
                 onChange={(e) => {
                   setCbaOptions(prevOptions => {
                     return {...prevOptions, evaluation_year: 1};
                   });
                 }}
          />
        </label>
        <label>
          2
          <input type="radio"
                 name="evaluation-year"
                 value="2"
                 checked={cbaOptions.evaluation_year ? cbaOptions.evaluation_year === 2 : false}
                 onChange={(e) => {
                   setCbaOptions(prevOptions => {
                     return {...prevOptions, evaluation_year: 2};
                   });
                 }}
          />
        </label>
      </div>
      <div>
        <button onClick={(e) => {runCbaScript()}}>Aja H/K analyysi</button>
      </div>
    </div>
  );
};
