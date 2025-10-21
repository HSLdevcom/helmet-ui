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
  const workDir = args.destinationDir;
  const tmpDir = path.join(workDir, "helmet-model-system-tmp-workdir");
  const finalDir = path.join(workDir, `helmet-model-system-${args.version}-${args.postfix}`);

  const downloadItem = await download(BrowserWindow.getFocusedWindow(), 
    `https://github.com/HSLdevcom/helmet-model-system/archive/${args.version}.zip`, 
    { directory: workDir }
  );

  const archivePath = downloadItem.getSavePath();
  await decompress(archivePath, tmpDir, { strip: 1 });
  fs.renameSync(path.join(tmpDir, "Scripts"), finalDir);
  del.sync([archivePath, tmpDir]);
  mainWindow.webContents.send('download-ready', finalDir);
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
