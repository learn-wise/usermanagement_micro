require('@babel/register')
require.extensions['.scss'] = () => {};
require.extensions['.css'] = () => {};
require.extensions['.svg'] = () => {};
require('dotenv').config()
const app = require('./server/index');
const http = require('http');
const chalk = require('chalk')
// import https from 'https';

// const Options = {
//     cert:,
//     key:
// }

http.createServer(app).listen(process.env.PORT, () => {
    console.log(' ❤️ ⚙️  ' + chalk.bold.black.bgCyan(`Server is running on port ${process.env.PORT}`))
});
// https.createServer(Options,app).listen(443);