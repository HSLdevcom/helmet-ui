import React from 'react';

const RunLog = ({isScenarioRunning, logContents, closeRunLog}) => {

  return (
    <div className="RunLog">
      <div className="RunLog__header">
        <button className="RunLog__close-btn"
                disabled={isScenarioRunning}
                onClick={(e) => closeRunLog()}
        >
          Sulje
        </button>
      </div>
      <div className="RunLog__entries">
        {logContents.map((entry) => {
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
    </div>
  )
};

// json.level = 'DEBUG', 'INFO', 'WARN', 'ERROR'
// json.message = '...'
// json.**extras