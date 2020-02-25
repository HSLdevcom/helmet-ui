const ps = require('python-shell');
const {ipcRenderer} = require('electron');
const path = require('path');

module.exports = {

  runCBAScriptPythonShell: function (worker, runParameters, onEndCallback) {

    // Make sure worker isn't overridden (and if so, abort the run)
    if (worker) {
      alert("Worker already in progress."); // Should never occur
      return;
    }

    // Start helmet-model-system's cba.py script with EMME's python interpreter
    const baseline_scenario = path.basename(runParameters.baseline_scenario_path);
    const projected_scenario = path.basename(runParameters.projected_scenario_path);
    worker = new ps.PythonShell(
      `${runParameters.helmet_scripts_path}/cba.py`,
      {
        mode: 'json',
        pythonPath: runParameters.emme_python_path,
        pythonOptions: ['-u'], // unbuffered
        args: [baseline_scenario, projected_scenario, runParameters.evaluation_year]
      });

    // Attach runtime handlers (stdout/stderr, process errors)
    worker.on('message', (event) => ipcRenderer.send('loggable-event-from-worker', {...event, time: new Date()}));
    worker.on('stderr', (event) => ipcRenderer.send('loggable-event-from-worker', {...event, time: new Date()}));
    worker.on('error', (error) => ipcRenderer.send('process-error-from-worker', error));

    // Attach end handler
    worker.end((err, code, signal) => {
      worker = null;
      if (err) {
        ipcRenderer.send('process-error-from-worker', err.message);
      }
      onEndCallback();
    });

    // Return worker, because the original reference isn't in use when assigning local worker var to new PythonShell().
    return worker;
  }
};
