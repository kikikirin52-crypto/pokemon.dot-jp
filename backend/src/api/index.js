const express = require('express');
const partyRoutes = require('./partyRoutes');

function setupRoutes(app) {
  // パーティ関連のルート
  app.use('/api', partyRoutes);

  // ヘルスチェック
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'ポケモン構築補完システム バックエンド',
      timestamp: new Date().toISOString()
    });
  });

  return app;
}

module.exports = setupRoutes;
