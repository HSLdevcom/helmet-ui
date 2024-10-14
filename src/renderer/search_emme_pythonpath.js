const path = require('path');
const fs = require('fs');
const versions = require('../versions');

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
    `usr/bin/python2` // mainly for developers on Mac & Linux
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
  const e = getVersion(versions.emme_system);
  const pythonVersion = getVersion(versions.emme_python);
  const commonEmmePath = `INRO\\Emme\\Emme ${e.major}\\Emme-${e.semver}`;
  const drives = ['C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', '/'];
  const paths = [
    `\\Program Files\\${commonEmmePath}\\${pythonPathPostfix}`,
    `\\Program Files (x86)\\${commonEmmePath}\\${pythonPathPostfix}`,
    `\\${commonEmmePath}\\${pythonPathPostfix}`,
    `usr/bin/python${pythonVersion.major}`, // mainly for developers on Mac & Linux
  ];
  const allPathCombinations = drives.reduce(
    (accumulator, d) => {
      // Combine each (d)rive to all (p)aths, and merge results via reduce
      return accumulator.concat(paths.map((p) => `${d}${p}`));
    }, []);
  const pythonInstallations = allPathCombinations.filter(fs.existsSync);
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

module.exports = {
  searchEMMEPython: searchEMMEPython,
  listEMMEPythonPaths: listEMMEPythonPaths,
};
