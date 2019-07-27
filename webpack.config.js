const {VueLoaderPlugin} = require("vue-loader");
const helpers = require("./helpers");

const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const proxy = require('http-proxy-middleware');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


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

let servers = ["ust", "usw", "use", "eu", "br", "ldn", "use2", "usw2", "sea", "sa"];

let mystera = "http://www.mysteralegacy.com/";
let isDev = true;


let srcPath = 'src/client';

let iconPath = helpers.root('mysteraLegacySquare.png');

module.exports = {
    entry: {
        polyfill: '@babel/polyfill',
        main: helpers.root(srcPath),
    },
    resolve: {
        extensions: ['.js', '.vue', '.ts', '.tsx'],
        alias: {
            'vue$': isDev ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.runtime.min.js',
            '@': helpers.root(srcPath)
        }
    },
    devtool: "cheap-module-eval-source-map",
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    esModule: true
                },
                include: [helpers.root(srcPath)]
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                },
                exclude: /node_modules/,


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

        before: function (app) {

            for (let server of servers) {
                app.use(getWsProxy(server));
            }


        },
        proxy: [
            {
                context: ['**', '!/', ...servers.map(x => "!/ws-" + x)],
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
            title: "Mystera Reborn"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        new FaviconsWebpackPlugin({
            // Your source logo
            logo: iconPath,
            // The prefix for all image files (might be a folder or a name)
            prefix: 'favicons-webpack-[hash]/',
            // Emit all stats of the generated icons
            emitStats: false,
            // The name of the json containing all favicon information
            statsFilename: 'faviconstats-[hash].json',
            // Generate a cache file with control hashes and
            // don't rebuild the favicons until those hashes change
            persistentCache: true,
            // Inject the html into the html-webpack-plugin
            // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
            // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
            title: 'Mystera Reborn',
            // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        new FaviconsWebpackPlugin({
            // Your source logo
            logo: helpers.root('splash.png'),
            // The prefix for all image files (might be a folder or a name)
            prefix: 'favicons-webpack-[hash]/',
            // Emit all stats of the generated icons
            emitStats: false,
            // The name of the json containing all favicon information
            statsFilename: 'faviconstats-[hash].json',
            // Generate a cache file with control hashes and
            // don't rebuild the favicons until those hashes change
            persistentCache: true,
            // Inject the html into the html-webpack-plugin
            // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
            // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
            title: 'Mystera Reborn',
            // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
            icons: {
                android: false,
                appleIcon: false,
                appleStartup: {background: "black"},
                coast: false,
                favicons: false,
                firefox: false,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        new WebpackPwaManifest({
            name: 'Mystera Reborn',
            short_name: 'MysteraReborn',
            description: 'Enhanced client for Mystera Legacy!',
            background_color: '#000000',
            orientation: "omit",
            theme_color: '#000000',
            inject: true,
            ios: {
                'apple-mobile-web-app-title': 'Mystera Reborn',
                'apple-mobile-web-app-status-bar-style': 'black'
            }
        }),
        new SWPrecacheWebpackPlugin(
            {
                cacheId: '4.9.1',
                dontCacheBustUrlsMatching: /\.\w{8}\./,
                filename: 'service-worker.js',
                minify: true,
                importScripts: ['serviceWorker.js'],
                navigateFallback: '/',
                staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
            }
        ),
        new CopyPlugin([
            {from: helpers.root("src/client/serviceWorker.js"), to: helpers.root('public/serviceWorker.js')},
        ])


    ]
};




