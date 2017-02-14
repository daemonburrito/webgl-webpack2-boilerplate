# WebGL Webpack Boilerplate

An example WebGL project built with Webpack 2, demonstrating the inclusion of
external GLSL with `webpack-glsl-loader`.

Inspired by https://github.com/obsoke/webpack-webgl-boilerplate, which was
written for Webpack 1. Besides using Webpack2, this project aims to be larger
in scope, and perhaps become a global `npm` CLI scaffold generator.

`main.js` demonstrates using ES6-style import statements to source the GLSL
files. After that, they can be passed into `gl.shaderSource()` without further
ado. This is made possible with the `webpack-glsl-loader` configuration in
`webpack.config.babel.js`.

See also:
* https://github.com/grieve/webpack-glsl-loader

Issues and pull requests welcome.
