import React, {useState} from 'react';

const RunLog = ({isScenarioRunning, entries, closeRunLog}) => {

  const [showINFO, setShowINFO] = useState(true);
  const [showWARN, setShowWARN] = useState(true);
  const [showERROR, setShowERROR] = useState(true);
  const [showDEBUG, setShowDEBUG] = useState(false);

  return (
    <div className="Log">
      <div className="Log__heading">Loki</div>

      <div className="Log__close"
           onClick={(e) => isScenarioRunning ? undefined : closeRunLog()}
      ></div>

      <div className="Log__header">

        <div className="Log__header-controls">
          <button className={"Log__header-control" + (showINFO ? " Log__header-control--on" : "")}
                  onClick={(e) => setShowINFO(prevState => !prevState)}
          >
            INFO
          </button>
          <button className={"Log__header-control" + (showERROR ? " Log__header-control--on" : "")}
                  onClick={(e) => setShowERROR(prevState => !prevState)}
          >
            ERROR
          </button>
          <button className={"Log__header-control" + (showWARN ? " Log__header-control--on" : "")}
                  onClick={(e) => setShowWARN(prevState => !prevState)}
          >
            WARNING
          </button>
          <button className={"Log__header-control" + (showDEBUG ? " Log__header-control--on" : "")}
                  onClick={(e) => setShowDEBUG(prevState => !prevState)}
          >
            DEBUG
          </button>
        </div>
      </div>

      <div className="Log__overflow">
      <div className="Log__entries">
        {entries.map((entry) => {
          switch (entry.level) {
            case "UI-event":
              return showINFO ?
                <div className={"Log__entry Log__entry--ui"} key={entry.id}>
                  {`[${entry.level}] ${entry.message}`}
                </div>
                :
                "";

            case "INFO" || "UI-event":
              const d = new Date(entry.time);
              const timestamp = `${('00'+d.getHours()).slice(-2)}:${('00'+d.getMinutes()).slice(-2)}`;
              return showINFO ?
                <div className={"Log__entry Log__entry"} key={entry.id}>
                  {`[${entry.level} ${timestamp}] ${entry.message}`}
                </div>
                :
                "";

            case "ERROR":
              return showERROR ?
                <div className={"Log__entry Log__entry--error"} key={entry.id}>
                  {`[${entry.level}] ${entry.message}`}
                </div>
                :
                "";

            case "NEWLINE":
              return <br key={entry.id} />;

            case "DEBUG":
              return showDEBUG ?
                <div className={"Log__entry"} key={entry.id}>
                  {`[${entry.level}] ${entry.message}`}
                </div>
                :
                "";
                
            case "WARN":
              return showWARN ?
                <div className={"Log__entry"} key={entry.id}>
                  {`[${entry.level}] ${entry.message}`}
                </div>
                :
                "";

            default:
              return <div className={"Log__entry"} key={entry.id}>
                {`[${entry.level}] ${entry.message}`}
              </div>;
          }
        })}
      </div>
      </div>
    </div>
  )
};

// json.level = 'DEBUG', 'INFO', 'WARN', 'ERROR'
// json.message = '...'
// json.**extras