// global.Promise         = require('bluebird');

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var publicPath = 'http://localhost:8050/public/assets';
var cssName = process.env.NODE_ENV === 'production' ? 'styles-[hash].css' : 'styles.css';
var jsName = process.env.NODE_ENV === 'production' ? 'bundle-[hash].js' : 'bundle.js';

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }),
  new MiniCssExtractPlugin({ filename: cssName }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    // new CleanWebpackPlugin(['public/assets/'], {
    //   root: __dirname,
    //   verbose: true,
    //   dry: false
    // })
    new CleanWebpackPlugin({
      verbose: true,
      dry: false
    })
    // new CleanWebpackPlugin()
  );
  // plugins.push(new webpack.optimize.DedupePlugin());
  // plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
} else {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  );
}

module.exports = {
  entry: ['./src/client.js'],
  resolve: {
    roots: [__dirname, path.join(__dirname, 'src')],
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
  plugins,
  output: {
    path: `${__dirname}/public/assets/`,
    filename: jsName,
    publicPath
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      { test: /\.gif$/, use: 'url-loader?limit=10000&mimetype=image/gif' },
      { test: /\.jpg$/, use: 'url-loader?limit=10000&mimetype=image/jpg' },
      { test: /\.png$/, use: 'url-loader?limit=10000&mimetype=image/png' },
      { test: /\.svg/, use: 'url-loader?limit=26000&mimetype=image/svg+xml' },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      { test: /\.json$/, use: 'json-loader' },
    ]
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
};