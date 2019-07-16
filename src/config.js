
module.exports = {
    window: {
        width: 800,
        height: 600,
        resizable: false,
        maximizable: false,
        fullscreen: false,
        fullscreenable: false,
        autoHideMenuBar: true,
        webPreferences: {
            devTools: true,
            nodeIntegration: true
        }
    },
    store: {
        properties: {
            EmmePath: 'emme.path',
            DataPath: 'data.path',
            PythonPath: 'python.path',
            HelmetPath: 'helmet.remote.path',
            Iterations: 'helmet.run.iterations'
        },
        schema: {
            'emme.path': {
                type: 'string'
            },
            'data.path': {
                type: 'string'
            },
            'python.path': {
                type: 'string'
            },
            'helmet.remote.path': {
                type: 'string'
            },
            'helmet.run.iterations': {
                type: 'number',
                minimum: 1,
                maximum: 100,
                default: 10
            }
        }
    }
}
