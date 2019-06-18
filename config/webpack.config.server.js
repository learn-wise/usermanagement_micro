const path = require('path');
const nodeExternals = require('webpack-node-externals')
const WebpackMessages = require('webpack-messages');
const webpack = require('webpack');
const isEnvProduction = process.env.NODE_ENV === 'production' ? true : false;
const isEnvDevelopment = process.env.NODE_ENV === 'development' ? true : false;

module.exports = {
    name: "server",
    mode: process.env.NODE_ENV,
    target: "node",
    entry: ['./server/routes/index.js'],
    output: {
        path: path.resolve(__dirname, '../dist/server'),
        filename: "server-bundle.js",
        publicPath: '/',
        libraryTarget: 'commonjs2'
    },
    externals: [nodeExternals({
        modulesDir: "./node_modules"
    })],
    stats: 'none',
    devtool: "cheap-module-source-map",
    module: {
        rules: [{
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [{
                    loader: require.resolve('eslint-loader'),
                    options: {
                        formatter: require.resolve('react-dev-utils/eslintFormatter'),
                        eslintPath: require.resolve('eslint'),
                    },
                }]
            },
            {
                test: /js$/,
                exclude: /node_modules/,
                use: [{
                    loader: require.resolve("babel-loader"),
                }]
            }
        ]
    },
    plugins: [
        new WebpackMessages({
            name: 'server',
            logger: str => console.log(`>> ${str}`)
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
}