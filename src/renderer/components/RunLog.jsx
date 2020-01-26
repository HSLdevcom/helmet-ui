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
      {this.props.log_contents.map((entry) => {
        switch (entry.level) {
          case "UI-event":
            return <div className={"RunLog__entry RunLog__entry--ui"}
                        key={entry.id}
            >
              {`[${entry.level}] ${entry.message}`}
            </div>;

          case "ERROR":
            return <div className={"RunLog__entry RunLog__entry--error"}
                        key={entry.id}
            >
              {`[${entry.level}] ${entry.message}`}
            </div>;

          case "NEWLINE":
            return <br/>;

          case "DEBUG":
            return "";

          default:
            return <div className={"RunLog__entry"}
                        key={entry.id}
            >
              {`[${entry.level}] ${entry.message}`}
            </div>;
        }
      })}
    </div>;
  }
}

// json.level = 'DEBUG', 'INFO', 'WARN', 'ERROR'
// json.message = '...'
// {"status":
// Progress: About 30min per ajo, tarkoituksena löytää ekvivalenssi, viimeinen ajo saattaa kestää pidempään
//     {"name": "helmet",
//      "completed": 0,
//      "current": 0,
//      "failed": 0,  background-color: ${json.status.failed > 0 ? 'red' : 'navy'}
//      "state": "starting",
//              starting: 'Käynnistetään..',
//              preparing: 'Valmistellaan..',
//              running: `Iteraatio ${json.status.current} käynnissä..`,
//              failed: `Iteraatio ${json.status.current} epäonnistui.`,
//              aborted: 'Simuloinnin alustus epäonnistui.',
//              finished: ' ',
//      "total": 5,
//      "log": "C:\\Users\\mwah\\Documents\\Github\\helmet-model-system\\Scripts\\helmet.log"
// },
//  "message": "Initializing matrices and models..",
//  "level": "INFO"
//  }
// {"status":
//     {"name": "helmet",
//      "completed": 0,
//      "results": [],
//      "current": 0,
//      "failed": 0,
//      "state": "preparing",
//      "total": 5,
//      "log": "C:\\Users\\mwah\\Documents\\Github\\helmet-model-system\\Scripts\\helmet.log"
//  },
//   "message": "Starting simulation with 5 iterations..",
//   "level": "INFO"
//  }