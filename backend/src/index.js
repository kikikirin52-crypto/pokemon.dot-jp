const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const setupRoutes = require('./api');

const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// 本番環境でフロントエンド静的ファイルをサーブ
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
}

// API ルートの設定
setupRoutes(app);

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error('エラー:', err.message);
  res.status(500).json({
    success: false,
    error: 'サーバーエラーが発生しました'
  });
});

// 404 ハンドラー
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'エンドポイントが見つかりません'
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 バックエンド起動: http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/health`);
});

module.exports = app;
