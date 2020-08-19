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
                name: "helmet",
                authors: "Helsingin Seudun Liikenne -kuntayhtyma",
                // TODO branding
                // iconUrl: '',
                // loadingGif: '',
                // setupIcon: ''
                // TODO Move to base64
                certificateFile: "helmet_cs4.pfx",
                certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
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
