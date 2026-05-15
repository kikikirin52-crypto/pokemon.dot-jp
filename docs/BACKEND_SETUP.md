# バックエンド セットアップガイド

## 概要

このセクションでは、ポケモン構築補完システムのバックエンド（Node.js + Express）のセットアップ手順を説明します。

## 前提条件

- Node.js v16以上
- npm v7以上（またはyarn）

## インストール手順

### 1. 依存パッケージのインストール

```bash
cd backend
npm install
```

このコマンドで以下のパッケージがインストールされます：
- **express**: Webフレームワーク
- **axios**: HTTP通信ライブラリ（PokeAPI統合用）
- **cors**: クロスオリジンリソース共有対応
- **dotenv**: 環境変数管理
- **nodemon** (dev): ファイル監視と自動リロード

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` ファイルを開いて、必要に応じて設定を変更します：

```
PORT=5000
NODE_ENV=development
POKEAPI_URL=https://pokeapi.co/api/v2
```

## サーバー起動

### 開発環境での起動

```bash
npm run dev
```

このコマンドで `nodemon` がファイルの変更を監視し、自動的に再起動します。

### 本番環境での起動

```bash
npm start
```

## ディレクトリ構成

```
backend/
├── src/
│   ├── index.js              # メインサーバーファイル
│   ├── api/
│   │   ├── index.js          # ルート設定
│   │   └── partyRoutes.js    # パーティAPI
│   └── services/
│       ├── pokeapi.js             # PokeAPI統合
│       ├── typeEffectiveness.js   # タイプ相性計算
│       ├── usageRankings.js       # 使用率データ
│       ├── abilityImmunities.js   # 特性無効化ロジック
│       └── partyCompletion.js     # パーティ補完ロジック
├── package.json
├── .env.example
└── .gitignore
```

## APIエンドポイント

### ヘルスチェック

**GET** `/api/health`

```bash
curl http://localhost:5000/api/health
```

レスポンス例:
```json
{
  "status": "ok",
  "message": "ポケモン構築補完システム バックエンド",
  "timestamp": "2024-05-02T12:00:00.000Z"
}
```

### ポケモン検索

**POST** `/api/search`

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"name": "pikachu"}'
```

### パーティ分析

**POST** `/api/analyze`

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"partyMembers": [...]}'
```

### パーティ提案

**POST** `/api/suggest`

```bash
curl -X POST http://localhost:5000/api/suggest \
  -H "Content-Type: application/json" \
  -d '{"partyMembers": [...]}'
```

### ランキング取得

**GET** `/api/rankings`

```bash
curl http://localhost:5000/api/rankings
```

## トラブルシューティング

### ポート 5000 が既に使用されている場合

```bash
# 異なるポートで起動
PORT=5001 npm run dev
```

### 依存パッケージのクリア

```bash
rm -rf node_modules package-lock.json
npm install
```

### Node.js バージョン確認

```bash
node --version
npm --version
```

## 次のステップ

- [フロントエンド セットアップガイド](../frontend/SETUP.md)
- [API ドキュメント](./API.md)
- [アーキテクチャ説明](./ARCHITECTURE.md)

---

最終更新: 2024年5月2日
