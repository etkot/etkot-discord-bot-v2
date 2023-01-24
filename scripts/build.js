import esbuild from 'esbuild'
import glob from 'glob'

esbuild
    .build({
        platform: 'node',
        entryPoints: glob.sync('src/**/*.ts'),
        outdir: 'dist',
        format: 'esm',
    })
    .then((result) => {
        console.log('🔥 Build complete 🔥')
    })
