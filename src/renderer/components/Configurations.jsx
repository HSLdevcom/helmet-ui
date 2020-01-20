import React from 'react';

class Configurations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenarios: [
        {
          id: 0,
          name: '',
          emme_project_file_path: undefined,
          data_folder_path: undefined,
          use_fixed_transit_cost: false,
          iterations: 10
        }
      ]
    };
  }

  render() {
    return <div>
      <ScenarioConfiguration
        scenario={this.state.scenarios[0]}
        updateScenario={(newValues) => {
          this.setState({
            scenarios: this.state.scenarios.map((s) => {
              return s.id === newValues.id ? {...s, ...newValues} : s
            })
          })
        }}
        deleteScenario={(scenario) => {
          if (confirm(`Oletko varma skenaarion ${scenario.name} poistosta?`)) {
            console.log(`Deleting configuration #${scenario.id}`)
            // No-op for now
          }
        }}
      />
      <ScenarioConfiguration
        scenario={this.state.scenarios[0]}
        updateScenario={(newValues) => {
          this.setState({
            scenarios: this.state.scenarios.map((s) => {
              return s.id === newValues.id ? {...s, ...newValues} : s
            })
          })
        }}
        deleteScenario={(scenario) => {
          if (confirm(`Oletko varma skenaarion ${scenario.name} poistosta?`)) {
            console.log(`Deleting configuration #${scenario.id}`)
            // No-op for now
          }
        }}
      />
    </div>;
  }
}
