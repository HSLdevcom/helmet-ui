import React, { useState } from 'react';
import classNames from 'classnames';
import { ArrowRight } from '../../icons';
import { useHelmetModelContext } from '../../context/HelmetModelContext';

const path = window.electronAPI.path;
const os = window.electronAPI.os;
const homedir = os.homedir();
const dialog = window.electronAPI.dialog;
const { exec } = window.electronAPI.child_process;

const EnvironmentOption = ({ envPath, isSelected, setPath, removePath }) => {  
  const emmeVersionName = envPath.split(path.sep).filter((subStr) => subStr.startsWith('Emme-') || subStr.startsWith('EMME'))

  // Function to set the EMMEPATH environment variable
  const setEmmePathEnvVariable = async (emmePath) => {
    if (!emmePath) {
      console.error("Invalid path provided for EMMEPATH.")
      return
    }

    const command = `setx EMMEPATH "${emmePath}"`;

    try {
      const result = await exec(command)
      console.log(`EMMEPATH set to: ${emmePath}`)
      console.log(result)
    } catch (error) {
      console.error(`Error setting EMMEPATH: ${error}`)
    }
  }

  // Extract the Emme folder path (parent directory of the Python executable)
  const emmeFolderPath = path.dirname(path.dirname(envPath))

  return (
    <div className="Settings__environment_option" key={envPath}>
      <span className={classNames("Settings__env_selected_logo", { 'Settings__logo_hidden': !isSelected })}><ArrowRight /></span>
      <p
        className={classNames('Settings__env_option_text', { 'Settings__env_unselected': !isSelected })}
        onClick={async () => {
          setPath(envPath) // Select the Python path
          await setEmmePathEnvVariable(emmeFolderPath); // Set the EMMEPATH variable
        }}
      >
        {Array.isArray(emmeVersionName) ? emmeVersionName.toString() : envPath}
      </p>
      <button
        className={classNames('Settings__env_option_btn', 'Settings__env_option_remove')}
        onClick={() => removePath(envPath)}
      >
        x
      </button>
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
  isSettingEnv,
  closeSettings,
  promptModelSystemDownload,
  listEMMEPythonPaths,
  getHelmetModelSystemVersion,
  downloadProgress,
  cancelDownload,
}) => {
  const { setHelmetModelSystemVersion } = useHelmetModelContext();

  const handleSetHelmetScriptsPath = async (newPath) => {
    await setHelmetScriptsPath(newPath);
    const helmetVersion = await getHelmetModelSystemVersion(newPath);
    setHelmetModelSystemVersion(helmetVersion ? helmetVersion.substring(1) : undefined);
  };

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
          { emmePythonEnvs.length === 1 &&
          (<div className="Settings__environment_option_spacer"/>)
          }
          {
            emmePythonEnvs.length === 0 &&
            (<div>
                <div className="Settings__environment_option_spacer"/>
                <div className="Settings__environment_option_spacer"/>
              </div>)
          }
        <button className="Settings__python-env-input-btn"
                  onClick={()=>{
                    dialog.showOpenDialog({
                      defaultPath: emmePythonPath ? emmePythonPath : path.join('/'), // Replace path.resolve with path.join
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
                  onClick={async () => { // Make the handler asynchronous
                    try {
                      console.log("Searching for EMME Python paths...");
                      const result = await listEMMEPythonPaths(); // Await the Promise
                      if (!result || !Array.isArray(result) || result.length !== 2) {
                        throw new Error("Invalid response from listEMMEPythonPaths");
                      }

                      const [found, pythonPaths] = result;
                      if (found && Array.isArray(pythonPaths) && pythonPaths.length > 0) {
                        alert(`Python-ympäristöjä löytyi. Valitse listasta haluamasi EMME Python-ympäristö ja ota se käyttöön`);
                        console.log("Found Python paths:", pythonPaths);
                        setEMMEPythonEnvs(pythonPaths);
                      } else {
                        alert(`Python-asennusta ei löytynyt oletetusta sijainnista.\n\nLisää Python-asennus manuaalisesti.`);
                        console.warn("No Python paths found.");
                      }
                    } catch (error) {
                      console.error("Error listing EMME Python paths:", error);
                      alert(`Tapahtui virhe Python-ympäristöjen etsimisessä. Tarkista lokitiedot.`);
                    }
                  }}
          >
            Etsi Python-ympäristöjä
          </button>
        </div>
        <br/>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">Helmet-model-system</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-helmet-scripts-path" title={helmetScriptsPath || "Path not set"}>
            {helmetScriptsPath ? path.basename(helmetScriptsPath) : "Valitse.."}
          </label>
          <input
            className="Settings__hidden-input"
            id="hidden-input-helmet-scripts-path"
            type="text"
            onClick={() => {
              dialog.showOpenDialog({
                defaultPath: helmetScriptsPath || projectPath,
                properties: ['openDirectory'],
              }).then((e) => {
                if (!e.canceled) {
                  handleSetHelmetScriptsPath(e.filePaths[0]);
                }
              });
            }}
          />
          {downloadProgress !== null ? (
            <div className="Settings__download-progress">
              <progress value={downloadProgress} max="100"></progress>
              <button onClick={() => {
                console.log('Cancel button clicked');
                cancelDownload();
              }}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="Settings__input-btn" onClick={(e) => {
              console.log('Prompting user to select model-system version for download');
              promptModelSystemDownload();
            }}>
              Lataa eri versio internetist&auml;
            </button>
          )}
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label">Projektin kansiopolku (oletusarvoisesti kotihakemistosi)</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-project-path" title={projectPath}>
            {projectPath ? path.basename(projectPath) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
                 id="hidden-input-project-path"
                 type="text"
                 onClick={() => {
                   dialog.showOpenDialog({
                     defaultPath: projectPath ? projectPath : homedir,
                     properties: ['openDirectory']
                   }).then((e) => {
                     if (!e.canceled) {
                       console.log(`Setting projectPath to: ${e.filePaths[0]}`);
                       setProjectPath(e.filePaths[0]);
                     } else {
                       console.log("Project path selection was canceled.");
                     }
                   }).catch((error) => {
                     console.error("Error selecting project path:", error);
                   });
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
        {isSettingEnv && <div className="Settings__waiting-overlay"></div>}
      </div>

    </div>
  )
};

export default Settings;