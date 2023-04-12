const path = require('path');
const express = require('express');
const compression = require('compression');
const proxyMiddleware = require('http-proxy-middleware');

module.exports = function addProdMiddlewares(app, options) {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');


  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  const proxies = {
    '/v1/admin': {
      target: process.env.PROXY_API,
      secure: false,
      changeOrigin: true,
      headers: {
        Connection: 'keep-alive'
      }
    },
    '/v1/api': {
      target: process.env.PROXY_API,
      secure: false,
      changeOrigin: true,
      headers: {
        Connection: 'keep-alive'
      }
    },
  }
  Object.keys(proxies).forEach(function(context) {
    app.use(proxyMiddleware.createProxyMiddleware(context, proxies[context]));
  });

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(outputPath, 'index.html')),
  );
};
