const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
            },
            {
                test: /\.(ttf|woff|eot|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: require.resolve('file-loader'),
                    options: {
                        emitFile: false
                    }
                }]
            },
            {
                test: /\.svg$/,
                issuer:{
                    test: /\.(scss|css|sass)$/
                },
                use: [{
                    loader: require.resolve('file-loader'),
                    options: {
                        emitFile: false
                    }
                }]
            },
            {
                test: /\.svg$/,
                issuer:{
                    test: /\.js$/
                },
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: require.resolve('file-loader'),
                options: {
                    outputPath: 'assets',
                    name: 'images/[name].[hash:8].[ext]',
                    emitFile: false,
                },
            },
            {
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isEnvDevelopment
                        }
                    },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]',
                            importLoaders: 1
                        }
                    },
                    {
                        loader: require.resolve('postcss-loader')
                    }
                ]
            },
            {
                test: /\.(sc|sa)ss$/,
                exclude: /node_modules/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isEnvDevelopment
                        }
                    },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]',
                            importLoaders: 2
                        }
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss'
                        }
                    },
                    {
                        loader: require.resolve("sass-loader")
                    }
                ]
            }
        ]
    },
    plugins: [
        new WebpackMessages({
            name: 'server',
            logger: str => console.log(`>> ${str}`)
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new MiniCssExtractPlugin({
            filename: 'stylesheets/[name].css'
        })
    ]
}