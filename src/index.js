const fs = require('fs')
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
  window.loadURL(`file://${__dirname}/index.html`);
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

  const drives = ['C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', '/']
  const paths = [
    '\\Program Files\\INRO\\Emme\\Emme4\\Emme-4.3.3\\Python27\\python.exe',
    '\\Program Files (x86)\\INRO\\Emme\\Emme4\\Emme-4.3.3\\Python27\\python.exe',
    '\\INRO\\Emme\\Emme4\\Emme-4.3.3\\Python27\\python.exe',
    'usr/bin/python2' // mainly for developers on Mac & Linux
  ]

  const all = _.flatMap(drives, (d) => _.flatMap(paths, (p) => `${d}${p}`))
  const path = _.find(all, fs.existsSync)
  if (path) {
    event.reply('emme-found', path)
  } else {
    event.reply('emme-not-found')
  }
}