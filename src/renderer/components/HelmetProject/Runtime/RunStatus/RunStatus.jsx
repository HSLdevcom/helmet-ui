import React from 'react';
import { Scatter } from 'react-chartjs-2';
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(duration);
dayjs.extend(relativeTime);

const RunStatus = ({isScenarioRunning, statusIterationsTotal, statusIterationsCompleted, statusReadyScenariosLogfiles, statusRunStartTime, statusRunFinishTime}) => {

  const scatterPlotData = {
    datasets: [{
      data: {
        x: Array.from({ length: statusIterationsCompleted }),

      }
    }
    ]
  }

  return (
    <div className="Status">
      {isScenarioRunning ?
        statusIterationsTotal ?
          <div>
            <div className="Status__readiness">
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
          &nbsp;
          Ajoaika: { dayjs.duration(dayjs(statusRunFinishTime).diff(dayjs(statusRunStartTime))).format('HH[h]:mm[m]:ss[s]') }
        </p>
      })}
    </div>
  );
};
