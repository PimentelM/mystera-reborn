const {VueLoaderPlugin} = require("vue-loader");
const helpers = require("./helpers");

const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const proxy = require('http-proxy-middleware');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');



var getWsProxy = (srv) => proxy('/ws/' + srv, {
    target: `wss://${srv}.mysteralegacy.com`,
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    ws: true, // enable websocket proxy
    logLevel: 'debug',
    headers: {
        Host: srv + ".mysteralegacy.com",
        Origin: "http://www.mysteralegacy.com"
    }
});

let servers = ["ust", "usw", "use", "eu", "br",  "ldn", "use2", "usw2", "sea", "sa"];

let mystera = "http://www.mysteralegacy.com/";
let isDev = true;


let srcPath = 'src/client';

let iconPath = helpers.root( 'myst.png');

module.exports = {
    entry: {
        polyfill: '@babel/polyfill',
        main: helpers.root(srcPath),
    },
    resolve: {
        extensions: ['.js', '.vue', '.ts', '.tsx'],
        alias: {
            'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
            '@': helpers.root(srcPath)
        }
    },
    devtool: "cheap-module-eval-source-map",
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [helpers.root(srcPath)]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [helpers.root(srcPath)]
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

            for (let server of servers){
                app.use(getWsProxy(server));
            }


        },
        proxy: [
            {
                context: ['**', '!/',...servers.map(x=>"!/ws-"+x)],
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
        path: helpers.root('public'),
        publicPath: '/',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js'
    },

    plugins: [
        new HTMLPlugin({
            title : "Mystera Reborn"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        new FaviconsWebpackPlugin(iconPath),
        new WebpackPwaManifest({
            name: 'Mystera Reborn',
            short_name: 'MysteraReborn',
            description: 'Enhanced client for Mystera Legacy!',
            background_color: '#000',
            orientation: "landscape",
            theme_color : '#000',
            icons: [
                {
                    src: iconPath,
                    sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
                }
            ]
        }),
        new SWPrecacheWebpackPlugin(
            {
                cacheId: '4.9.1',
                dontCacheBustUrlsMatching: /\.\w{8}\./,
                filename: 'service-worker.js',
                minify: true,
                navigateFallback: '/',
                staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
            }
        ),



    ]
};




