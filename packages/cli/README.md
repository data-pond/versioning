> Notice: This project has been submitted to the EduHack 2023 on [DevPost](https://eduhacks23.devpost.com/) as part of the [DataPond Project](https://datapond.earth), the first decentralized free book library on the topic of Ethics and Sustainability.  

#  @datapond/ar-web3-versions

A Smart contract aimed at keeping track of deployed versions for a decentralized web3 app.
Typically, a downloadable  installer, or a URL.

The contract state is: 

```
{
    versions: {
        [platform: string]: {
            [version: string]: {timestamp: number, url: string}
        }
    },
    allowedKeys: {
        [pubKey: string]: {
            [accessRight: string]: number
        }
    }
}

```

It allows you to keep track of all deployed versions on a per platform basis.

For example: 
```javascript
const example = {
  Windows: {
    "1.0": "http://windows.url.for.version.1",
    "1.1": "http://windows.url.for.version.1.1",
    "1.2": "http://windows.url.for.version.1.2"
  },
  Flatpak: {
    "1.0": "http://Flatpak.url.for.version.1",
    "1.1": "http://Flatpak.url.for.version.1.1",
    "1.2": "http://Flatpak.url.for.version.1.2"
  }
}
```

The `allowedKeys` keeps track on which publick Keys is allowed to manage the deployments, and the admin keys.

This Program has 3 parts:

- [@datapond/ar-web3-versions](https://www.npmjs.com/package/@datapond/ar-web3-versions) A CLI that allows to create new contracts, manage keys, make new deployments and list versions (This Repo)
- [@datapond/ar-check-new-version](https://www.npmjs.com/package/@datapond/ar-check-new-version) - A javascript client for connecting to the smart contract, and check if there is an update
- A Web GUI to manage versions (coming soon)

# Getting started

## 1 - Get Arweave Wallet

Arweave is the evolution of web3 storage - providing decentralized permanent storage as a proof of work.
To get quickly started: 
- get your free Wallet here: https://arweave.app/
- read: https://www.communitylabs.com/blog/arweave-for-beginners-how-to-buy-arweave-tokens

Buying 5US$ worth of AR will be enough  to update your contract weekly for the next 50 years.

When you have your wallet ready, download the `jwk` json key and store it safely at `pathToYourKey.json`.  

## 2 - Create a new Contract

```bash
$ npx @datapond/ar-web3-versions new --jwk pathToYourKey.json

The Contract Id deployed is YOUR_CONTRACT_ID
Please give it 5min - It needs to be validated before being visible to all nodes on the blockchain
Deployment time: .....
you can inspect the Tx  at this URL: https://viewblock.io/arweave/tx/YOUR_CONTRACT_ID
and the contract here: https://viewblock.io/arweave/contract/YOUR_CONTRACT_ID


```

Now you have a contract deployed on the blockchain - with only your Key that is allowed to add or delete deployments from the deployment history.

Save your **YOUR_CONTRACT_ID** for later use.

## 3 - Deploy a new executable

Example for windows:

```bash
$ npx @datapond/ar-web3-versions deploy --platform win --version "1.1" --url "http://download.your.installer.here" --jwk pathToYourKey.json --contractId YOUR_CONTRACT_ID
````

The contract has now been updated with the latest version. Any client using `@datapond/ar-check-new-version` will be notified that a new version is available.

## 4 - Update your App

Inside your Javascript based App, include the following script. 

>**Note that the client doesn't need to own a wallet to access the latest version.** 

`npm install -D @datapond/ar-check-new-version`

```javascript

import {GetLatestVersion, Platforms} from '@datapond/ar-check-new-version';
import {version} from './package.json'; 

const contractId = 'YOUR_CONTRACT_ID'
const {version: latestVersion, url} = GetLatestVersion(Platforms.Windows, contractId);

if (latestVersion !== version) {
    alert(`A new version is available to download here: ${url}`)
}

```

# API

```bash
npx @datapond/ar-web3-versions --help


Usage: @datapond/ar-web3-versions [options] [command]

CLI to deploy a smart contract to the Arweave Blockchain for managing deployments and versioning

Options:
  -V, --version            output the version number
  -h, --help               display help for command

Commands:
  new [options]            Deploy a new Versioning Contract - it will return the contract TransactionID that you need to save to re-use
  deploy [options]         register a new deployment, and update the contract state
  list [options]           list all
  check [options]          check if a transaction exists
  latest [options]         Get the latest version for the specified platform
  state [options]          Look at the global state of the contract
  GetVersionUrl [options]  Get Download Url for the specified version
  help [command]           display help for command

```

# Licence

This library is published under the C Licence.
