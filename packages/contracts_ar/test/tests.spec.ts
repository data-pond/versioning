import {expect, test} from 'vitest'
import {AccessRight, DeployFunctions, DeployVersion, Platforms, timestamp} from "@versioning-contract/commons";
import SmartWeave from 'smartweave'
import {arLocal, mine, arweave, generateWallet} from './utils.ts'
import * as path from "path";
import * as fs from 'fs';
import * as SmartWeaveSdk from "smartweave";

test('Start ArLocal', async () => {

    const server = await arLocal('./')
    const wallet = await generateWallet('1000000000')

    const __dirname = import.meta.dirname;

    console.log('dirname', __dirname)
    // deploy contract
    const contractSrc = fs.readFileSync(path.resolve(path.join(__dirname, '../out/node/versions.js')), 'utf-8');
    const initialState = JSON.stringify({
        versions: {},
        allowedKeys: {
            [wallet.address]: {
                [AccessRight.KEY_DELETE]: timestamp(),
                [AccessRight.KEY_ADD]: timestamp(),
                [AccessRight.DEPLOY_DELETE]: timestamp(),
                [AccessRight.DEPLOY_ADD]: timestamp(),
            }
        }
    })
    const contractId = await SmartWeave.createContract(arweave, wallet.jwk, contractSrc, initialState);

    expect(contractId.length > 0).toBeTruthy()


    const version = "1"
    const url = "http://google.com"
    const platform = Platforms.Linux_FlatPak


    const version2 = "2"
    const url2 = "http://google2.com"


    await SmartWeave.interactWrite(arweave, wallet.jwk, contractId, {
        function: DeployFunctions.Deploy,
        args: {version, url, platform}
    },  [],  '', '')

    await mine();

    await SmartWeave.interactWrite(arweave, wallet.jwk, contractId, {
        function: DeployFunctions.Deploy,
        args: {version: version2, url: url2, platform}
    },  [],  '', '')

    await mine();

    const result = await SmartWeave.interactRead(arweave, wallet.jwk, contractId, {
        function: DeployFunctions.ListVersions,
        args:{platform}
    });

    console.log(result)

    expect(result.length).toBe(2)

    expect(result[0].version).toBe(version)
    expect(result[0].url).toBe(url)

    expect(result[1].version).toBe(version2)
    expect(result[1].url).toBe(url2)

    const result2 = await SmartWeave.interactRead(arweave, wallet.jwk, contractId, {
        function: DeployFunctions.GetLatestVersion,
        args:{platform}
    });

    expect(result2.url).toBe(url2)

    const result3 = await SmartWeave.interactRead(arweave, wallet.jwk, contractId, {
        function: DeployFunctions.GetVersionUrl,
        args:{platform, version}
    });

    expect(result3).toBe(url)

    const result4 = await SmartWeave.interactRead(arweave, wallet.jwk, contractId, {
        function: DeployFunctions.GetVersionUrl,
        args:{platform, version: version2}
    });

    expect(result4).toBe(url2)

    await server.stop()

})