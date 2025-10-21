import React, {useState, useEffect, useRef} from 'react';
import Settings from './Settings/Settings';
import HelmetProject from './HelmetProject/HelmetProject';
import classNames from 'classnames';

// Use APIs from window.electronAPI
const { ipcRenderer, shell, fs, path, os, child_process} = window.electronAPI;
const homedir = os.homedir();

interface AppProps {
  helmetUIVersion: string;
  searchEMMEPython: () => [boolean, string];
  listEMMEPythonPaths: () => string[];
}


// vex-js imported globally in index.html, since we cannot access webpack config in electron-forge
const App: React.FC<AppProps> = ({helmetUIVersion, searchEMMEPython, listEMMEPythonPaths}) => {
  console.log('window.electronAPI:', window.electronAPI);

  // Global settings
  const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false); // whether Settings -dialog is open
  const [isProjectRunning, setProjectRunning] = useState<boolean>(false); // whether currently selected Project is running
  const [isDownloadingHelmetScripts, setDownloadingHelmetScripts] = useState<boolean>(false); // whether downloading "/Scripts" is in progress
  const [emmePythonPath, setEmmePythonPath] = useState<string|undefined>(undefined); // file path to EMME python executable
  const [emmePythonEnvs, setEmmePythonEnvs] = useState<string[]|undefined>([]); // List of all discovered python executables
  const [helmetScriptsPath, setHelmetScriptsPath] = useState<string|undefined>(undefined); // folder path to HELMET model system scripts
  const [projectPath, setProjectPath] = useState<string|undefined>(undefined); // folder path to scenario configs, default homedir
  const [basedataPath, setBasedataPath] = useState<string|undefined>(undefined); // folder path to base input data (subdirectories: 2016_zonedata, 2016_basematrices)
  const [resultsPath, setResultsPath] = useState<string|undefined>(undefined); // folder path to Results directory
  const [dlHelmetScriptsVersion, setDlHelmetScriptsVersion] = useState<string|undefined>(undefined); // which version is being downloaded
  const [helmetModelSystemVersion, setHelmetModelSystemVersion] = useState<string|undefined>(undefined);

  // Global settings store contains "emme_python_path", "helmet_scripts_path", "project_path", "basedata_path", and "resultdata_path".
  const globalSettingsStore = useRef({
    get: (key: string) => window.electronAPI.StoreAPI.get(key),
    set: (key: string , value: any) => window.electronAPI.StoreAPI.set(key, value),
  });

  const _setEMMEPythonPath = (newPath: string) => {
    setEmmePythonPath(newPath);
    globalSettingsStore.current.set('emme_python_path', newPath);
  };

  const _setEMMEPythonEnvs = (newList: string[]) => {
    setEmmePythonEnvs(newList);
    globalSettingsStore.current.set('emme_python_envs', newList);
  }

  const _removeFromEMMEPythonEnvs = (path: string) => {
    const pythonEnvs = emmePythonEnvs?.slice() ?? [];
    const foundPath = pythonEnvs.indexOf(path);
    if (foundPath > -1) {
      pythonEnvs.splice(foundPath,1);
      _setEMMEPythonEnvs(pythonEnvs);
    }
  }

  const _addToEMMEPythonEnvs = (path: string) => {
    const pythonEnvs = emmePythonEnvs?.slice() ?? [];
    const foundPath = pythonEnvs.indexOf(path);
    if (foundPath === -1) {
      pythonEnvs.push(path);
      _setEMMEPythonEnvs(pythonEnvs);
    }
  }

  const _setHelmetScriptsPath = async (newPath: string) => {
    // Cannot use state variable since it'd be undefined at times
    const pythonPath: string | undefined = globalSettingsStore.current.get('emme_python_path');
    try {
      await child_process.exec(`"${path.join(path.dirname(pythonPath!), "Scripts", "pip.exe")}" install --user -r "${path.join(newPath, "requirements.txt")}"`);
    } catch (e) {
      console.log(e);
      console.log("No requirements file found for HELMET Scripts. Some functionality may not work properly.");
    }
    setHelmetScriptsPath(newPath);
    globalSettingsStore.current.set('helmet_scripts_path', newPath);
    updateHelmetModelVersion(newPath);
  };

  const _setProjectPath = (newPath: string) => {
    setProjectPath(newPath);
    globalSettingsStore.current.set('project_path', newPath);
  };

  const _setBasedataPath = (newPath: string) => {
    setBasedataPath(newPath);
    globalSettingsStore.current.set('basedata_path', newPath);
  };

  const _setResultsPath = (newPath: string) => {
    setResultsPath(newPath);
    globalSettingsStore.current.set('resultdata_path', newPath);
  };

  const _listEMMEPythonPaths = () => {
    return listEMMEPythonPaths();
  }

const _promptModelSystemDownload = () => {
  fetch('https://api.github.com/repos/HSLdevcom/helmet-model-system/tags')
    .then((response) => response.json() as Promise<GithubTag[]>) // explicitly type the JSON
    .then((tags: GithubTag[]) => {
      // Build the select HTML safely
      const optionsHtml = tags.map((tag) => `<option value="${tag.name}">${tag.name}</option>`).join('');
      const inputHtml = [
        '<div class="vex-custom-field-wrapper">',
          '<select name="version">',
            optionsHtml,
          '</select>',
        '</div>'
      ].join('');

      vex.dialog.open({
        message: "Valitse model-system versio:",
        input: inputHtml,
        callback: (data?: { version?: string }) => {    // typed callback param
          if (!data || !data.version) {
            // Cancelled or no version selected
            return;
          }
          const now = new Date();
          setDlHelmetScriptsVersion(data.version);
          setDownloadingHelmetScripts(true);
          ipcRenderer.send(
            'message-from-ui-to-download-helmet-scripts',
            {
              version: data.version,
              destinationDir: homedir,
              postfix: `${('00'+now.getDate()).slice(-2)}-${('00'+now.getMonth()).slice(-2)}-${Date.now()}`, // DD-MM-epoch
            }
          );
        }
      });
    })
    .catch((err) => {
      console.error('Failed to fetch tags', err);
      // Maybe show user-friendly alert here
    });
};

  // Electron IPC event listeners
  const onDownloadReady = (event: any, savePath: string) => {
    _setHelmetScriptsPath(savePath);
    setDownloadingHelmetScripts(false);
  };

  const getHelmetModelSystemVersion = async (helmetScriptsPath: string) => {
    const rootFiles = await fs.readdir(helmetScriptsPath ?? homedir);
    const configFile = rootFiles.find(file => file === 'dev-config.json')
    if(configFile) {
      const jsonPath = path.join(helmetScriptsPath, configFile);
      const configString = await fs.readFile(jsonPath);
      const configuration = JSON.parse(configString);
      if(configuration['HELMET_VERSION']) {
        return configuration['HELMET_VERSION'];
      } else {
        return '';
      }
    }
    return '';
  };

  const updateHelmetModelVersion = async (helmetScriptsPath: string) => {
    console.log("Updating Helmet model system version from path:", helmetScriptsPath);
    const helmetVersion = await getHelmetModelSystemVersion(helmetScriptsPath);
    if (helmetVersion !== '') {
      const trimmedVersionString = helmetVersion.substring(1);
      setHelmetModelSystemVersion(trimmedVersionString);
      ipcRenderer.send('change-title', `Helmet UI | Helmet ${trimmedVersionString}`);
    }
  }

  useEffect(() => {
    // Attach Electron IPC event listeners (to worker => UI events)
    ipcRenderer.on('download-ready', onDownloadReady);

    // Search for EMME's Python if not set in global store (default win path is %APPDATA%, should remain there [hidden from user])
    if (!globalSettingsStore.current.get('emme_python_path')) {
      const [found, pythonPath] = searchEMMEPython();
      if (found) {
        if (confirm(`Python löytyi sijainnista:\n\n${pythonPath}\n\nHaluatko käyttää tätä sijaintia?`)) {
          globalSettingsStore.current.set('emme_python_path', pythonPath);
          globalSettingsStore.current.set('emme_python_envs', [pythonPath])
        }
      }
    }
    // Copy existing global store values to state. Remember: state updates async so refer to existing.
    const existingEmmePythonPath = globalSettingsStore.current.get('emme_python_path');
    const existingHelmetScriptsPath = globalSettingsStore.current.get('helmet_scripts_path');
    const existingProjectPath = globalSettingsStore.current.get('project_path');
    const existingBasedataPath = globalSettingsStore.current.get('basedata_path');
    const existingResultsPath = globalSettingsStore.current.get('resultdata_path');
    const existingPythonEnvs = globalSettingsStore.current.get('emme_python_envs');
    setEmmePythonPath(existingEmmePythonPath);
    setHelmetScriptsPath(existingHelmetScriptsPath);
    setProjectPath(existingProjectPath);
    setBasedataPath(existingBasedataPath);
    setResultsPath(existingResultsPath);

    if(Array.isArray(existingPythonEnvs)) {
      setEmmePythonEnvs(existingPythonEnvs);
    } else {
      setEmmePythonEnvs([]);
    }

    // If project path is the initial (un-set), set it to homedir. Remember: state updates async so refer to existing.
    if (!existingProjectPath) {
      _setProjectPath(homedir);
    }

    // If project path does not exist on set path, set it to homedir. Remember: state updates async so refer to existing.
    if (!existingProjectPath || !fs.existsSync(existingProjectPath)) {
      alert(`Projektikansiota ei löydy polusta '${existingProjectPath}'.\nProjektikansioksi asetetaan kotikansio '${homedir}'.`)
      _setProjectPath(homedir);
    }

    if (!existingBasedataPath || !existingResultsPath) {
      setSettingsOpen(true);
    }

    if(existingHelmetScriptsPath) {
      console.log("Existing helmet scripts path:", existingHelmetScriptsPath);
      updateHelmetModelVersion(existingHelmetScriptsPath);
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
          emmePythonEnvs={emmePythonEnvs}
          helmetScriptsPath={helmetScriptsPath}
          projectPath={projectPath}
          basedataPath={basedataPath}
          resultsPath={resultsPath}
          dlHelmetScriptsVersion={dlHelmetScriptsVersion}
          isDownloadingHelmetScripts={isDownloadingHelmetScripts}
          closeSettings={() => setSettingsOpen(false)}
          setEMMEPythonPath={_setEMMEPythonPath}
          setEMMEPythonEnvs={_setEMMEPythonEnvs}
          listEMMEPythonPaths={_listEMMEPythonPaths}
          addToEMMEPythonEnvs={_addToEMMEPythonEnvs}
          removeFromEMMEPythonEnvs={_removeFromEMMEPythonEnvs}
          setHelmetScriptsPath={_setHelmetScriptsPath}
          setProjectPath={_setProjectPath}
          setBasedataPath={_setBasedataPath}
          setResultsPath={_setResultsPath}
          promptModelSystemDownload={_promptModelSystemDownload}
        />
      </div>

      {/* UI title bar, app-version, etc. */}
      <div className="App__header">
        <span className="App__header-title">{helmetModelSystemVersion ? `Helmet ${helmetModelSystemVersion}` : ''}</span>
        &nbsp;
        <span className="App__header-version">{`UI ${helmetUIVersion}`}</span>
      </div>

      {/* HELMET Project -specific content, including runtime- & per-scenario-settings */}
      <div className="App__body">
        <HelmetProject
          emmePythonPath={emmePythonPath}
          helmetScriptsPath={helmetScriptsPath}
          projectPath={projectPath ? projectPath : homedir}
          basedataPath={basedataPath}
          resultsPath={resultsPath}
          signalProjectRunning={setProjectRunning}
        />
      </div>
      
      <div className="App__header-button-container">
        <a className="header-documentation-link" title='Dokumentaatio' 
          target="_blank" 
          onClick={() => shell.openExternal("https://hsldevcom.github.io/helmet-docs/")}
          style={{display: isSettingsOpen ? "none" : "flex"}}> 
            <span>?</span>
        </a>
        <div className={classNames("App__open-settings", { 'App__settings-disabled': isProjectRunning })} title='Asetukset'
          style={{display: isSettingsOpen ? "none" : "block"}}
          onClick={() => isProjectRunning ? setSettingsOpen(false) : setSettingsOpen(true)}>
        </div>
      </div>
    </div>
  )
};

export default App;