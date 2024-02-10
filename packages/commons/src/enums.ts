export enum AccessRight {
    KEY_ADD='ka',
    KEY_DELETE='kd',
    DEPLOY_ADD='da',
    DEPLOY_DELETE='dd',
}

export enum DeployFunctions {

    Deploy = 'Deploy', //(version: string, url: string)**
    GetLatestVersion = 'GetLatestVersion',// (): { deployDate: string, version: string, downloadUrl: string }**
    AddAuthorizedKey = 'AddAuthorizedKey', //(publicKey: string)**
    GetVersionUrl = 'GetVersionUrl', //(versionId: string): string**
    ListVersions = 'ListVersions', //(): Array<{version: string, deployDate: Date,  url: string}>
}


export enum Platforms {
    Windows = 'win',
    Linux_FlatPak = 'flatpak',
    Linux_Snap = 'snap',
    Linux_Dev = 'deb',
    Linux_Rpm = 'rpm',
    Linux_Pacman = 'pacman',
    Linux_AppImage = 'appimage',
    Linux_Apk='apk',
    Apple_IOS = 'ios',
    Apple_OSX = 'osx',
    Android = 'android'
}