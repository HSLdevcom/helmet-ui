import React from 'react';

const {ipcRenderer} = require('electron');

// vex-js imported globally in index.html, since we cannot access webpack config in electron-forge

class RunConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenario_ids_to_run: [],
      status_iterations_total: null,
      status_iterations_current: 0,
      status_iterations_completed: 0,
      status_iterations_failed: 0,
      status_state: null,
      status_logfile_path: null,
      status_ready_scenarios_logfiles: [], // [{name: .., logfile: ..}]
    };

    // Electron IPC event listeners
    this.onLoggableEvent = (event, args) => {
      if (args.status) {
        this.setState({
          status_iterations_total: args.status['total'],
          status_iterations_current: args.status['current'],
          status_iterations_completed: args.status['completed'],
          status_iterations_failed: args.status['failed'],
          status_state: args.status['state'],
          status_logfile_path: args.status['log'],
        });
        if (args.status.state === 'finished') {
          // noinspection JSCheckFunctionSignatures
          this.setState({
            status_ready_scenarios_logfiles: this.state.status_ready_scenarios_logfiles.concat({
              name: args.status.name,
              logfile: args.status.log
            })
          })
        }
      }
    };
  }

  _handleClickScenarioToActive(scenario) {
    this.state.scenario_ids_to_run.includes(scenario.id) ?
      // If scenario exists in scenarios to run, remove it
      this.setState({scenario_ids_to_run: this.state.scenario_ids_to_run.filter((id) => id !== scenario.id)})
      :
      // Else add it
      this.setState({scenario_ids_to_run: this.state.scenario_ids_to_run.concat(scenario.id)});
  }

  _handleClickNewScenario() {
    const promptCreation = (previousError) => {
      vex.dialog.prompt({
        message: (previousError ? previousError : "") + "Anna uuden skenaarion nimike:",
        placeholder: '',
        callback: (inputScenarioName) => {
          let error = "";
          // Check for cancel button press
          if (inputScenarioName === false) {
            return;
          }
          // Check input for initial errors
          if (inputScenarioName === "") {
            error = "Nimike on pakollinen, tallennettavaa tiedostonime\u00e4 varten. ";
          }
          if (this.props.scenarios.map((s) => s.name).includes(inputScenarioName)) {
            error = "Nimike on jo olemassa, valitse toinen nimi tai poista olemassa oleva ensin. ";
          }
          // Handle recursively any input errors (mandated by the async library since prompt isn't natively supported in Electron)
          if (error) {
            promptCreation(error);
          } else {
            this.props.createNewScenario(inputScenarioName);
          }
        }
      });
    };
    promptCreation();
  }

  _handleClickStartStop() {
    this.props.running_scenario_id === null ?
      this.props.runAllActiveScenarios(this.state.scenario_ids_to_run)
      :
      this.props.cancelRunning();
  }

  componentDidMount() {
    // Attach Electron IPC event listeners (to worker => UI events)
    ipcRenderer.on('loggable-event', this.onLoggableEvent);
  }

  componentWillUnmount() {
    // Detach Electron IPC event listeners
    ipcRenderer.removeListener('loggable-event', this.onLoggableEvent);
  }

  render() {
    return <div className="RunConfiguration">
      <div className="RunConfiguration__heading">Lis&auml;&auml; skenaario(t) ajettavaksi, tai luo uusi skenaario</div>
      <div className="RunConfiguration__saved-scenarios">
        {/* Create table of all scenarios "<Button-To-Add-As-Runnable> <Button-To-Open-Configuration>" */}
        {this.props.scenarios.map((s) => {
          return <div className="RunConfiguration__scenario" key={s.id}>
            <button className={"RunConfiguration__scenario-run-btn" + (
                      this.state.scenario_ids_to_run.includes(s.id) ?
                        " RunConfiguration__scenario-run-btn--active"
                        :
                        ""
                    )}
                    disabled={this.props.running_scenario_id !== null}
                    onClick={(e) => this._handleClickScenarioToActive(s)}
            >
              Ajettavaksi
            </button>
            &nbsp;
            <button className={"RunConfiguration__scenario-name-config-btn" + (
                      this.props.open_scenario_id === s.id ? " RunConfiguration__scenario-name-config-btn--active" : ""
                    )}
                    disabled={this.props.running_scenario_id !== null}
                    onClick={(e) => this.props.setOpenScenarioId(s.id)}
            >
              {s.name}
            </button>
          </div>;
        })}
        <div className="RunConfiguration__saved-scenarios-footer">
          <button className="RunConfiguration__add-new-scenario-btn"
                  disabled={this.props.running_scenario_id !== null}
                  onClick={(e) => this._handleClickNewScenario()}
          >
            Uusi skenaario
          </button>
        </div>
      </div>
      <hr className="RunConfiguration__separator"/>
      <div className="RunConfiguration__start-stop-controls">
        <p className="RunConfiguration__start-stop-description">
          {this.state.scenario_ids_to_run.length ?
            <span>
              Ajettavana:
              <span className="RunConfiguration__start-stop-scenarios">
                {this.props.scenarios.filter((s) => this.state.scenario_ids_to_run.includes(s.id)).map((s) => s.name).join(', ')}
              </span>
            </span>
            :
            "Ei ajettavaksi valittuja skenaarioita"
          }
        </p>
        {this.props.running_scenario_id !== null ?
          <div className="RunConfiguration__run-status">
            {this.state.status_iterations_total ?
              <div>
                <div className="RunConfiguration__run-status-percentage-ready"
                     style={{
                       background: (
                         `linear-gradient(`
                         + `to right, `
                         + `aliceblue 0%, `
                         + `aliceblue ${Math.round(this.state.status_iterations_completed / this.state.status_iterations_total * 100)}%, `
                         + `transparent ${Math.round(this.state.status_iterations_completed / this.state.status_iterations_total * 100)}%, `
                         + `transparent 100%)`
                       )
                     }}
                >
                  Valmiina
                  &nbsp;
                  <strong>{this.state.status_iterations_completed}</strong>
                  &nbsp;
                  /
                  &nbsp;
                  <strong>{this.state.status_iterations_total}</strong>
                  &nbsp;
                  (<strong>{Math.round(this.state.status_iterations_completed / this.state.status_iterations_total * 100)}%</strong>)
                </div>
              </div>
              :
              "Setting up python-shell . . ."
            }
            {this.state.status_ready_scenarios_logfiles.map((readyScenario) => {
              return <p className="RunConfiguration__run-status-scenario-ready">
                {readyScenario.name} valmis
                &nbsp;
                <a className="RunConfiguration__run-status-logfile-link"
                   href={readyScenario.logfile}
                >
                  lokit
                </a>
              </p>
            })}
            {
              //      "state": "starting",
              //              starting: 'Käynnistetään..',
              //              preparing: 'Valmistellaan..',
              //              running: `Iteraatio ${json.status.current} käynnissä..`,
              //              failed: `Iteraatio ${json.status.current} epäonnistui.`,
              //              aborted: 'Simuloinnin alustus epäonnistui.',
              //              finished: ' ',
              //  "message": "Initializing matrices and models..",
              //
              //      "state": "preparing",
              //   "message": "Starting simulation with 5 iterations..",
            }
          </div>
          :
          ""
        }
        <button className="RunConfiguration__start-stop-btn"
                onClick={(e) => this._handleClickStartStop()}
        >
          {this.props.running_scenario_id === null ?
            `K\u00e4ynnist\u00e4 (${this.state.scenario_ids_to_run.length}) skenaariota`
            :
            `Keskeyt\u00e4 loput skenaariot`
          }
        </button>
      </div>
    </div>;
  }
}
