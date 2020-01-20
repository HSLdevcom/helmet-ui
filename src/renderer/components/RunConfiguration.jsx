import React from 'react';

class RunConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenarios_to_run: [],
      open_scenario: undefined,
    };
  }

  render() {
    return <div className="RunConfiguration">
      <div className="RunConfiguration__heading">Lis&auml;&auml; skenaario(t) ajettavaksi, tai luo uusi skenaario</div>
      <div className="RunConfiguration__saved-scenarios">
        {this.props.scenarios.map((s) => {
          const isActive = this.state.scenarios_to_run.find((scenario) => scenario.id === s.id);
          return <div className="RunConfiguration__scenario">
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
                      this.state.open_scenario.id === s.id ? " RunConfiguration__scenario-name-config-btn--active" : ""
                    )}
                    onClick={(e) => {
                      // todo
                    }}
            >{s.name}</button>
          </div>;
        })}
      </div>
    </div>;
  }
}