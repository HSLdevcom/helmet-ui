const {app, BrowserWindow, ipcMain} = require('electron');
const {download} = require('electron-dl');
const path = require('path');
const fs = require('fs');
const del = require('del');
const decompress = require('decompress');
const Store = require('electron-store');

// Handle breaking changes in electron-store-v7.0.0:
// https://github.com/sindresorhus/electron-store/releases/tag/v7.0.0
Store.initRenderer();

// @electron/remote/main must be initialized in the main process before it can be used from the renderer:
require('@electron/remote/main').initialize();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {app.quit();}

// Keep a global reference of certain objects, so they won't be garbage collected. (This is Electron-app best practise)
let mainWindow, entrypointWorkerWindow, cbaWorkerWindow, useMockAssignmentInsteadOfEmme;

async function createUI() {
  // Render main window including UI (index.html linking to all UI components)
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true, // There's no reason to disable these (CTRL+SHIFT+i) https://superuser.com/questions/367662/ctrlshifti-in-windows-7
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });
  await mainWindow.loadFile('src/renderer/index.html');

  // Quit when main window is closed
  mainWindow.on('closed', () => {
    app.quit();
  });
}

async function createHelmetEntrypointWorker() {
  // Create hidden window for background process #1 (Electron best practise, alternative is web workers with limited API)
  entrypointWorkerWindow = new BrowserWindow({webPreferences: {nodeIntegration: true, contextIsolation: false, enableRemoteModule: true}, show: false});
  await entrypointWorkerWindow.loadFile('src/background/helmet_entrypoint_worker.html');
}

async function createCbaScriptWorker() {
  // Create hidden window for background process #2 (Electron best practise, alternative is web workers with limited API)
  cbaWorkerWindow = new BrowserWindow({webPreferences: {nodeIntegration: true, contextIsolation: false, enableRemoteModule: true}, show: false});
  await cbaWorkerWindow.loadFile('src/background/cba_script_worker.html');
}

// When Electron has initialized, and is ready to create windows. Some APIs can only be used from here on.
app.on('ready', async () => {
  await createUI();
  await createHelmetEntrypointWorker();
  await createCbaScriptWorker();
});

ipcMain.on('message-from-ui-to-download-helmet-scripts', (event, args) => {
  const workDir = args.destinationDir;
  const tmpDir = path.join(workDir, "helmet-model-system-tmp-workdir");
  const finalDir = path.join(workDir, `helmet-model-system-${args.version}-${args.postfix}`);

  // Download model system repo (passed in args.url - may vary in future depending on tag/version)
  download(
    BrowserWindow.getFocusedWindow(),
    `https://github.com/HSLdevcom/helmet-model-system/archive/${args.version}.zip`,
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

ipcMain.on('message-from-ui-to-disable-emme', (event, args) => {
  useMockAssignmentInsteadOfEmme = true;
});

ipcMain.on('message-from-ui-to-enable-emme', (event, args) => {
  useMockAssignmentInsteadOfEmme = false;
});

// Relay message to run all scenarios; UI => main => worker
ipcMain.on('message-from-ui-to-run-scenarios', (event, args) => {
  if (useMockAssignmentInsteadOfEmme) {
    // If debug switch is activated, choose to run MockAssignment instead, without requiring an EMME-license on this PC
    for (let runParameters of args) {
      runParameters.DO_NOT_USE_EMME = true;
    }
  }
  entrypointWorkerWindow.webContents.send('run-scenarios', args);
});

// Relay message to run Cost-Benefit Analysis script; UI => main => worker
ipcMain.on('message-from-ui-to-run-cba-script', (event, args) => {
  cbaWorkerWindow.webContents.send('run-cba-script', args);
});

// Relay message (interruption) to terminate current scenario and cancel any queued scenarios; UI => main => worker
ipcMain.on('message-from-ui-to-cancel-scenarios', (event, args) => {
  entrypointWorkerWindow.webContents.send('cancel-scenarios');
});

// Relay message of scenarios complete when switching to next; worker => main => UI
ipcMain.on('message-from-worker-scenario-complete', (event, args) => {
  mainWindow.webContents.send('scenario-complete', args);
});

// Relay message of all scenarios complete; worker => main => UI
ipcMain.on('message-from-worker-all-scenarios-complete', (event, args) => {
  mainWindow.webContents.send('all-scenarios-complete');
});

// Relay a loggable UI-event in worker; worker => main => UI
ipcMain.on('loggable-ui-event-from-worker', (event, args) => {
  mainWindow.webContents.send('loggable-event', args);
});

// Relay a loggable event in worker; worker => main => UI
ipcMain.on('loggable-event-from-worker', (event, args) => {
  event_time = args["time"];
  delete(args["time"]);
  // python-shell 3.0.0 breaking change: Every character from
  // stderr is its own value (like {0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'})
  // so let us join all values into one string ('hello').
  event_string = Object.values(args).join('');
  // Try to read the string as JSON. If it fails, use the whole string
  // as a message. Messages via utils.log are written to stderr as JSON.
  // Warnings from numpy tend to be written as plain-text. 
  try {
    // utils.log
    event_args = JSON.parse(event_string);
  } catch (error) {
    // numpy warnings
    event_args = {
      "level": "EXCEPTION",
      "message": event_string,
    };
  }
  event_args["time"] = event_time;
  mainWindow.webContents.send('loggable-event', event_args);
});

// Log worker-errors (by PythonShell, not stderr) in main console
ipcMain.on('process-error-from-worker', (event, args) => {
  mainWindow.webContents.send('loggable-event', {
    "level": "ERROR",
    "message": (typeof args === "string") ? args : JSON.stringify(args)
  });
});
