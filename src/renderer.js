const ps = require('python-shell')

let worker
const settings = {};

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
    const i = window.document.getElementById("iterations").value
    const python = window.document.getElementById("python").files[0]
    const scripts = window.document.getElementById("scripts").files[0]

    settings.emme = emme ? emme.path : settings.emme
    settings.data = data ? data.path : settings.data
    settings.iterations = i ? parseInt(i) : settings.iterations
    settings.python = python ? python.path : settings.python
    settings.scripts = scripts ? scripts.path : settings.scripts
    
    console.debug(settings)
}

const runStop = (e) => {

    console.log(settings)
    
    if (worker) {
        worker.terminate(1)
        worker = null
    } else {
        
        const opts = {
            mode: 'json',
            pythonOptions: ['-u'],
            pythonPath: settings.python
        }

        const msg = {
            emme: settings.emme,
            data: settings.data,
            iterations: settings.iterations
        }
        console.log(msg);

        worker = new ps.PythonShell(settings.scripts, opts)
        worker.on('message', onMessage)
        worker.send(msg)
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
