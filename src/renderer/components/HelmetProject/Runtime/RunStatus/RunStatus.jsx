import React from 'react';
import { Chart as ChartJS, LinearScale, LineElement, PointElement, CategoryScale, Tooltip } from "chart.js";
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(duration);
dayjs.extend(relativeTime);
ChartJS.register(LinearScale, LineElement, CategoryScale, PointElement, Tooltip);


const RunStatus = ({isScenarioRunning, statusIterationsTotal, statusIterationsCompleted, statusReadyScenariosLogfiles, statusRunStartTime, statusRunFinishTime, demandConvergenceArray}) => {

  const graphData = {
    labels: demandConvergenceArray.map(listing => listing.iteration),
    datasets: [{
      label: 'Konvergenssi',
      data: demandConvergenceArray.map(listing => listing.value),
      backgroundColor: '#007AC9',
      borderColor: '#007AC9'
    }
    ],
    options: {
      plugins: {
        legend: {
          display: true
        }
      },
      tooltips: {
        callbacks: {
            label: (tooltipItem, data) => {
              return "testi"
            }
        }
    }
    }
  }

  return (
    <div className="Status">
      {
        statusIterationsTotal ?
          <div>
            <div className="Status__readiness">
              <Line className="runtime-chart" data={graphData} />
              &nbsp;
            </div>
          </div>
          :
          ""
      }
      {statusReadyScenariosLogfiles.map((readyScenario) => {
        return (
        <div> 
          <p className="Status__finished-scenario" key={readyScenario.name}>
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
        </div>)
      })}
    </div>
  );
};
