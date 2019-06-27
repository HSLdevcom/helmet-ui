const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');

module.exports = {
    buildIdentifier: process.env.TRAVIS_BRANCH === 'release' ? 'prod' : 'beta',
    packagerConfig: {
        appBundleId: fromBuildIdentifier({ prod: 'fi.hsl.helmet.ui', beta: 'fi.hsl.beta.helmet.ui' })
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "helmet_ui"
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
                prerelease: true,
                authToken: process.env.GITHUB_TOKEN
            }
        }
    ]
}
