const path = require('path');
const {webFrame, ipcRenderer} = require('electron');
const _ = require('lodash');
const ps = require('python-shell');
const Store = require('electron-store');
const child_process = require('child_process');
const config = require('../config');

// Disable content zooming (it seems prone to glitching on Windows). https://github.com/electron/electron/issues/15496
webFrame.setZoomLevel(1);
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

let worker;
const store = new Store({'cwd': config.store.saveDir});

/**
 * Set status message, for displaying log messages above DEBUG level.
 */
function setMessage(text, isError) {
  const message = document.getElementById('message');
  message.textContent = text;
  message.setAttribute('class', isError ? 'error' : '');
}

/**
 * Set simulation state text.
 */
function setState(status) {

  const STATE_LABELS = {
    starting: 'Simulaatio aloitettu.',
    preparing: 'Simulaatiota valmistellaan.',
    running: 'Simulaatio käynnissä.',
    failed: 'Simulaatio epäonnistui.',
    aborted: 'Simulaatio epäonnistui.',
    finished: 'Simulaatio päättynyt.'
  };

  const {state, log, results} = status || {};

  document.getElementById('status-state').innerHTML = STATE_LABELS[state] || '';
}

/**
 * Update the results panel with given results.
 */
function setResults(status) {

  const {log, results} = status || {};
  const logLink = document.getElementById('log-link');
  const keyValues = document.getElementById("key-values");

  if (status && log) {
    logLink.setAttribute('href', `file:///${log}`);
    logLink.setAttribute('style', 'visibility:visible;');
  } else {
    logLink.setAttribute('style', 'visibility:hidden;');
  }

  if (results && !_.isEmpty(results)) {
    const formatted = _.flatMap(results, (res, i) => {
      const title = `Iteraatio ${i + 1}`;
      const values = _.map(res, (v, k) => `- ${k} = ${v}`);
      return _.concat(title, values).join('<br/>');
    });
    keyValues.innerHTML = formatted.join('<br/><br/>');

    const resultsDiv = document.getElementById("results");
    resultsDiv.scrollTop += resultsDiv.offsetTop;
  } else {
    keyValues.innerHTML = '';
  }
}

/**
 * Set current iteration status.
 */
function setCurrentIteration(status) {

  const i = status ? status.current : 0;
  const state = status ? status.state : null;

  const LABELS = {
    starting: 'Käynnistetään..',
    preparing: 'Valmistellaan..',
    running: `Iteraatio ${i} käynnissä..`,
    failed: `Iteraatio ${i} epäonnistui.`,
    aborted: 'Simuloinnin alustus epäonnistui.',
    finished: ' ',
  };

  const e = window.document.getElementById('status-current');
  e.innerHTML = LABELS[state] || '';
}

/**
 * Set progress indicators and update progress bar.
 */
function setProgress(completed, failed, total) {
  // About 30min per ajo, tarkoituksena löytää ekvivalenssi, viimeinen ajo saattaa kestää pidempään
  const txt = window.document.getElementById('status-progress');
  const bar = document.querySelector("#progressbar .percentage");
  const progress = Math.min(100, Math.round((completed + failed) / total * 100));
  const color = failed > 0 ? 'red' : 'navy';

  txt.innerHTML = `${completed} / ${total} iteraatiota suoritettu, ${failed} virhettä.`;
  bar.setAttribute("style", `width:${progress}%; background-color:${color};`);
}

/**
 * Reset and hide simulation status panel and results.
 */
function resetStatus() {
  setState(null);
  setCurrentIteration(null);
  setProgress(0, 0, store.get('iterations'));
  setMessage("");
  setResults(null);
  document.getElementById('status-panel').setAttribute('style', 'visibility:hidden;');
}

/**
 * Handle incoming message from helmet-model-system.
 */
function handleMsg(json) {
  if (json.level !== 'DEBUG') {
    setMessage(json.message, json.level === 'ERROR');
  }
  if (json.status) {
    document.getElementById('status-panel').setAttribute('style', 'visibility:visible;');
    setState(json.status);
    setProgress(json.status.completed, json.status.failed, json.status.total);
    setCurrentIteration(json.status);
    setResults(json.status);
  }
}

/**
 * Enable/disable control panel inputs.
 */
function setControlsEnabled(isEnabled) {
  document.querySelectorAll('input, label').forEach((i) => {
    if (isEnabled) {
      document.body.classList.remove('busy');
      i.removeAttribute('disabled');
    } else {
      document.body.classList.add('busy');
      i.setAttribute('disabled', 'true');
    }
  })
}

/**
 * Start or stop helmet-model-system.
 */
function runStop(e) {

  resetStatus();

  if (!validateSettings()) {
    return;
  }

  if (worker) {
    worker.terminate(1);
    worker = null;
    setControlsEnabled(true);
  } else {
    setControlsEnabled(false);
    document.getElementById('runStopButton').innerHTML = 'Lopeta';

    const scenario = store.get('scenario_name');
    const pythonPath = store.get('emme_python_path');
    const helmetPath = store.get('helmet_scripts_path');
    const helmet = `${helmetPath}/helmet_remote.py`;

    console.debug(pythonPath, helmetPath);

    const opts = {
      mode: 'json',
      pythonOptions: ['-u'],
      pythonPath: pythonPath,
    };

    const command = {
      scenario: scenario,
      emme_path: store.get('emme_project_file_path'),
      data_path: store.get('data_folder_path'),
      iterations: store.get('iterations'),
      log_level: 'DEBUG', // TODO make configurable
    };

    ipcRenderer.send('console.log', `running:  ${opts.pythonPath}  ${opts.pythonOptions}  ${helmet}\n`.split('  ').join('\n  '));
    worker = new ps.PythonShell(helmet, opts);
    worker.on('message', (json) => {
      console.debug('[message]', json);
      handleMsg(json);
    });
    worker.on('stderr', (json) => {
      console.debug('[stderr]', json);
      handleMsg(json);
    });
    worker.on('error', (err) => {
      console.error('[error]', err);
      setMessage(err.message, true);
    });
    ipcRenderer.send('console.log', `writing the python process stdin: ${JSON.stringify(command, null, " ")}\n`);
    worker.send(command);
    worker.end((err, code, signal) => {
      worker = null;
      setControlsEnabled(true);
      document.getElementById('runStopButton').innerHTML = 'Aloita';
      if (err) {
        console.error('[end]', err);
        alert(err.message);
      }
      console.debug(`Python exited with code ${code}, signal ${signal}.`);
    });
  }
}

/**
 * Check and notify on missing settings.
 */
function validateSettings() {

  const emp = store.get('emme_project_file_path');
  if (!emp) {
    alert("Emme-projektia ei ole valittu!");
    return false;
  }

  const data = store.get('data_folder_path');
  if (!data) {
    alert("Data-kansiota ei ole valittu!");
    return false;
  }

  const helmet = store.get('helmet_scripts_path');
  if (!helmet) {
    alert("Helmet Scripts -kansiota ei ole asetettu, tarkista Asetukset.");
    return false;
  }

  const python = store.get('emme_python_path');
  if (!python) {
    alert("Python -sijaintia ei ole asetettu!");
    return false;
  }

  const iter = store.get('iterations');
  if (iter < 1 || iter > 99) {
    alert("Aseta iteraatiot väliltä 1 - 99.");
    return false;
  }

  return true;
}

resetStatus();
