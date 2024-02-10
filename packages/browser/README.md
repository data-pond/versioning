> Notice: This project has been submitted to the EduHack 2023 on [DevPost](https://eduhacks23.devpost.com/) as part of the [DataPond Project](https://datapond.earth), the first decentralized free book library on the topic of Ethics and Sustainability.

# @datapond/ar-check-new-version

This is the browser utility that allows you to load the latest published version from the registered contracts.

A Smart contract aimed at keeping track of deployed versions for a decentralized web3 app.
Typically, a downloadable  installer, or a URL.

# Usage

```bash
npm i -D @datapond/ar-check-new-version
```

```typescript
import {version} from '../package.json';
import VersionCheck, {Platforms} from '../src/index';
const contractId = '2yVor8mhpZiELinh-l6UOSWC2pQowa9-LNnQnSqoGBk';
const platform = Platforms.Windows;

const {GetLastVersion} = VersionCheck(platform, contractId);
const {version: lastVersion, url} = await GetLastVersion();

if(version !== lastVersion) {
    console.log(`A new version is available at ${url}`);
}


```

# Version Management

To create the contract, and manage deployed versions, go to [@datapond/ar-web3-versions](https://www.npmjs.com/package/@datapond/ar-web3-versions) 
