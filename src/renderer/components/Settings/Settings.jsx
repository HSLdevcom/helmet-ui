import React from 'react';
import path from "path";
const {dialog} = require('@electron/remote');
import versions from '../versions';
import { listEMMEPythonPaths } from './search_emme_pythonpath';
import classNames from 'classnames';

const EnvironmentOption = ({
  envPath, isSelected, setPath, removePath,
}) => {
  return (
    <div className="Settings__environment_option">
      <p>{envPath}</p>
      <button className={classNames('Settings__env_option_btn', { 'Settings__env_btn_disabled': isSelected})} disabled={isSelected} onClick={() => setPath(envPath)}>{isSelected ? 'Käytössä' : 'Valitse'}</button>
      <button className="Settings__env_option_btn" onClick={() => removePath(envPath)}>Poista</button>
    </div>
  )
}

const PathOptionDivider = () => <div className='Settings__env_option_divider' />

const Settings = ({
  emmePythonPath, emmePythonEnvs, setEMMEPythonPath, setEMMEPythonEnvs, addToEMMEPythonEnvs, removeFromEMMEPythonEnvs,
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
          <span className="Settings__pseudo-label">Käytettävät Python-ympäristöt:</span>
          { emmePythonEnvs.map((env, index) => { return (
            <div>
              <EnvironmentOption envPath={env} isSelected={emmePythonPath === env}
             setPath={setEMMEPythonPath} 
             removePath={removeFromEMMEPythonEnvs}/>
             { index < emmePythonEnvs.length && <PathOptionDivider/> }
            </div>)})}
        <button className="Settings__input-btn"
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
                        addToEMMEPythonEnvs(e.filePaths[0]);
                      }
                    })
                  }}
          >
            Lisää Python-ympäristö
          </button>
        <button className="Settings__input-btn"
                  onClick={(e) => {
                    const [found, pythonPaths] = listEMMEPythonPaths();
                    if (found) {
                      alert(`Python-ympäristöjä löytyi. Valitse listasta oikea EMME Python-ympäristö ja ota sen jälkeen käyttöön ${pythonPaths}`)
                      setEMMEPythonEnvs(pythonPaths);
                    } else {
                      alert(`Emme ${versions.emme_system} ja Python ${versions.emme_python} eivät löytyneet oletetusta sijainnista.\n\nSyötä Pythonin polku manuaalisesti.`);
                    }}}
          >
            Etsi Python-ympäristöjä
          </button>
        </div>
        <br/>
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
                     defaultPath: projectPath ? projectPath : homedir,
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
