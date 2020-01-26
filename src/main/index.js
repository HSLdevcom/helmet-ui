const {app, BrowserWindow, ipcMain} = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {app.quit();}

// Keep a global reference of certain objects, so they won't be garbage collected. (This is Electron-app best practise)
let mainWindow, workerWindow;

async function createUI() {
  // Render main window including UI (index.html linking to all UI components)
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true, // There's no reason to disable these (CTRL+SHIFT+i) https://superuser.com/questions/367662/ctrlshifti-in-windows-7
      nodeIntegration: true
    }
  });
  await mainWindow.loadFile('src/renderer/index.html');

  // Quit when main window is closed...
  mainWindow.on('closed', () => {
    mainWindow = null;
    // ...as long as it isn't OS X (=darwin), where user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

async function createWorker() {
  // Create hidden window for background processes (Electron best practise, alternative is web workers with limited API)
  workerWindow = new BrowserWindow({webPreferences: {nodeIntegration: true}, show: false});
  await workerWindow.loadFile('src/background/worker.html');
}

// When Electron has initialized, and is ready to create windows. Some APIs can only be used from here on.
app.on('ready', async () => {
  await createUI();
  await createWorker();
});

// On OS X re-create the main window, when dock icon is clicked and main window was closed.
app.on('activate', async () => {
  if (mainWindow === null) {
    await createUI();
  }
});

// Relay initial message to run scenarios; UI => main => worker
ipcMain.on('message-from-ui-to-run-scenarios', (event, args) => {
  workerWindow.webContents.send('run-scenarios', args);
});

// Relay cancelling message (interruption) to terminate current scenario and cancel any queued scenarios
ipcMain.on('message-from-ui-to-cancel-scenarios', (event, args) => {
  workerWindow.webContents.send('cancel-scenarios');
});

// Relay a loggable event in worker; worker => main => UI
ipcMain.on('loggable-event-from-worker', (event, args) => {
  console.log(args);
});