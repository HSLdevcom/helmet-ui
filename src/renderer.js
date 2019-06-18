const ps = require('python-shell')

let worker
const script = `${__dirname}/worker.py`
const opts = { mode: 'json', pythonOptions: ['-u'] }
const command = { task: "hardwork", count: 5 };

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

const runStop = (e) => {
    if (worker) {
        worker.terminate(1)
        worker = null
    } else {
        setStatus("Running Python script..")        
        worker = new ps.PythonShell(script, opts)
        worker.on('message', onMessage)
        worker.send(command)
        worker.end(end)
    }
}

window.document
    .querySelector("button")
    .addEventListener('click', runStop)
