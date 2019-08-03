import proxy from 'http-proxy-middleware';

let mystera = "http://www.mysteralegacy.com/";
let servers = ["ust", "usw", "use", "eu", "br", "ldn", "use2", "usw2", "sea", "sa"];

let httpProxy =
    {
        "changeOrigin": true,
        "cookieDomainRewrite": "localhost",
        "target": mystera,
        onProxyReq: proxyReq => {
            if (proxyReq.getHeader('origin')) {
                proxyReq.setHeader('origin', mystera);
            }
        }
    };


export function SetupHttpProxy(app) {
    app.use(proxy(['!/', ...servers.map(x => "!/ws-" + x), '**'], httpProxy));
}
