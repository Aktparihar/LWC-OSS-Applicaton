const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/client/index.js',
        about: './src/client/about.js'
    },
    output: {
        filename: '[name].bundle.[contenthash].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/about.html',
            filename: 'about/index.html',
            chunks: ['about']
        })
    ]
};
