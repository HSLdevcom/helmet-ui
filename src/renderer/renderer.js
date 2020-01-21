const _ = require('lodash');
const ps = require('python-shell');

/**
 * Reset and hide simulation status panel and results.
 */
function resetStatus() {
  document.getElementById('status-state').innerHTML = '';
  document.getElementById('status-current').innerHTML = '';
  document.getElementById('status-progress').innerHTML = "0 / 0 iteraatiota suoritettu, 0 virhettä.";
  document.querySelector("#progressbar .percentage").setAttribute("style", "width: 0%; background-color: 'navy'};");
  document.getElementById('message').textContent = "";
  document.getElementById('log-link').setAttribute('style', 'visibility:hidden;');
  document.getElementById('status-panel').setAttribute('style', 'visibility:hidden;');
}

/**
 * Handle incoming message from helmet-model-system.
 */
function handleMsg(json) {
  if (json.level !== 'DEBUG') {
    const message = document.getElementById('message');
    message.textContent = json.message;
    message.setAttribute('class', json.level === 'ERROR' ? 'error' : '');
  }
  if (json.status) {
    document.getElementById('status-panel').setAttribute('style', 'visibility:visible;');
    const STATE_LABELS = {
      starting: 'Simulaatio aloitettu.',
      preparing: 'Simulaatiota valmistellaan.',
      running: 'Simulaatio käynnissä.',
      failed: 'Simulaatio epäonnistui.',
      aborted: 'Simulaatio epäonnistui.',
      finished: 'Simulaatio päättynyt.'
    };
    document.getElementById('status-state').innerHTML = STATE_LABELS[json.status.state];
    // Progress: About 30min per ajo, tarkoituksena löytää ekvivalenssi, viimeinen ajo saattaa kestää pidempään
    document.getElementById('status-progress').innerHTML = (
      `${json.status.completed} / ${json.status.total} iteraatiota suoritettu, ${json.status.failed} virhettä.`
    );
    document.querySelector("#progressbar .percentage")
      .setAttribute(
        "style",
        `width: ${Math.min(100, Math.round((json.status.completed + json.status.failed) / json.status.total * 100))}%; background-color: ${json.status.failed > 0 ? 'red' : 'navy'};`
      );
    const LABELS = {
      starting: 'Käynnistetään..',
      preparing: 'Valmistellaan..',
      running: `Iteraatio ${json.status.current} käynnissä..`,
      failed: `Iteraatio ${json.status.current} epäonnistui.`,
      aborted: 'Simuloinnin alustus epäonnistui.',
      finished: ' ',
    };
    document.getElementById('status-current').innerHTML = LABELS[json.status.state];
    const {log, results} = json.status;
    document.getElementById('log-link').setAttribute('href', `file:///${log}`);
    document.getElementById('log-link').setAttribute('style', 'visibility:visible;');
    if (results && !_.isEmpty(results)) {
      const formatted = _.flatMap(results, (res, i) => {
        const title = `Iteraatio ${i + 1}`;
        const values = _.map(res, (v, k) => `- ${k} = ${v}`);
        return _.concat(title, values).join('<br/>');
      });
      document.getElementById("key-values").innerHTML = formatted.join('<br/><br/>');
      document.getElementById("results").scrollTop += document.getElementById("results").offsetTop;
    } else {
      document.getElementById("key-values").innerHTML = '';
    }
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
function runStop(worker, store) {

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
      const message = document.getElementById('message');
      message.textContent = err.message;
      message.setAttribute('class', 'error');
    });
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
function validateSettings(store) {

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
