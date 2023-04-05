//=============== Plugins =============================
import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser";
import bootstrap from "./bootstrap.js";
const production = {
    output: {
        dir: 'build',
        format: 'es',
        entryFileNames: '[name]',
        chunkFileNames: 'chunks/[name]-[hash]',
    },
    plugins: [
        nodeResolve({modulePaths:  [path.join(process.cwd(), 'node_modules')]}),
        terser({
            maxWorkers: 4
        }),
        bootstrap.moduleAliasResolver()
    ]
}

const development = {
    output: {
        dir: 'build',
        format: 'es',
        entryFileNames: '[name]',
        chunkFileNames: 'chunks/[name]-[hash]',
        sourcemap: 'inline'
    },
    plugins: [
        nodeResolve({modulePaths:  [path.join(process.cwd(), 'node_modules')]}),
        bootstrap.moduleAliasResolver()
    ]
}

export {production, development}
