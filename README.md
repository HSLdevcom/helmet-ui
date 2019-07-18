# Helmet UI

[![Build Status](https://travis-ci.org/HSLdevcom/helmet-ui.svg?branch=master)](https://travis-ci.org/HSLdevcom/helmet-ui)

This is the UI for [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system).

## Development env

 This is an [Electron.js](https://electrojs.org) application written mostly in JavaScript, HTML and CSS.

### Requirements

- Git client
- Node.js 10 LTS + NPM
- [helmet-model-system](https://github.com/HSLdevcom/helmet-model-system)
- Emme 4.3.3 (Windows-only)

On Mac and Linux, [Wine](https://www.winehq.org/) and [Mono](https://www.mono-project.com/) are required to make the Windows build of the app.

See the [end-user requirements](#end-user-environment) that also apply to testing the UI integration with Emme.

### Setup

Due to tight integration with Emme, the application is mainly targeted for Windows but can be developed on Mac and Linux as well. However, the final testing should always happen on Windows with Emme.

```
$ git clone <this repository>`
$ npm install
```

See [End-User Enviroment](#end-user-environment) for preparing the Windows environment for testing the app.

### Running and building

As usual, the `start` script is used to start the application in development environment. Running `make` will create an installer binary to be distributed to end-users.

- `$ npm start`
- `$ npm run make` (builds the app for current platform)

See also: [Electronforge.io](https://www.electronforge.io/)

### Version Control

[Git](https://git-scm.com/) is used as the primary tool for version control and `master` branch is the main development line, aka. bleeding edge. All changes should be made in dedicated feature/bugfix branches, followed by a [pull request](https://help.github.com/en/articles/creating-a-pull-request) and a peer-review. Then, after all checks have passed, the branch may be merged in `master`.

### Continuous Integration

The application is built automatically by [Travis CI](https://travis-ci.org/HSLdevcom/helmet-ui.svg?branch=master) when changes are pushed in master branch or pull requests are opened.

[Releases](https://github.com/HSLdevcom/helmet-ui/releases) are deployed automatically when changes are pushed in the `release` branch, which should be updated with `master` only to make new releases.

### Publishing Releases

The Electron Forge's [Github publisher](https://www.electronforge.io/config/publishers/github) is used to upload files and draft a new release, thus avoiding the need to upload and tag releases manually.

The resulting draft must be reviewed, edited and approved in Github to make it publically available to everyone. This allows testing the package and making final fixes to it before making it public.

1. Test and bring all the desired changes in the `master` branch.
1. Increment the `version` number in [package.json](./package.json) and commit.
    - See also: [Semantic Versioning](https://semver.org/)
1. Switch to `release` branch
1. Merge `master` to `release` and push to remote
    - `$ git merge master`
    - `$ git push`
1. Wait for [Travis](https://travis-ci.org/HSLdevcom/helmet-ui) to build the application.
1. Go to [releases page](https://github.com/HSLdevcom/helmet-ui/releases) page and **Edit** the newly created draft.
    1. Ensure the release name corresponds to version number
    1. Write a brief description (new features, changes, fixes etc)
    1. Check/uncheck the Pre-release checkbox as needed.
    1. Press **Publish release** when all is good.

_Notice: you cannot create drafts with an existing version number (i.e. release name). Thus, any intermediate drafts must be deleted before pushing final tweaks and fixes for the version about to be released._

## End-User Environment

Before using Helmet UI, the following requirements must be met:

  1. [Emme 4.3.3](https://www.inrosoftware.com/en/products/emme/) is installed, with active license/dongle.
  1. `%EMMEPATH%\programs` is set in user's `PATH` environment variable.
  1. [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system) is downloaded at the workstation

The application attempts to find Emme installation on the workstation, but may fail if it is installed in an unusual location. If this is the case, you must set the Python location manually. This is notified on first start and can be done in the application's setting dialog (_Asetukset_):

- Emme Python executable
    - This **must** be the Python shipped with Emme to meet some special dependencies.
    - e.g. `C:\Program Files\INRO\Emme-4.3.3\Python27\python.exe`
- The `Scripts` folder of [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system)
    - e.g. `C:\Helmet\helmet-model-system\Scripts`
    - this is the Python backend doing most of the work

Before running simulations, you must also specify the following:

1. Emme project file (`.emp`)
1. Folder containing the initial model data.
    - e.g. `c:\Helmet\helmet-model-system\Zone_data\2030`
1. Number of iterations to be executed (optional)
1. Scenario/run name (optional)
