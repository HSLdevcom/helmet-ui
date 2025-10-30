const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const del = require('del');
const decompress = require('decompress');
const Store = require('electron-store');
const { download } = require('electron-dl');

// Initialize electron-store for renderer usage
Store.initRenderer();

// Handle Windows Squirrel installer events
if (require('electron-squirrel-startup')) app.quit();

// Keep references to windows so they aren’t GC’ed
let mainWindow, entrypointWorkerWindow, cbaWorkerWindow;
let workPreloadTimeout;
let useMockAssignmentInsteadOfEmme = false;
const activeDownloads = new Map(); // Track active downloads for cancellation

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1520,
    height: 1200,
    resizable: true,
    fullscreen: false,
    autoHideMenuBar: true,
    title: 'Helmet UI',
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist', 'main', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: false,
      backgroundThrottling: false,
    },
  });

  
  
  // Load the Vite-bundled renderer
  if (process.env.NODE_ENV === 'development') {
    await mainWindow.loadURL('http://localhost:5173');
  } else {
    const indexPath = path.join(__dirname, '../renderer/dist/index.html');
    await mainWindow.loadFile(indexPath);;
  }

  mainWindow.on('closed', () => app.quit());
}

async function createWorkerWindow(htmlFile) {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  await win.loadFile(htmlFile);
  return win;
}

// App ready
app.on('ready', async () => {
  await createMainWindow();
  entrypointWorkerWindow = await createWorkerWindow(path.join(app.getAppPath(), 'src/background/helmet_entrypoint_worker.html'));
  cbaWorkerWindow = await createWorkerWindow(path.join(app.getAppPath(), 'src/background/cba_script_worker.html'));
});

// ===== IPC handlers =====

// Title change
ipcMain.on('change-title', (_, newTitle) => {
  mainWindow?.setTitle(newTitle);
});

// Download helmet scripts
ipcMain.on('message-from-ui-to-download-helmet-scripts', async (event, args) => {
  console.log(`Starting download for version: ${args.version}`);
  const workDir = args.destinationDir;
  const extractedDir = path.join(workDir, `helmet-model-system-${args.version}-${args.postfix}`);

  try {
    const downloadItem = await download(BrowserWindow.getFocusedWindow(),
      `https://github.com/HSLdevcom/helmet-model-system/archive/${args.version}.zip`,
      {
        directory: workDir,
        onProgress: (progress) => {
          console.log(`Download progress for version ${args.version}: ${progress.percent * 100}%`);
          mainWindow.webContents.send('download-progress', { progress, version: args.version });
        },
      }
    );

    const archivePath = downloadItem.getSavePath();
    console.log(`Download complete for version ${args.version}. Extracting...`);

    // Ensure extraction directory exists
    fs.mkdirSync(extractedDir, { recursive: true });

    await decompress(archivePath, extractedDir);

    // Try deleting the zip file after extraction
    try {
      fs.unlinkSync(archivePath);
    } catch (err) {
      console.warn(`Could not delete archive: ${err.message}`);
    }

    // Inspect extracted structure
    const contents = fs.readdirSync(extractedDir);
    console.log('Extracted directory contents:', contents);

    // Find the actual subfolder
    const extractedSubfolder =
      contents.find(f => f.startsWith(`helmet-model-system-${args.version}`)) ||
      contents.find(f => f.startsWith('helmet-model-system-'));

    if (!extractedSubfolder) {
      throw new Error(`Could not locate extracted folder under ${extractedDir}`);
    }

    const scriptsFolder = path.join(extractedDir, extractedSubfolder, 'Scripts');
    if (!fs.existsSync(scriptsFolder)) {
      throw new Error(`Scripts folder not found at: ${scriptsFolder}`);
    }

    console.log(`Extraction complete. Scripts folder ready at: ${scriptsFolder}`);
    mainWindow.webContents.send('download-ready', { finalDir: scriptsFolder, version: args.version });
  } catch (error) {
    console.error(`Error during download or extraction for version ${args.version}:`, error);
    mainWindow.webContents.send('download-error', { error: error.message, version: args.version });
  } finally {
    activeDownloads.delete(args.version); // Remove from active downloads
  }
});

ipcMain.on('cancel-download', (event, version) => {
  console.log(`Canceling download for version: ${version}`);
  const downloadItem = activeDownloads.get(version);
  if (downloadItem) {
    downloadItem.cancel(); // Cancel the download
    activeDownloads.delete(version);
    mainWindow.webContents.send('download-cancelled', { version });
    console.log(`Download canceled for version: ${version}`);
  } else {
    console.warn(`No active download found for version: ${version}`);
  }
});

// Enable / disable EMME
ipcMain.on('message-from-ui-to-disable-emme', (event, args) => {
  useMockAssignmentInsteadOfEmme = true;
});

ipcMain.on('message-from-ui-to-enable-emme', (event, args) => {
  useMockAssignmentInsteadOfEmme = false;
});

// Relay message to run all scenarios; UI => main => worker
ipcMain.on('message-from-ui-to-run-scenarios', async (event, args) => {
  if (!entrypointWorkerWindow || entrypointWorkerWindow.isDestroyed()) {
    entrypointWorkerWindow = await createWorkerWindow(
      path.join(app.getAppPath(), 'src/background/helmet_entrypoint_worker.html')
    );
  }

  if (useMockAssignmentInsteadOfEmme) {
    // If debug switch is activated, choose to run MockAssignment instead, without requiring an EMME-license on this PC
    for (let runParams of args) runParams.DO_NOT_USE_EMME = true;
  }
  entrypointWorkerWindow.webContents.send('run-scenarios', args);
});

// Relay message to run Cost-Benefit Analysis script; UI => main => worker
ipcMain.on('message-from-ui-to-run-cba-script', (event, args) => {
  cbaWorkerWindow.webContents.send('run-cba-script', args);
});

// Relay message (interruption) to terminate current scenario and cancel any queued scenarios; UI => main => worker
ipcMain.on('message-from-ui-to-cancel-scenarios', () => {
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
    // numpy warnings and other non-log messages
    event_args = {
      "level": "EXCEPTION",
      "message": event_string,
    };
  }
  event_args["time"] = event_time;
  mainWindow.webContents.send('loggable-event', event_args);
});

// This is to fix the inputs not having focus after showing a prompt or alert
ipcMain.on('focus-fix', () => {
  mainWindow?.blur();
  mainWindow?.focus();
});

// Dialog handler
ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
  return await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), options);
});
