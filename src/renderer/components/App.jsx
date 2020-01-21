import React from 'react';
import path from 'path';
import Store from 'electron-store';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSettingsOpen: false,
      emmePythonPath: undefined,
      helmetScriptsPath: undefined,
    };
    // Global settings store contains "emme_python_path" and "helmet_scripts_path", which are same in every scenario.
    this.globalSettingsStore = new Store();
  }

  componentDidMount() {
    // Search for EMME's Python if not set
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
    // Copy existing global settings to state
    this.setState({
      emmePythonPath: this.globalSettingsStore.get('emme_python_path'),
      helmetScriptsPath: this.globalSettingsStore.get('helmet_scripts_path')
    })
  }

  render() {
    return <div className="App">
      <div className="App__settings-overlay" style={{display: this.state.isSettingsOpen ? "block" : "none"}}/>

      <div className="App__settings-dialog" style={{display: this.state.isSettingsOpen ? "block" : "none"}}>
        <div className="App__settings-dialog-heading">Asetukset</div>
        <div>
          <span className="App__settings-pseudo-label">Emme Python</span>
          <label className="App__settings-pseudo-file-select" id="python-label" htmlFor="python">
            {this.state.emmePythonPath ? path.basename(this.state.emmePythonPath) : "Valitse.."}
          </label>
          <input className="App__settings-hidden-input"
                 id="python"
                 type="file"
                 accept=".exe"
                 onChange={(e) => {
                   const inputPath = e.target.files[0].path;
                   this.setState({emmePythonPath: inputPath});
                   this.globalSettingsStore.set('emme_python_path', inputPath);
                 }}
          />
        </div>
        <div>
          <span className="App_settings-pseudo-label">Helmet Scripts</span>
          <label className="App__settings-pseudo-file-select" id="scripts-label" htmlFor="scripts">
            {this.state.helmetScriptsPath ? path.basename(this.state.helmetScriptsPath) : "Valitse.."}
          </label>
          <input className="App__settings-hidden-input"
                 id="scripts"
                 type="file"
                 webkitdirectory=""
                 directory=""
                 onChange={(e) => {
                   const inputPath = e.target.files[0].path;
                   this.setState({helmetScriptsPath: inputPath});
                   this.globalSettingsStore.set('helmet_scripts_path', inputPath);
                 }}
          />
        </div>
        <br/>
        <div id="App__settings-dialog-controls">
          <button
            onClick={(e) => {
              this.setState({isSettingsOpen: false});
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
                style={{display: !this.state.isSettingsOpen ? "block" : "none"}}
                onClick={(e) => {
                  this.setState({isSettingsOpen: true});
                }}
        >Asetukset</button>
      </div>

      <div id="dashboard">
        <Configurations helmet_ui_app_config={this.props.config}/>
        <div id="status-panel">
          <div id="status-state"></div>
          <div id="status-progress"></div>
          <div id="progressbar">
            <div className="percentage"></div>
          </div>
          <div id="status-current"></div>
          <div id="message"></div>
        </div>
      </div>

      <h3>Tulokset</h3>

      <div id="results-panel">
        <div id="results">
          <p><a id="log-link" href="" target="_blank">Tapahtumaloki</a></p>
          <p id="key-values"></p>
        </div>
      </div>
    </div>
  }
}
