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
        >
          Sulje
        </button>
      </div>
      <div className="RunLog__entries">
        {this.props.log_contents.map((entry) => {
          switch (entry.level) {
            case "UI-event":
              return <div className={"RunLog__entry RunLog__entry--ui"} key={entry.id}>
                {`[${entry.level}] ${entry.message}`}
              </div>;

            case "ERROR":
              return <div className={"RunLog__entry RunLog__entry--error"} key={entry.id}>
                {`[${entry.level}] ${entry.message}`}
              </div>;

            case "NEWLINE":
              return <br/>;

            case "DEBUG":
              return "";

            default:
              return <div className={"RunLog__entry"} key={entry.id}>
                {`[${entry.level}] ${entry.message}`}
              </div>;
          }
        })}
      </div>
    </div>;
  }
}

// json.level = 'DEBUG', 'INFO', 'WARN', 'ERROR'
// json.message = '...'
// json.**extras