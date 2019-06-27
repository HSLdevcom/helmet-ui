const ps = require('python-shell')
const Store = require('electron-store')

let worker

const schema = {
	'emme.path': {
		type: 'string',
    },
    'data.path': {
        type: 'string',
    },
    'python.path': {
        type: 'string',
    },
    'helmet.remote.path': {
        type: 'string',
    },
	'helmet.run.iterations': {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 5
	}
};
const store = new Store(schema)

const setStatus = (text) => {
    window.document
        .getElementById("status")
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

    const emme = window.document.getElementById("emme").files[0]
    const data = window.document.getElementById("data").files[0]
    const iterations = window.document.getElementById("iterations").value
    const python = window.document.getElementById("python").files[0]
    const remote = window.document.getElementById("scripts").files[0]

    if (emme) {
        store.set('emme.path', emme.path)
    }
    if (data) {
        store.set('data.path', data.path)
    }
    if (python) {
        store.set('python.path', python.path)
    }
    if (remote) {
        store.set('helmet.remote.path', remote.path)
    }
    if (iterations) {
        store.set('helmet.run.iterations', parseInt(iterations))
    }    
}

const runStop = (e) => {
    
    if (worker) {
        worker.terminate(1)
        worker = null
    } else {
        
        const pythonPath = store.get('python.path')
        const remoteScript = store.get('helmet.remote.path');

        console.debug(pythonPath, remoteScript)

        const opts = {
            mode: 'json',
            pythonOptions: ['-u'],
            pythonPath: pythonPath
        }

        const command = {
            emme: store.get('emme.path'),
            data: store.get('data.path'),
            iterations: store.get('helmet.run.iterations')
        }
        console.log(command);

        worker = new ps.PythonShell(remoteScript, opts)
        worker.on('message', onMessage)
        worker.send(command)
        worker.end(onEnd)
    }
}

const closeDialog = (e) => {
    // TODO persist settings
    document.getElementById("settings").close()
}

const settingsClick = (e) => {
    document.getElementById("settings").show()
}

window.document
    .getElementById("emme")
    .addEventListener('change', settingsChange)

window.document
    .getElementById("data")
    .addEventListener('change', settingsChange)

window.document
    .getElementById("iterations")
    .addEventListener('change', settingsChange)

window.document
    .getElementById("python")
    .addEventListener('change', settingsChange)

window.document
    .getElementById("scripts")
    .addEventListener('change', settingsChange)

window.document
    .getElementById("settingsButton")
    .addEventListener('click', settingsClick)

window.document
    .getElementById("dialogOkButton")
    .addEventListener('click', closeDialog)

window.document
    .getElementById("dialogCancelButton")
    .addEventListener('click', closeDialog)

window.document
    .getElementById("runStopButton")
    .addEventListener('click', runStop)
