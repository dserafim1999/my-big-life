const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var NODE_ENV = process.env.NODE_ENV;

const htmlPlugin = new HtmlWebpackPlugin({
    template: "./public/index.html", 
    filename: "./index.html"
  });

  var config = {
    mode: NODE_ENV === 'development' ? 'development' : 'production',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
    },
    entry: {
        index: './public/index.js',
    },
    devServer: {
        historyApiFallback: true,
        compress: true,
        port: 3000,
        static: true,
        historyApiFallback: {
            rewrites: [
                { from: /^.*\/bundle\.js$/, to: '/bundle.js' },
            ]
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                  {
                    loader: 'file-loader'
                  }
                ]
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
        ]
    },
    plugins: [htmlPlugin, new MiniCssExtractPlugin()],
}

if (NODE_ENV === 'development') {
    config.devtool = NODE_ENV === 'development' ? 'inline-source-map' : false;
}

module.exports = config;