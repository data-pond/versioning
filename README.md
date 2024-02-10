> Notice: This project has been submitted to the EduHack 2023 on [DevPost](https://eduhacks23.devpost.com/) as part of the [DataPond Project](https://datapond.earth), the first decentralized free book library on the topic of Ethics and Sustainability.  

A Smart contract aimed at keeping track of deployed versions for a decentralized web3 app.
Typically, a downloadable  installer, or a URL.


# Repo structure:

It is a typescript monorepo, organized around the ESNext module methodology using [turbo](https://turbo.build/).

- [The CLI Documentation](/packages/cli/README.md)  
- [The Web Client Documentation](/packages/browser/README.md)
- [The smart contract source code](/packages/contracts_ar/src/versions.ts)
- [The versioning class source code](/packages/commons/src/index.ts)

It publishes 2 npm packages:

- [@datapond/ar-web3-versions](https://www.npmjs.com/package/@datapond/ar-web3-versions) for the CLI
- [@datapond/ar-check-new-version](https://www.npmjs.com/package/@datapond/ar-check-new-version) for the Javascript client