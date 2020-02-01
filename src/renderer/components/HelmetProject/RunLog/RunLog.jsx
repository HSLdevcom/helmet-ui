import React from 'react';

const RunLog = ({isScenarioRunning, logContents, closeRunLog}) => {

  return (
    <div className="Log">
      <div className="Log__header">
        <button className="Log__close-btn"
                disabled={isScenarioRunning}
                onClick={(e) => closeRunLog()}
        >
          Sulje
        </button>
      </div>
      <div className="Log__entries">
        {logContents.map((entry) => {
          switch (entry.level) {
            case "UI-event":
              return <div className={"Log__entry Log__entry--ui"} key={entry.id}>
                {`[${entry.level}] ${entry.message}`}
              </div>;

            case "ERROR":
              return <div className={"Log__entry Log__entry--error"} key={entry.id}>
                {`[${entry.level}] ${entry.message}`}
              </div>;

            case "NEWLINE":
              return <br/>;

            case "DEBUG":
              return "";

            default:
              return <div className={"Log__entry"} key={entry.id}>
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