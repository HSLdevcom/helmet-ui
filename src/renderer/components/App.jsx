import React from 'react';
import path from 'path';
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
    ipcRenderer.on('all-scenarios-complete', (event, args) => {
      this.setState({is_running: false});
    });
  }

  componentDidMount() {
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

  render() {
    return <div className={"App" + (this.state.is_running ? " App--busy" : "")}>
      <div className="App__settings-overlay" style={{display: this.state.is_settings_open ? "block" : "none"}}/>

      <div className="App__settings-dialog" style={{display: this.state.is_settings_open ? "block" : "none"}}>
        <div className="App__settings-dialog-heading">Asetukset</div>
        <div>
          <span className="App__settings-pseudo-label">Emme Python</span>
          <label className="App__settings-pseudo-file-select" id="python-label" htmlFor="python">
            {this.state.emme_python_path ? path.basename(this.state.emme_python_path) : "Valitse.."}
          </label>
          <input className="App__settings-hidden-input"
                 id="python"
                 type="file"
                 accept=".exe"
                 onChange={(e) => {
                   const inputPath = e.target.files[0].path;
                   this.setState({emme_python_path: inputPath});
                   this.globalSettingsStore.set('emme_python_path', inputPath);
                 }}
          />
        </div>
        <div>
          <span className="App_settings-pseudo-label">Helmet Scripts</span>
          <label className="App__settings-pseudo-file-select" id="scripts-label" htmlFor="scripts">
            {this.state.helmet_scripts_path ? path.basename(this.state.helmet_scripts_path) : "Valitse.."}
          </label>
          <input className="App__settings-hidden-input"
                 id="scripts"
                 type="file"
                 webkitdirectory=""
                 directory=""
                 onChange={(e) => {
                   const inputPath = e.target.files[0].path;
                   this.setState({helmet_scripts_path: inputPath});
                   this.globalSettingsStore.set('helmet_scripts_path', inputPath);
                 }}
          />
        </div>
        <br/>
        <div id="App__settings-dialog-controls">
          <button
            onClick={(e) => {
              this.setState({is_settings_open: false});
            }}
          >Sulje
          </button>
        </div>
      </div>

      <div className="App__header">
        Helmet 4.0
        &nbsp;
        <span className="App__header-version">{`UI v${this.props.helmetUIVersion}`}</span>
        <button className="App__open-settings-btn"
                style={{display: !this.state.is_settings_open ? "block" : "none"}}
                onClick={(e) => {
                  this.setState({is_settings_open: true});
                }}
                disabled={this.state.is_running}
        >Asetukset</button>
      </div>

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
  }
}
