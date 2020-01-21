import React from 'react';
// vex-js imported globally in index.html, since we cannot access webpack config in electron-forge

class RunConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenarios_to_run: [],
    };
  }

  render() {
    return <div className="RunConfiguration">
      <div className="RunConfiguration__heading">Lis&auml;&auml; skenaario(t) ajettavaksi, tai luo uusi skenaario</div>
      <div className="RunConfiguration__saved-scenarios">
        {/* Create table of all scenarios [<Button-To-Add-As-Runnable> <Button-To-Open-Configuration>] */}
        {this.props.scenarios.map((s) => {
          const isActive = this.state.scenarios_to_run.find((scenario) => scenario.id === s.id);
          return <div className="RunConfiguration__scenario" key={s.id}>
            <button className={"RunConfiguration__scenario-run-btn" + (
                      isActive ? " RunConfiguration__scenario-run-btn--active" : ""
                    )}
                    onClick={(e) => {
                      isActive ?
                        // If scenario exists in scenarios to run, remove it
                        this.setState({scenarios_to_run: this.state.scenarios_to_run.filter((scenario) => scenario.id !== s.id)})
                        :
                        // Else add it
                        this.setState({scenarios_to_run: this.state.scenarios_to_run.concat(s)});
                    }}
            >Ajettavaksi
            </button>
            &nbsp;
            <button className={"RunConfiguration__scenario-name-config-btn" + (
                      this.props.open_scenario_id === s.id ? " RunConfiguration__scenario-name-config-btn--active" : ""
                    )}
                    onClick={(e) => {
                      this.props.setOpenScenarioId(s.id);
                    }}
            >{s.name}</button>
          </div>;
        })}
        <div className="RunConfiguration__saved-scenarios-footer">
          <button className="RunConfiguration__add-new-scenario-btn"
                  onClick={(e) => {
                    const promptCreation = (previousError) => {
                      vex.dialog.prompt({
                        message: (previousError ? previousError : "") + "Anna uuden skenaarion nimike:",
                        placeholder: '',
                        callback: (newScenarioName) => {
                          let error = "";
                          // Check for cancel button press
                          if (newScenarioName === false) {
                            return;
                          }
                          // Check input for initial errors
                          if (newScenarioName === "") {
                            error = "Nimike on pakollinen, tallennettavaa tiedostonime\u00e4 varten. ";
                          }
                          if (this.props.scenarios.map((s) => s.name).includes(newScenarioName)) {
                            error = "Nimike on jo olemassa, valitse toinen nimi tai poista olemassa oleva ensin. ";
                          }
                          // Handle recursively any input errors (mandated by the async library since prompt isn't natively supported in Electron)
                          if (error) {
                            promptCreation(error);
                          } else {
                            this.props.createNewScenario(newScenarioName);
                          }
                        }
                      });
                    };
                    promptCreation();
                  }}
          >Uusi skenaario</button>
        </div>
      </div>
    </div>;
  }
}