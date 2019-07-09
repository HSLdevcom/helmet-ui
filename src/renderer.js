const path = require('path')
const ps = require('python-shell')
const Store = require('electron-store')
const config = require('./config')

let worker
const props = config.store.properties;
const store = new Store(config.store.schema);

const setLabel = (id, txt, title) => {
    const label = window.document.getElementById(id)
    if (label) {
        label.innerHTML = txt
        label.setAttribute('title', title);
    }
}

const initSettings = () => {

    const emme = store.get(props.EmmePath)
    if (emme) {
        setLabel('emme-label', path.basename(store.get(props.EmmePath)), store.get(props.EmmePath));
    }

    const data = store.get(props.DataPath)
    if (data) {
        setLabel('data-label', path.basename(store.get(props.DataPath)), store.get(props.DataPath));
    }    

    const python = store.get(props.PythonPath)
    if (python) {
        setLabel('python-label', path.basename(store.get(props.PythonPath)), store.get(props.PythonPath));
    }

    const helmet = store.get(props.HelmetPath)
    if (helmet) {
        setLabel('scripts-label', path.basename(store.get(props.HelmetPath)), store.get(props.HelmetPath));    
    }

    window.document.getElementById('iterations').value = store.get(props.Iterations)
}

initSettings();

const setStatus = (text, isError) => {
    const status = window.document.getElementById('status')
    status.textContent = text
    status.setAttribute('class', isError ? 'error' : '')
}

const handleMsg = (json) => {
    if (json.level !== 'DEBUG') {
        setStatus(json.msg, json.level === 'ERROR')
    }
}

const onMessage = (json) => {
    console.debug('[message]', json)
    handleMsg(json)
}

const onStdErr = (json) => {
    console.debug('[stderr]', json)
    handleMsg(json)
}

const onError = (err) => {
    console.error('[error]', err)
    setStatus(err.message, true)
}

const onEnd = (err, code, signal) => {
    worker = null
    if (err) {
        console.error('[end]', err)
        setStatus(err.message, true);
    }
    console.debug(`Python exited with code ${code}, signal ${signal}.`)
}

const settingsChange = (e) => {

    const emme = window.document.getElementById('emme').files[0]
    const data = window.document.getElementById('data').files[0]
    const iterations = window.document.getElementById('iterations').value
    const python = window.document.getElementById('python').files[0]
    const scripts = window.document.getElementById('scripts').files[0]

    if (emme) {
        store.set(props.EmmePath, emme.path)        
        setLabel('emme-label', path.basename(emme.path), emme.path);
    }
    if (data) {
        store.set(props.DataPath, data.path)
        setLabel('data-label', path.basename(data.path), data.path);
    }
    if (python) {
        store.set(props.PythonPath, python.path)
        setLabel('python-label', path.basename(python.path), python.path);
    }
    if (scripts) {
        store.set(props.HelmetPath, scripts.path)
        setLabel('scripts-label', path.basename(scripts.path), scripts.path);
    }
    if (iterations) {
        store.set(props.Iterations, parseInt(iterations))
    }
}

const runStop = (e) => {
    setStatus("")
    if (worker) {
        worker.terminate(1)
        worker = null
    } else {

        const pythonPath = store.get(props.PythonPath)
        const helmetPath = store.get(props.HelmetPath)
        const helmetScript = `${helmetPath}/helmet_remote.py`

        console.debug(pythonPath, helmetScript)

        const opts = {
            mode: 'json',
            pythonOptions: ['-u'],
            pythonPath: pythonPath
        }

        const command = {
            emme_path: store.get(props.EmmePath),
            data_path: store.get(props.DataPath),
            iterations: store.get(props.Iterations),
            log_level: 'DEBUG' // TODO make configurable
        }

        worker = new ps.PythonShell(helmetScript, opts)
        worker.on('message', onMessage)
        worker.on('stderr', onStdErr);
        worker.on('error', onError);
        worker.send(command)
        worker.end(onEnd)
    }
}

const closeDialog = (e) => {
    document.getElementById('settings').close()
}

const settingsClick = (e) => {
    document.getElementById('settings').show()
}

window.document
    .getElementById('emme')
    .addEventListener('change', settingsChange)

window.document
    .getElementById('data')
    .addEventListener('change', settingsChange)

window.document
    .getElementById('iterations')
    .addEventListener('change', settingsChange)

window.document
    .getElementById('python')
    .addEventListener('change', settingsChange)

window.document
    .getElementById('scripts')
    .addEventListener('change', settingsChange)

window.document
    .getElementById('settingsButton')
    .addEventListener('click', settingsClick)

window.document
    .getElementById('closeDialogButton')
    .addEventListener('click', closeDialog)

window.document
    .getElementById('runStopButton')
    .addEventListener('click', runStop)

process.on('uncaughtException', (err) => {
    if (err) console.error(err);
});