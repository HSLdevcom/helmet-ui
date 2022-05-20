# Helmet UI

![master](https://github.com/HSLdevcom/helmet-ui/actions/workflows/node.js.yml/badge.svg?branch=master)

Helmet UI is a desktop user interface for [Helmet 4 Model System](https://github.com/HSLdevcom/helmet-model-system). **Read [the documentation in Finnish](https://hsldevcom.github.io/helmet-ui/) to learn how to use Helmet UI and Helmet 4 Model System.** If you wish to develop the UI, continue below.

## Development requirements

This is an [Electron](https://electrojs.org) application written in JavaScript _([NodeJS API](https://nodejs.org/api/)
and [Electron API](https://www.electronjs.org/docs/api) available within app)_, HTML and CSS.

- Git client
- Node.js 16 LTS & NPM
- EMME 4.x.x _(Windows-only)_
- _[optionally]_ [helmet-model-system](https://github.com/HSLdevcom/helmet-model-system) _(otherwise downloaded and auto-installed by the UI)_

On Mac and Linux, [Wine](https://www.winehq.org/) and [Mono](https://www.mono-project.com/) are also required to make the app for Windows.

## Setup

Due to tight integration with EMME, the application is mainly targeted for Windows but can be developed on Mac and Linux as well.
However, the final testing should always happen on Windows with Emme.

```
$ git clone <this repository>
$ npm install
```

See [the documentation](https://hsldevcom.github.io/helmet-ui/) for preparing the Windows environment for testing.
EMME and EMME-Python versions can be set in [versions.js](src/versions.js), affecting the automatic resolving of Python binary.

## Running and building

`npm start` command is used to start the application in development environment. Running `npm run make` will create an installer binary to be distributed to end-users.

See also: [Electronforge.io](https://www.electronforge.io/)

## Version control

[Git](https://git-scm.com/) is used as the primary tool for version control and `master` branch is the main development line, aka. bleeding edge.
All changes should be made in dedicated feature/bugfix branches, followed by a [pull request](https://help.github.com/en/articles/creating-a-pull-request) and a peer-review.
Then, after all checks have passed, the branch may be merged in `master`.

## Continuous integration

The application is built automatically by [GitHub Actions](https://github.com/HSLdevcom/helmet-ui/actions)
when changes are pushed in master branch or pull requests are opened.

[Releases](https://github.com/HSLdevcom/helmet-ui/releases) are deployed automatically when changes are pushed in the `release` branch,
which should be updated with `master` only to make new releases.

## Publishing releases

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
