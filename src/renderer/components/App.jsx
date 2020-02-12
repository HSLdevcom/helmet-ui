import React, {useState, useEffect, useRef} from 'react';
import Store from 'electron-store';

const homedir = require('os').homedir();
const {ipcRenderer} = require('electron');
const {execSync} = require('child_process');
const path = require('path');

const App = ({helmetUIVersion, versions, searchEMMEPython}) => {

  // Global settings
  const [isSettingsOpen, setSettingsOpen] = useState(false); // whether Settings -dialog is open
  const [isProjectRunning, setProjectRunning] = useState(false); // whether currently selected Project is running
  const [emmePythonPath, setEmmePythonPath] = useState(undefined); // file path to EMME python executable
  const [helmetScriptsPath, setHelmetScriptsPath] = useState(undefined); // folder path to HELMET model system scripts
  const [projectPath, setProjectPath] = useState(undefined); // folder path to scenario configs, default homedir
  const [isDownloadingHelmetScripts, setDownloadingHelmetScripts] = useState(false); // whether downloading "/Scripts" is in progress

  // Global settings store contains "emme_python_path", "helmet_scripts_path", and "project_path".
  const globalSettingsStore = useRef(new Store());

  const _setEMMEPythonPath = (newPath) => {
    setEmmePythonPath(newPath);
    globalSettingsStore.current.set('emme_python_path', newPath);
  };

  const _setHelmetScriptsPath = (newPath) => {
    try {
      execSync(`"${path.join(path.dirname(emmePythonPath), "Scripts", "pip.exe")}" install --user -r "${path.join(newPath, "requirements.txt")}"`);
    } catch (e) {
      console.log("No requirements file found for HELMET Scripts. Some functionality may not work properly.");
    }
    setHelmetScriptsPath(newPath);
    globalSettingsStore.current.set('helmet_scripts_path', newPath);
  };

  const _setProjectPath = (newPath) => {
    setProjectPath(newPath);
    globalSettingsStore.current.set('project_path', newPath);
  };

  // Electron IPC event listeners
  const onDownloadReady = (event, savePath) => {
    _setHelmetScriptsPath(savePath);
    setDownloadingHelmetScripts(false);
  };

  useEffect(() => {
    // Attach Electron IPC event listeners (to worker => UI events)
    ipcRenderer.on('download-ready', onDownloadReady);

    // Search for EMME's Python if not set in global store (default win path is %APPDATA%, should remain there [hidden from user])
    if (!globalSettingsStore.current.get('emme_python_path')) {
      const [found, pythonPath] = searchEMMEPython();
      if (found) {
        if (confirm(`Python ${versions.emme_python} löytyi sijainnista:\n\n${pythonPath}\n\nHaluatko käyttää tätä sijaintia?`)) {
          globalSettingsStore.current.set('emme_python_path', pythonPath);
        }
      } else {
        alert(`Emme ${versions.emme_system} ja Python ${versions.emme_python} eivät löytyneet oletetusta sijainnista.\n\nMääritä Pythonin sijainti Asetukset-dialogissa.`);
      }
    }
    // Copy existing global store values to state. Remember: state updates async so refer to existing.
    const existingEmmePythonPath = globalSettingsStore.current.get('emme_python_path');
    const existingHelmetScriptsPath = globalSettingsStore.current.get('helmet_scripts_path');
    const existingProjectPath = globalSettingsStore.current.get('project_path');
    setEmmePythonPath(existingEmmePythonPath);
    setHelmetScriptsPath(existingHelmetScriptsPath);
    setProjectPath(existingProjectPath);

    // If project path is the initial (un-set), set it to homedir. Remember: state updates async so refer to existing.
    if (!existingProjectPath) {
      _setProjectPath(homedir);
    }

    // If HELMET Scripts is the initial (un-set), download latest version and use that. Remember: state updates async so refer to existing.
    if (!existingHelmetScriptsPath) {
      const now = new Date();
      setDownloadingHelmetScripts(true);
      ipcRenderer.send(
        'message-from-ui-to-download-helmet-scripts',
        {
          url: "https://github.com/HSLdevcom/helmet-model-system/archive/master.zip",
          destinationDir: homedir,
          postfix: `${('00'+now.getDate()).slice(-2)}_${('00'+now.getMonth()).slice(-2)}_${now.getFullYear()}`, // DD_MM_YYYY
        }
      );
    }

    return () => {
      // Detach Electron IPC event listeners
      ipcRenderer.removeListener('download-ready', onDownloadReady);
    }
  }, []);

  return (
    <div className={"App" + (isProjectRunning ? " App--busy" : "")}>

      {/* Pop-up global settings dialog with overlay behind it */}
      <div className="App__settings" style={{display: isSettingsOpen ? "block" : "none"}}>
        <Settings
          emmePythonPath={emmePythonPath}
          helmetScriptsPath={helmetScriptsPath}
          isDownloadingHelmetScripts={isDownloadingHelmetScripts}
          projectPath={projectPath}
          closeSettings={() => setSettingsOpen(false)}
          setEMMEPythonPath={_setEMMEPythonPath}
          setHelmetScriptsPath={_setHelmetScriptsPath}
          setProjectPath={_setProjectPath}
        />
      </div>

      {/* UI title bar, app-version, etc. */}
      <div className="App__header">
        Helmet 4.0
        &nbsp;
        <span className="App__header-version">{`UI v${helmetUIVersion}`}</span>
        <button className="App__open-settings-btn"
                style={{display: isSettingsOpen ? "none" : "block"}}
                onClick={(e) => setSettingsOpen(true)}
                disabled={isProjectRunning}
        >
          Asetukset
        </button>
      </div>

      {/* HELMET Project -specific content, including runtime- & per-scenario-settings */}
      <div className="App__body">
        <HelmetProject
          emmePythonPath={emmePythonPath}
          helmetScriptsPath={helmetScriptsPath}
          projectPath={projectPath ? projectPath : homedir}
          signalProjectRunning={setProjectRunning}
        />
      </div>
    </div>
  )
};
