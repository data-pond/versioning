import {AccessRight, Platforms} from "./enums.js";
import {timestamp} from './timestamp.js'

export * from './enums.js';
export * from './timestamp.js';

export interface DeployVersionState {
    versions: {
        [platform: string]: {
            [version: string]: {timestamp: number, url: string}
        }
    }
    allowedKeys: {
        [pubKey: string]: {
            [accessRight: string]: number
        }
    }
}


export class DeployVersion implements DeployVersionState {

    versions: {
        [platform: string]: {
            [version: string]: {
                timestamp: number,
                url: string
            }
        }
    } = {};

    allowedKeys: {
        [pubKey: string]: {
            [accessRight: string]: number
        }
    } = {}

    constructor(data: DeployVersionState) {
        this.versions = data.versions;
        this.allowedKeys = data.allowedKeys;
    }

    initialize(keyManagementPublicKey: string, deploymentPublicKey: string) {
        if (Object.keys(this.allowedKeys).length > 0) {
            throw new Error(`this contract can be initialized only once`)
        }
        const ts = timestamp()
        this.allowedKeys[keyManagementPublicKey] = {};
        if (typeof this.allowedKeys[deploymentPublicKey] === 'undefined') {
            this.allowedKeys[deploymentPublicKey] = {};
        }

        this.allowedKeys[keyManagementPublicKey][AccessRight.KEY_ADD] = ts;
        this.allowedKeys[keyManagementPublicKey][AccessRight.KEY_DELETE] = ts;
        this.allowedKeys[deploymentPublicKey][AccessRight.DEPLOY_ADD] = ts;
        this.allowedKeys[deploymentPublicKey][AccessRight.DEPLOY_DELETE] = ts;

    }

    private isKeyAllowed(key: string, accessRight: AccessRight) : boolean {
        return typeof this.allowedKeys[key] !== 'undefined' && typeof this.allowedKeys[key][accessRight] !== 'undefined'
    }

    deploy(caller: string, platform: Platforms, version: string, url: string) {
        if (this.isKeyAllowed(caller, AccessRight.DEPLOY_ADD)) {
            if (typeof this.versions[platform] === 'undefined' ) {
                this.versions[platform] = {};
            }
            if (typeof this.versions[platform][version] !== 'undefined') {
                throw new Error(`version '${version}' has already been deployed on the platform '${platform}'`)
            }
            this.versions[platform][version] = {
                url,
                timestamp: timestamp()
            }
        } else {
            throw new Error(`key '${caller}' is not allowed to add deployments`)
        }
    }

    removeDeploy(caller: string, platform: Platforms, version: string) {
        if (this.isKeyAllowed(caller, AccessRight.DEPLOY_DELETE)) {
            if (this.versions[platform] && this.versions[platform][version]) {
                delete  this.versions[platform][version]
            } else {
                throw new Error(`version '${version}' doesn't exist on the platform '${platform}'`)
            }
        } else {
            throw new Error(`key '${caller}' is not allowed to delete deployments`)
        }
    }

    removeKeyRole(caller: string, key: string, role: AccessRight) {
        if (this.isKeyAllowed(caller, AccessRight.KEY_DELETE)) {
            if (this.allowedKeys[key] && this.allowedKeys[key][role]) {
                delete this.allowedKeys[key][role]
            } else {
                throw new Error(`key '${key}' is not defined for role ${role}`)
            }
        } else {
            throw new Error(`key '${caller}' is not allowed to remove Keys`)
        }
    }

    addKeyRole(caller: string, key: string, role: AccessRight) {
        if (this.isKeyAllowed(caller, AccessRight.KEY_ADD)) {
            if (this.allowedKeys[key]) {
                if (this.allowedKeys[key][role]) {
                    return
                }
            } else {
                this.allowedKeys[key] = {}
            }
            this.allowedKeys[key][role] = timestamp()
        } else {
            throw new Error(`key '${caller}' is not allowed to remove Keys`)
        }
    }

    getLatestVersion(platform: Platforms): { timestamp: number, version: string, url: string } {
        const versions = this.listVersions(platform)
        if (versions.length >0) {
            return versions[versions.length-1]
        }
        throw new Error(`No version available for '${platform}': versions = ${JSON.stringify(this.versions)}`)
    }


    getVersionUrl(platform: Platforms, version: string): string {
        if (this.versions[platform]) {
            if (this.versions[platform][version]) {
                return this.versions[platform][version].url
            }
            throw new Error(`Version '${version}' on Platform '${platform}' hasn't been deployed`)
        }
        throw new Error(`Platform '${platform}' hasn't been deployed`)
    }

    listVersions(platform: Platforms): Array<{ version: string, timestamp: number, url: string }> {
        if (this.versions[platform]) {
            const result = Object.keys(this.versions[platform]).map(version => ({
                version,
                url: this.versions[platform][version].url,
                timestamp: this.versions[platform][version].timestamp,
            }))
            result.sort((a, b) => a.timestamp < b.timestamp ? -1  : 1)
            return result
        }
        return [];
    }

    toJSON(): DeployVersionState {
        return {
            versions: this.versions,
            allowedKeys: this.allowedKeys
        }
    }
}