# ビルドコマンド クイックリファレンス

## 開発環境

### 同時起動（推奨）
```bash
npm run dev
```
- バックエンド: http://localhost:5000
- フロントエンド: http://localhost:3000

### 個別起動
```bash
npm run dev:backend    # バックエンドのみ
npm run dev:frontend   # フロントエンドのみ
```

---

## 本番環境ビルド

### クロスプラットフォーム自動ビルド（推奨）

```bash
npm run build
```

**対応OS**: Windows、Linux、Mac（全て同じコマンド）

- フロントエンドをビルド
- `backend/public` に自動コピー
- バックエンド依存関係の確認
- カラーテキストでビルド進捗を表示

### プラットフォーム固定ビルド

**Windows:**
```bash
npm run build:windows
# または
./build.ps1
```

**Linux/Mac:**
```bash
npm run build:unix
# または
bash ./build.sh
```

### 手動ビルド
```bash
npm run build:frontend    # フロントエンドをビルド
npm run copy:frontend     # backend/public にコピー
npm run install:backend   # バックエンド依存関係
```

---

## 本番環境実行

```bash
cd backend
NODE_ENV=production npm start
```

アプリケーション: http://localhost:5000

---

## その他のコマンド

```bash
npm run install:all       # すべての依存パッケージをインストール
npm run test              # すべてテスト実行
npm run test:backend      # バックエンドテストのみ
npm run test:frontend     # フロントエンドテストのみ
npm run clean             # ビルド出力を削除
```

---

## トラブルシューティング

### PowerShell 実行エラー
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ポート競合
```bash
PORT=5001 NODE_ENV=production npm start
```

### キャッシュクリア
```bash
npm run clean
npm run install:all
npm run build
```

---

最終更新: 2024年5月2日
