/* eslint-disable no-undef */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, 'build', 'frontend', 'index')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
        alias: {
            components: path.resolve(__dirname, 'src', 'frontend', 'components'),
            containers: path.resolve(__dirname, 'src', 'frontend', 'containers'),
            actions: path.resolve(__dirname, 'src', 'frontend', 'store', 'actions'),
            reducers: path.resolve(__dirname, 'src', 'frontend', 'store', 'reducers'),
            middlewares: path.resolve(__dirname, 'src', 'frontend', 'store', 'middlewares'),
            helpers: path.resolve(__dirname, 'src', 'frontend', 'helpers'),
            frontendRoot: path.resolve(__dirname, 'src', 'frontend'),
        },
    },
    module: {
        rules: [{
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'frontend', 'index.html'),
            filename: 'index.html',
        })
    ],
    performance: {
        hints: false
    }
};