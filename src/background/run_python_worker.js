const ps = require('python-shell');
const {ipcRenderer} = require('electron');

module.exports = {

  runPythonShell: function (worker, runParameters, onEndCallback) {

    // Make sure worker isn't overridden (and if so, abort the run)
    if (worker) {
      alert("Worker already in progress."); // Should never occur
      return;
    }

    // Start helmet-model-system's helmet_remote.py in shell with python interpreter
    worker = new ps.PythonShell(
      `${runParameters.helmet_scripts_path}/helmet_remote.py`,
      {
        mode: 'json',
        pythonOptions: ['-u'],
        pythonPath: runParameters.emme_python_path,
      });

    // Attach runtime handlers (stdout/stderr, process errors)
    worker.on('message', (event) => ipcRenderer.send('loggable-event-from-worker', {...event, time: new Date()}));
    worker.on('stderr', (event) => ipcRenderer.send('loggable-event-from-worker', {...event, time: new Date()}));
    worker.on('error', (error) => ipcRenderer.send('process-error-from-worker', error));

    // Send run parameters via stdin
    worker.send({
      scenario: runParameters.name,
      emme_path: runParameters.emme_project_file_path,
      first_scenario_id: Number(runParameters.first_scenario_id),
      data_path: runParameters.data_folder_path,
      use_fixed_transit_cost: runParameters.use_fixed_transit_cost,
      iterations: Number(runParameters.iterations),
      log_level: runParameters.log_level,
      use_emme: !runParameters.DO_NOT_USE_EMME
    });

    // Attach end handler
    worker.end((err, code, signal) => {
      worker = null;
      if (err) {
        ipcRenderer.send('process-error-from-worker', err.message);
      }
      ipcRenderer.send('scenario-complete', runParameters.name);
      onEndCallback();
    });

    // Return worker, because the original reference isn't in use when assigning local worker var to new PythonShell().
    return worker;
  }
};
