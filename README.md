# Helmet UI

![master](https://github.com/HSLdevcom/helmet-ui/actions/workflows/node.js.yml/badge.svg?branch=master)

Helmet UI is a desktop user interface for [Helmet Model System](https://github.com/HSLdevcom/helmet-model-system). 
**Read [the documentation in Finnish](https://hsldevcom.github.io/helmet-docs/) to learn how to use Helmet UI and Helmet Model System.**
 If you wish to develop the UI, continue below.

## Development requirements

This is an [Electron](https://electrojs.org) application written in JavaScript _([NodeJS API](https://nodejs.org/api/)
and [Electron API](https://www.electronjs.org/docs/api) available within app)_, TypeScript, HTML and CSS.

- Git client
- Node.js 20 LTS & NPM
- OpenPaths EMME version >= 24.x.x _(Windows-only)_
- _[optionally]_ [helmet-model-system](https://github.com/HSLdevcom/helmet-model-system) _(otherwise downloaded and auto-installed by the UI)_

On Mac and Linux, [Wine](https://www.winehq.org/) and [Mono](https://www.mono-project.com/) are also required to make the app for Windows.

## Setup

Due to tight integration with EMME, the application is mainly targeted for Windows but can be developed on Mac and Linux as well.
However, the final testing should always happen on Windows with Emme.

```
$ git clone <this repository>
$ npm install
```

See [the documentation](https://hsldevcom.github.io/helmet-docs/) for preparing the Windows environment for testing (in Finnish).
EMME and EMME-Python versions can be set in [versions.js](src/versions.js), affecting the automatic resolving of Python binary.

## Running and building

`npm start` command is used to start the application in development environment. Running `npm run make` will create an installer binary to be distributed to end-users.

See also: [Electronforge.io](https://www.electronforge.io/)

### Running mock assignments for testing

Normally, the backend of the program, Helmet model system (https://github.com/HSLdevcom/helmet-model-system), requires an active installation and license of Bentley's OpenPaths EMME (https://www.bentley.com/software/openpaths/). For development and testing purposes, the model system allows the running of a mock scenario, which requires some extra steps:

1. In Helmet UI's settings, download helmet-model-system using the **"Lataa eri versio internetistä"**, and download the newest version
2. Find the downloaded model system folder, and go to *helmet-model-system-<version>/Scripts/dev_config.json*, add **"DO_NOT_USE_EMME"** to **"OPTIONAL_FLAGS"** (with the quotation marks)
3. In some folder, create an empty text file, and set its file extension to **.emp** (For example, **test.emp**)
4. In Helmet UI's settings, set **"Lähtödatan sisältävä kansio"** to *helmet-model-system-<version>/Scripts/tests/test_data/Base_input_data*
5. In Helmet UI's settings, set **"Tulosten tallennuspolku"** to *helmet-model-system-<version>/Scripts/tests/test_data/Results*
6. Create a new scenario with the **"Uusi Helmet-skenaario"** -button. Name it **test**
7. Set **"Emme-projekti (.emp)"** to the .emp text file created earlier
8. Set **"Syöttötiedot"** to *helmet-model-system-<version>/Scripts/tests/test_data/Results/Scenario_input_data/2030_test*
9. Run the newly created mock scenario by selecting it in the scenario list, and clicking **"Käynnistä (1) skenaariota"**

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

The Electron Forge's [Github publisher](https://www.electronforge.io/config/publishers/github) is
used to upload files and draft a new release, thus avoiding the need to upload and tag releases
manually.

The resulting draft must be reviewed, edited and approved in Github to make it publically available
to everyone. This allows testing the package and making final fixes to it before making it public.

1. Test and bring all the desired changes in the `master` branch.
1. Remove if there's word `SNAPSHOT` in `version` field of [package.json](./package.json), and
   update version as per [semver practises](https://semver.org/).
1. Switch to `release` branch
1. Merge `master` to `release` and push to remote
    - `$ git merge master`
    - `$ git push`
1. Wait for [GitHub Actions](https://github.com/HSLdevcom/helmet-ui/actions) to build the
   application.
1. Go to [releases page](https://github.com/HSLdevcom/helmet-ui/releases) page and **Edit** the
   newly created draft.
    1. Ensure the release name corresponds to version number
    1. Write a brief description (new features, changes, fixes etc)
    1. Check/uncheck the pre-release checkbox as needed.
    1. Select `release` branch as the target for tagging
    1. Press **Publish release** when all is good.
1. Switch back to `master` branch and update the version number matching the release. This can be
   updated to indicate a [snapshot](http://codethataint.com/blog/what-are-maven-snapshots/) before
   next release (e.g. `1.3.0-SNAPSHOT`) while said release (`1.3.0`) is in development, if necessary.
    1. [`package.json#L4`](https://github.com/HSLdevcom/helmet-ui/blob/15a7c6e5ae020b8048907a7498d0d534a68ce21b/package.json#L4)
    1. [`package-lock.json#L3`](https://github.com/HSLdevcom/helmet-ui/blob/15a7c6e5ae020b8048907a7498d0d534a68ce21b/package-lock.json#L3)
       and [`#L9`](https://github.com/HSLdevcom/helmet-ui/blob/15a7c6e5ae020b8048907a7498d0d534a68ce21b/package-lock.json#L9)

:warning: You cannot create drafts with an existing version number (i.e. release name). Thus, any
intermediate drafts must be deleted before pushing final tweaks and fixes for the version about to
be released.
