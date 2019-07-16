const path = require('path')
const ps = require('python-shell')
const Store = require('electron-store')
const config = require('./config')

let worker
const props = config.store.properties
const store = new Store(config.store.schema)

function setLabel(id, txt, title) {
    const label = window.document.getElementById(id)
    if (label) {
        label.innerHTML = txt
        label.setAttribute('title', title)
    }
}

function initSettings() {

    const emme = store.get(props.EmmePath)
    if (emme) {
        setLabel('emme-label', path.basename(store.get(props.EmmePath)), store.get(props.EmmePath))
    }

    const data = store.get(props.DataPath)
    if (data) {
        setLabel('data-label', path.basename(store.get(props.DataPath)), store.get(props.DataPath))
    }    

    const python = store.get(props.PythonPath)
    if (python) {
        setLabel('python-label', path.basename(store.get(props.PythonPath)), store.get(props.PythonPath))
    }

    const helmet = store.get(props.HelmetPath)
    if (helmet) {
        setLabel('scripts-label', path.basename(store.get(props.HelmetPath)), store.get(props.HelmetPath))    
    }

    window.document.getElementById('iterations').value = store.get(props.Iterations)
}

function setMessage(text, isError) {
    const message = window.document.getElementById('message')
    message.textContent = text
    message.setAttribute('class', isError ? 'error' : '')
}

function setState(state) {
    const e = window.document.getElementById('status-state')
    e.innerHTML = state ? `Simulation ${state}.` : 'Ready.'
}

function setCurrentIteration(current) {
    const e = window.document.getElementById('status-current')
    e.innerHTML = (current || 0) ? `Iteration ${current} in progress..` : ' '
}

function setProgress(completed, failed, total) {
    
    const txt = window.document.getElementById('status-progress')
    const bar = document.querySelector("#progressbar .done")
    const progress = Math.round(completed / total * 100)
    const color = failed > 0 ? 'red' : 'gray'

    txt.innerHTML = `${completed} of ${total} iterations completed, ${failed} failed.`
    bar.setAttribute("style", `width:${progress}%background-color:${color}`)
}

function resetStatus() {
    setState(null)
    setCurrentIteration(0)
    setProgress(0, 0, store.get(props.Iterations))
}

function handleMsg(json) {
    if (json.level !== 'DEBUG') {
        setMessage(json.message, json.level === 'ERROR')
    }
    if (json.status) {
        setState(json.status.state)
        setCurrentIteration(json.status.current)
        setProgress(json.status.completed, json.status.failed, json.status.total)

    }
}

function onMessage(json) {
    console.debug('[message]', json)
    handleMsg(json)
}

function onStdErr(json) {
    console.debug('[stderr]', json)
    handleMsg(json)
}

function onError(err) {
    console.error('[error]', err)
    setMessage(err.message, true)
}

function onEnd(err, code, signal) {
    worker = null
    if (err) {
        console.error('[end]', err)
        setMessage(err.message, true)
    }
    console.debug(`Python exited with code ${code}, signal ${signal}.`)
}

function settingsChange(e) {

    const emme = window.document.getElementById('emme').files[0]
    const data = window.document.getElementById('data').files[0]
    const iterations = window.document.getElementById('iterations').value
    const python = window.document.getElementById('python').files[0]
    const scripts = window.document.getElementById('scripts').files[0]

    if (emme) {
        store.set(props.EmmePath, emme.path)        
        setLabel('emme-label', path.basename(emme.path), emme.path)
    }
    if (data) {
        store.set(props.DataPath, data.path)
        setLabel('data-label', path.basename(data.path), data.path)
    }
    if (python) {
        store.set(props.PythonPath, python.path)
        setLabel('python-label', path.basename(python.path), python.path)
    }
    if (scripts) {
        store.set(props.HelmetPath, scripts.path)
        setLabel('scripts-label', path.basename(scripts.path), scripts.path)
    }
    if (iterations) {
        store.set(props.Iterations, parseInt(iterations))
    }
}

function runStop(e) {
    setMessage("")
    resetStatus()
    if (worker) {
        worker.terminate(1)
        worker = null
    } else {

        const pythonPath = store.get(props.PythonPath)
        const helmetPath = store.get(props.HelmetPath)
        const helmet = `${helmetPath}/helmet_remote.py`

        console.debug(pythonPath, helmetPath)

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

        worker = new ps.PythonShell(helmet, opts)
        worker.on('message', onMessage)
        worker.on('stderr', onStdErr)
        worker.on('error', onError)
        worker.send(command)
        worker.end(onEnd)
    }
}

function closeDialog(e) {
    document.getElementById('settings').close()
}

function settingsClick(e) {
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
    if (err) console.error(err)
})

initSettings()
resetStatus()
setMessage()
