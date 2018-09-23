const merge = require('webpack-merge');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',

    output: {
        path: __dirname + "/dist/production"
    },

    performance: {
        hints: false
    },

    plugins: [
        new CleanWebpackPlugin([__dirname + "/dist/production"]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/src/html/index.html',
            title: 'react-studies(production)'
        })
    ]
});