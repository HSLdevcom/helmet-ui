import React, { useState } from 'react';
import path from "path";
const {dialog} = require('@electron/remote');
const versions = require('../versions');
import { listEMMEPythonPaths } from './search_emme_pythonpath';
import classNames from 'classnames';

const EnvironmentOption = ({
  envPath, isSelected, setPath, removePath,
}) => {

  //Splits the env using OS-spesific delimiter / or \ and then filters out every other substring except the Emme version folder name.
  const emmeVersionName = envPath.split(path.sep).filter((subStr) => subStr.startsWith('Emme-'));

  return (
    <div className="Settings__environment_option" key={envPath}>
      <p className={classNames('Settings__env_option_text', { 'Settings__env_unselected': !isSelected})} onClick={() => setPath(envPath)}>{Array.isArray(emmeVersionName) ? emmeVersionName.toString() : envPath}</p>
      <button className={classNames('Settings__env_option_btn', 'Settings__env_option_remove')} onClick={() => removePath(envPath)}>x</button>
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
          <span className="Settings__pseudo-label">{ emmePythonEnvs.length > 0 ? "Käytettävät Python-ympäristöt:" : "Ei python-ympäristöjä käytettävissä."}</span>
          { Array.isArray(emmePythonEnvs) && emmePythonEnvs.length > 0 && (emmePythonEnvs.map((env, index) => { return (
            <div key={index}>
              <EnvironmentOption envPath={env} isSelected={emmePythonPath === env}
             setPath={setEMMEPythonPath}
             removePath={removeFromEMMEPythonEnvs}/>
             { index < emmePythonEnvs.length && <PathOptionDivider/> }
            </div>)}))}
          { emmePythonEnvs.length === 0 &&
          (<div className="Settings__environment_option_spacer"/>)
          }
        <button className="Settings__python-env-input-btn"
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
        <button className="Settings__python-env-input-btn"
                  onClick={(e) => {
                    const [found, pythonPaths] = listEMMEPythonPaths();
                    if (found) {
                      alert(`Python-ympäristöjä löytyi. Valitse listasta haluamasi EMME Python-ympäristö ja ota se käyttöön`);
                      console.log(pythonPaths);
                      setEMMEPythonEnvs(pythonPaths);
                    } else {
                      alert(`Python-asennukset ${versions.emme_major_versions.toString()} eivät löytyneet oletetusta sijainnista.\n\nLisää Python-asennus manuaalisesti.`);
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
