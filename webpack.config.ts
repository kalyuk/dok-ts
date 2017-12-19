import * as webpack from 'webpack';
import * as path from 'path';
import * as Uglify from 'uglifyjs-webpack-plugin';

const PUBLIC_PATH = path.join(__dirname, 'build');
const SRC_PATH = path.join(__dirname, 'src');

export default {
  context: SRC_PATH,
  entry: './index.ts',
  output: {
    path: PUBLIC_PATH,
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/, PUBLIC_PATH],
        use: [
          {
            loader: 'awesome-typescript-loader'
          }
        ],
        test: /\.ts?$/
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new Uglify({
      uglifyOptions: {
        sourceMap: false,
        ecma: 5,
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
};
