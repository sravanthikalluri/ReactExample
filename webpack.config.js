const path = require('path');
const webpack = require('webpack');
var config = {
  //Pack the import file
  entry: './main.js',

  // Configure the package results, path define the output folder, and filename define the name of the package result file
    output: {
        path:path.join(__dirname, '/dist'),
        filename: 'index.js',
    },
    resolveLoader: {
        modules: [path.join(__dirname, 'node_modules')]
    },
  // set server port number
  devServer: {
    inline: true,
    port: 3333,
    historyApiFallback: true,
  },

  //Configure the processing logic of the module and define the loader with the loaders
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
        {
            test: /\.(less|css)$/,
            loader: 'style!css'
        }
    ],
    node: {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
  }
}

module.exports = config;
