const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');

/**
 * Electron Forge config.
 *
 * https://www.electronforge.io/config/makers/squirrel.windows
 * https://www.electronforge.io/config/publishers/github
 */
module.exports = {
    buildIdentifier: process.env.TRAVIS_BRANCH === 'release' ? 'prod' : 'beta',
    packagerConfig: {
        appBundleId: fromBuildIdentifier({ prod: 'fi.hsl.helmet.ui', beta: 'fi.hsl.beta.helmet.ui' })
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "helmet-ui",

                // TODO branding
                // iconUrl: '',
                // loadingGif: '',
                // setupIcon: ''

                certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
                certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD
            }
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        }
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'HSLdevcom',
                    name: 'helmet-ui'
                },
                draft: true,
                prerelease: false,
                authToken: process.env.GITHUB_TOKEN
            }
        }
    ]
}
