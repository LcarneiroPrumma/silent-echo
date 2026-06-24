const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    mode: argv.mode || 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
      chunkFilename: isDevelopment ? '[name].chunk.js' : '[name].[contenthash:8].chunk.js',
      clean: true,
    },
    devtool: isDevelopment ? 'eval-source-map' : false,
    devServer: {
      port: 8080,
      host: 'localhost',
      open: true,
      hot: true,
      historyApiFallback: true,
      compress: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
        {
          test: /\.(mp3|wav|ogg|m4a)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: isDevelopment,
        'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
      }),
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].[contenthash:8].css',
      }),
    ],
    optimization: {
      minimize: !isDevelopment,
      minimizer: [new TerserPlugin()],
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@scenes': path.resolve(__dirname, 'src/scenes'),
        '@systems': path.resolve(__dirname, 'src/systems'),
        '@entities': path.resolve(__dirname, 'src/entities'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  };
};