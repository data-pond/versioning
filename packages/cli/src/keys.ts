import {JWKInterface} from "arweave/node/lib/wallet.js";
import path from "path";
import fs from "fs";
import {AccessRight, timestamp} from "@datapond/commons";
import Arweave from "arweave";

export const parseJwkFile = (file: string): JWKInterface => {
    const p = path.resolve(file)
    if (fs.existsSync(p)) {
        const data = fs.readFileSync(p, 'utf-8')
        return JSON.parse(data)
    } else {
        throw new Error(`File '${p}' doesn't exist`);
    }
}

export const generateAllowedKeys = async (arweave: Arweave, key: JWKInterface, deployKey: string, adminKey: string): Promise<{
    [key: string]: {
        [permission: string]: number
    }
}> => {
    const creatorKey = await arweave.wallets.getAddress(key);
    const allowedKeys: {
        [pubKey: string]: {
            [accessRight: string]: number
        }
    } = {};

    const ts = timestamp()
    const key1 = deployKey ? deployKey : creatorKey
    allowedKeys[key1] = {
        [AccessRight.DEPLOY_ADD]: ts,
        [AccessRight.DEPLOY_DELETE]: ts,
    }

    const key2 = adminKey ? adminKey : creatorKey
    if (typeof allowedKeys[key2] === 'undefined') {
        allowedKeys[key2] = {}
    }
    allowedKeys[key2][AccessRight.KEY_ADD] = ts;
    allowedKeys[key2][AccessRight.KEY_DELETE] = ts;

    return allowedKeys
}