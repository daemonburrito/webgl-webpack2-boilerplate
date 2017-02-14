import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';


const ROOT_PATH = path.resolve(__dirname),
  ENTRY_PATH = path.resolve(ROOT_PATH, 'src/js/main.js'),
  SRC_PATH = path.resolve(ROOT_PATH, 'src'),
  JS_PATH = path.resolve(ROOT_PATH, 'src/js'),
  TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.ejs'),
  SHADER_PATH = path.resolve(ROOT_PATH, 'src/shaders'),
  BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

let debug = process.env.NODE_ENV !== 'production';

export default {
  context: SRC_PATH,
  entry: {
    main: ENTRY_PATH,
    vendor: 'gl-matrix'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
        title: 'WebGL Webpack Boilerplate',
        template: TEMPLATE_PATH,
        inject: 'body'
    }),
    new webpack.LoaderOptionsPlugin({
      debug: debug
    })
  ],
  output: {
      path: BUILD_PATH,
      filename: '[hash].[name].js'
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
                    ],
                    plugins: [
                      'syntax-dynamic-import'
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
    modules: [SRC_PATH, 'node_modules']
  },
  devtool: debug ? 'eval-source-map' : 'source-map'
};