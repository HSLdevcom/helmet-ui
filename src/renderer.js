const path = require('path')
const ps = require('python-shell')
const Store = require('electron-store')
const config = require('./config')
const { version } = require('../package.json')
const { ipcRenderer } = require('electron')

let worker
const props = config.store.properties
const store = new Store(config.store.schema)

// try to find Emme & Python if not set
if (!store.get(config.store.properties.PythonPath)) {
    ipcRenderer.send('check-emme')
}
ipcRenderer.on('emme-found', (event, path) => {
    const ok = confirm(`Python 2.7 löytyi sijainnista:\n\n${path}\n\nHaluatko käyttää tätä sijaintia?`)
    if (ok) {
        store.set(config.store.properties.PythonPath, path)
        initSettings()
    }
})
ipcRenderer.on('emme-not-found', () => {
    alert("Python 2.7 ei löytynyt oletetusta sijainnista.\n\nMääritä sijainti Asetukset-dialogissa.")
})

/**
 * Set button labels for selecting the Emme project (.emp) and data folder.
 */
function setLabel(id, txt, title) {
    const label = window.document.getElementById(id)
    if (label) {
        label.innerHTML = txt
        label.setAttribute('title', title)
    }
}

/**
 * Display all current settings in Store.
 */
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

    const iterations = store.get(props.Iterations)
    if (iterations) {
        window.document.getElementById('iterations').value = iterations
    }

    const scenario = store.get(props.Scenario)
    if (scenario) {
        document.getElementById('scenario').value = scenario
    }
}

/**
 * Settings change listener, persist immediately.
 */
function settingsChange(e) {

    const emme = window.document.getElementById('emme').files[0]
    const data = window.document.getElementById('data').files[0]
    const iterations = window.document.getElementById('iterations').value
    const python = window.document.getElementById('python').files[0]
    const scripts = window.document.getElementById('scripts').files[0]
    const scenario = window.document.getElementById('scenario').value

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
        const prevIter = store.get(props.Iterations)
        store.set(props.Iterations, parseInt(iterations))
        if (prevIter !== iterations) {
            resetStatus()
            setProgress(0, 0, iterations)
        }
    }
    if(scenario) {
        store.set(props.Scenario, scenario)
    }
}

/**
 * Set status message, for displaying log messages above DEBUG level.
 */
function setMessage(text, isError) {
    const message = window.document.getElementById('message')
    message.textContent = text
    message.setAttribute('class', isError ? 'error' : '')
}

/**
 * Set simulation state text.
 */
function setState(status) {


    const END_STATES = [
        'aborted', 'failed', 'finished'
    ]
    const STATE_LABELS = {
        starting: 'Simulaatio aloitettu.',
        preparing: 'Simulaatiota valmistellaan.',
        running: 'Simulaatio käynnissä.',
        failed: 'Simulaatio epäonnistui.',
        aborted: 'Simulaatio epäonnistui.',
        finished: 'Simulaatio päättynyt.'
    }

    const { state, log } = status || {}
    
    window.document
        .getElementById('status-state')
        .innerHTML = STATE_LABELS[state] || ''

    const logLink = document.getElementById('log-link')
    if (status && END_STATES.includes(state)) {
        const url = `file:///${log}`
        logLink.setAttribute('href', url)
        logLink.setAttribute('style', 'visibility:visible;')
    } else {
        logLink.setAttribute('style', 'visibility:hidden;')
    }
}

/**
 * Request main process to open given URL with associated app.
 */
function openLink(e) {
    e.preventDefault();
    const url = e.target.getAttribute('href')
    ipcRenderer.send('launch-url', url)
}

/**
 * Set current iteration status.
 */
function setCurrentIteration(status) {

    const i = status ? status.current : 0
    const state = status ? status.state : null 

    const LABELS = {
        starting: 'Käynnistetään..',
        preparing: 'Valmistellaan..',
        running: `Iteraatio ${i} käynnissä..`,
        failed: `Iteraatio ${i} epäonnistui.`,
        aborted: 'Simuloinnin alustus epäonnistui.',
        finished: ' '
    }

    const e = window.document.getElementById('status-current')
    e.innerHTML = LABELS[state] || ''
}

/**
 * Set progress indicators and update progress bar.
 */
function setProgress(completed, failed, total) {
    
    const txt = window.document.getElementById('status-progress')
    const bar = document.querySelector("#progressbar .percentage")
    const progress = Math.min(100, Math.round((completed + failed) / total * 100))
    const color = failed > 0 ? 'red' : 'navy'

    txt.innerHTML = `${completed} / ${total} iteraatiota suoritettu, ${failed} virhettä.`
    bar.setAttribute("style", `width:${progress}%; background-color:${color};`)
}


/**
 * Reset and hide simulation status panel and results.
 */
function resetStatus() {
    setState(null)
    setCurrentIteration(null)
    setProgress(0, 0, store.get(props.Iterations))
    document.getElementById('status-panel').setAttribute('style', 'visibility:hidden;')
}


/**
 * Handle incoming message from helmet-model-system.
 */
function handleMsg(json) {
    if (json.level !== 'DEBUG') {
        setMessage(json.message, json.level === 'ERROR')
    }
    if (json.status) {
        document.getElementById('status-panel').setAttribute('style', 'visibility:visible;')
        setState(json.status)
        setProgress(json.status.completed, json.status.failed, json.status.total)
        setCurrentIteration(json.status)
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
    setControlsEnabled(true)
    if (err) {
        console.error('[end]', err)
        // setMessage(err.message, true)
        alert(err.message)
    }
    console.debug(`Python exited with code ${code}, signal ${signal}.`)
}

function setControlsEnabled(isEnabled) {
    document.querySelectorAll('input').forEach((i) => {
        if (isEnabled) {
            document.body.classList.remove('busy')
            i.removeAttribute('disabled')
        } else {
            document.body.classList.add('busy')
            i.setAttribute('disabled', true)
        }
    })
}

/**
 * Start or stop helmet-model-system.
 */
function runStop(e) {
    
    resetStatus()
    setMessage("")

    if (worker) {
        worker.terminate(1)
        worker = null
        setControlsEnabled(true)
    } else {

        setControlsEnabled(false)
        const scenario = store.get(props.Scenario)
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
            scenario: scenario,
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
    document.getElementById('shader').setAttribute('style', 'display: none;');
}

function settingsClick(e) {
    document.getElementById('shader').setAttribute('style', 'display: block;');
    document.getElementById('settings').show()
}

window.document
    .getElementById('version')
    .innerText = `UI v${version}`

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
    .getElementById('scenario')
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

window.document
    .getElementById('log-link')
    .addEventListener('click', openLink)

process.on('uncaughtException', (err) => {
    if (err) {
        console.error(err)
        alert(err)
    }
})

initSettings()
resetStatus()
setMessage()
