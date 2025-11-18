import React from 'react';
import { Chart as ChartJS, LinearScale, LineElement, PointElement, CategoryScale, Tooltip, Legend, Title } from "chart.js";
import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime'
import { SCENARIO_STATUS_STATE } from '../../../../../enums.js';
import { useHelmetModelContext } from '../../../../context/HelmetModelContext';
import { ReadyScenarioLogfile } from '../../../../../types';

const shell = window.electronAPI.shell;

dayjs.extend(duration);
dayjs.extend(relativeTime);
ChartJS.register(LinearScale, LineElement, CategoryScale, PointElement, Tooltip, Legend, Title);

interface RunStatusProps {
  isScenarioRunning: boolean;
  statusIterationsTotal: number | null;
  statusIterationsCompleted: number | null;
  statusReadyScenariosLogfiles: ReadyScenarioLogfile[] | null;
  statusRunStartTime: string | number | null;
  statusRunFinishTime: string | number | null;
  statusState: string | null;
  demandConvergenceArray: Array<{
    iteration: number;
    value?: number;       // For Helmet versions < 5
    rel_gap?: number;     // For Helmet versions >= 5
    max_gap?: number;     // For Helmet versions >= 5
  }> | null;
}


const RunStatus = ({ isScenarioRunning, statusIterationsTotal, statusIterationsCompleted, statusReadyScenariosLogfiles, statusRunStartTime, statusRunFinishTime, statusState, demandConvergenceArray }: RunStatusProps) => {
  const { majorVersion } = useHelmetModelContext();
  const safeArray = Array.isArray(demandConvergenceArray) ? demandConvergenceArray : []; // Ensure demandConvergenceArray is defined as an array even if null

  let graphData: ChartData<"line"> = {
    labels: [],
    datasets: []
  };

  let graphOptions: ChartOptions<"line"> = {};


  if (majorVersion && majorVersion >= 5) {
    // console.log("Using Helmet 5 or later");
    graphData = {
      labels: safeArray.map(l => l.iteration),
      datasets: [
        {
          label: "Rel gap",
          data: safeArray.map(l =>
            l.rel_gap !== undefined ? Number((l.rel_gap * 100).toFixed(4)) : null
          ),
          backgroundColor: "#007AC9",
          borderColor: "#007AC9",
          yAxisID: "y",
        },
        {
          label: "Max gap",
          data: safeArray.map(l =>
            l.max_gap !== undefined ? Number(l.max_gap.toFixed(4)) : null
          ),
          backgroundColor: "#FB5F20",
          borderColor: "#FB5F20",
          yAxisID: "y1",
        },
      ],
    };

    graphOptions = {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        title: { display: true, text: "Convergence", align: "center" },
        legend: { display: true },
      },
      scales: {
        y: {
          position: "left",
          title: { display: true, text: "Rel gap [%]" },
        },
        y1: {
          position: "right",
          title: { display: true, text: "Max gap" },
          grid: { drawOnChartArea: false },
        },
        x: {
          title: { display: true, text: "Iteration [#]" },
        },
      },
    };
  } else {
    graphData = {
      labels: safeArray.map(l => l.iteration),
      datasets: [
        {
          label: "Rel_Gap (%)",
          data: safeArray.map(l => Number((l.value! * 100).toFixed(4))),
          backgroundColor: "#007AC9",
          borderColor: "#007AC9",
        },
      ],
    };

    graphOptions = {
      plugins: {
        title: { display: true, text: "Convergence", align: "center" },
        legend: { display: false },
      },
      scales: {
        y: {
          title: { display: true, text: "Rel_Gap [%]" },
        },
        x: {
          title: { display: true, text: "Iteration [#]" },
        },
      },
    };

  }

  const formatRunStatusTime = (
    runFinishTime: string | number | null,
    runStartTime: string | number | null
  ) => {
    if (!runFinishTime || !runStartTime) return "-";

    const diff = dayjs(runFinishTime).diff(dayjs(runStartTime));
    const formattedTime = dayjs.duration(diff).format("HH[h]:mm[m]:ss[s]");

    return formattedTime !== "NaNh:NaNm:NaNs" ? formattedTime : "-";
  };


  return (
    <div className="Status">
      {
        (statusState === SCENARIO_STATUS_STATE.RUNNING || statusState === SCENARIO_STATUS_STATE.FINISHED) &&
          <div>
            <div className="Status__readiness">
              <Line className="runtime-chart" options={graphOptions} data={graphData} />
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
      { statusReadyScenariosLogfiles &&
      !isScenarioRunning &&
      statusReadyScenariosLogfiles.map(item => (
        <div>
          <p className="Status__finished-scenario" key={item.name}>
            {item.name} valmis
            &nbsp;
            <button
              className="Status__finished-scenario-logfile-link"
              onClick={() => item.logfile ? shell.openPath(item.logfile): ''}
            >
              Lokit
            </button>
            &nbsp;
            <button
              className="Status__finished-scenario-logfile-link"
              onClick={() => item.resultsPath[0] ? shell.showItemInFolder(item.resultsPath[0]) : ''}
            >
              Tulokset
            </button>
            &nbsp;
            Ajoaika: { formatRunStatusTime(statusRunFinishTime, statusRunStartTime) }
          </p>
        </div>
      ))
    }

    </div>
  );
};

export default RunStatus;