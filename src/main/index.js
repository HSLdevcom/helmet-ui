const {app, BrowserWindow} = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {app.quit();}

// Keep a global reference of certain objects, so they won't be garbage collected. (This is Electron-app best practise)
let mainWindow;

const createWindow = async () => {
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
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// When Electron has initialized, and is ready to create windows. Some APIs can only be used from here on.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // ...as long as it isn't OS X (=darwin), where user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On OS X re-create the main window, when dock icon is clicked and main window was closed.
app.on('activate', async () => {
  if (mainWindow === null) {
    await createWindow();
  }
});
