
module.exports = {
    packagerConfig: {
        appBundleId: 'fi.hsl.helmet.ui'
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
                prerelease: true,
                authToken: process.env.GITHUB_TOKEN
            }
        }
    ],
    buildIdentifier: `${new Date().getTime()}`
}
