import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'model-list.js',
  output: [
    {
      format: 'esm',
      file: 'bundle.js'
    },
  ],
  plugins: [
    resolve(),
  ]
};