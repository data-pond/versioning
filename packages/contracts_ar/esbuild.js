import {buildArweave, replaceExport} from "@datapond/config/esbuild";
import * as path from 'path';
import {readFileSync, writeFileSync} from 'fs'
buildArweave({}).then(() => {
    const builtPath = path.resolve('out/node/versions.js');
    console.log('Path ', builtPath);
    const content = readFileSync(builtPath, 'utf-8')
    writeFileSync(builtPath, replaceExport(content), 'utf-8')
})

