import { build } from 'esbuild';
import fg from 'fast-glob';
import { rmOutDirPlugin } from './plugins/rm-out-dir.js';

export const buildArweave = async ({ ...args }) => {
    await build({
        entryPoints: await fg('src/**/*.ts'),
        platform: 'node',
        target: 'node16',
        format: 'esm', //cjs iife esm
    
        outdir: './out/node',
        sourcemap: false,
        logLevel: 'info',
        plugins: [rmOutDirPlugin()],
        keepNames: false,
        // custom
        bundle: true,
        minify: false,
        // minifyIdentifiers: true,
        minifySyntax: true,
        minifyWhitespace: true,
        //
        ...args
    })
};

export const replaceExport = (src) => {
    return src.replace(`export{handle}`, ``).replace(`function handle`, `export function handle`)
}
