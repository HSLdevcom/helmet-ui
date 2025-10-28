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
  
  workPreloadTimeout = setTimeout(async () => {
    entrypointWorkerWindow = await createWorkerWindow('src/background/helmet_entrypoint_worker.html');
    cbaWorkerWindow = await createWorkerWindow('src/background/cba_script_worker.html');
  }, 5000);
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
ipcMain.on('message-from-ui-to-disable-emme', () => { useMockAssignmentInsteadOfEmme = true; });
ipcMain.on('message-from-ui-to-enable-emme', () => { useMockAssignmentInsteadOfEmme = false; });

// Relay scenario runs
ipcMain.on('message-from-ui-to-run-scenarios', (event, args) => {
  if (useMockAssignmentInsteadOfEmme) {
    for (let runParams of args) runParams.DO_NOT_USE_EMME = true;
  }
  entrypointWorkerWindow.webContents.send('run-scenarios', args);
});

// Relay CBA scripts
ipcMain.on('message-from-ui-to-run-cba-script', (event, args) => {
  cbaWorkerWindow.webContents.send('run-cba-script', args);
});

// Cancel scenarios
ipcMain.on('message-from-ui-to-cancel-scenarios', () => {
  entrypointWorkerWindow.webContents.send('cancel-scenarios');
});

// Relay events from worker to UI
ipcMain.on('message-from-worker-scenario-complete', (event, args) => {
  mainWindow.webContents.send('scenario-complete', args);
});

ipcMain.on('message-from-worker-all-scenarios-complete', () => {
  mainWindow.webContents.send('all-scenarios-complete');
});

ipcMain.on('loggable-ui-event-from-worker', (event, args) => {
  mainWindow.webContents.send('loggable-event', args);
});

// Focus fix for prompts
ipcMain.on('focus-fix', () => {
  mainWindow?.blur();
  mainWindow?.focus();
});

// Dialog handler
ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
  return await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), options);
});
