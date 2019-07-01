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
    console.debug('Message from Python:', JSON.stringify(json))
    if (json.msg) setStatus(json.msg)
}

const onEnd = (err, code, signal) => {
    if (err) throw err
    worker = null
    console.debug(`Python exited with code ${code}, signal ${signal}.`)
}

const settingsChange = (e) => {

    const emme = window.document.getElementById('emme').files[0]
    const data = window.document.getElementById('data').files[0]
    const iterations = window.document.getElementById('iterations').value
    const python = window.document.getElementById('python').files[0]
    const remote = window.document.getElementById('scripts').files[0]

    if (emme) {
        store.set(props.EmmePath, emme.path)
    }
    if (data) {
        store.set(props.DataPath, data.path)
    }
    if (python) {
        store.set(props.PythonPath, python.path)
    }
    if (remote) {
        store.set(props.HelmetRemote, remote.path)
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
        const remoteScript = store.get(props.HelmetRemote);

        console.debug(pythonPath, remoteScript)

        const opts = {
            mode: 'json',
            pythonOptions: ['-u'],
            pythonPath: pythonPath
        }

        const command = {
            emme: store.get(props.EmmePath),
            data: store.get(props.DataPath),
            iterations: store.get(props.Iterations)
        }
        console.log(command);

        worker = new ps.PythonShell(remoteScript, opts)
        worker.on('message', onMessage)
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
    .getElementById('dialogOkButton')
    .addEventListener('click', closeDialog)

window.document
    .getElementById('dialogCancelButton')
    .addEventListener('click', closeDialog)

window.document
    .getElementById('runStopButton')
    .addEventListener('click', runStop)
