const path = require('path');
const _ = require('lodash');
const ps = require('python-shell');
const Store = require('electron-store');
const config = require('../config');
const {version} = require('../../package.json');
const {webFrame} = require('electron');
const child_process = require('child_process');
const {searchEMMEPython} = require('./search_emme_pythonpath');

// Disable content zooming (it seems prone to glitching on Windows). https://github.com/electron/electron/issues/15496
webFrame.setZoomLevel(1);
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

let worker;
const props = config.store.properties;
const store = new Store(config.store.schema);

// Try to find EMME's Python if not set
if (!store.get(config.store.properties.PythonPath)) {
  const [found, path] = searchEMMEPython();
  if (found) {
    const v = config.emme.pythonVersion;
    const ok = confirm(`Python ${v} löytyi sijainnista:\n\n${path}\n\nHaluatko käyttää tätä sijaintia?`);
    if (ok) {
      store.set(config.store.properties.PythonPath, path);
      initSettings();
    }
  } else {
    const ev = config.emme.version;
    const pv = config.emme.pythonVersion;
    alert(`Emme ${ev} ja Python ${pv} eivät löytyneet oletetusta sijainnista.\n\nMääritä Pythonin sijainti Asetukset-dialogissa.`);
  }
}

/**
 * Set button labels for selecting the Emme project (.emp) and data folder.
 */
function setLabel(id, txt, title) {
  const label = window.document.getElementById(id);
  if (label) {
    label.innerHTML = txt;
    label.setAttribute('title', title);
  }
}

/**
 * Display all current settings in Store.
 */
function initSettings() {

  const emme = store.get(props.EmmePath);
  if (emme) {
    setLabel('emme-label', path.basename(store.get(props.EmmePath)), store.get(props.EmmePath));
  }

  const data = store.get(props.DataPath);
  if (data) {
    setLabel('data-label', path.basename(store.get(props.DataPath)), store.get(props.DataPath));
  }

  const python = store.get(props.PythonPath);
  if (python) {
    setLabel('python-label', path.basename(store.get(props.PythonPath)), store.get(props.PythonPath));
  }

  const helmet = store.get(props.HelmetPath);
  if (helmet) {
    setLabel('scripts-label', path.basename(store.get(props.HelmetPath)), store.get(props.HelmetPath));
  }

  const iterations = store.get(props.Iterations);
  if (iterations) {
    window.document.getElementById('iterations').value = iterations;
  }

  const scenario = store.get(props.Scenario);
  if (scenario) {
    document.getElementById('scenario').value = scenario;
  }
}

/**
 * Settings change listener, persist immediately.
 */
function settingsChange(e) {

  const emme = window.document.getElementById('emme').files[0];
  const data = window.document.getElementById('data').files[0];
  const iterations = window.document.getElementById('iterations').value;
  const python = window.document.getElementById('python').files[0];
  const scripts = window.document.getElementById('scripts').files[0];
  const scenario = window.document.getElementById('scenario').value;

  if (emme) {
    store.set(props.EmmePath, emme.path);
    setLabel('emme-label', path.basename(emme.path), emme.path);
  }
  if (data) {
    store.set(props.DataPath, data.path);
    setLabel('data-label', path.basename(data.path), data.path);
  }
  if (python) {
    store.set(props.PythonPath, python.path);
    setLabel('python-label', path.basename(python.path), python.path);
  }
  if (scripts) {
    store.set(props.HelmetPath, scripts.path);
    setLabel('scripts-label', path.basename(scripts.path), scripts.path);
  }
  if (iterations) {
    const prevIter = store.get(props.Iterations);
    store.set(props.Iterations, parseInt(iterations));
    if (prevIter !== iterations) {
      resetStatus();
      setProgress(0, 0, iterations);
    }
  }
  if (scenario) {
    store.set(props.Scenario, scenario);
  }
}

/**
 * Set status message, for displaying log messages above DEBUG level.
 */
function setMessage(text, isError) {
  const message = window.document.getElementById('message');
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

  window.document
    .getElementById('status-state')
    .innerHTML = STATE_LABELS[state] || '';
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
 * Request main process to open given URL with associated app.
 */
function openLink(e) {
  e.preventDefault();
  const COMMANDS = {'darwin': 'open', 'win32': 'start', 'linux': 'xdg-open'};
  const url = e.target.getAttribute('href');
  child_process.exec(`${COMMANDS[process.platform]} ${url}`, console.error);
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
  setProgress(0, 0, store.get(props.Iterations));
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

function onMessage(json) {
  console.debug('[message]', json);
  handleMsg(json);
}

function onStdErr(json) {
  console.debug('[stderr]', json);
  handleMsg(json);
}

function onError(err) {
  console.error('[error]', err);
  setMessage(err.message, true);
}

function onEnd(err, code, signal) {
  worker = null;
  setControlsEnabled(true);
  document.getElementById('runStopButton').innerHTML = 'Aloita';
  if (err) {
    console.error('[end]', err);
    alert(err.message);
  }
  console.debug(`Python exited with code ${code}, signal ${signal}.`);
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

    const scenario = store.get(props.Scenario);
    const pythonPath = store.get(props.PythonPath);
    const helmetPath = store.get(props.HelmetPath);
    const helmet = `${helmetPath}/helmet_remote.py`;

    console.debug(pythonPath, helmetPath);

    const opts = {
      mode: 'json',
      pythonOptions: ['-u'],
      pythonPath: pythonPath,
    };

    const command = {
      scenario: scenario,
      emme_path: store.get(props.EmmePath),
      data_path: store.get(props.DataPath),
      iterations: store.get(props.Iterations),
      log_level: 'DEBUG', // TODO make configurable
    };

    worker = new ps.PythonShell(helmet, opts);
    worker.on('message', onMessage);
    worker.on('stderr', onStdErr);
    worker.on('error', onError);
    worker.send(command);
    worker.end(onEnd);
  }
}

/**
 * Check and notify on missing settings.
 */
function validateSettings() {

  const emp = store.get(props.EmmePath);
  if (!emp) {
    alert("Emme-projektia ei ole valittu!");
    return false;
  }

  const data = store.get(props.DataPath);
  if (!data) {
    alert("Data-kansiota ei ole valittu!");
    return false;
  }

  const helmet = store.get(props.HelmetPath);
  if (!helmet) {
    alert("Helmet Scripts -kansiota ei ole asetettu, tarkista Asetukset.");
    return false;
  }

  const python = store.get(props.PythonPath);
  if (!python) {
    alert("Python -sijaintia ei ole asetettu!");
    return false;
  }

  const iter = store.get(props.Iterations);
  if (iter < 1 || iter > 99) {
    alert("Aseta iteraatiot väliltä 1 - 99.");
    return false;
  }

  return true;
}

function closeDialog(e) {
  document.getElementById('settings').close();
  document.getElementById('shader').setAttribute('style', 'display: none;');
}

function settingsClick(e) {
  document.getElementById('shader').setAttribute('style', 'display: block;');
  document.getElementById('settings').show();
}

window.document
  .getElementById('version')
  .innerText = `UI v${version}`;

window.document
  .getElementById('emme')
  .addEventListener('change', settingsChange);

window.document
  .getElementById('data')
  .addEventListener('change', settingsChange);

window.document
  .getElementById('iterations')
  .addEventListener('change', settingsChange);

window.document
  .getElementById('python')
  .addEventListener('change', settingsChange);

window.document
  .getElementById('scripts')
  .addEventListener('change', settingsChange);

window.document
  .getElementById('scenario')
  .addEventListener('change', settingsChange);

window.document
  .getElementById('settingsButton')
  .addEventListener('click', settingsClick);

window.document
  .getElementById('closeDialogButton')
  .addEventListener('click', closeDialog);

window.document
  .getElementById('runStopButton')
  .addEventListener('click', runStop);

window.document
  .getElementById('log-link')
  .addEventListener('click', openLink);

process.on('uncaughtException', (err) => {
  if (err) {
    console.error(err);
    alert(err);
  }
});

initSettings();
resetStatus();
