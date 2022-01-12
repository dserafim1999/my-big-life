const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

var NODE_ENV = process.env.NODE_ENV

const htmlPlugin = new HtmlWebpackPlugin({
    template: "./src/index.html", 
    filename: "./index.html"
  });

  var config = {
    mode: NODE_ENV === 'development' ? 'development' : 'production',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
    },
    entry: {
        index: './src/index.js',
    },
    devServer: {
        static: './dist',
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
            }
        ]
    },
    plugins: [htmlPlugin, new MiniCssExtractPlugin()],
}

if (NODE_ENV === 'development') {
    config.devtool = NODE_ENV === 'development' ? 'inline-source-map' : false;
} 

module.exports = config;