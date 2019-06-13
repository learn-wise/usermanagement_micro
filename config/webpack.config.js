const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack'),
    BrotliPlugin = require('brotli-webpack-plugin'),
    CompressionPlugin = require('compression-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin');

process.env.NODE_ENV = 'production'

module.exports = {
    mode: "development",
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
        publicPath:'/'
    },
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
                        cacheCompression: false,
                        compact: false,
                    }
                }, ]
            },
            {
                test: /\.(js|mjs)$/,
                include: /node_modules/,
                loader: require.resolve('babel-loader'),
                options: {
                    babelrc: false,
                    configFile: false,
                    compact: false,
                    presets: [
                        [
                            require.resolve('babel-preset-react-app/dependencies'),
                            {
                                helpers: true
                            },
                        ]
                    ],
                    cacheDirectory: true,
                    cacheCompression: false,
                    sourceMaps: false,
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
        new webpack.HotModuleReplacementPlugin(), // Enable HMR
        new CompressionPlugin({
            algorithm: "gzip"
        }),
        // new BrotliPlugin({
        //     asset: '[path].br[query]',
        //     test: /\.(js|css|html|svg)$/,
        //     threshold: 10240,
        //     minRatio: 0.8,
        // }),
        new ExtractTextPlugin('stylesheets/[name].css'),
        new HtmlWebpackPlugin(
            Object.assign({}, {
                inject: true,
                template: 'client/index.html',
            }, {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            })),
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
}