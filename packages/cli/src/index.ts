import * as SmartWeaveSdk from 'smartweave'
import Arweave from 'arweave';
import { program }  from 'commander';
import {AccessRight, DeployFunctions, timestamp} from "@datapond/commons";
import { JWKInterface } from 'arweave/node/lib/wallet.js';
import {generateAllowedKeys, parseJwkFile} from "./keys.js";
// @ts-ignore
import contractSource from './versions.src';


const arweave = new Arweave({
    host: 'arweave.net',// Hostname or IP address for a Arweave host
    port: 443,          // Port
    protocol: 'https',  // Network protocol http or https
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
});



const dateFormat = (date: Date = new Date()) => new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long'
}).format(date)

import {name, version, description} from '../package.json'

program.name(name)
    .description(description)
    .version(version);

program.command('new')
    .description('Deploy a new Versioning Contract - it will return the contract TransactionID that you need to save to re-use')

    .requiredOption('--jwk <string>', 'the file containing your ArWeave Key')
    .option('--deployKey <string>', 'the Public Key that is allowed to deploy a new version. Leave empty if you want to use the same as --jwk')
    .option('--adminKey <string>', 'the Public Key that is allowed to add/remove a new Key. Leave empty if you want to use the same as --jwk')
    .action(async ( options) => {

        console.log(options);
        const {jwk, deployKey, adminKey} = options;

        let key: JWKInterface
        try {
            key = parseJwkFile(jwk);
        } catch(e) {
            console.error(`ERROR JWK File: ${e.message}`)
            process.exit(1)
            return
        }

        const allowedKeys = await generateAllowedKeys(arweave, key, deployKey, adminKey)
        const data = await SmartWeaveSdk.createContract(arweave, key, contractSource, JSON.stringify({
            versions: {},
            allowedKeys
        }));

        console.log(`The Contract Id deployed is ${data}`);
        console.log(`Please give it some time - It needs to be validated before being visible to all nodes on the blockchain`)
        console.log(`Deployment time: ${dateFormat()}`);
        console.log(`you can inspect the Tx  at this URL: https://viewblock.io/arweave/tx/${data}`)
        console.log(`and the contract here: https://viewblock.io/arweave/contract/${data}`)
    });

//
// program.command('newFromTx')
//     .description('Deploy a new Contract from an existing transaction Id')
//     .addHelpText('after', 'You might have a complex setup, and want to use the same contract source for all instances. This command will reuse the specified ')
//     .requiredOption('--jwk <string>', 'the file containing your ArWeave Key')
//     .option('--deployKey <string>', 'the Pub Key that is allowed to deploy a new version. Leave empty if you want to use the same as --jwk')
//     .option('--adminkey <string>', 'the Pub Key that is allowed to add a new Key. Leave empty if you want to use the same as --jwk')
//     .option('--version <string>', 'The initial Version to deploy, leave empty if nothing to deploy')
//     .option('--url <string>', 'Must be set if versionId is set')
//     .option('--platform <string>', 'Must be set if versionId is set')
//     .action(async ( options) => {
//
//         const {jwk, adminKey, deployKey, version, url, platform} = options;
//         let key: JWKInterface;
//         try {
//             key = parseJwkFile(jwk);
//         } catch(e) {
//             console.error(`ERROR JWK File: ${e.message}`)
//             process.exit(1)
//             return
//         }
//
//         const allowedKeys = await generateAllowedKeys(arweave, key, deployKey, adminKey)
//
//         let versions: any = {}
//         if (version && url && platform) {
//             versions[platform] = {
//                 [version]: {
//                     url,
//                     timestamp: timestamp()
//                 }
//             }
//         }
//         const data = await SmartWeaveSdk.createContract(arweave, key, sourceTxId, JSON.stringify({
//             versions,
//             allowedKeys
//         }));
//
//         console.log(`The Contract Id deployed is ${data}`);
//         console.log(`Please give it up to 5min - It needs to be validated before being visible to all nodes on the blockchain`)
//         console.log(`Deployment time: ${dateFormat()}`);
//         console.log(`you can inspect the Tx  at this URL: https://viewblock.io/arweave/tx/${data}`)
//         console.log(`and the contract here: https://viewblock.io/arweave/contract/${data}`)
//     });


/**
 *  Windows = 'win',
 *     Linux_FlatPak = 'flatpak',
 *     Linux_Snap = 'snap',
 *     Linux_Dev = 'deb',
 *     Linux_Rpm = 'rpm',
 *     Linux_Pacman = 'pacman',
 *     Linux_AppImage = 'appimage',
 *     Linux_Apk='apk',
 *     Apple_IOS = 'ios',
 *     Apple_OSX = 'osx',
 *     Android = 'android'
 */

program.command('deploy')
    .description('register a new deployment, and update the contract state')
    .requiredOption('--contractId <string>', 'the contractId to deploy to')
    .requiredOption('--jwk <string>', 'the file containing your ArWeave Key')
    .requiredOption('--version <string>', 'A string describing the version')
    .requiredOption('-p, --platform <string>', 'The platform to deploy on. Valid values are win, flatpak, deb, rpm, snap, pacman, appimage, apk, ios, osx, android')
    .requiredOption('--url <string>', 'The Url where the program can be downloaded from')
    .action(async (options) => {
        const {version, contractId, url, jwk, platform} = options;

        console.log(`deploying on https://viewblock.io/arweave/tx/${contractId}`)
        console.log(`platform: ${platform}`)
        console.log(`version: ${version}`)
        console.log(`url: ${url}`)
        console.log(`....`)

        const key = parseJwkFile(jwk);

        const data = await SmartWeaveSdk.interactWrite(arweave, key, contractId, {
            function: DeployFunctions.Deploy,
            args: {version, url, platform}
        },  [],  '', '')
        console.log(`Deployment done. time: ${dateFormat()}`);
        // console.log('return Data: ', data)
        // console.log(`https://viewblock.io/arweave/contract/${contractId}`)
    });


program.command('list')
    .description('list all')
    .requiredOption('--platform <string>', 'The platform to deploy on. Valid values are win, flatpak, deb, rpm, snap, pacman, appimage, apk, ios, osx, android')
    .requiredOption('--contractId <string>', 'the contractId to deploy to')
    .action(async (options) => {
        const { contractId, platform} = options;
        console.log(`https://viewblock.io/arweave/tx/${contractId}`)
        console.log(`https://viewblock.io/arweave/contract/${contractId}`)
        // const key = parseJwkFile(jwk);
        const data = await SmartWeaveSdk.interactRead(arweave, undefined, contractId, {
            function: DeployFunctions.ListVersions,
            args: {platform}
        },  [],  '', '');
        console.log(data)
    });

program.command('check')
    .description('check if a transaction exists')
    .requiredOption('--contractId <string>')
    .action(async options => {
        const {contractId} = options
        try {
            const transaction = await arweave.transactions.get(contractId)
            console.log(`transaction found ok`)
        } catch(e) {
            console.log(`Transaction not found.`)
        }
        console.log(`https://viewblock.io/arweave/tx/${contractId}`)
        console.log(`https://viewblock.io/arweave/contract/${contractId}`)
    });



// program.command('deploySource')
//     .description('deploy The contract source to a new TxId')
//     .requiredOption('--jwk <string>', 'the file containing your ArWeave Key')
//     .action(async options => {
//         const { jwk} = options;
//         const key = parseJwkFile(jwk);
//
//         const srcTx = await arweave.createTransaction({ data: contractSource }, key);
//
//         srcTx.addTag('App-Name', 'SmartWeaveContractSource');
//         srcTx.addTag('App-Version', '0.3.0');
//         srcTx.addTag('Content-Type', 'application/javascript');
//
//         await arweave.transactions.sign(srcTx, key);
//
//         console.log(`uploading Transaction ${srcTx.id}`);
//
//         const response = await arweave.transactions.post(srcTx);
//
//         if (response.status === 200 || response.status === 208) {
//             console.log(new Date())
//             console.log('source file uploaded: ', response.data)
//             // return await createContractFromTx(arweave, wallet, srcTx.id, initState);
//         } else {
//             throw new Error(`Unable to write Contract Source: ${JSON.stringify(response?.statusText ?? '')}`);
//         }
//
//     });

program.command('latest')
    .description('Get the latest version for the specified platform')
    .requiredOption('--contractId <string>', 'the contractId to deploy to')
    .requiredOption('--platform <string>', 'The platform to deploy on. Valid values are win, flatpak, deb, rpm, snap, pacman, appimage, apk, ios, osx, android')
    .action(async (options) => {
        const {contractId, platform} = options;

        const emptyWallet = await arweave.wallets.generate();

        const data = await SmartWeaveSdk.interactRead(arweave, emptyWallet, contractId, {
            function: DeployFunctions.GetLatestVersion,
            args: {platform}
        },  [],  '', '')

        console.log(`https://viewblock.io/arweave/tx/${contractId}`)
        console.log(`https://viewblock.io/arweave/contract/${contractId}`)

        console.log(data)
    });

program.command('state')
    .description('Look at the global state of the contract')
    .requiredOption('--contractId <string>', 'the contractId to deploy to')
    .action(async (options) => {
        const {contractId} = options;

        const data = await SmartWeaveSdk.readContract(arweave,  contractId)

        console.log(`https://viewblock.io/arweave/tx/${contractId}`)
        console.log(`https://viewblock.io/arweave/contract/${contractId}`)

        console.log(JSON.stringify(data, null, 2))

    });


program.command('GetVersionUrl')
    .description('Get Download Url for the specified version')
    .requiredOption('--contractId <string>', 'the contractId to deploy to')
    .requiredOption('--version <string>', 'A string describing the version')
    .requiredOption('--platform <string>', 'The platform to deploy on. Valid values are win, flatpak, deb, rpm, snap, pacman, appimage, apk, ios, osx, android')
    .action(async (options) => {
        const {version, contractId, platform} = options;
        console.log(`https://viewblock.io/arweave/tx/${contractId}`)
        console.log(`https://viewblock.io/arweave/contract/${contractId}`)
        const data = await SmartWeaveSdk.interactRead(arweave, undefined, contractId, {
            function: DeployFunctions.GetVersionUrl,
            args: {version, platform}
        },  [],  '', '');
        console.log(new Date())
        console.log(data)
    });

program.parse();


