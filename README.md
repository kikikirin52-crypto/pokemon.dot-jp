# ポケモン構築補完＆自動生成システム

全18タイプへの一貫性を切り、現環境での使用率が高い最強の相性補完パーティを自動生成するWebアプリケーション。

## プロジェクト概要

ユーザーが指定した1〜3匹のポケモンに対し、残りの枠（最大6匹）を自動選出し、以下の条件を満たす最強の相性補完パーティを提案します：

- ✅ 全18タイプへの一貫性を切る（すべてのタイプを誰かが半減以下で受けられる）
- ✅ 現環境での使用率が高い
- ✅ 高速な提案生成

## プロジェクト構成

```
pokemon.dot-jp/
├── backend/                 # Node.js + Express バックエンド
│   ├── src/
│   │   ├── index.js         # メインサーバーファイル
│   │   ├── api/
│   │   │   ├── index.js     # ルート設定
│   │   │   └── partyRoutes.js # パーティAPI
│   │   └── services/
│   │       ├── pokeapi.js           # PokeAPI統合
│   │       ├── typeEffectiveness.js # タイプ相性計算
│   │       ├── usageRankings.js     # 使用率データ
│   │       ├── abilityImmunities.js # 特性無効化
│   │       └── partyCompletion.js   # パーティ補完ロジック
│   ├── public/              # 本番環境用 - フロントエンド静的ファイル
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                # React フロントエンド
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.jsx
│   │   ├── api/
│   │   │   └── client.js    # バックエンドクライアント
│   │   ├── components/
│   │   │   ├── PokemonSearch.jsx       # ポケモン検索フォーム
│   │   │   ├── ResistanceMatrix.jsx    # 耐性マトリックス
│   │   │   └── PartySuggestion.jsx     # パーティ提案UI
│   │   └── styles/
│   │       ├── PokemonSearch.css
│   │       ├── ResistanceMatrix.css
│   │       └── PartySuggestion.css
│   ├── public/
│   │   └── index.html
│   ├── build/               # ビルド出力（本番用）
│   └── package.json
│
├── docs/                    # ドキュメント
│   ├── BACKEND_SETUP.md     # バックエンドセットアップ
│   ├── FRONTEND_SETUP.md    # フロントエンドセットアップ
│   └── BUILD_GUIDE.md       # ビルド＆デプロイガイド
├── package.json             # ルートパッケージ（統合ビルド用）
├── build.ps1                # Windows ビルドスクリプト
├── build.sh                 # Unix/Mac ビルドスクリプト
├── README.md                # このファイル
└── .gitignore
```

## 開発フェーズ

### PHASE 1: データ基盤 ✅ 完成
- **Task 1.1** ✅ PokeAPI を使用した全ポケモンのタイプ、画像、種族値取得
- **Task 1.2** ✅ 使用率データの定義（Pikalytics対応想定）
- **Task 1.3** ✅ 特性による無効化ロジックの組み込み

### PHASE 2: ロジック ✅ 完成
- **Task 2.1** ✅ 一貫性スキャンエンジン実装
  - 18タイプそれぞれから受ける最小ダメージ倍率を計算
  - 判定基準: 全タイプに対し 0.5倍以下の個体が1匹以上
  
- **Task 2.2** ✅ スコアリング選出
  - `Score = (解消できる一貫性タイプの数 × 100) + 使用率ボーナス`
  
- **Task 2.3** ✅ パーティ自動生成アルゴリズム
  1. ユーザー入力から「一貫している」タイプを特定
  2. スコアが最も高いポケモンを1匹追加
  3. 18タイプ全てがカバーされるか、6匹埋まるまで繰り返す

### PHASE 3: フロントエンド ✅ ほぼ完成
- **Task 3.1** ✅ ポケモン検索・入力フォーム（インクリメンタルサーチ）
- **Task 3.2** ✅ 耐性マトリックスの可視化
- **Task 3.3** ✅ 自動生成UI

## セットアップ方法

### 前提条件
- Node.js v16以上
- npm または yarn

### クイックスタート

```bash
# 1. 全ての依存パッケージをインストール
npm run install:all

# 2. 開発環境で起動
npm run dev
```

自動的にバックエンド (`http://localhost:5000`) とフロントエンド (`http://localhost:3000`) が起動します。

### バックエンド セットアップ

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**バックエンド起動**: `http://localhost:5000`

### フロントエンド セットアップ

```bash
cd frontend
npm install
npm start
```

**フロントエンド起動**: `http://localhost:3000`

### 本番環境ビルド

#### クロスプラットフォーム（推奨）

Windows、Linux、Mac 全て同じコマンド：

```bash
npm run build
```

#### プラットフォーム固定

**Windows:**
```bash
npm run build:windows
# または
./build.ps1
```

**Linux / Mac:**
```bash
npm run build:unix
# または
bash ./build.sh
```

詳細は [ビルドガイド](docs/BUILD_GUIDE.md) を参照してください。

## API エンドポイント

### 健康チェック
- **GET** `/api/health`
  - バックエンド状態確認

### ポケモン操作
- **POST** `/api/search`
  - ポケモンを名前で検索
  - リクエスト: `{ name: "string" }`
  
- **GET** `/api/rankings`
  - 使用率ランキングを取得

### パーティ操作
- **POST** `/api/analyze`
  - 現在のパーティを分析（一貫性を特定）
  - リクエスト: `{ partyMembers: [...] }`
  
- **POST** `/api/suggest`
  - パーティ補完を提案
  - リクエスト: `{ partyMembers: [...] }`

## 実装上のルール

1. **使用率の優先**
   - 相性補完が完璧でも、使用率が極端に低い（進化前など）は除外

2. **重複の禁止**
   - 同じポケモン、同じ持ち物の重複なし

3. **高速レスポンス**
   - 計算対象を使用率上位のみに絞り込み
   - フロントエンド側で瞬時に結果表示

## 期待される出力結果（例）

**ユーザー入力**: ガケガニ（いわ）

**システム出力**:
1. 現在の一貫性（穴）: フェアリー、かくとう、じめん、はがね、みず、くさ
2. 補完提案1位: **サーフゴー**（使用率上位・一貫性3つ解消）
3. 補完提案2位: **カイリュー**（使用率上位・地面無効・格闘半減）
4. 最終生成パーティ: ガケガニ / サーフゴー / カイリュー / ... （全18タイプ一貫性なし）

## 技術スタック

### バックエンド
- **フレームワーク**: Express.js
- **言語**: JavaScript (Node.js)
- **API統合**: PokeAPI v2
- **データ**: ポケモンメタデータ、使用率ランキング

### フロントエンド
- **フレームワーク**: React 18
- **言語**: JavaScript (JSX)
- **通信**: Axios
- **スタイル**: CSS3

## 今後の拡張予定

- [ ] PokeAPI リアルタイム最新データ同期
- [ ] 複数の持ち物・特性パターン対応
- [ ] ランクマッチのシーズン別分析
- [ ] パーティの詳細な相性表示
- [ ] ユーザーパーティ保存機能
- [ ] ポケモン画像のダウンロード高速化
- [ ] 国際化対応（多言語）
- [ ] PWA対応（オフライン利用）

## ライセンス

MIT License

## 参照

- [PokeAPI Documentation](https://pokeapi.co/)
- [Pikalytics](https://www.pikalytics.com/)
- ポケットモンスター 公式ページ

---

**作成日**: 2024年
**バージョン**: 1.0.0
