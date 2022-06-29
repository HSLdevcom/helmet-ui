import React from 'react';
import path from "path";
const {dialog} = require('@electron/remote');
import {searchEMMEPython} from './search_emme_pythonpath';
import versions from '../versions';

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

      <div className="Settings__overlay" onClick={(e) => closeSettings()}>{/* Dark background overlay */}</div>

      <div className="Settings__dialog">

        <div className="Settings__dialog-controls" onClick={(e) => closeSettings()}></div>

        <div className="Settings__dialog-heading">Projektin asetukset</div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">Emme Python v3.7</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-emme-python-path" title={emmePythonPath}>
            {emmePythonPath ? path.basename(emmePythonPath) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
                 id="hidden-input-emme-python-path"
                 type="text"
                 onClick={()=>{
                   dialog.showOpenDialog({
                     defaultPath: emmePythonPath ? emmePythonPath : path.resolve('/'),
                     filters: [
                       { name: 'Executable', extensions: ['exe'] },
                       { name: 'All Files', extensions: ['*'] }
                     ],
                     properties: ['openFile']
                   }).then((e)=>{
                     if (!e.canceled) {
                       setEMMEPythonPath(e.filePaths[0]);
                     }
                   })
                 }}
          />
        <button className="Settings__input-btn"
                  onClick={(e) => {
                    const [found, pythonPath] = searchEMMEPython();
                    if (found) {
                      if (confirm(`Python ${versions.emme_python} löytyi sijainnista:\n\n${pythonPath}\n\nHaluatko käyttää tätä sijaintia?`)) {
                        setEMMEPythonPath(pythonPath);
                      }
                    } else {
                      alert(`Emme ${versions.emme_system} ja Python ${versions.emme_python} eivät löytyneet oletetusta sijainnista.\n\nSyötä Pythonin polku manuaalisesti.`);
                    }}}
          >
            Hae Python automaattisesti
          </button>
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">Helmet-model-system</span>
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
                     defaultPath: helmetScriptsPath ? helmetScriptsPath : projectPath,
                     properties: ['openDirectory']
                   }).then((e)=>{
                     if (!e.canceled) {
                       setHelmetScriptsPath(e.filePaths[0], emmePythonPath);
                     }
                   })
                 }}
          />
          <button className="Settings__input-btn"
                  onClick={(e) => {promptModelSystemDownload()}}
          >
            Lataa eri versio internetist&auml;
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
                     defaultPath: projectPath ? projectPath : path.resolve('/'),
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
                     defaultPath: basedataPath ? basedataPath : projectPath,
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
                     defaultPath: resultsPath ? resultsPath : projectPath,
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
