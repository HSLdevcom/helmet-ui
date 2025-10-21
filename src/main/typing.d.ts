interface VexDialogOptions {
  message?: string;
  input?: string;
  callback?: (data?: any) => void;
}

declare const vex: {
  dialog: {
    open: (opts: VexDialogOptions) => void;
    prompt?: (opts: any) => void;
  };
};

type GithubTag = {
  name: string;
}

interface Window {
  electronAPI: {
    StoreAPI: {
      get: (key: string) => string | undefined;
      set: (key: string, value: any) => void;
    };
    fs: {
      readFile: (file: string, encoding?: BufferEncoding) => Promise<string>;
      readdir: (dir: string) => Promise<string[]>;
      existsSync: (file: string) => boolean;
      unlink: (file: string) => Promise<void>;
      rename: (oldPath: string, newPath: string) => Promise<void>;
      mkdir: (dir: string, options?: { recursive?: boolean }) => Promise<void>;
    };
    path: {
      join: (...paths: string[]) => string;
      dirname: (p: string) => string;
      basename: (p: string) => string;
    };
    os: {
      homedir: () => string;
    };
    child_process: {
      exec: (cmd: string) => Promise<Buffer>;
    };
    shell: {
      openExternal: (url: string) => void;
      openPath: (path: string) => Promise<string>;
      showItemInFolder: (path: string) => void;
    };
    ipcRenderer: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, func: (...args: any[]) => void) => void;
      removeListener: (channel: string, func: (...args: any[]) => void) => void;
    };
    downloadHelmetScripts: (args: any) => void;
    onDownloadReady: (callback: (finalDir: string) => void) => void;
    ps: {
      PythonShell: any;
    };
    _: any;
    dialog: {
      showOpenDialog: (options: any) => Promise<any>;
    };
  };
}
