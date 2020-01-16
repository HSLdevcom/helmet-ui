const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { app, BrowserWindow, ipcMain } = require('electron')
const config = require('./config')
const child_process = require('child_process')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window;

const createWindow = () => {
  window = new BrowserWindow(config.window);
  window.loadFile('src/index.html');
  window.on('closed', () => { window = null; });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (window === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
process.on('uncaughtException', (err) => {
  console.error(err);
});

ipcMain.on('launch-url', (event, arg) => {
  const COMMANDS = { 'darwin': 'open', 'win32': 'start', 'linux': 'xdg-open' }
  child_process.exec(`${COMMANDS[process.platform]} ${arg}`, console.error);
})

ipcMain.on('check-emme', checkPython)

/**
 * Check and try to set Python location on Windows
 */
function checkPython(event, args) {

  const e = getVersion(config.emme.version)
  const emmePath = `INRO\\Emme\\Emme ${e.major}\\Emme-${e.semver}`

  const p = getVersion(config.emme.pythonVersion)
  const pythonPath = `Python${p.major}${p.minor}\\python.exe`

  const EMMEPATH = process.env.EMMEPATH || ''
  const emmePythonPath = path.join(EMMEPATH, pythonPath)
  if (fs.existsSync(emmePythonPath)) {
    event.reply('emme-found', emmePythonPath)
    return
  }

  // not found based on EMMEPATH, try guessing some common locations
  const drives = ['C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', '/']
  const paths = [
    `\\Program Files\\${emmePath}\\${pythonPath}`,
    `\\Program Files (x86)\\${emmePath}\\${pythonPath}`,
    `\\${emmePath}\\${pythonPath}`,
    `usr/bin/python2` // mainly for developers on Mac & Linux
  ]

  const all = _.flatMap(drives, (d) => _.flatMap(paths, (p) => `${d}${p}`))
  const first = _.find(all, fs.existsSync)
  if (first) {
    event.reply('emme-found', first)
  } else {
    event.reply('emme-not-found')
  }
}

/**
 * Dissect given semantic version number string
 */
function getVersion(semver) {
  const tokens = semver ? semver.split('.', 3) : []
  return {
    semver,
    major: tokens[0] || '',
    minor: tokens[1] || '',
    patch: tokens[2] || '',
  }
}