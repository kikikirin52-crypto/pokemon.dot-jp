# フロントエンド セットアップガイド

## 概要

このセクションでは、ポケモン構築補完システムのフロントエンド（React）のセットアップ手順を説明します。

## 前提条件

- Node.js v16以上
- npm v7以上（またはyarn）
- バックエンドサーバーが `http://localhost:5000` で起動していることが推奨

## インストール手順

### 1. 依存パッケージのインストール

```bash
cd frontend
npm install
```

このコマンドで以下のパッケージがインストールされます：
- **react**: Reactライブラリ
- **react-dom**: ReactDOM
- **axios**: HTTP通信ライブラリ
- **react-scripts**: Create React Appのスクリプト

### 2. バックエンドURLの確認

`src/api/client.js` で設定されているバックエンドURLを確認します：

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

バックエンドが異なるURLで起動している場合は、この値を変更してください。

## 開発環境での起動

```bash
npm start
```

自動的にブラウザが開き、`http://localhost:3000` でアプリケーションが起動します。

## ビルド

本番環境用にビルドするには：

```bash
npm run build
```

`build/` ディレクトリに本番環境用のファイルが生成されます。

## ディレクトリ構成

```
frontend/
├── public/
│   ├── index.html           # HTMLテンプレート
│   └── favicon.ico
├── src/
│   ├── App.jsx              # メインコンポーネント
│   ├── App.css              # メインスタイル
│   ├── index.jsx            # エントリーポイント
│   ├── api/
│   │   └── client.js        # バックエンドAPI クライアント
│   ├── components/
│   │   ├── PokemonSearch.jsx      # ポケモン検索フォーム
│   │   ├── ResistanceMatrix.jsx   # 耐性マトリックス表示
│   │   └── PartySuggestion.jsx    # パーティ提案UI
│   └── styles/
│       ├── PokemonSearch.css
│       ├── ResistanceMatrix.css
│       └── PartySuggestion.css
├── package.json
├── .gitignore
└── README.md
```

## 主要コンポーネント

### 1. PokemonSearch (ポケモン検索)

ユーザーがポケモンを検索・選択するコンポーネント。

- インクリメンタルサーチ機能
- 最大3匹のポケモン選択
- 選択済みポケモンの表示

### 2. ResistanceMatrix (耐性マトリックス)

現在のパーティの18タイプに対する耐性を可視化。

- 一貫性がある（穴）: ✕ 赤
- 対策済み: ○ 緑

### 3. PartySuggestion (パーティ提案)

自動生成されたパーティを表示。

- 各スロットにポケモンを表示
- 使用率ランキングを表示
- 残る弱点タイプを表示

## 使用方法

1. ポケモンを1〜3匹選択
2. 「耐性を分析」で弱点を確認
3. 「パーティを自動生成」で相性補完ポケモンを提案
4. 完成したパーティを確認

## トラブルシューティング

### バックエンド接続エラー

バックエンドが起動していることを確認：

```bash
curl http://localhost:5000/api/health
```

### キャッシュクリア

```bash
rm -rf node_modules .cache
npm install
npm start
```

### React DevTools のインストール

ブラウザの拡張機能として React DevTools をインストールすることで、
コンポーネントのデバッグが容易になります。

## パフォーマンス最適化

### コード分割

大きなコンポーネントは React.lazy で遅延読み込み可能。

### メモライズ化

React.memo や useMemo で不要なレンダリングを削減。

### 画像最適化

PokeAPI の画像URL を使用していますが、キャッシュを活用することで
パフォーマンスを向上させることができます。

## 次のステップ

- [バックエンド セットアップガイド](../docs/BACKEND_SETUP.md)
- [API ドキュメント](../docs/API.md)
- [コンポーネント説明](./COMPONENTS.md)

---

最終更新: 2024年5月2日
