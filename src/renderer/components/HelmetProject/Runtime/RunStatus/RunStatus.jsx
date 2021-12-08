import React from 'react';

const RunStatus = ({isScenarioRunning, statusIterationsTotal, statusIterationsCompleted, statusReadyScenariosLogfiles}) => {

  return (
    <div className="Status">
      {isScenarioRunning ?
        statusIterationsTotal ?
          <div>
            <div className="Status__readiness"
                 style={{
                   background: (
                     `linear-gradient(`
                     + `to right, `
                     + `#99cfff 0%, `
                     + `#99cfff ${Math.round(statusIterationsCompleted / statusIterationsTotal * 100)}%, `
                     + `transparent ${Math.round(statusIterationsCompleted / statusIterationsTotal * 100)}%, `
                     + `transparent 100%)`
                   )
                 }}
            >
              Valmiina
              &nbsp;
              <strong>{statusIterationsCompleted}</strong>
              &nbsp;
              /
              &nbsp;
              <strong>{statusIterationsTotal}</strong>
              &nbsp;
              (<strong>{Math.round(statusIterationsCompleted / statusIterationsTotal * 100)}%</strong>)
            </div>
          </div>
          :
          <p>Setting up python-shell . . .</p>
        :
        ""
      }
      {statusReadyScenariosLogfiles.map((readyScenario) => {
        return <p className="Status__finished-scenario" key={readyScenario.name}>
          {readyScenario.name} valmis
          &nbsp;
          <a className="Status__finished-scenario-logfile-link"
             href={readyScenario.logfile}
             target="_blank"
          >
            lokit
          </a>
        </p>
      })}
    </div>
  );
};
