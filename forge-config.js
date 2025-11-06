const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');

/**
 * Electron Forge config.
 *
 * https://www.electronforge.io/config/makers/squirrel.windows
 * https://www.electronforge.io/config/makers/zip
 * https://www.electronforge.io/config/publishers/github
 */
module.exports = {
    // Previously, buildIdentidier was either 'prod' or 'beta'. Now, it is always 'prod'.
    buildIdentifier: 'prod',
    packagerConfig: {
        appBundleId: fromBuildIdentifier({ prod: 'fi.hsl.helmet.ui', beta: 'fi.hsl.beta.helmet.ui' }),
        icon: "./appicons/icons/win/icon.ico",
        extraResources: [
            {
            from: 'dist/renderer',
            to: 'renderer'
            }
        ]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "helmet",
                authors: "Helsingin Seudun Liikenne -kuntayhtyma",
                // iconUrl: "https://raw.githubusercontent.com/HSLdevcom/helmet-ui/e3714d944c62c6ba4b8ed1ce8ac57fcbecaf0f13/helmet.ico",
                // loadingGif: '',
                // setupIcon: 'helmet.ico',
                certificateFile: "helmet_cs4.pfx",
                certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
            }
        },
        {
            name: "@electron-forge/maker-zip",
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
