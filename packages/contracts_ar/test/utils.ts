import Arweave from "arweave";
import ArLocal from 'arlocal';

const port = 1984;
const host ='127.0.0.1';


export const arweave = Arweave.init({
    host,
    port,
    protocol: 'http',
    timeout: 20000,
    logging: false,

});
export const generateWallet = async (funds: string) => {
    try {
        const jwk = await arweave.wallets.generate();
        const generatedAddr = await arweave.wallets.getAddress(jwk);
        await arweave.api.get(`/mint/${generatedAddr}/${funds}`)
        return {jwk, address: generatedAddr}
    } catch(e) {
        console.error(`error generating wallet: `, e);
        throw e
    }
}



export const mine = async  () => {
    await arweave.api.get('/mine')
}

export const arLocal = async (basePath: string): Promise<ArLocal> => {
    // @ts-ignore
    const server =  new ArLocal(port, false)
    await server.start();
    return server
}