const {app, BrowserWindow, ipcMain} = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window;

const createWindow = async () => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: false,
      nodeIntegration: true
    }
  });
  await window.loadFile('src/renderer/index.html');
  window.on('closed', () => {
    window = null;
  });
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

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (window === null) {
    await createWindow();
  }
});

process.on('uncaughtException', (err) => {
  console.error(err);
});

/**
 * Enable sending messages to development console for debug purposes.
 * Clarification:
 * - console.log here goes to main process' CLI (displayed when ran locally in development)
 * - console.log in renderer process goes to Chrome console (available via <BrowserWindow>.openDevTools() method)
 * Thus sending IPC call (named 'console-log') here, puts content of args to development console.
 */
ipcMain.on('console-log', (event, args) => {
  console.log(args);
});
