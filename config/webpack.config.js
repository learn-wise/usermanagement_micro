const path = require('path'),
    webpack = require('webpack'),
    BrotliPlugin = require('brotli-webpack-plugin'),
    CompressionPlugin = require('compression-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    WebpackMessages = require('webpack-messages'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isEnvProduction = process.env.NODE_ENV === 'production' ? true : false;
const isEnvDevelopment = process.env.NODE_ENV === 'development' ? true : false;

module.exports = {
    name: "client",
    target: "web",
    mode: process.env.NODE_ENV,
    entry: [
        "@babel/runtime/regenerator",
        "webpack-hot-middleware/client?noInfo=true&timeout=2000",
        "react-hot-loader/patch",
        './client/index.js'
    ],
    output: {
        filename: 'public-bundle.js',
        chunkFilename: 'public-bundle.chunk.js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/'
    },
    stats: 'none',
    devtool: "cheap-module-source-map",
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                extractComments: true,
                parallel: true,
                cache: true,
                uglifyOptions: {
                    parse: {
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,

                    },
                    output: {
                        comments: false
                    }
                }
            })
        ],
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    module: {
        rules: [

            {
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
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: require.resolve("babel-loader"),
                    options: {
                        cacheDirectory: true,
                        cacheCompression: isEnvProduction,
                        compact: isEnvProduction,
                    }
                }, ]
            },
            {
                test: /\.(js|mjs)$/,
                include: /node_modules/,
                loader: require.resolve('babel-loader'),
                options: {
                    babelrc: false,
                    configFile: isEnvProduction,
                    compact: isEnvProduction,
                    presets: [
                        [
                            require.resolve('babel-preset-react-app/dependencies'),
                            {
                                helpers: true
                            },
                        ]
                    ],
                    cacheDirectory: true,
                    cacheCompression: isEnvProduction,
                    sourceMaps: isEnvProduction,
                },
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: require.resolve('file-loader'),
                options: {
                    name: 'images/[name].[hash:8].[ext]',
                },
            },

            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
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
                })
            },
            {
                test: /\.(sc|sa)ss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
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
                })
            },
        ]
    },
    plugins: [
        isEnvDevelopment && new webpack.HotModuleReplacementPlugin(), // Enable HMR
        isEnvProduction && new CompressionPlugin({
            algorithm: "gzip"
        }),
        isEnvProduction && new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg|jpg)$/,
            threshold: 10240,
            minRatio: 0.8,
            // deleteOriginalAssets: true
        }),
        new ExtractTextPlugin('stylesheets/[name].css'),
        new WebpackMessages({
            name: 'client',
            logger: str => console.log(`>> ${str}`)
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ].filter(Boolean),
    node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
}