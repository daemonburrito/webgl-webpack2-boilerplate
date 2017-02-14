import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';


const ROOT_PATH = path.resolve(__dirname),
  ENTRY_PATH = path.resolve(ROOT_PATH, 'src/js/main.js'),
  SRC_PATH = path.resolve(ROOT_PATH, 'src'),
  JS_PATH = path.resolve(ROOT_PATH, 'src/js'),
  TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.html'),
  SHADER_PATH = path.resolve(ROOT_PATH, 'src/shaders'),
  BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

let debug = process.env.NODE_ENV !== 'production';

export default {
  context: SRC_PATH,
  entry: ENTRY_PATH,
  plugins: [
      new HtmlWebpackPlugin({
          title: 'WebGL2 sandbox',
          template: TEMPLATE_PATH,
          inject: 'body'
      }),
      new webpack.LoaderOptionsPlugin({
        debug: debug
      })
  ],
  output: {
      path: BUILD_PATH,
      filename: 'bundle.js'
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                      ['latest', {
                        modules: false
                      }]
                    ]
                }
              }],
              include: JS_PATH,
              exclude: /(node_modules|bower_components)/
          },
          {
              test: /\.glsl$/,
              use: [{
                loader: 'webpack-glsl-loader'
              }],
              include: SHADER_PATH
          }
      ]
  },
  resolve: {
    modules: [SRC_PATH, path.resolve(ROOT_PATH, 'node_modules')]
  },
  devtool: debug ? 'eval-source-map' : 'source-map'
};