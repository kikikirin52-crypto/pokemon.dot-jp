/**
 * ポケモンのタイプ相性計算エンジン
 * 18タイプ × 18タイプの相性を定義
 */

// タイプ相性マトリックス（実数値）
// key: 攻撃側タイプ, value: { 防御側タイプ: ダメージ倍率 }
const TYPE_EFFECTIVENESS = {
  'normal': {
    'rock': 0.5,
    'ghost': 0,
    'steel': 0.5
  },
  'fighting': {
    'normal': 2,
    'flying': 0.5,
    'poison': 0.5,
    'rock': 2,
    'bug': 0.5,
    'ghost': 0,
    'steel': 2,
    'psychic': 0.5,
    'ice': 2,
    'dark': 2,
    'fairy': 0.5
  },
  'flying': {
    'fighting': 2,
    'bug': 2,
    'grass': 2,
    'rock': 0.5,
    'steel': 0.5,
    'electric': 0.5
  },
  'poison': {
    'poison': 0.5,
    'ground': 0.5,
    'rock': 0.5,
    'ghost': 0.5,
    'steel': 0,
    'grass': 2,
    'fairy': 2
  },
  'ground': {
    'flying': 0,
    'poison': 2,
    'rock': 2,
    'bug': 0.5,
    'grass': 0.5,
    'electric': 2,
    'fire': 2,
    'steel': 2
  },
  'rock': {
    'flying': 2,
    'bug': 2,
    'fire': 2,
    'ice': 2,
    'fighting': 0.5,
    'ground': 0.5,
    'steel': 0.5
  },
  'bug': {
    'fighting': 0.5,
    'flying': 0.5,
    'poison': 0.5,
    'ghost': 0.5,
    'steel': 0.5,
    'fire': 0.5,
    'grass': 2,
    'psychic': 2,
    'dark': 2,
    'fairy': 0.5
  },
  'ghost': {
    'normal': 0,
    'fighting': 0,
    'poison': 2,
    'bug': 0.5,
    'ghost': 2,
    'dark': 0.5,
    'steel': 0.5
  },
  'steel': {
    'normal': 2,
    'flying': 2,
    'rock': 2,
    'bug': 2,
    'steel': 0.5,
    'grass': 0.5,
    'psychic': 2,
    'ice': 2,
    'dragon': 2,
    'fairy': 2,
    'fire': 0.5,
    'ground': 0.5,
    'poison': 0
  },
  'fire': {
    'bug': 2,
    'steel': 2,
    'grass': 2,
    'ice': 2,
    'fairy': 2,
    'fire': 0.5,
    'ground': 0.5,
    'rock': 0.5,
    'water': 0.5
  },
  'water': {
    'steel': 2,
    'fire': 2,
    'water': 0.5,
    'grass': 0.5,
    'ice': 2,
    'ground': 2
  },
  'grass': {
    'ground': 2,
    'rock': 2,
    'water': 2,
    'grass': 0.5,
    'poison': 0.5,
    'flying': 0.5,
    'bug': 0.5,
    'fire': 0.5,
    'steel': 0.5
  },
  'electric': {
    'flying': 2,
    'water': 2,
    'electric': 0.5,
    'grass': 0.5,
    'ground': 0
  },
  'psychic': {
    'fighting': 2,
    'poison': 2,
    'psychic': 0.5,
    'steel': 0.5,
    'dark': 0
  },
  'ice': {
    'flying': 2,
    'ground': 2,
    'grass': 2,
    'dragon': 2,
    'fire': 0.5,
    'water': 0.5,
    'grass': 0.5,
    'ice': 0.5,
    'steel': 0.5
  },
  'dragon': {
    'dragon': 2,
    'steel': 0.5,
    'fire': 0.5,
    'water': 0.5,
    'grass': 0.5,
    'ice': 0.5,
    'electric': 0.5
  },
  'dark': {
    'fighting': 0.5,
    'dark': 0.5,
    'fairy': 0.5,
    'ghost': 2,
    'psychic': 0
  },
  'fairy': {
    'fighting': 2,
    'poison': 0.5,
    'dark': 2,
    'fire': 0.5,
    'steel': 0.5,
    'flying': 0.5
  }
};

/**
 * 攻撃側タイプが防御側タイプに与えるダメージ倍率を計算
 */
function getEffectiveness(attackType, defenseType) {
  if (!TYPE_EFFECTIVENESS[attackType]) return 1;
  return TYPE_EFFECTIVENESS[attackType][defenseType] || 1;
}

/**
 * ポケモンが受けるダメージ倍率を計算（複合タイプ対応）
 */
function calculateDamageTaken(incomingType, pokemonTypes) {
  let damage = 1;

  pokemonTypes.forEach(defenseType => {
    damage *= getEffectiveness(incomingType, defenseType);
  });

  return damage;
}

/**
 * 18タイプに対するポケモンの耐性をスキャン
 */
function scanTypeResistances(pokemonTypes) {
  const allTypes = [
    'normal', 'fighting', 'flying', 'poison', 'ground',
    'rock', 'bug', 'ghost', 'steel', 'fire',
    'water', 'grass', 'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
  ];

  const resistances = {};

  allTypes.forEach(attackType => {
    const damage = calculateDamageTaken(attackType, pokemonTypes);
    resistances[attackType] = damage;
  });

  return resistances;
}

/**
 * ポケモンが「受けられるタイプ」（0.5倍以下）をリストアップ
 */
function getResistantTypes(pokemonTypes) {
  const resistances = scanTypeResistances(pokemonTypes);
  return Object.keys(resistances).filter(type => resistances[type] <= 0.5);
}

module.exports = {
  TYPE_EFFECTIVENESS,
  getEffectiveness,
  calculateDamageTaken,
  scanTypeResistances,
  getResistantTypes
};
