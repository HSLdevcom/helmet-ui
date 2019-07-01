const ps = require('python-shell')
const Store = require('electron-store')
const config = require('./config');

let worker
const props = config.store.properties;
const store = new Store(config.store.schema);

// TODO set others too
window.document.getElementById('iterations').value = store.get(props.Iterations)

const setStatus = (text) => {
    window.document
        .getElementById('status')
        .textContent = text
}

const onMessage = (json) => {
    if (json.level === 'DEBUG') console.debug(json)
    if (json.level === 'INFO') setStatus(json.msg)
}

const onStdErr = (err) => {
    console.log(err)
    setStatus(`Error: ${err.message}`)
}

const onEnd = (err, code, signal) => {
    if (err) {
        console.error(err)
        throw err
    }
    worker = null
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
    }
    if (data) {
        store.set(props.DataPath, data.path)
    }
    if (python) {
        store.set(props.PythonPath, python.path)
    }
    if (scripts) {
        store.set(props.HelmetPath, scripts.path)
    }
    if (iterations) {
        store.set(props.Iterations, parseInt(iterations))
    }
}

const runStop = (e) => {
    
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
        worker.on('error', (e) => console.error(e.message))
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
