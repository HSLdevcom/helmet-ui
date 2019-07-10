# Helmet UI

[![Build Status](https://travis-ci.org/HSLdevcom/helmet-ui.svg?branch=master)](https://travis-ci.org/HSLdevcom/helmet-ui)

This is the UI for [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system). It is an [Electron.js](https://electrojs.org) app written in JavaScript, HTML and CSS.

## Development env

### Requirements

- Git client
- Node.js 10 LTS + NPM
- [helmet-model-system](https://github.com/HSLdevcom/helmet-model-system)
- EMME (Windows-only)

On Mac and Linux, [Wine](https://www.winehq.org/) and [Mono](https://www.mono-project.com/) are required to make the Windows build of the app.

See the [end-user requirements](#end-user-environment) that also apply to testing the UI integration with EMME.

### Setup

Due to tight integration with EMME, the application is mainly targeted for Windows but can be developed on Mac and Linux as well. However, the final testing should always happen on Windows with EMME.

```
$ git clone <this repository>`
$ npm install
```

See [end-user enviroment](#end-user-environment) for preparing the Windows environment for testing the app.

### Running and building

As usual, the `start` script is used to start the application in development environment. Running `make` will create an installer binary to be distributed to end-users.

- `$ npm start`
- `$ npm run make` (builds the app for current platform)

See also: [Electronforge.io](https://www.electronforge.io/)

### Version Control

[Git](https://git-scm.com/) is used as the primary tool for version control and `master` branch is the main development line, aka. bleeding edge. All changes should be made in dedicated feature/bugfix branches, followed by a [pull request](https://help.github.com/en/articles/creating-a-pull-request) and a peer-review. Then, after all checks have passed, the branch may be merged in `master`.

### Continuous Integration

The application is built automatically by [Travis CI](https://travis-ci.org/HSLdevcom/helmet-ui.svg?branch=master) when changes are pushed in master branch or pull requests are opened.

### Releases

[Releases](https://github.com/HSLdevcom/helmet-ui/releases) are deployed automatically when changes are pushed in the `release` branch. Hence, this branch should be updated with `master` only prior to making a new release. The Electron Forge's Github publisher is used to upload files and draft a release, thus avoiding the need to upload and tag releases manually.

The resulting draft release must be reviewed and approved in Github to make it publically available to everyone. This allows testing the package and making final fixes to it before making it public. After testing and possible bugfixes, it is recommended to delete any intermediate drafts and accept the final release with corresponding version number. This will make the release public and also tags the final commit.

## End-User Environment

Prior using Helmet UI, the following requirements must be met:

  1. [EMME](https://www.inrosoftware.com/en/products/emme/) is installed ( with active license & dongle)
  1. `%EMMEPATH%\programs` is set in user's `PATH` environment variable.
  1. [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system) is downloaded at the workstation

After installing the Helmet UI on workstation, the following settings must be specified in the application's _Settings dialog_:

1. EMME Python executable.
    - This **must** be the Python shipped with EMME to meet some special dependencies.
    - e.g. `c:\Program Files\Inro\EMME\Python27\python.exe`
1. The `Scripts` folder of Helmet 4.0 Model System
    - e.g. `c:\Helmet\helmet-model-system\Scripts`

Before running simulations, the user must specify

1. EMME project file (`.emp`)
1. Folder containing the initial model data.
    - e.g. `c:\Helmet\helmet-model-system\Zone_data\2030`
