
const path              = require('path')
const webpack           = require('webpack')
const rucksack          = require('rucksack-css')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const dirs = {
  client: path.join(__dirname, 'client'),
  static: path.join(__dirname, 'static'),
}

module.exports = {
  context: dirs.client,
  entry: {
    jsx: './index.js',
    html: './index.html',
  },
  output: {
    path: dirs.static,
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: { root: dirs.client, extensions: [ '', '.js', '.jsx' ] },
  module: {
    loaders: [
      { test: /\.html$/, loader: 'file?name=[name].[ext]' },
      {
        test: /\.css$/,
        include: /client/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader',
            '?',
            [
              'modules',
              'importLoaders=1',
              process.env.NODE_ENV === 'production'
                ? 'localIdentName=[hash:base64:8]'
                : 'localIdentName=[local]-[hash:base64:4]'
            ].join('&'),
            '!',
            'postcss-loader',
          ].join(''))
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ 'es2015' ],
          plugins: [
            'transform-runtime',
            'transform-function-bind',
            [ 'transform-react-jsx', { 'pragma': 'h' } ],
          ]
        }
      },
    ],
  },
  postcss: [ rucksack({ autoprefixer: true }) ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new ExtractTextPlugin('style.css', { allChunks: true }),
  ],
  devServer: {
    hot: true,
    contentBase: './client',
    proxy: {
      '/api/*': {
        target: 'http://127.0.0.1:3001',
        secure: false,
        pathRewrite: { '^/api/': '/' },
      },
    },
  },
}
