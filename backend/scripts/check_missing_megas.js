const path = require('path');
const fs = require('fs');
const japPath = path.resolve(__dirname, '..', 'src', 'services', 'japaneseNames.js');
const championsPath = path.resolve(__dirname, '..', 'data', 'champions-page-pokemon.json');

const japContent = fs.readFileSync(japPath, 'utf8');
// crude eval to get JAPANESE_NAME_MAP object
const mapMatch = japContent.match(/const JAPANESE_NAME_MAP = \{([\s\S]*?)\};/m);
if (!mapMatch) {
  console.error('JAPANESE_NAME_MAP not found');
  process.exit(1);
}
const mapBody = mapMatch[1];
const keys = Array.from(mapBody.matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)).map(m=>m[1]);
const hasMega = new Set(keys.filter(k=>k.includes('-mega')));

const champions = JSON.parse(fs.readFileSync(championsPath, 'utf8'));

// simple normalization: remove forms and parentheses like " (ヒスイ)" and colon parts
function normalizeJapanese(jp){
  return jp.replace(/\s*\(.+\)$/,'').replace(/:.+$/,'').trim();
}

const missing = [];
for(const jp of champions){
  const base = normalizeJapanese(jp);
  // try to find english key in JAPANESE_NAME_MAP by matching value
  const keyMatch = Array.from(mapBody.matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)).find(m=>m[2]===base);
  if (!keyMatch) continue;
  const eng = keyMatch[1];
  const megaKey = eng + '-mega';
  if (!hasMega.has(megaKey)) {
    missing.push({japanese: base, english: eng, megaKey});
  }
}

console.log(JSON.stringify(missing, null, 2));
