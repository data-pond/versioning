import { build } from 'esbuild';
import fg from 'fast-glob';
import { rmOutDirPlugin } from './plugins/rm-out-dir.js';

export const buildNode = async ({ ...args }) => {
    await build({
        entryPoints: await fg('src/**/*.ts'),
        platform: 'node',
        target: 'node16',
        format: 'esm',
    
        outdir: './out/node',
        sourcemap: false,
        logLevel: 'info',
        plugins: [rmOutDirPlugin()],
        keepNames: false,
        // custom
        bundle: false,
        minify: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        minifyWhitespace: true,


    
        ...args
    })
};
