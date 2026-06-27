const { getDefaultConfig } = require("expo/metro-config");
const https = require("node:https");

const config = getDefaultConfig(__dirname);
const defaultEnhanceMiddleware = config.server?.enhanceMiddleware;

function proxyOpenFoodFactsSearch(req, res) {
  const incomingUrl = new URL(req.url, "http://localhost");
  const targetUrl = new URL("https://search.openfoodfacts.org/search");
  incomingUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const proxyReq = https.request(
    targetUrl,
    {
      method: "GET",
      // Dev-only proxy: keeps Expo Web local working when Node cannot read the OS CA store.
      agent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        Accept: "application/json",
        "User-Agent": "UNTDF TNT 2026",
      },
    },
    (proxyRes) => {
      res.statusCode = proxyRes.statusCode ?? 502;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (error) => {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message }));
  });

  proxyReq.end();
}

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    const enhancedMiddleware = defaultEnhanceMiddleware
      ? defaultEnhanceMiddleware(middleware, server)
      : middleware;

    return (req, res, next) => {
      if (req.url?.startsWith("/__openfoodfacts_search")) {
        proxyOpenFoodFactsSearch(req, res);
        return;
      }

      enhancedMiddleware(req, res, next);
    };
  },
};

module.exports = config;
