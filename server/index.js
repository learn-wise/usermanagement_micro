import bodyParser from 'body-parser';
import chalk from 'chalk';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import expressStaticGzip from 'express-static-gzip';
import {renderToString} from 'react-dom/server';
import React from 'react';
import App from '../client/Routes'
require('dotenv').config()

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config.js')
const webpackHotMiddleware = require("webpack-hot-middleware");

const app = express()

// Database configure
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
})
mongoose.connection
    .on('connected', () => {
        console.log(chalk.green.bold('[AdminSection] Server is now connected successfully'))
    })
    .on('disconnected', () => {
        console.log(chalk.redBright.bold('[AdminSection] Server is now disconnected,Please check DB connection'))
    })
    .on('error', () => {
        console.log(chalk.bgRed.whiteBright('[AdminSection] ERROR happened in DB connection'))
    })
mongoose.set('useCreateIndex', true);
// Middleware Configure
app.use(bodyParser.urlencoded({extended: false}));
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


// Client configure
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));

app.use(expressStaticGzip(webpackConfig.output.path))

app.use('*',(req,res)=>{
    res.send(renderToString(<App/>)
})



module.exports = app;