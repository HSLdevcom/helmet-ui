const {app, BrowserWindow, ipcMain} = require('electron');
const {download} = require('electron-dl');
const path = require('path');
const fs = require('fs');
const del = require('del');
const decompress = require('decompress');

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

  // Quit when main window is closed
  mainWindow.on('closed', () => {
    app.quit();
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

ipcMain.on('message-from-ui-to-download-helmet-scripts', (event, args) => {
  const workDir = args.destinationDir;
  const tmpDir = path.join(workDir, "helmet-model-system-tmp-workdir");
  const finalDir = path.join(workDir, `helmet-model-system-${args.postfix}`);

  // Download model system repo (passed in args.url - may vary in future depending on tag/version)
  download(
    BrowserWindow.getFocusedWindow(),
    args.url,
    {
      directory: workDir
    }
  )
    .then((downloadItem) => {
      const archivePath = downloadItem.getSavePath();

      // Decompress downloaded archive to tmpDir
      decompress(archivePath, tmpDir, {strip: 1})
        .then(() => {
          // Single-out "/Scripts" folder and move it to destination
          fs.renameSync(path.join(tmpDir, "Scripts"), finalDir);

          // Delete archive & tmpDir (del module checks for current working dir, overridable but good sanity check)
          process.chdir(workDir);
          del.sync(archivePath);
          del.sync(tmpDir);

          // Notify UI "download (and post-processing) is ready"
          mainWindow.webContents.send('download-ready', finalDir);
        });
    });
});

// Relay message to run all scenarios; UI => main => worker
ipcMain.on('message-from-ui-to-run-scenarios', (event, args) => {
  workerWindow.webContents.send('run-scenarios', args);
});

// Relay message (interruption) to terminate current scenario and cancel any queued scenarios; UI => main => worker
ipcMain.on('message-from-ui-to-cancel-scenarios', (event, args) => {
  workerWindow.webContents.send('cancel-scenarios');
});

// Relay message of scenarios complete when switching to next; worker => main => UI
ipcMain.on('message-from-worker-scenario-complete', (event, args) => {
  mainWindow.webContents.send('scenario-complete', args);
});

// Relay message of all scenarios complete; worker => main => UI
ipcMain.on('message-from-worker-all-scenarios-complete', (event, args) => {
  mainWindow.webContents.send('all-scenarios-complete');
});

// Relay a loggable event in worker; worker => main => UI
ipcMain.on('loggable-event-from-worker', (event, args) => {
  mainWindow.webContents.send('loggable-event', args);
});

// Log worker-errors (by PythonShell, not stderr) in main console
ipcMain.on('process-error-from-worker', (event, args) => {
  mainWindow.webContents.send('loggable-event', {
    "level": "ERROR",
    "message": (typeof args === "string") ? args : JSON.stringify(args)
  });
});
