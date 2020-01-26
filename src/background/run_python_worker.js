const ps = require('python-shell');

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

/**
 * Start or stop helmet-model-system.
 */
function runStop(worker, runParameters) {

  if (worker) {
    worker.terminate(1);
    worker = null;
  } else {
    worker = new ps.PythonShell(
      `${runParameters.helmet_scripts_path}/helmet_remote.py`,
      {
        mode: 'json',
        pythonOptions: ['-u'],
        pythonPath: runParameters.emme_python_path,
      });
    worker.on('message', (json) => {
      console.debug('[message]', json);
      // json.level = 'DEBUG', 'INFO', 'WARN', 'ERROR'
      // json.message = '...'
      // {"status":
      // Progress: About 30min per ajo, tarkoituksena löytää ekvivalenssi, viimeinen ajo saattaa kestää pidempään
      //     {"name": "helmet",
      //      "completed": 0,
      //      "current": 0,
      //      "failed": 0,  background-color: ${json.status.failed > 0 ? 'red' : 'navy'}
      //      "state": "starting",
      //              starting: 'Käynnistetään..',
      //              preparing: 'Valmistellaan..',
      //              running: `Iteraatio ${json.status.current} käynnissä..`,
      //              failed: `Iteraatio ${json.status.current} epäonnistui.`,
      //              aborted: 'Simuloinnin alustus epäonnistui.',
      //              finished: ' ',
      //      "total": 5,
      //      "log": "C:\\Users\\mwah\\Documents\\Github\\helmet-model-system\\Scripts\\helmet.log"
      // },
      //  "message": "Initializing matrices and models..",
      //  "level": "INFO"
      //  }
      // {"status":
      //     {"name": "helmet",
      //      "completed": 0,
      //      "results": [],
      //      "current": 0,
      //      "failed": 0,
      //      "state": "preparing",
      //      "total": 5,
      //      "log": "C:\\Users\\mwah\\Documents\\Github\\helmet-model-system\\Scripts\\helmet.log"
      //  },
      //   "message": "Starting simulation with 5 iterations..",
      //   "level": "INFO"
      //  }
    });
    worker.on('stderr', (json) => {
      console.debug('[stderr]', json);
      // json.level = 'DEBUG', 'INFO', 'ERROR'
      // json.message = '...'
    });
    worker.on('error', (err) => {
      console.error('[error]', err);
      const message = document.getElementById('message');
      message.textContent = err.message;
      message.setAttribute('class', 'error');
    });
    worker.send({
      scenario: runParameters.name,
      emme_path: runParameters.emme_project_file_path,
      data_path: runParameters.data_folder_path,
      iterations: runParameters.iterations,
      log_level: runParameters.log_level
    });
    worker.end((err, code, signal) => {
      worker = null;
      /**
       * Enable control panel inputs. And mark body.cursor = normal
       */
      if (err) {
        console.error('[end]', err);
        alert(err.message);
      }
      console.debug(`Python exited with code ${code}, signal ${signal}.`);
    });
  }
}
