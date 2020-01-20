import React from 'react';

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
        {this.props.scenarios.map((s) => {
          return <div className="RunConfiguration__scenario">
            <button className="RunConfiguration__scenario-run-btn">Ajettavaksi</button>
            &nbsp;
            <button className="RunConfiguration__scenario-name-config-btn">{s.name}</button>
          </div>;
        })}
      </div>
    </div>;
  }
}