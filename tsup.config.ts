import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/server.ts'],
    format:["esm"],
    target:"esnext",
    outDir:"dist/src",
    clean:true,
    bundle:true,
    splitting:false,
    sourcemap:true,
    banner:{
        js:`
        import { createRequire } from 'module';
        const require = createRequire(import.meta.url)
        `,
    },
});