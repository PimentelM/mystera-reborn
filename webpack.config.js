const {VueLoaderPlugin} = require("vue-loader");
const helpers = require("./helpers");

const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const proxy = require('http-proxy-middleware');
const webpack = require('webpack');

var getWsProxy = (srv) => proxy('/ws/' + srv, {
    target: `wss://${srv}.mysteralegacy.com`,
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    ws: true, // enable websocket proxy
    logLevel: 'debug',
    headers: {
        Host: "br.mysteralegacy.com",
        Origin: "http://www.mysteralegacy.com"
    }
});


let mystera = "http://www.mysteralegacy.com/";
let isDev = true;

module.exports = {
    entry: {
        polyfill: '@babel/polyfill',
        main: helpers.root('src', 'main'),
    },
    resolve: {
        extensions: ['.js', '.vue', '.ts', '.tsx'],
        alias: {
            'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
            '@': helpers.root('src')
        }
    },
    devtool: 'cheap-module-eval-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [helpers.root('src')]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [helpers.root('src')]
            },
            {
                test: /\.css$/,
                use: [
                    isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
                    {loader: 'css-loader', options: {sourceMap: isDev}},
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
                    {loader: 'css-loader', options: {sourceMap: isDev}},
                    {loader: 'sass-loader', options: {sourceMap: isDev}}
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    isDev ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
                    {loader: 'css-loader', options: {sourceMap: isDev}},
                    {loader: 'sass-loader', options: {sourceMap: isDev}}
                ]
            }
        ]
    },

    devServer: {
        hot: true,
        overlay: false,
        compress: true,
        port: 8000,

        setup: function (app) {

            app.use(getWsProxy("br"));


        },
        proxy: [
            {
                context: ['**', '!/', '!/ws-br'],
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
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all'
        }
    },
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js'
    },

    plugins: [
        new HTMLPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),


    ]
};




