# Helmet UI

![master](https://github.com/HSLdevcom/helmet-ui/actions/workflows/node.js.yml/badge.svg?branch=master)

Desktop user interface for [Helmet 4 Model System](https://github.com/HSLdevcom/helmet-model-system) and
[EMME - Multimodal Transport Planning Software](https://www.inrosoftware.com/en/products/emme/).

## Development

This is an [Electron](https://electrojs.org) application written in JavaScript _([NodeJS API](https://nodejs.org/api/)
and [Electron API](https://www.electronjs.org/docs/api) available within app)_, HTML and CSS.

### Requirements

- Git client
- Node.js 16 LTS & NPM
- EMME 4.x.x _(Windows-only)_
- _[optionally]_ [helmet-model-system](https://github.com/HSLdevcom/helmet-model-system) _(otherwise downloaded and auto-installed by the UI)_

On Mac and Linux, [Wine](https://www.winehq.org/) and [Mono](https://www.mono-project.com/) are also required to make the app for Windows.

### Setup

Due to tight integration with EMME, the application is mainly targeted for Windows but can be developed on Mac and Linux as well.
However, the final testing should always happen on Windows with Emme.

```
$ git clone <this repository>
$ npm install
```

See [End-User Enviroment](#end-user-environment) for preparing the Windows environment for testing.
EMME and EMME-Python versions can be set in [versions.js](src/versions.js), affecting the automatic resolving of Python binary.

### Running and building

`npm start` command is used to start the application in development environment. Running `npm run make` will create an installer binary to be distributed to end-users.

See also: [Electronforge.io](https://www.electronforge.io/)

### Version Control

[Git](https://git-scm.com/) is used as the primary tool for version control and `master` branch is the main development line, aka. bleeding edge.
All changes should be made in dedicated feature/bugfix branches, followed by a [pull request](https://help.github.com/en/articles/creating-a-pull-request) and a peer-review.
Then, after all checks have passed, the branch may be merged in `master`.

### Continuous Integration

The application is built automatically by [GitHub Actions](https://github.com/HSLdevcom/helmet-ui/actions)
when changes are pushed in master branch or pull requests are opened.

[Releases](https://github.com/HSLdevcom/helmet-ui/releases) are deployed automatically when changes are pushed in the `release` branch,
which should be updated with `master` only to make new releases.

### Publishing Releases

The Electron Forge's [Github publisher](https://www.electronforge.io/config/publishers/github) is used to upload files and draft a new release,
thus avoiding the need to upload and tag releases manually.

The resulting draft must be reviewed, edited and approved in Github to make it publically available to everyone.
This allows testing the package and making final fixes to it before making it public.

1. Test and bring all the desired changes in the `master` branch.
1. Remove if there's word `SNAPSHOT` in `version` field of [package.json](./package.json), and update version as per semver practises.
    - See also: [Semantic Versioning](https://semver.org/)
1. Switch to `release` branch
1. Merge `master` to `release` and push to remote
    - `$ git merge master`
    - `$ git push`
1. Wait for [GitHub Actions](https://github.com/HSLdevcom/helmet-ui/actions) to build the application.
1. Go to [releases page](https://github.com/HSLdevcom/helmet-ui/releases) page and **Edit** the newly created draft.
    1. Ensure the release name corresponds to version number
    1. Write a brief description (new features, changes, fixes etc)
    1. Check/uncheck the pre-release checkbox as needed.
    1. Select `release` branch as the target for tagging
    1. Press **Publish release** when all is good.
    1. Switch back to `master` branch and update the version number matching the release. This can be updated to indicate a [snapshot](http://codethataint.com/blog/what-are-maven-snapshots/) before next release (e.g. `1.3.0-SNAPSHOT`) while said release (`1.3.0`) is in development, if necessary.

_Notice: you cannot create drafts with an existing version number (i.e. release name). Thus, any intermediate drafts must be deleted before pushing final tweaks and fixes for the version about to be released._

## End-User Environment

### Installation

Before using Helmet UI, the following requirements must be met:

  1. [Emme 4.5.X](https://www.inrosoftware.com/en/products/emme/) is installed, with active license/dongle.
  1. `%EMMEPATH%\programs` is set in user's `PATH` environment variable.
  1. _[optionally]_ [Helmet 4 Model System](https://github.com/HSLdevcom/helmet-model-system) is downloaded and set up _(or let UI download it)_

The Helmet UI installer can be downloaded from [releases](https://github.com/HSLdevcom/helmet-ui/releases), where the exe packages is found under the **Assets** of each release.

:warning: **The release packages are not downloaded by many so Windows will complain about it and prevents the installer from running.
This can be overridden in either of two ways:**

- Simply by selecting "More info" ("Lisätiedot") and then clicking "Run anyway". (This option will probably work only if you have admin rights)
- By right-clicking the downloaded .exe-file, selecting Properties and ticking the box "Unblock".

![Unblock](docs/unblock.png)

The application installs itself in the user's `%HOMEPATH%/AppData` folder.
The app itself is located under `AppData\Local`, while settings are persisted in `AppData\Roaming`.
The settings should survive as-is when updating to newer version, assuming the new version is backwards compatible with the old settings.

On first start, the application attempts to find Emme installation on the workstation and download the latest version of
[Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system) scripts.
The application will also run `pip install`.
The EMME Python path setup may fail if `EMMEPATH` environment variable is not set or the application is installed in an unusual way.
If this is the case, you must set the location of Python executable manually in the setting dialog (Asetukset), along with the location of Scripts folder.

### Settings

- Emme Python executable
  - This **must** be the `python.exe` shipped with Emme to meet some special dependencies.
  - e.g. `C:\Program Files\INRO\Emme-4.5.0\Python37\python.exe`
- The `Scripts` folder of [Helmet 4 Model System](https://github.com/HSLdevcom/helmet-model-system)
  - This is the Python backend doing most of the work.
  - This can be updated to a fresh/updated version by clicking "Lataa eri versio...".
    This will not overwrite your old (tweaked) scripts, it will always save the scripts in a new directory.
  - It can also be set to an existing folder on your computer.
- Project directory
  - This is where your model run specifications (.json) will be saved.
- Base data directory
  - This is where base demand matrices and base year (2018) data are located
- Result data directory
  - This is where you want your model run results to be saved

### Model run setup

**Need to update this!**
For each HELMET scenario you want to run, you must also specify the following:

1. Scenario/run name
2. Emme project file (`.emp`)
3. The number of the Emme scenario where the bike network is located (usually 19),
   this scenario must be followed by the walk scenario and three time-dependent car and transit scenarios (aht, pt, iht).
4. Folder containing the input data.
    - e.g. `c:\Helmet\helmet-model-system\Scenario_input_data\2030`
5. Whether or not you have a pre-calculated transit cost matrix (located in the results folder for this scenario)
6. Number of iterations to be executed

This is the download link that can be handed to users, along with an advice to download the latest version, i.e. the first one on the list.

- https://github.com/HSLdevcom/helmet-ui/releases

The package to be downloaded is named `Helmet.4.1.UI-x.y.z.Setup.exe`, where the `x.y.z` corresponds to the application version.

## Version history

**3.0.0**  
Breaking change: Changes all Python interface input data paths _(as well as output Results directory path)_ to dynamic.  

**2.1.1**  
ENHANCEMENT: *Reminder text "downloading new model-system requires internet connection"*    
ENHANCEMENT: *Add button in Settings to download new helmet-model-system version*  
FIX: *Overriding old model-system versions is postfixed with epoch timestamp in folder name*    
FIX: *pip install is performed after download of model-systed (previously triggered only on switching folder)*  

**2.1.0**  
FEA: *Cost Benefit Analysis (two input scenario result folders, and evaluation year, passed to side-script)*  

**2.0.0**  
Breaking change: Python interface is called via args, instead of stdin. Also the Python file name is different. Compatible with model-system version 0.1.0 and newer.  

**1.5.0**  
FEA: *Various UI/UX enhancements from discussion with an end-user*  

**1.4.0**  
FEA: *enable model-system version selection (before auto-install)*  

**1.3.0**  
FEA: *auto-install also model-system dependencies whenever model-system reference changes*  

**1.2.0**  
FEA: *enable auto-install of helmet-model-system*  

**1.1.1 (hotfix)**  
FIX: *cast numeric parameters as numbers when sent to model-system*  
FIX: *log python-process errors to log component as errors*  

**1.1.0**  
Rewritten with ReactJS  
FIX: *out of date lodash package*  
FEA: *new boolean field USE_FIXED_TRANSIT_COST*  
FEA: *new number field FIRST_SCENARIO_ID*  
FEA: *enable multiple saved scenarios*  
FEA: *enable serial execution of selected scenarios*  
FEA: *enable changing scenarios' load path (=HELMET Project)*  
FEA: *enable scenarios' reload ("Refresh") via button*  
FEA: *change "End" button to remove remaining scenarios from run*  

**1.0.0 (Initial release)**  
Able to set scenario parameters and run Helmet Model System.  
