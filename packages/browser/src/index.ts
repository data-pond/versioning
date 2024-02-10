import {Platforms, DeployFunctions} from "@datapond/commons";
import arweave from 'arweave';
import * as SmartweaveSdk from 'smartweave';

export * from '@datapond/commons';

export default (platform: Platforms, contractId: string, dev = false) => {
    const config = dev ? {
        host: 'localhost',
        port: 1984,
        protocol: 'http',
        timeout: 20000,
        logging: false,
    } : {
        host: 'arweave.net',// Hostname or IP address for a Arweave host
        port: 443,          // Port
        protocol: 'https',  // Network protocol http or https
        timeout: 20000,     // Network request timeouts in milliseconds
        logging: false,     // Enable network request logging
    };


    const Arweave = new arweave(config)


    const GetLastVersion = async (): Promise<{
        version: string,
        url: string
    }> => {

        const jwk = await Arweave.wallets.generate()
        // const address = await Arweave.wallets.getAddress(jwk);

        console.log('calling interactRead')
        return SmartweaveSdk.interactRead(Arweave, jwk, contractId, {
            function: DeployFunctions.GetLatestVersion,
            args: {
                platform
            }
        }).catch(e => {
            console.error(`error calling interactread `, e)
        });
    }

    const GetState = async (): Promise<{
        [platform: string]: Array<{ version: string, url: string }>
    }> => {
        const jwk = await Arweave.wallets.generate()
        const address = await Arweave.wallets.getAddress(jwk);

        return  SmartweaveSdk.readContract(Arweave, contractId)
    }

    return {GetState, GetLastVersion}
}
