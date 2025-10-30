import React from 'react';
import { Chart as ChartJS, LinearScale, LineElement, PointElement, CategoryScale, Tooltip, Legend, Title } from "chart.js";
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime'
import { SCENARIO_STATUS_STATE } from '../../../../../enums.js';
import { useHelmetModelContext } from '../../../../context/HelmetModelContext';

const shell = window.electronAPI.shell;

dayjs.extend(duration);
dayjs.extend(relativeTime);
ChartJS.register(LinearScale, LineElement, CategoryScale, PointElement, Tooltip, Legend, Title);


const RunStatus = ({ isScenarioRunning, statusIterationsTotal, statusIterationsCompleted, statusReadyScenariosLogfiles, statusRunStartTime, statusRunFinishTime, statusState, demandConvergenceArray }) => {
  const { majorVersion } = useHelmetModelContext();

  if (majorVersion && majorVersion >= 5) {
    console.log("Using Helmet 5 or later");
  }

  const graphConfig = {
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Convergence',
          align: 'Center'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: { 
          title: {
            display: true,
            text: 'Rel_Gap [ % ]',
            font: {
              size: 16
            }
          }
         },
        x: {
          title: {
            display: true,
            text: 'Iteration [ # ]',
            font: {
              size: 16
            }
          }
        }
        },
      animation: {
        duration: 0
      }
    },
  }

  const graphData = {
    labels: demandConvergenceArray.map(listing => listing.iteration),
    datasets: [{
      label: 'Rel_Gap (%)',
      data: demandConvergenceArray.map(listing => (listing.value * 100).toFixed(4)),
      backgroundColor: '#007AC9',
      borderColor: '#007AC9'
    }
    ],
  }

  const formatRunStatusTime = (runFinishTime, runStartTime) => {
    const formattedTime = dayjs.duration(dayjs(runFinishTime).diff(dayjs(runStartTime))).format('HH[h]:mm[m]:ss[s]');
    return formattedTime !== 'NaNh:NaNm:NaNs' ? formattedTime : '-'
  }

  return (
    <div className="Status">
      {
        (statusState === SCENARIO_STATUS_STATE.RUNNING || statusState === SCENARIO_STATUS_STATE.FINISHED) &&
          <div>
            <div className="Status__readiness">
              <Line className="runtime-chart" options={graphConfig.options} data={graphData} />
              &nbsp;
            </div>
          </div>
      }
      { (statusState === SCENARIO_STATUS_STATE.PREPARING || statusState === SCENARIO_STATUS_STATE.STARTING) &&
          (
            <div className="Status__readiness">
              <p> Starting python shell...</p>
            </div>
          )
      }
      { statusReadyScenariosLogfiles !== null && !isScenarioRunning && statusReadyScenariosLogfiles.name &&
        <div> 
          <p className="Status__finished-scenario" key={statusReadyScenariosLogfiles.name}>
            {statusReadyScenariosLogfiles.name} valmis
            &nbsp;
            <button className="Status__finished-scenario-logfile-link"
              onClick={() => statusReadyScenariosLogfiles.logfile !== undefined ? shell.openPath(statusReadyScenariosLogfiles.logfile): ''}
            >
              Lokit
            </button>
            &nbsp;
            <button className="Status__finished-scenario-logfile-link"
              onClick={() => statusReadyScenariosLogfiles.resultsPath[1] !== undefined ? shell.showItemInFolder(statusReadyScenariosLogfiles.resultsPath) : ''}
            >
              Tulokset
            </button>
            &nbsp;
            Ajoaika: { formatRunStatusTime(statusRunFinishTime, statusRunStartTime) }
          </p>
        </div>
      }
    </div>
  );
};

export default RunStatus;