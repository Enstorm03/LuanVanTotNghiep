const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * CRA proxy setup — tự động được load khi npm start.
 * Mọi request /api/* từ bất kỳ origin nào (kể cả ngrok)
 * đều được forward sang localhost:8080.
 */
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      on: {
        error: (err, _req, res) => {
          console.error('[Proxy Error]', err.message);
          res.status(502).json({ error: 'Backend không phản hồi: ' + err.message });
        },
      },
    })
  );
};
