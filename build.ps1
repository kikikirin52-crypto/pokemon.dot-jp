# ポケモン構築補完システム - ビルドスクリプト (PowerShell)

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   ポケモン構築補完システム - ビルド開始                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# チェック: Node.js がインストールされているか
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ エラー: Node.js がインストールされていません" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Node.js: $(node -v)" -ForegroundColor Green
Write-Host "✓ npm: $(npm -v)" -ForegroundColor Green
Write-Host ""

# ステップ1: フロントエンドのビルド
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "ステップ1: フロントエンドをビルド中..." -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Push-Location frontend
if (-not (Test-Path node_modules)) {
    Write-Host "フロントエンド依存パッケージをインストール中..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ フロントエンド依存パッケージのインストールに失敗しました" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

Write-Host "フロントエンドをビルド中..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ フロントエンドのビルドに失敗しました" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

Write-Host "✓ フロントエンドのビルド完了" -ForegroundColor Green
Write-Host ""

# ステップ2: ビルド結果をバックエンドにコピー
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "ステップ2: ビルド結果をバックエンドにコピー中..." -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

# backend/public ディレクトリを作成
if (-not (Test-Path backend\public)) {
    New-Item -ItemType Directory -Path backend\public -Force > $null
    Write-Host "backend/public ディレクトリを作成しました" -ForegroundColor Cyan
}

# フロントエンドのビルド結果をコピー
Write-Host "frontend/build から backend/public にコピー中..." -ForegroundColor Cyan
Copy-Item -Path frontend\build\* -Destination backend\public -Recurse -Force
Write-Host "✓ コピー完了" -ForegroundColor Green
Write-Host ""

# ステップ3: バックエンド依存パッケージの確認
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "ステップ3: バックエンド依存パッケージの確認..." -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Push-Location backend
if (-not (Test-Path node_modules)) {
    Write-Host "バックエンド依存パッケージをインストール中..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ バックエンド依存パッケージのインストールに失敗しました" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
Pop-Location

Write-Host "✓ バックエンド依存パッケージの確認完了" -ForegroundColor Green
Write-Host ""

# 完成
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✓ ビルド完了！                                ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "本番環境での起動コマンド:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  NODE_ENV=production npm start" -ForegroundColor White
Write-Host ""
Write-Host "または PowerShell では:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  \$env:NODE_ENV='production'; npm start" -ForegroundColor White
Write-Host ""
