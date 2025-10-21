"use strict";
const electron = require("electron");
const Store = require("electron-store");
const fs = require("fs");
const path = require("path");
const os = require("os");
const child_process = require("child_process");
const ps = require("python-shell");
const globalSettings = new Store({ name: "globalSettings" });
electron.contextBridge.exposeInMainWorld("electronAPI", {
  StoreAPI: {
    get: (key) => globalSettings.get(key),
    set: (key, value) => globalSettings.set(key, value)
  },
  ps: { PythonShell: ps.PythonShell },
  downloadHelmetScripts: (args) => electron.ipcRenderer.send("message-from-ui-to-download-helmet-scripts", args),
  onDownloadReady: (callback) => electron.ipcRenderer.on("download-ready", (event, finalDir) => callback(finalDir)),
  ipcRenderer: {
    send: (channel, data) => electron.ipcRenderer.send(channel, data),
    on: (channel, func) => electron.ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
    removeListener: (channel, func) => electron.ipcRenderer.removeListener(channel, func)
  },
  shell: {
    openExternal: (url) => electron.shell.openExternal(url),
    openPath: (p) => electron.shell.openPath(p),
    showItemInFolder: (p) => electron.shell.showItemInFolder(p)
  },
  fs: {
    readdir: (dir) => fs.promises.readdir(dir),
    readFile: (file) => fs.promises.readFile(file, "utf-8"),
    existsSync: (file) => fs.existsSync(file),
    unlink: (file) => fs.promises.unlink(file),
    rename: (oldPath, newPath) => fs.promises.rename(oldPath, newPath),
    mkdir: (dir, options) => fs.promises.mkdir(dir, options)
  },
  path: {
    join: (...args) => path.join(...args),
    dirname: (p) => path.dirname(p),
    basename: (p) => path.basename(p)
  },
  os: { homedir: () => os.homedir() },
  child_process: {
    exec: (cmd) => new Promise((resolve, reject) => {
      child_process.exec(cmd, (error, stdout, stderr) => {
        if (error) reject(stderr || error.message);
        else resolve(stdout);
      });
    })
  },
  dialog: { showOpenDialog: (options) => electron.ipcRenderer.invoke("dialog:showOpenDialog", options) }
});
