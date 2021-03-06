const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  // app.use(proxy('/api/', { 
  //     target: 'http://localhost:5000/',
  //     changeOrigin:true,
  //     onProxyReq(proxyReq) {
  //       if (proxyReq.getHeader("origin")) {
  //         proxyReq.setHeader("origin", "http://localhost:5000/")
  //       }
  //     },
  //     logLevel: "debug",
  //   }));
  app.use(proxy('/socket.io', {
    target: 'http://localhost:8000/',
    changeOrigin: true,
    ws: true,
  }));
};