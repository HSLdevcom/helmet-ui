const ps = require('python-shell')

let worker
const script = `${__dirname}/worker.py`
const opts = { mode: 'json', pythonOptions: ['-u'] }
const command = { iterations: 5 };

const setStatus = (text) => {
    window.document
        .getElementById("status")
        .textContent = text
}

const onMessage = (json) => {
    console.log(json)
    if (json.msg) setStatus(json.msg)
}

const end = (err, code, signal) => {
    if (err) throw err
    worker = null
    setStatus(`Python exited with code ${code}, signal ${signal}.`)
}

const iterationsChange = (e) => {
    const i = window.document.getElementById("iterations").value
    command.iterations = parseInt(i)
}

const emmeChange = (e) => {
    const file = window.document.getElementById("emme").files[0].path
    command.emme = file;
}

const dataChange = (e) => {
    const file = window.document.getElementById("data").files[0].path
    command.data = file;  
}

const runStop = (e) => {
    console.log(command)
    if (worker) {
        worker.terminate(1)
        worker = null
    } else {
        worker = new ps.PythonShell(script, opts)
        worker.on('message', onMessage)
        worker.send(command)
        worker.end(end)
    }
}

window.document
    .getElementById("emme")
    .addEventListener('change', emmeChange)

window.document
    .getElementById("data")
    .addEventListener('change', dataChange)

window.document
    .getElementById("iterations")
    .addEventListener('change', iterationsChange);

window.document
    .querySelector("button")
    .addEventListener('click', runStop)
