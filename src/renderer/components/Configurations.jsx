import React from 'react';

class Configurations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenarios: [
        {
          id: 0,
          name: '2016',
          emme_project_file_path: undefined,
          data_folder_path: undefined,
          use_fixed_transit_cost: false,
          iterations: 10
        },
        {
          id: 1,
          name: '2030',
          emme_project_file_path: undefined,
          data_folder_path: undefined,
          use_fixed_transit_cost: true,
          iterations: 10
        },
      ],
      open_scenario_id: null,
    };
  }

  render() {
    return <div className="ConfigurationsWrapper">
      <RunConfiguration
        scenarios={this.state.scenarios}
        open_scenario_id={this.state.open_scenario_id}
        setOpenScenarioId={(scenario_id) => {
          this.setState({open_scenario_id: scenario_id});
        }}
        createNewScenario={(name) => {
          const newId = Math.max.apply(null, this.state.scenarios.map((s) => s.id)) + 1;
          // Create the new scenario in "scenarios" array first
          this.setState({
            scenarios: this.state.scenarios.concat({
              id: newId,
              name: name,
              emme_project_file_path: undefined,
              data_folder_path: undefined,
              use_fixed_transit_cost: false,
              iterations: 10,
            })
          });
          // Then set open_scenario_id (having open_scenario as reference causes sub-elements to be bugged because of different object reference)
          this.setState({
            open_scenario_id: newId
          })
        }}
      />
      {this.state.open_scenario_id !== null ?
        <ScenarioConfiguration
          scenario={this.state.scenarios.find((s) => s.id === this.state.open_scenario_id)}
          updateScenario={(newValues) => {
            this.setState({
              scenarios: this.state.scenarios.map((s) => {
                return s.id === newValues.id ? {...s, ...newValues} : s
              })
            })
          }}
          deleteScenario={(scenario) => {
            if (confirm(`Oletko varma skenaarion ${scenario.name} poistosta?`)) {
              this.setState({
                open_scenario_id: null,
                scenarios: this.state.scenarios.filter((s) => s.id !== scenario.id)
              });
              window.location.reload();  // Vex-js dialog input gets stuck otherwise
            }
          }}
        />
        :
        ""
      }
    </div>;
  }
}
