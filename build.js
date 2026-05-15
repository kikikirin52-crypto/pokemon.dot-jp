#!/usr/bin/env node

/**
 * ポケモン構築補完システム - クロスプラットフォーム ビルドスクリプト
 * Windows, Linux, Mac に対応
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('');
  log(colors.cyan, '╔════════════════════════════════════════════════════════╗');
  log(colors.cyan, `║   ${title.padEnd(50)}║`);
  log(colors.cyan, '╚════════════════════════════════════════════════════════╝');
  console.log('');
}

function logSection(title) {
  console.log('');
  log(colors.yellow, '════════════════════════════════════════════════════════');
  log(colors.yellow, title);
  log(colors.yellow, '════════════════════════════════════════════════════════');
  console.log('');
}

function executeCommand(command, description, cwd = process.cwd()) {
  try {
    log(colors.cyan, `${description}...`);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(colors.red, `❌ ${description}に失敗しました`);
    return false;
  }
}

// メイン処理
async function build() {
  logHeader('ポケモン構築補完システム - ビルド開始');

  // Node.js チェック
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    log(colors.green, `✓ Node.js: ${nodeVersion}`);
    log(colors.green, `✓ npm: ${npmVersion}`);
  } catch (error) {
    log(colors.red, '❌ エラー: Node.js がインストールされていません');
    process.exit(1);
  }

  const rootDir = process.cwd();
  const frontendDir = path.join(rootDir, 'frontend');
  const backendDir = path.join(rootDir, 'backend');
  const publicDir = path.join(backendDir, 'public');

  // ステップ1: フロントエンドをビルド
  logSection('ステップ1: フロントエンドをビルド中...');

  if (!fs.existsSync(path.join(frontendDir, 'node_modules'))) {
    if (!executeCommand('npm install', 'フロントエンド依存パッケージをインストール', frontendDir)) {
      process.exit(1);
    }
  }

  if (!executeCommand('npm run build', 'フロントエンドをビルド', frontendDir)) {
    process.exit(1);
  }

  log(colors.green, '✓ フロントエンドのビルド完了');
  console.log('');

  // ステップ2: ビルド結果をバックエンドにコピー
  logSection('ステップ2: ビルド結果をバックエンドにコピー中...');

  // backend/public ディレクトリを作成
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    log(colors.cyan, 'backend/public ディレクトリを作成しました');
  }

  // フロントエンドのビルド結果をコピー
  const buildDir = path.join(frontendDir, 'build');
  if (!fs.existsSync(buildDir)) {
    log(colors.red, '❌ エラー: フロントエンドの build/ ディレクトリが見つかりません');
    process.exit(1);
  }

  try {
    log(colors.cyan, 'frontend/build から backend/public にコピー中...');
    copyDirSync(buildDir, publicDir);
    log(colors.green, '✓ コピー完了');
  } catch (error) {
    log(colors.red, `❌ コピーエラー: ${error.message}`);
    process.exit(1);
  }
  console.log('');

  // ステップ3: バックエンド依存パッケージの確認
  logSection('ステップ3: バックエンド依存パッケージの確認...');

  if (!fs.existsSync(path.join(backendDir, 'node_modules'))) {
    if (!executeCommand('npm install', 'バックエンド依存パッケージをインストール', backendDir)) {
      process.exit(1);
    }
  }

  log(colors.green, '✓ バックエンド依存パッケージの確認完了');
  console.log('');

  // 完成
  logHeader('✓ ビルド完了！');

  log(colors.cyan, '本番環境での起動コマンド:');
  console.log('');
  log(colors.yellow, '  cd backend');
  log(colors.yellow, '  NODE_ENV=production npm start');
  console.log('');
  log(colors.cyan, 'または PowerShell では:');
  console.log('');
  log(colors.yellow, "  cd backend");
  log(colors.yellow, "  $env:NODE_ENV='production'; npm start");
  console.log('');
}

/**
 * ディレクトリをコピー（再帰的）
 */
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);

  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// 実行
build().catch(error => {
  log(colors.red, `❌ ビルドエラー: ${error.message}`);
  process.exit(1);
});
