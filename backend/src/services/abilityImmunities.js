/**
 * 特性による無効化ロジック
 * 一部の特性がタイプ相性を無効化する場合の処理
 */

const ABILITY_IMMUNITIES = {
  // 浮遊: じめんタイプの攻撃を無効化
  'levitate': {
    immuneTo: ['ground'],
    description: 'じめんタイプのダメージを無効化'
  },
  // 蓄電: でんきタイプの攻撃を無効化、受け取ると素早さ↑
  'volt-absorb': {
    immuneTo: ['electric'],
    description: 'でんきタイプのダメージを無効化'
  },
  // 潮湿: みずタイプの攻撃を無効化
  'water-absorb': {
    immuneTo: ['water'],
    description: 'みずタイプのダメージを無効化'
  },
  // 土盛: みずタイプの攻撃を無効化、受け取るとぼうぎょ↑
  'dry-skin': {
    immuneTo: ['water'],
    description: 'みずタイプのダメージを無効化'
  },
  // 日差し: ほのおタイプのダメージを無効化
  'flash-fire': {
    immuneTo: ['fire'],
    description: 'ほのおタイプのダメージを無効化'
  },
  // 緑の皮膚: くさタイプのダメージを無効化
  'thick-fat': {
    immuneTo: ['fire', 'ice'],
    description: 'ほのお・こおりタイプのダメージを軽減'
  },
  // 水の耳: みずタイプのダメージを無効化
  'hydration': {
    immuneTo: [],
    description: '雨時にみずタイプの攻撃を半減'
  },
  // 砂の流れ: こおりタイプのダメージを軽減
  'sand-veil': {
    immuneTo: [],
    description: '砂嵐時にダメージを軽減'
  }
};

/**
 * ポケモンが持つ能力で無効化するタイプを取得
 */
function getImmunitiesByAbility(abilities) {
  const immunities = new Set();

  abilities.forEach(ability => {
    const abilityName = ability.name.toLowerCase();
    if (ABILITY_IMMUNITIES[abilityName]) {
      ABILITY_IMMUNITIES[abilityName].immuneTo.forEach(type => {
        immunities.add(type);
      });
    }
  });

  return Array.from(immunities);
}

/**
 * タイプの相性を計算（特性による無効化を考慮）
 */
function calculateTypeEffectiveness(incomingType, defenseTypes, abilities) {
  // 特性による無効化をチェック
  const abilityImmunities = getImmunitiesByAbility(abilities);
  if (abilityImmunities.includes(incomingType)) {
    return { effectiveness: 0, reason: '特性で無効化' };
  }

  // 複合タイプの場合の計算ロジック（簡略版）
  // 実装詳細は typeEffectiveness.js を参照
  return { effectiveness: 1, reason: '通常ダメージ' };
}

/**
 * パーティ全体で受けられるタイプを計算
 */
function analyzePartyDefense(partyMembers, allTypeData) {
  const coverage = {};

  // 18タイプ全てを初期化
  const allTypes = [
    'normal', 'fighting', 'flying', 'poison', 'ground',
    'rock', 'bug', 'ghost', 'steel', 'fire',
    'water', 'grass', 'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
  ];

  allTypes.forEach(type => {
    coverage[type] = {
      defenders: [],
      effectiveness: Infinity // 最小ダメージ倍率
    };
  });

  // 各メンバーが受ける有効なダメージを計算
  partyMembers.forEach(member => {
    allTypes.forEach(attackType => {
      // タイプ相性を計算（簡略版）
      // 実装詳細は typeEffectiveness.js を参照
      const memberCoverage = calculateTypeEffectiveness(
        attackType,
        member.types,
        member.abilities
      );

      if (memberCoverage.effectiveness < coverage[attackType].effectiveness) {
        coverage[attackType].effectiveness = memberCoverage.effectiveness;
        coverage[attackType].defenders = [member.name];
      } else if (memberCoverage.effectiveness === coverage[attackType].effectiveness) {
        coverage[attackType].defenders.push(member.name);
      }
    });
  });

  return coverage;
}

module.exports = {
  ABILITY_IMMUNITIES,
  getImmunitiesByAbility,
  calculateTypeEffectiveness,
  analyzePartyDefense
};
