import {AccessRight, DeployVersion, Platforms} from "../src";
import {describe, expect, test} from "vitest";

describe('DeployVersion class', () => {
    let instance: DeployVersion
    const deployManagementKey = 'abcd';
    const keyManagementKey = '1234';

    const deployManagementKey_2 = 'efgh';
    const keyManagementKey_2 = '5678';

    const invalidKey = 'zzzz'


    test('Initialization', async () => {
        instance = new DeployVersion({versions: {}, allowedKeys: {}})
        instance.initialize(keyManagementKey, deployManagementKey)

        expect(() => instance.initialize(keyManagementKey, deployManagementKey)).toThrowError()
    });


    test(`Key management`, () => {
        // invalid Keys
        expect(() => instance.addKeyRole(invalidKey, keyManagementKey_2, AccessRight.KEY_ADD)).toThrowError()
        expect(() => instance.addKeyRole(invalidKey, keyManagementKey_2, AccessRight.KEY_DELETE)).toThrowError()
        expect(() => instance.addKeyRole(invalidKey, deployManagementKey_2, AccessRight.DEPLOY_ADD)).toThrowError()
        expect(() => instance.addKeyRole(invalidKey, deployManagementKey_2, AccessRight.DEPLOY_DELETE)).toThrowError()

        expect(() => instance.removeKeyRole(invalidKey, 'a', AccessRight.DEPLOY_DELETE)).toThrowError()


        instance.addKeyRole(keyManagementKey, keyManagementKey_2, AccessRight.KEY_ADD)
        instance.addKeyRole(keyManagementKey, keyManagementKey_2, AccessRight.KEY_DELETE)

    });

    test('deploy', () => {

        instance.deploy(deployManagementKey, Platforms.Linux_AppImage, '0.91', 'some Url 1')
        instance.deploy(deployManagementKey, Platforms.Linux_AppImage, '0.92', 'some Url 2')

        const versions = instance.listVersions(Platforms.Linux_AppImage);
        expect(versions.length).eq(2)
        expect(versions[0].version).eq('0.91')
        expect(versions[1].version).eq('0.92')

        expect(versions[0].url).eq('some Url 1')
        expect(versions[1].url).eq('some Url 2')

        expect(instance.getVersionUrl(Platforms.Linux_AppImage, "0.91")).toBe('some Url 1')
        expect(instance.getVersionUrl(Platforms.Linux_AppImage, "0.92")).toBe('some Url 2')


        const latest = instance.getLatestVersion(Platforms.Linux_AppImage)
        expect(latest.version).eq('0.92')
        expect(latest.url).eq('some Url 2')

    });

    test('remove deploy', () => {
        instance.removeDeploy(deployManagementKey, Platforms.Linux_AppImage,  '0.92')
        const latest2 = instance.getLatestVersion(Platforms.Linux_AppImage)
        expect(latest2.version).eq('0.91')
        expect(latest2.url).eq('some Url 1')
    });
})
