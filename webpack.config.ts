import * as externals from 'webpack-node-externals';
import * as webpack from 'webpack';
import * as path from 'path';

const PUBLIC_PATH = path.join(__dirname, 'build');
const SRC_PATH = path.join(__dirname, 'src');

export default {
  context: SRC_PATH,
  entry: {
    index: [
      './index.ts',
      './base/index.ts',
      './web/index.ts'
    ]
  },
  output: {
    path: PUBLIC_PATH,
    filename: '[name].js'
  },
  externals: [externals()],
  module: {
    rules: [
      {
        exclude: [/node_modules/, PUBLIC_PATH, /\.test\.ts$/, /\.d\.ts$/],
        use: [
          {
            loader: 'ts-loader'
          }
        ],
        test: /\.ts$/
      }
    ]
  }, plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js',]
  },
  target: 'node'
};
