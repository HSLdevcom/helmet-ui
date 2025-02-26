const path = require('path');
const fs = require('fs');
const versions = require('../versions');
const _ = require('lodash');

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

const checkEmmePythonEnv = () => {
   // Set Windows' python exe path postfix (e.g. Python27\python.exe)
   const p = getVersion(versions.emme_python);
   const pythonPathPostfix = `Python${p.major}${p.minor}\\python.exe`;
   // Search from environment variable "EMMEPATH"
   const envEmmePath = process.env.EMMEPATH || '';
   const envEmmePythonPath = path.join(envEmmePath, pythonPathPostfix);
   if (envEmmePath && fs.existsSync(envEmmePythonPath)) {
    return [true, envEmmePythonPath];
   } else {
    return [false, null];
   }
}

const listEMMEPythonPaths = () => {
  const pythonVersion = getVersion(versions.emme_python);

  const commonEmmePaths = []
  const pythonInstallations = []

  // Check if Windows python exe exists in environment variables
  const [hasPythonEnvInstallation, pythonEnvInstallation] = checkEmmePythonEnv();
  if(hasPythonEnvInstallation) { pythonInstallations.push(pythonEnvInstallation) };

  versions.emme_major_versions.forEach(majorVersion => { commonEmmePaths.push(`INRO\\Emme\\Emme ${majorVersion}`) })

  const drives = ['C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', '/'];
  const paths = []
  commonEmmePaths.forEach(commonEmmePath => {
    paths.push(
      `Program Files\\${commonEmmePath}`,
      `Program Files (x86)\\${commonEmmePath}`,
      `Program Files\\Bentley\\OpenPaths`,
      `${commonEmmePath}`,
    )
  })
  paths.push(`usr/bin/python${pythonVersion.major}`); // mainly for developers on Mac & Linux

  const allPathCombinations = drives.reduce(
    (accumulator, d) => {
      // Combine each (d)rive to all (p)aths, and merge results via reduce
      return accumulator.concat(paths.map((p) => path.join(d,p)));
    }, []);
  allPathCombinations.forEach((pathCombination) => {
    const foundPythonEnv = hasPythonEnv(pathCombination);
    if (foundPythonEnv !== null) {
      pythonInstallations.push(...foundPythonEnv);
    }
  });
  if (pythonInstallations.length > 0) {
    // Filter out duplicates
    const filteredPythons = _.uniq(pythonInstallations).filter(filteredPath => {
      return !filteredPath.startsWith('\\');
    });
    return [true, filteredPythons];
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
  const pathExists = fs.existsSync(basePath);
  let exePaths = [];
  if (pathExists) {
    try {
      const subPaths = fs.readdirSync(basePath)
      subPaths.forEach(subPath => {
        if(subPath.startsWith("Emme") || subPath.startsWith("EMME")) {
          const emmeVersionFolder = path.join(basePath, subPath);
          const emmeVersionFolderContents = fs.readdirSync(emmeVersionFolder);
          emmeVersionFolderContents.forEach(emmeFolderPath => {
            if(emmeFolderPath.startsWith("Python")) {
              const pythonFolderPath = path.join(emmeVersionFolder, emmeFolderPath);
              const pythonPathFiles = fs.readdirSync(pythonFolderPath);
              pythonPathFiles.forEach(fileName => {
                if(fileName === 'python.exe') {
                  const pythonExecutablePath = path.join(pythonFolderPath, fileName);
                  exePaths.push(pythonExecutablePath);
                }
              })
            }
          })
        }
      })
    }
    catch(e) {
      console.log(`Error traversing path ${basePath}`);
      console.log(e);
    }
  }
  return exePaths;
}

module.exports = {
  searchEMMEPython: searchEMMEPython,
  listEMMEPythonPaths: listEMMEPythonPaths,
};
