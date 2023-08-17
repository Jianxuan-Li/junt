// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const isProduction = process.env.NODE_ENV == 'production'
const stylesHandler = MiniCssExtractPlugin.loader

const config = {
  entry: {
    popup: './src/popup.tsx',
    // fullpage: "./src/fullpage.ts"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    open: false,
    host: 'localhost',
    port: 3000,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'extension_base/popup.html',
      chunks: ['popup'],
    }),
    // new HtmlWebpackPlugin({
    //   filename: "fullpage.html",
    //   template: "extension_base/fullpage.html",
    //   chunks: ["fullpage"]
    // }),
    new CopyPlugin({
      patterns: [
        { from: 'extension_base/icon-128.png', to: '' },
        { from: 'extension_base/manifest.json', to: '' },
      ],
    }),

    new MiniCssExtractPlugin(),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    alias: {
      '@': path.resolve('src'),
    },
  },
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production'
  } else {
    config.mode = 'development'
    config.devtool = 'cheap-source-map'
  }
  return config
}
