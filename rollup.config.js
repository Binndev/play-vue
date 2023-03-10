import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup'


export default defineConfig({
  input: './src/index.ts',
  output: {
    file: 'dist/vue.js',
    format: 'umd',
   name: 'Vue', // ćšć±ćé
   sourcemap: true
  },
  plugins: [
    typescript({
      sourceMap: false
    }),
    babel({
        exclude: 'node_modules/**'
    }),
    serve({
        port: 3000,
        contentBase: '',
        openPage: '/index.html'
    }),
  ]
  
});