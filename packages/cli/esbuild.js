import {buildNode, buildBrowser} from "@datapond/config/esbuild";

buildNode({
    bundle: true,
    external:[
        'smartweave',
        'arweave',
        'commander',
    ],
    loader: {
        '.src': 'text'
    }
})

