import React, { useState } from 'react';
import path from "path";
const {dialog} = require('@electron/remote');
const versions = require('../versions');
import { listEMMEPythonPaths } from './search_emme_pythonpath';
import classNames from 'classnames';

const EnvironmentOption = ({
  envPath, isSelected, setPath, removePath,
}) => {
  return (
    <div className="Settings__environment_option">
      <p className='Settings__env_option_text'>{envPath}</p>
      <button className={classNames('Settings__env_option_btn', { 'Settings__btn_disabled': isSelected})} disabled={isSelected} onClick={() => setPath(envPath)}>{isSelected ? 'Käytössä' : 'Valitse'}</button>
      <button className={classNames('Settings__env_option_btn', 'Settings__env_option_remove')} onClick={() => removePath(envPath)}>Poista</button>
    </div>
  )
}

const EmmeVersionEdit = ({
  emmeVersion, setEmmeVersion, closeEditing
}) => {

  const [savingDisabled, setSavingDisabled] = useState(true);
  const [newEmmeVersion, setNewEmmeVersion] = useState('');
  const VERSION_NUMBER_REGEX = RegExp(/^(\d+\.)?(\d+\.)?(\*|\d+)$/);
  const validateVersionNumber = (e) => {
    const regExpResults = e.target.value.match(VERSION_NUMBER_REGEX);
    return regExpResults !== null;
  }

  return (
    <div className='Settings__emme_input'>
      <span className="Settings__pseudo-label">Syötä uusi EMME versio: </span>
      <input type='text' defaultValue={emmeVersion} placeholder='esim. 4.5.0' onChange={(e) => {
        
        setNewEmmeVersion(e.target.value);
        const validationPasses = validateVersionNumber(e);
        setSavingDisabled(!validationPasses);
      }}></input>
      <button className={classNames('Settings__emme_edit_save_btn', { 'Settings__btn_disabled': savingDisabled})}
       disabled={savingDisabled} 
       onClick={() => {
          closeEditing();
          setEmmeVersion(newEmmeVersion);
        }}>
        Tallenna
      </button>
    </div>
  )
};

const PathOptionDivider = () => <div className='Settings__env_option_divider' />

const Settings = ({
  emmePythonPath, emmePythonEnvs, setEMMEPythonPath, setEMMEPythonEnvs, addToEMMEPythonEnvs, removeFromEMMEPythonEnvs,
  helmetScriptsPath, setHelmetScriptsPath, dlHelmetScriptsVersion, isDownloadingHelmetScripts,
  projectPath, setProjectPath,
  basedataPath, setBasedataPath,
  resultsPath, setResultsPath,
  closeSettings,
  promptModelSystemDownload, emmeVersion, setEmmeVersion,
}) => {

  const [showEmmeDialog, setShowEmmeDialog] = useState(false);

  return (
    <div className="Settings">

      <div className="Settings__overlay" onClick={(e) => closeSettings()}>{/* Dark background overlay */}</div>

      <div className="Settings__dialog">

        <div className="Settings__dialog-controls" onClick={(e) => closeSettings()}></div>

        <div className="Settings__dialog-heading">Projektin asetukset</div>

        <div className="Settings__emme_version_group">
        <span className="Settings__pseudo-label">{`EMME-versio: ${emmeVersion}`}</span>
        <button className='Settings__emme_edit_btn'
          onClick={() => {
            setShowEmmeDialog(!showEmmeDialog);
          }}
        >
          {showEmmeDialog ? 'Peruuta' : 'Muokkaa'}
        </button>
        </div>
        { showEmmeDialog && <EmmeVersionEdit emmeVersion={emmeVersion}
         setEmmeVersion={setEmmeVersion}
         closeEditing={() => setShowEmmeDialog(false)} /> }
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">Käytettävät Python-ympäristöt:</span>
          { emmePythonEnvs && (emmePythonEnvs.map((env, index) => { return (
            <div>
              <EnvironmentOption envPath={env} isSelected={emmePythonPath === env}
             setPath={setEMMEPythonPath} 
             removePath={removeFromEMMEPythonEnvs}/>
             { index < emmePythonEnvs.length && <PathOptionDivider/> }
            </div>)}))}
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
                    const [found, pythonPaths] = listEMMEPythonPaths(emmeVersion);
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
