const express = require('express');
const next = require('next');
const LRUCache = require("lru-cache");

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const ssrCache = new LRUCache({
    length: function (n, key) {
        return n.toString().length + key.toString().length;
    },
    max: 200 * 1000 * 1000, // 200MB cache soft limit
    maxAge: 1000 * 60 * 60 * 24 // 1hour
});

app.prepare()
    .then(() => {
        const server = express();
        server.use(express.static(__dirname + '/public'));

        server.get("*", (req, res) => {
            if (
                req.url === "/"
                // || req.url === "/gethour"
                // || req.url === "/hello"
                // || req.url === "/test"
            ) {
                return renderAndCache(req, res, req.url, {});
            } else {
                return handle(req, res);
            }
        });

        server.listen(3000, (err) => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack);
        process.exit(1)
    });


async function renderAndCache(req, res, pagePath, queryParams) {
    const key = getCacheKey(req);
    if (ssrCache.has(key)) {
        res.setHeader("x-cache", "HIT");
        res.send(ssrCache.get(key));
        return;
    }
    try {
        const html = await app.renderToHTML(req, res, pagePath, queryParams);
        if (res.statusCode !== 200) {
            res.send(html);
            return;
        }
        ssrCache.set(key, html);
        res.setHeader("x-cache", "MISS");
        res.send(html);
    } catch (err) {
        app.renderError(err, req, res, pagePath, queryParams);
    }
}

function getCacheKey(req) {
    return `${req.url}`;
}