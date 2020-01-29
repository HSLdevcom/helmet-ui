import React from 'react';
import Store from 'electron-store';

const {ipcRenderer} = require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_settings_open: false,
      emme_python_path: undefined,
      helmet_scripts_path: undefined,
      is_running: false,
    };

    // Global settings store contains "emme_python_path" and "helmet_scripts_path", which are same in every scenario.
    this.globalSettingsStore = new Store();

    // Electron IPC event listeners
    this.onAllScenariosComplete = (event, args) => {
      this.setState({is_running: false});
    };
  }

  _setEMMEPythonPath = (newPath) => {
    this.setState({emme_python_path: newPath});
    this.globalSettingsStore.set('emme_python_path', newPath);
  };

  _setHelmetScriptsPath = (newPath) => {
    this.setState({helmet_scripts_path: newPath});
    this.globalSettingsStore.set('helmet_scripts_path', newPath);
  };

  componentDidMount() {
    // Attach Electron IPC event listeners (to worker => UI events)
    ipcRenderer.on('all-scenarios-complete', this.onAllScenariosComplete);

    // Search for EMME's Python if not set in global store (default win path is %APPDATA%, should remain there [hidden from user])
    if (!this.globalSettingsStore.get('emme_python_path')) {
      const [found, pythonPath] = this.props.searchEMMEPython();
      if (found) {
        if (confirm(`Python ${this.props.config.emme.pythonVersion} löytyi sijainnista:\n\n${pythonPath}\n\nHaluatko käyttää tätä sijaintia?`)) {
          this.globalSettingsStore.set('emme_python_path', pythonPath);
        }
      } else {
        alert(`Emme ${this.props.config.emme.version} ja Python ${this.props.config.emme.pythonVersion} eivät löytyneet oletetusta sijainnista.\n\nMääritä Pythonin sijainti Asetukset-dialogissa.`);
      }
    }
    // Copy existing global store values to state
    this.setState({
      emme_python_path: this.globalSettingsStore.get('emme_python_path'),
      helmet_scripts_path: this.globalSettingsStore.get('helmet_scripts_path')
    })
  }

  componentWillUnmount() {
    // Detach Electron IPC event listeners
    ipcRenderer.removeListener('all-scenarios-complete', this.onAllScenariosComplete);
  }

  render() {
    return <div className={"App" + (this.state.is_running ? " App--busy" : "")}>

      {/* Pop-up settings dialog with overlay behind it */}
      <div className="App__settings" style={{display: this.state.is_settings_open ? "block" : "none"}}>
        <Settings
          emme_python_path={this.state.emme_python_path}
          helmet_scripts_path={this.state.helmet_scripts_path}
          closeSettings={() => this.setState({is_settings_open: false})}
          setEMMEPythonPath={this._setEMMEPythonPath}
          setHelmetScriptsPath={this._setHelmetScriptsPath}
        />
      </div>

      {/* UI title bar, app-version, etc. */}
      <div className="App__header">
        Helmet 4.0
        &nbsp;
        <span className="App__header-version">{`UI v${this.props.helmetUIVersion}`}</span>
        <button className="App__open-settings-btn"
                style={{display: this.state.is_settings_open ? "none" : "block"}}
                onClick={(e) => this.setState({is_settings_open: true})}
                disabled={this.state.is_running}
        >
          Asetukset
        </button>
      </div>

      <div className="App__body">
        <Configurations
          helmet_ui_app_config={this.props.config}
          emme_python_path={this.state.emme_python_path}
          helmet_scripts_path={this.state.helmet_scripts_path}
          runAll={(runParametersArray) => {
            ipcRenderer.send('message-from-ui-to-run-scenarios', runParametersArray);
            this.setState({is_running: true, is_settings_open: false});
          }}
          cancelAll={() => {
            ipcRenderer.send('message-from-ui-to-cancel-scenarios');
            this.setState({is_running: false});
          }}
        />
      </div>

    </div>
  }
}
