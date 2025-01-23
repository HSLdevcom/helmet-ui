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

const listEMMEPythonPaths = (emmeVersion) => {
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
  const e = getVersion(emmeVersion);
  const pythonVersion = getVersion(versions.emme_python);
  const commonEmmePath = `INRO\\Emme\\Emme ${e.major}\\Emme-${e.semver}`;
  const drives = ['C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', '/'];
  const paths = [
    `\\Program Files\\${commonEmmePath}`,
    `\\Program Files (x86)\\${commonEmmePath}`,
    `\\${commonEmmePath}`,
    `usr/bin/python${pythonVersion.major}`, // mainly for developers on Mac & Linux
    `Users/erkki/testi`
  ];
  const allPathCombinations = drives.reduce(
    (accumulator, d) => {
      // Combine each (d)rive to all (p)aths, and merge results via reduce
      return accumulator.concat(paths.map((p) => `${d}${p}`));
    }, []);
  const pythonInstallations = []
  allPathCombinations.forEach((pathCombination) => {
    const foundPythonEnv = hasPythonEnv(pathCombination);
    if (foundPythonEnv !== null) {
      pythonInstallations.push(foundPythonEnv);
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
  let exePath = null;
  if (pathExists) {
    const subPaths = fs.readdirSync(basePath)
    subPaths.forEach(path => {
      if(path.startsWith("Python")) {
        // Go through the subdirectory and look for a python executable
        const subPathFiles = fs.readdirSync(`${basePath}${getDirSeparator()}${path}`);
        subPathFiles.forEach(fileName => {
          if(fileName === 'python.exe') {
            exePath = `${basePath}${getDirSeparator()}${path}${getDirSeparator()}${fileName}`;
          }
        })
      }
    })
  }
  return exePath;
}

function getDirSeparator() {
  const isRunningOnWindows = os.platform() === 'win32';
  return isRunningOnWindows ? '\\' : '/'
}

module.exports = {
  searchEMMEPython: searchEMMEPython,
  listEMMEPythonPaths: listEMMEPythonPaths,
};
