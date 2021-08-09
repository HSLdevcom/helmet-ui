import React from 'react';
import path from "path";
const {dialog} = require('@electron/remote');

const Settings = ({
  emmePythonPath, setEMMEPythonPath,
  helmetScriptsPath, setHelmetScriptsPath, dlHelmetScriptsVersion, isDownloadingHelmetScripts,
  projectPath, setProjectPath,
  basedataPath, setBasedataPath,
  resultsPath, setResultsPath,
  closeSettings,
  promptModelSystemDownload,
}) => {
  return (
    <div className="Settings">

      <div className="Settings__overlay">{/* Dark background overlay */}</div>

      <div className="Settings__dialog">
        <button className="Settings__dialog-controls" onClick={(e) => closeSettings()}>
            X
        </button>
        <div className="Settings__dialog-heading">Projektin asetukset</div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">EMME Python (v2.7)</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-emme-python-path" title={emmePythonPath}>
            {emmePythonPath ? path.basename(emmePythonPath) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
                 id="hidden-input-emme-python-path"
                 type="file"
                 accept=".exe"
                 onChange={(e) => setEMMEPythonPath(e.target.files[0].path)}
          />
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">HELMET model-system</span>
          {isDownloadingHelmetScripts ?
            <span className="Settings__pseudo-file-select">
              Downloading model-system {dlHelmetScriptsVersion === 'master' ? 'latest' : dlHelmetScriptsVersion}. . .
            </span>
            :
            <label className="Settings__pseudo-file-select" htmlFor="hidden-input-helmet-scripts-path" title={helmetScriptsPath}>
              {helmetScriptsPath ? path.basename(helmetScriptsPath) : "Valitse.."}
            </label>
          }
          <input className="Settings__hidden-input"
                 id="hidden-input-helmet-scripts-path"
                 type="text"
                 onClick={()=>{
                   dialog.showOpenDialog({
                     properties: ['openDirectory']
                   }).then((e)=>{
                     if (!e.canceled) {
                       setHelmetScriptsPath(e.filePaths[0], emmePythonPath);
                     }
                   })
                 }}
          />
          <button className="Settings__beside-input-btn"
                  onClick={(e) => {promptModelSystemDownload()}}
          >
            Lataa eri versio (vaatii internet-yhteyden {'\u{0001F4F6}'})
          </button>
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">Projektin kansiopolku (oletusarvoisesti kotihakemistosi)</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-project-path" title={projectPath}>
            {projectPath ? path.basename(projectPath) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
                 id="hidden-input-project-path"
                 type="text"
                 onClick={()=>{
                   dialog.showOpenDialog({
                     properties: ['openDirectory']
                   }).then((e)=>{
                     if (!e.canceled) {
                       setProjectPath(e.filePaths[0]);
                     }
                   })
                 }}
          />
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">L&auml;ht&ouml;datan sis&auml;lt&auml;v&auml; kansio</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-basedata-path" title={basedataPath}>
            {basedataPath ? path.basename(basedataPath) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
                 id="hidden-input-basedata-path"
                 type="text"
                 onClick={()=>{
                   dialog.showOpenDialog({
                     properties: ['openDirectory']
                   }).then((e)=>{
                     if (!e.canceled) {
                       setBasedataPath(e.filePaths[0]);
                     }
                   })
                 }}
          />
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">Tulosten tallennuspolku</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-results-path" title={resultsPath}>
            {resultsPath ? path.basename(resultsPath) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
                 id="hidden-input-results-path"
                 type="text"
                 onClick={()=>{
                   dialog.showOpenDialog({
                     properties: ['openDirectory']
                   }).then((e)=>{
                     if (!e.canceled) {
                       setResultsPath(e.filePaths[0]);
                     }
                   })
                 }}
          />
        </div>
      </div>

    </div>
  )
};
