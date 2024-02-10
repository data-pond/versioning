import { build } from 'esbuild';
import fg from 'fast-glob';
import { rmOutDirPlugin } from './plugins/rm-out-dir.js';
export const buildBrowser = async ({ ...args }) => {
    await build({
        entryPoints: await fg('src/**/*.ts'),
        platform: 'browser',

        format: 'iife',
        bundle: true,
        outdir: './out/web',
        sourcemap: false,
        logLevel: 'info',
        plugins: [rmOutDirPlugin()],
        ...args,
    })
};