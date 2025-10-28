import React, {useState, useEffect, useRef} from 'react';
import Settings from './Settings/Settings';
import HelmetProject from './HelmetProject/HelmetProject';
import classNames from 'classnames';
import { useHelmetModelContext } from '../context/HelmetModelContext';
import Modal from './Modal/Modal'; // Import the custom modal component

// Use APIs from window.electronAPI
const { ipcRenderer, shell, fs, path, os, child_process, downloadHelmetScripts} = window.electronAPI;
const homedir = os.homedir();

interface AppProps {
  helmetUIVersion: string;
  searchEMMEPython: () => [boolean, string];
  listEMMEPythonPaths: () => string[];
}


// vex-js imported globally in index.html, since we cannot access webpack config in electron-forge
const App: React.FC<AppProps> = ({helmetUIVersion, searchEMMEPython, listEMMEPythonPaths}) => {
  const { helmetModelSystemVersion, setHelmetModelSystemVersion } = useHelmetModelContext();

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
  const [dlHelmetScriptsVersion, setDlHelmetScriptsVersion] = useState<string|undefined>(undefined);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<{ title: string; label: string; options: string[] }>({
    title: '',
    label: '',
    options: [],
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  // Global settings store contains "emme_python_path", "helmet_scripts_path", "project_path", "basedata_path", and "resultdata_path".
  const globalSettingsStore = useRef({
    get: (key: string) => window.electronAPI.StoreAPI.get(key),
    set: (key: string , value: any) => window.electronAPI.StoreAPI.set(key, value),
  });

  const _setEMMEPythonPath = async (newPath: string) => {
    const helmetScriptsPath: string | undefined = globalSettingsStore.current.get('helmet_scripts_path');
    if (helmetScriptsPath) {
      try {
        const requirementsPath = path.join(helmetScriptsPath, "requirements.txt");
        if (fs.existsSync(requirementsPath)) {
          await child_process.exec(`"${path.join(path.dirname(newPath), "Scripts", "pip.exe")}" install --user -r "${requirementsPath}"`);
        } else {
          console.warn(`No requirements file found at: ${requirementsPath}`);
        }
      } catch (e) {
        console.error("Error installing requirements:", e);
      }
    }

    console.log("Setting emmePythonPath to:", newPath);
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
    try {
      // Resolve accidental "one folder too high" selection
      const helmetFilePath = path.join(newPath, "helmet.py");
      const scriptsSubfolderPath = path.join(newPath, "Scripts", "helmet.py");

      if (!fs.existsSync(helmetFilePath) && fs.existsSync(scriptsSubfolderPath)) {
        if (confirm(`Valitusta kansiosta ei löydy "helmet.py" -tiedostoa, mutta sen\nsisällä olevasta "Scripts" kansiosta löytyy.\n\nValitaanko "Scripts" kansio valitsemasi kansion sijaan?`)) {
          newPath = path.join(newPath, "Scripts");
        }
      }

      const pythonPath: string | undefined = globalSettingsStore.current.get('emme_python_path');
      if (pythonPath) {
        const requirementsPath = path.join(newPath, "requirements.txt");
        if (fs.existsSync(requirementsPath)) {
          await child_process.exec(`"${path.join(path.dirname(pythonPath), "Scripts", "pip.exe")}" install --user -r "${requirementsPath}"`);
        } else {
          console.warn(`No requirements file found at: ${requirementsPath}`);
        }
      }

      console.log("Setting helmetScriptsPath to:", newPath);
      setHelmetScriptsPath(newPath);
      globalSettingsStore.current.set('helmet_scripts_path', newPath);
      updateHelmetModelVersion(newPath);

    } catch (e) {
      console.error("Error installing requirements or setting helmetScriptsPath:", e);
    }
  };


  const _setProjectPath = (newPath: string) => {
    console.log(`Updating projectPath to: ${newPath}`);
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
        const options = tags.map((tag) => tag.name);
        setModalOptions({
          title: 'Lataa eri versio internetistä',
          label: 'Valitse model-system versio:',
          options,
        });
        setModalOpen(true);
      })
      .catch((err) => {
        console.error('Failed to fetch tags', err);
        alert('Failed to fetch model-system versions. Please try again later.');
      });
  };

  const handleModalSubmit = () => {
    if (!selectedOption) {
      alert('Please select a version.');
      return;
    }
    const now = new Date();
    setDlHelmetScriptsVersion(selectedOption);
    setDownloadingHelmetScripts(true);
    downloadHelmetScripts({
      version: selectedOption,
      destinationDir: homedir,
      postfix: `${('00' + now.getDate()).slice(-2)}-${('00' + now.getMonth()).slice(-2)}-${Date.now()}`, // DD-MM-epoch
    });
    setModalOpen(false);
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
    try {
      console.log("Updating Helmet model system version from path:", helmetScriptsPath);
      const rootFiles = await fs.readdir(helmetScriptsPath);
      const configFile = rootFiles.find((file) => file === 'dev-config.json');
      if (configFile) {
        const jsonPath = path.join(helmetScriptsPath, configFile);
        const configString = await fs.readFile(jsonPath);
        const configuration = JSON.parse(configString);
        if (configuration['HELMET_VERSION']) {
          const trimmedVersionString = configuration['HELMET_VERSION'].substring(1);
          setHelmetModelSystemVersion(trimmedVersionString);
          ipcRenderer.send('change-title', `Helmet UI | Helmet ${trimmedVersionString}`);
        }
      } else {
        console.warn("dev-config.json not found in the Scripts folder.");
      }
    } catch (error) {
      console.error("Error updating Helmet model version:", error);
    }
  };

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
    } else {
      console.log(`Setting projectPath state to: ${existingProjectPath}`);
      setProjectPath(existingProjectPath);
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

  useEffect(() => {
    ipcRenderer.on('download-progress', (_, { progress, version }) => {
      console.log(`Download progress for version ${version}: ${progress.percent * 100}%`);
      setDownloadProgress(progress.percent * 100);
    });

    ipcRenderer.on('download-ready', (_, { finalDir, version }) => {
      console.log(`Download complete for version ${version}. Final directory: ${finalDir}`);
      setDownloadProgress(null);
      _setHelmetScriptsPath(finalDir);
    });

    ipcRenderer.on('download-error', (_, { error, version }) => {
      console.error(`Download error for version ${version}: ${error}`);
      setDownloadProgress(null);
    });

    ipcRenderer.on('download-cancelled', (_, { version }) => {
      console.log(`Download canceled for version ${version}`);
      setDownloadProgress(null);
    });

    return () => {
      ipcRenderer.removeListener('download-progress', () => {});
      ipcRenderer.removeListener('download-ready', () => {});
      ipcRenderer.removeListener('download-error', () => {});
      ipcRenderer.removeListener('download-cancelled', () => {});
    };
  }, []);

  const handleCancelDownload = () => {
    ipcRenderer.send('cancel-download', dlHelmetScriptsVersion);
  };

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
          getHelmetModelSystemVersion={getHelmetModelSystemVersion}
          downloadProgress={downloadProgress}
          cancelDownload={handleCancelDownload}
        />
      </div>

      {/* UI title bar, app-version, etc. */}
      <div className="App__header">
        <span className="App__header-title">{helmetModelSystemVersion ? `Helmet ${helmetModelSystemVersion}` : ''}</span>
        &nbsp;
        <span className="App__header-version">{`UI ${helmetUIVersion}`}</span>
      </div>

      {/* HELMET Project -specific content, including runtime-& per-scenario-settings */}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        title={modalOptions.title}
      >
        <label className="Modal__label">{modalOptions.label}</label>
        <select
          className="Modal__input"
          value={selectedOption || ''}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="" disabled>
            Select a version
          </option>
          {modalOptions.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Modal>
    </div>
  )

};
export default App;