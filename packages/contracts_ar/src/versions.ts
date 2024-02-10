import { DeployFunctions, DeployVersion, DeployVersionState} from "@datapond/commons";


export function handle (state: DeployVersionState, action: {input: {function, args}, caller}) {

    const cl = new DeployVersion(state);
    try {
        switch (action.input.function) {
            case DeployFunctions.Deploy: {
                const {version, url, platform} = action.input.args;
                cl.deploy(action.caller,  platform, version, url)
                return {
                    state: cl.toJSON()
                }
            }
            case DeployFunctions.GetLatestVersion: {
                const {platform} = action.input.args;
                return {
                    result: cl.getLatestVersion(platform)
                }
            }
            case DeployFunctions.AddAuthorizedKey: {
                const {pubKey, permission} = action.input.args;
                cl.addKeyRole(action.caller, pubKey, permission)
                return {
                    state: cl.toJSON()
                }
            }
            case DeployFunctions.GetVersionUrl: {
                const {version, platform} = action.input.args;
                const url = cl.getVersionUrl(platform, version);
                return {
                    result: url
                }
            }
            case DeployFunctions.ListVersions: {
                const {platform} = action.input.args;
                const versions = cl.listVersions(platform)
                return {
                    result: versions
                }
            }
        }
    } catch(e) {
        throw new ContractError(e)
    }
    throw new Error(`unknown function call: '${action.input.function}'`)
}