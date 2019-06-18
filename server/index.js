import bodyParser from 'body-parser';
import chalk from 'chalk';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import expressStaticGzip from 'express-static-gzip';
import mainRouter from './routes';
import expressGraphql from 'express-graphql';
import schema from './GraphQL/schema';
import path from 'path';

// miscellanies configurations
require('dotenv').config({path:path.resolve(process.cwd(),'.env')})
const app = express()


// Webpack configuration
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackClientConfig = require('../config/webpack.config.js')
const webpackServerConfig = require('../config/webpack.config.server.js')

const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');


// Database configure
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
})
mongoose.connection
    .on('connected', () => {
        console.log('🎉🎉  '+chalk.green.bold('[AdminSection] Database is now connected successfully'))
    })
    .on('disconnected', () => {
        console.log('☹️  '+chalk.redBright.bold('[AdminSection] Database is now disconnected,Please check DB connection'))
    })
    .on('error', () => {
        console.log('😕  '+chalk.bgRed.whiteBright('[AdminSection] ERROR happened in DB connection'))
    })
mongoose.set('useCreateIndex', true);
// Middleware Configure
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Session configure
const RedisStore = require('connect-redis')(session)
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.sessionKey,
    store: new RedisStore({
        logErrors: true
    })
}))

// Passport configure


// Graphql configure
app.use('/graphql', expressGraphql({
    schema,
    graphiql: true,
    pretty: true
}))

// Client configure
const compiler = webpack([webpackClientConfig, webpackServerConfig]);
app.use(webpackDevMiddleware(compiler, {
    serverSideRender: true,
    logLevel:'silent',
    logTime:false
}));
app.use(webpackHotMiddleware(compiler.compilers.find(com => com.name === 'client')));
app.use(webpackHotServerMiddleware(compiler))

app.use(expressStaticGzip('./dist', {
    enableBrotli: true,
    orderPreference: ['br', 'gz']
}))

app.use(mainRouter())
module.exports = app;