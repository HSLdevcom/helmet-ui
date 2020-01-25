import React from 'react';

// vex-js imported globally in index.html, since we cannot access webpack config in electron-forge

class RunConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenario_ids_to_run: [],
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
                  onClick={(e) => this._handleClickNewScenario()}
          >
            Uusi skenaario
          </button>
        </div>
      </div>
      <hr className="RunConfiguration__separator"/>
      <div className="RunConfiguration__start-stop-controls">
        <p className="RunConfiguration__start-stop-description">
          {
            this.state.scenario_ids_to_run.length ?
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
        <button className="RunConfiguration__start-stop-btn"
                onClick={(e) => {
                  this.props.runAllActiveScenarios(this.state.scenario_ids_to_run);
                }}
        >
          K&auml;ynnist&auml; ({this.state.scenario_ids_to_run.length.toString()}) skenaariota
        </button>
      </div>
    </div>;
  }
}
