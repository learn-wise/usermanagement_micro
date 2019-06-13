require('@babel/register')
const  app =require('./server/index');
const  http =require('http');
// import https from 'https';

// const Options = {
//     cert:,
//     key:
// }

http.createServer(app).listen(8080,()=>{
    console.log('server is running on port 8080')
});
// https.createServer(Options,app).listen(443);