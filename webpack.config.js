const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const proxy = require('http-proxy-middleware');
const webpack = require('webpack');

var getWsProxy = (srv) =>  proxy('/ws/' + srv, {
  target: `wss://${srv}.mysteralegacy.com`,
  changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  ws: true, // enable websocket proxy
  logLevel: 'debug',
  headers : {
    Host: "br.mysteralegacy.com",
    Origin: "http://www.mysteralegacy.com"
  }
});





let mystera = "http://www.mysteralegacy.com/";

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  devServer: {
    hot: true,
    setup: function(app) {

      app.use(getWsProxy("br"));


    },
    proxy: [
      {
        context: ['**', '!/','!/ws-br'],
        "changeOrigin": true,
        "cookieDomainRewrite": "localhost",
        "target": mystera,
        onProxyReq: proxyReq => {
          if (proxyReq.getHeader('origin')) {
            proxyReq.setHeader('origin', mystera);
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HTMLPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};




