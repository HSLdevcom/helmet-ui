import { contextBridge, ipcRenderer, shell } from 'electron';
import fs from 'fs';
import path from 'path';
import os from 'os';
import child_process from 'child_process';
import ps from 'python-shell';
import Store from 'electron-store';

const globalSettings = new Store({ name: 'globalSettings' });
const scenarioStores = new Map<string, Store>();

contextBridge.exposeInMainWorld('electronAPI', {
  StoreAPI: {
    get: (key: string) => globalSettings.get(key),
    set: (key: string, value: any) => globalSettings.set(key, value),
    getScenarioStore: (namespace: string) => {
      if (!scenarioStores.has(namespace)) {
        scenarioStores.set(namespace, new Store({ name: namespace }));
      }
      const store = scenarioStores.get(namespace);
      return {
        get: (key: string) => store?.get(key),
        set: (key: string, value: any) => store?.set(key, value),
        delete: (key: string) => store?.delete(key),
        clear: () => store?.clear(),
      };
    },
  },
  ps: { PythonShell: ps.PythonShell },
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => 
      ipcRenderer.send(channel, ...args),
    on: (channel: string, func: (...args: any[]) => void) =>
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
    removeListener: (channel: string, func: (...args: any[]) => void) =>
      ipcRenderer.removeListener(channel, func),
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  },
  downloadHelmetScripts: (args: any[]) => ipcRenderer.send('message-from-ui-to-download-helmet-scripts', args),
  cancelDownload: (version: string) => ipcRenderer.send('cancel-download', version),
  shell: {
    openExternal: (url: string) => shell.openExternal(url),
    openPath: (p: string) => shell.openPath(p),
    showItemInFolder: (p: string) => shell.showItemInFolder(p),
  },
  fs: {
    readdir: (dir: string) => fs.promises.readdir(dir),
    readFile: (file: string) => fs.promises.readFile(file, 'utf-8'),
    existsSync: (file: string) => fs.existsSync(file),
    unlink: (file: string) => fs.promises.unlink(file),
    rename: (oldPath: string, newPath: string) => fs.promises.rename(oldPath, newPath),
    mkdir: (dir: string, options?: any) => fs.promises.mkdir(dir, options),
  },
  path: {
    join: (...args: string[]) => path.join(...args),
    dirname: (p: string) => path.dirname(p),
    basename: (p: string) => path.basename(p),
    sep: path.sep,
  },
  os: { homedir: () => os.homedir() },
  child_process: {
    exec: (cmd: string) => new Promise((resolve, reject) => {
      child_process.exec(cmd, (error, stdout, stderr) => {
        if (error) reject (stderr || error.message);
        else resolve(stdout);
      });
    }),
  },
  dialog: { showOpenDialog: (options: any) => ipcRenderer.invoke('dialog:showOpenDialog', options) },
});
