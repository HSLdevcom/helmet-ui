const path = require('path');
const fs = require('fs');
const versions = require('../versions');
const os = require('os');

/**
 * Check and try to set EMME's Python location on Windows, searching from common known paths.
 */
const searchEMMEPython = () => {

  // Set Windows' python exe path postfix (e.g. Python27\python.exe)
  const p = getVersion(versions.emme_python);
  const pythonPathPostfix = `Python${p.major}${p.minor}\\python.exe`;

  // Search from environment variable "EMMEPATH"
  const envEmmePath = process.env.EMMEPATH || '';
  const envEmmePythonPath = path.join(envEmmePath, pythonPathPostfix);
  if (envEmmePath && fs.existsSync(envEmmePythonPath)) {
    return [true, envEmmePythonPath];
  }

  // Not found based on EMMEPATH, try guessing some common locations on Windows
  const e = getVersion(versions.emme_system);
  const commonEmmePath = `INRO\\Emme\\Emme ${e.major}\\Emme-${e.semver}`;
  const drives = ['C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', '/'];
  const paths = [
    `\\Program Files\\${commonEmmePath}\\${pythonPathPostfix}`,
    `\\Program Files (x86)\\${commonEmmePath}\\${pythonPathPostfix}`,
    `\\${commonEmmePath}\\${pythonPathPostfix}`,
    `usr/bin/python3` // mainly for developers on Mac & Linux
  ];
  const allPathCombinations = drives.reduce(
    (accumulator, d) => {
      // Combine each (d)rive to all (p)aths, and merge results via reduce
      return accumulator.concat(paths.map((p) => `${d}${p}`));
    }, []);
  const firstExisting = allPathCombinations.find(fs.existsSync);
  if (firstExisting) {
    return [true, firstExisting];
  } else {
    return [false, null];
  }
};

const listEMMEPythonPaths = () => {
  // Set Windows' python exe path postfix (e.g. Python27\python.exe)
  const p = getVersion(versions.emme_python);
  const pythonPathPostfix = `Python${p.major}${p.minor}\\python.exe`;
  // Search from environment variable "EMMEPATH"
  const envEmmePath = process.env.EMMEPATH || '';
  const envEmmePythonPath = path.join(envEmmePath, pythonPathPostfix);
  if (envEmmePath && fs.existsSync(envEmmePythonPath)) {
    return [true, envEmmePythonPath];
  }

  // Not found based on EMMEPATH, try guessing some common locations on Windows
  const pythonVersion = getVersion(versions.emme_python);

  const commonEmmePaths = []
  versions.emme_major_versions.forEach(majorVersion => { commonEmmePaths.push(`INRO\\Emme\\Emme ${majorVersion}`) })

  const drives = ['C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', '/'];
  const paths = []
  commonEmmePaths.forEach(commonEmmePath => {
    paths.push(
      `\\Program Files\\${commonEmmePath}`,
      `\\Program Files (x86)\\${commonEmmePath}`,
      `\\${commonEmmePath}`,
    )
  })
  paths.push(`usr/bin/python${pythonVersion.major}`); // mainly for developers on Mac & Linux

  const allPathCombinations = drives.reduce(
    (accumulator, d) => {
      // Combine each (d)rive to all (p)aths, and merge results via reduce
      return accumulator.concat(paths.map((p) => `${d}${p}`));
    }, []);
  const pythonInstallations = []
  allPathCombinations.forEach((pathCombination) => {
    const foundPythonEnv = hasPythonEnv(pathCombination);
    if (foundPythonEnv !== null) {
      pythonInstallations.push(...foundPythonEnv);
    }
  });
  if (pythonInstallations.length > 0) {
    return [true, pythonInstallations];
  } else {
    return [false, null];
  }
}

/**
 * Dissect given semantic version number string
 */
function getVersion(semver) {
  const tokens = semver ? semver.split('.', 3) : [];
  return {
    semver,
    major: tokens[0] || '',
    minor: tokens[1] || '',
    patch: tokens[2] || '',
  }
}

function hasPythonEnv(basePath) {
  const pathExists = fs.existsSync(basePath) && fs.lstatSync(basePath).isDirectory();
  let exePaths = [];
  if (pathExists) {
    const subPaths = fs.readdirSync(basePath)
    subPaths.forEach(path => {
      if(path.startsWith("Emme ")) {
        const majorVersionFolderPath = `${basePath}${getDirSeparator()}${path}`;
        const majorVersionFolderPathFiles = fs.readdirSync(majorVersionFolderPath);
        
        // Filter away every folder except possible Emme installation folders
        const subVersionFolders = majorVersionFolderPathFiles.filter(file => file.startsWith("Emme-"));
        subVersionFolders.forEach(subVersionFolder => {
          // Go through the subdirectory and look for a python executable, should be in Emme-x.xx.xx.xx/Python/python.exe on Windows machines.
          const emmeFolderFilesPath = majorVersionFolderPath.concat(getDirSeparator(), subVersionFolder);
          const emmeFolderFiles = fs.readdirSync(emmeFolderFilesPath);
          emmeFolderFiles.forEach(folderPath => {
            if(folderPath.startsWith("Python")) {
              const pythonFolderPath = emmeFolderFilesPath.concat(getDirSeparator(), folderPath);
              const pythonPathFiles = fs.readdirSync(pythonFolderPath);
              pythonPathFiles.forEach(fileName => {
                if(fileName === 'python.exe') {
                  exePaths.push(pythonFolderPath.concat(getDirSeparator(), fileName));
                }
              })
            }
          })
        })
      }
    })
  }
  console.log(exePaths);
  return exePaths;
}

function getDirSeparator() {
  const isRunningOnWindows = os.platform() === 'win32';
  return isRunningOnWindows ? '\\' : '/'
}

module.exports = {
  searchEMMEPython: searchEMMEPython,
  listEMMEPythonPaths: listEMMEPythonPaths,
};
