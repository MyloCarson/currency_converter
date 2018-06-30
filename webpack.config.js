var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: {
         app :'./index.js'
     },
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'app.bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.js?$/,
                 loader: 'babel-loader',
                 exclude: /node_modules/,
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     }
 };