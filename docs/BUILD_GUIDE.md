# ビルド＆デプロイガイド

## 概要

このプロジェクトは以下の複数のビルド方法をサポートしています：

- **開発環境**: 分離実行（バックエンド + フロントエンド）
- **本番環境**: 統合ビルド（フロントエンドをバックエンドに埋め込み）

---

## 開発環境でのセットアップ

### 1. 依存パッケージをインストール（全体）

```bash
# ルートディレクトリから実行
npm install:all
```

または個別にインストール：

```bash
# バックエンド
cd backend && npm install

# フロントエンド
cd frontend && npm install
```

### 2. 開発環境で起動

#### 方法A: 統合コマンド（推奨）

```bash
# ルートディレクトリから実行
npm run dev
```

このコマンドで、バックエンド (`http://localhost:5000`) とフロントエンド (`http://localhost:3000`) が
同時に起動します。

#### 方法B: 個別起動

**ターミナル1 - バックエンド:**
```bash
cd backend
npm run dev
```

**ターミナル2 - フロントエンド:**
```bash
cd frontend
npm start
```

---

## 本番環境でのビルド

### 方法1: クロスプラットフォーム自動ビルド（推奨）

Windows、Linux、Mac 全て同じコマンドで動作：

```bash
npm run build
```

このコマンドは以下を自動実行します：
1. フロントエンドをビルド（`frontend/build` に出力）
2. `frontend/build` の内容を `backend/public` にコピー
3. バックエンド依存パッケージを確認
4. 本番環境起動方法を表示

### 方法2: プラットフォーム固定ビルドスクリプト

#### Windows (PowerShell)

```powershell
./build.ps1
```

または npm コマンド：

```bash
npm run build:windows
```

#### Linux / Mac

```bash
bash ./build.sh
```

または npm コマンド：

```bash
npm run build:unix
```

### 方法2: 手動ビルド

```bash
# ステップ1: フロントエンドをビルド
cd frontend
npm run build
cd ..

# ステップ2: backend/public ディレクトリを作成
mkdir -p backend/public

# ステップ3: ビルド結果をコピー
# Windows:
xcopy frontend\build backend\public /E /I /Y

# Linux/Mac:
cp -r frontend/build/* backend/public/

# ステップ4: バックエンド依存パッケージをインストール
cd backend
npm install
```

---

## 本番環境での実行

### バックエンドの起動

```bash
cd backend
NODE_ENV=production npm start
```

**PowerShell の場合:**

```powershell
$env:NODE_ENV='production'
npm start
```

この場合、以下が実行されます：

1. バックエンドが `http://localhost:5000` で起動
2. フロントエンドの静的ファイル（`backend/public` 配下）をサーブ
3. すべてのリクエストがシングルポートで処理される

### 確認

ブラウザで `http://localhost:5000` にアクセスしてアプリケーションが起動するか確認してください。

---

## ビルド出力

ビルド完了後、以下のディレクトリ構成になります：

```
backend/
├── node_modules/
├── public/                    ← フロントエンドの静的ファイル
│   ├── index.html
│   ├── static/
│   └── ...
└── src/
```

---

## トラブルシューティング

### PowerShell スクリプト実行エラー

```
このシステムではスクリプトの実行が無効になっているため...
```

**解決方法:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

その後、再度スクリプトを実行：

```powershell
./build.ps1
```

### `concurrently` モジュールが見つからない

```
npm ERR! Module not found: 'concurrently'
```

**解決方法:**

```bash
npm install
```

### ポート 5000 が既に使用中

別のポートで起動：

```bash
cd backend
PORT=5001 NODE_ENV=production npm start
```

### フロントエンドの静的ファイルが見つからない

```bash
# backend/public ディレクトリを確認
ls backend/public

# 手動でコピー
cp -r frontend/build/* backend/public/
```

---

## ビルドコマンド一覧

| コマンド | 説明 | 環境 |
|---------|------|------|
| `npm run dev` | バック＆フロント同時起動 | 開発 |
| `npm run dev:backend` | バックエンドのみ起動 | 開発 |
| `npm run dev:frontend` | フロントエンドのみ起動 | 開発 |
| `npm run build` | ビルド実行（自動選択） | 本番 |
| `npm run build:windows` | Windows 用ビルド | 本番 |
| `npm run build:unix` | Unix/Linux/Mac 用ビルド | 本番 |
| `npm run build:frontend` | フロントエンドのみビルド | 本番 |
| `npm run test` | すべてテスト実行 | テスト |
| `npm run test:backend` | バックエンドテスト | テスト |
| `npm run test:frontend` | フロントエンドテスト | テスト |
| `npm run clean` | ビルド出力を削除 | - |

---

## 環境変数

### バックエンド (.env)

```env
# ポート番号
PORT=5000

# 実行環境（development / production）
NODE_ENV=development

# PokeAPI URL
POKEAPI_URL=https://pokeapi.co/api/v2
```

**本番環境での設定例:**

```env
PORT=5000
NODE_ENV=production
POKEAPI_URL=https://pokeapi.co/api/v2
```

---

## Docker でのビルド＆実行（オプション）

将来対応予定。

---

## CI/CD パイプライン（オプション）

GitHub Actions などでの自動ビルド・デプロイは別途ドキュメントで説明します。

---

最終更新: 2024年5月2日
