const ps = require('python-shell');
const {ipcRenderer} = require('electron');

module.exports = {

  runInputValidationPythonShell: function (worker, allRunParameters, onEndCallback) {

    // Make sure worker isn't overridden (and if so, abort the run)
    if (worker) {
      alert("Worker already in progress."); // Should never occur
      return;
    }

    // Start helmet-model-system's helmet_validate_inputfiles.py in shell with EMME's python interpreter
    worker = new ps.PythonShell(
      `${allRunParameters[0].helmet_scripts_path}/helmet_validate_inputfiles.py`,
      {
        mode: 'json',
        pythonPath: allRunParameters[0].emme_python_path,
        pythonOptions: ['-u'], // unbuffered
        args: [
          "--log-level", allRunParameters[0].log_level,
          "--log-format", "JSON",
          "--baseline-data-path", allRunParameters[0].base_data_folder_path
        ]
          .concat(["--emme-paths"]).concat(allRunParameters.map(p => p.emme_project_file_path))
          .concat(["--first-scenario-ids"]).concat(allRunParameters.map(p => p.first_scenario_id))
          .concat(["--forecast-data-paths"]).concat(allRunParameters.map(p => p.forecast_data_folder_path))
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
      onEndCallback(err);
    });

    // Return worker, because the original reference isn't in use when assigning local worker var to new PythonShell().
    return worker;
  },

  runHelmetEntrypointPythonShell: function (worker, runParameters, onEndCallback) {

    // Make sure worker isn't overridden (and if so, abort the run)
    if (worker) {
      alert("Worker already in progress."); // Should never occur
      return;
    }

    // Start helmet-model-system's helmet.py in shell with EMME's python interpreter
    worker = new ps.PythonShell(
      `${runParameters.helmet_scripts_path}/helmet.py`,
      {
        mode: 'json',
        pythonPath: runParameters.emme_python_path,
        pythonOptions: ['-u'], // unbuffered
        args: [
          "--log-level", runParameters.log_level,
          "--log-format", "JSON",
          "--scenario-name", runParameters.name,
          "--results-path", runParameters.results_data_folder_path,
          "--emme-path", runParameters.emme_project_file_path,
          "--first-scenario-id", runParameters.first_scenario_id,
          "--baseline-data-path", runParameters.base_data_folder_path,
          "--forecast-data-path", runParameters.forecast_data_folder_path,
          "--iterations", runParameters.iterations
        ]
          .concat(runParameters.use_fixed_transit_cost ? ["--use-fixed-transit-cost"] : [])
          .concat(runParameters.DO_NOT_USE_EMME ? ["--do-not-use-emme"] : []),
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
