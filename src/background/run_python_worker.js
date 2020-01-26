const ps = require('python-shell');
const {ipcRenderer} = require('electron');

/**
 * Reset and hide simulation status panel and results.
 */
// function resetStatus() {
//   document.getElementById('status-state').innerHTML = '';
//   document.getElementById('status-current').innerHTML = '';
//   document.getElementById('status-progress').innerHTML = "0 / 0 iteraatiota suoritettu, 0 virhettä.";
//   document.querySelector("#progressbar .percentage").setAttribute("style", "width: 0%; background-color: 'navy'};");
//   document.getElementById('message').textContent = "";
//   document.getElementById('log-link').setAttribute('style', 'visibility:hidden;');
//   document.getElementById('status-panel').setAttribute('style', 'visibility:hidden;');
// }

module.exports = {

  stopPythonShell: function (worker) {
    if (worker) {
      worker.terminate(1);
    }
  },

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
    worker.on('message', (event) => ipcRenderer.send('loggable-event-from-worker', event));
    worker.on('stderr', (event) => ipcRenderer.send('loggable-event-from-worker', event));
    worker.on('error', (error) => ipcRenderer.send('process-error-from-worker', error));
    // Send run parameters via stdin
    worker.send({
      scenario: runParameters.name,
      emme_path: runParameters.emme_project_file_path,
      data_path: runParameters.data_folder_path,
      iterations: runParameters.iterations,
      log_level: runParameters.log_level
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
    return worker;
  }
};
