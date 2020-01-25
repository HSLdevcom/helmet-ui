import React from 'react';

class RunLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="RunLog">
      <div className="RunLog__header">
        <button className="RunLog__close-btn"
                disabled={this.props.is_scenario_running}
                onClick={(e) => this.props.closeRunLog()}
        >Sulje</button>
      </div>
      {this.props.log_contents.map((entry) => {
        return <div className="RunLog__entry" key={entry.id}>
          {`[${entry.level}] ${entry.message}`}
        </div>;
      })}
    </div>;
  }
}
