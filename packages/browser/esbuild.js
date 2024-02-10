import { buildBrowser} from "@datapond/config/esbuild";

buildBrowser({
    external: [
        'arweave',
        'smartweave'
    ],
    bundle: true,
    minify: true
})

