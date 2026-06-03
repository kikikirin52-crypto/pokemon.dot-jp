const { calculateDamageTaken, scanTypeResistances } = require('./typeEffectiveness');
const { getUsageBonus, USAGE_RANKINGS } = require('./usageRankings');
const { getBasePokemonName: getBaseName } = require('./japaneseNames');

/**
 * メガシンカポケモンかどうかを判定
 */
function isMegaPokemon(pokemonName) {
  return pokemonName && pokemonName.toLowerCase().includes('mega');
}

/**
 * パーティ内のメガシンカ数をカウント
 */
function countMegaPokemon(party) {
  return party.filter(pokemon => isMegaPokemon(pokemon.name)).length;
}

/**
 * ポケモンの種族値合計を計算
 */
function calculateTotalStats(pokemon) {
  if (!pokemon.stats) {
    return 0;
  }

  // statsが配列形式の場合（PokeAPIの生データ）
  if (Array.isArray(pokemon.stats)) {
    return pokemon.stats.reduce((total, stat) => {
      return total + (stat.base_stat || 0);
    }, 0);
  }

  // statsがオブジェクト形式の場合（fetchPokemonDetailsの戻り値）
  if (typeof pokemon.stats === 'object') {
    const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
    return statNames.reduce((total, statName) => {
      return total + (pokemon.stats[statName] || 0);
    }, 0);
  }

  return 0;
}

/**
 * 現在のパーティの「一貫性（穴）」を特定
 * = 18タイプ全ての攻撃を当てて、全員が等倍以上で受けるタイプを抽出
 */
function identifyWeaknesses(partyMembers) {
  const allTypes = [
    'normal', 'fighting', 'flying', 'poison', 'ground',
    'rock', 'bug', 'ghost', 'steel', 'fire',
    'water', 'grass', 'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
  ];

  const weaknesses = [];

  allTypes.forEach(attackType => {
    // このタイプから最小ダメージを受けるメンバーを探す
    let minDamage = Infinity;
    let bestDefender = null;

    partyMembers.forEach(member => {
      const damage = calculateDamageTaken(attackType, member.types);
      if (damage < minDamage) {
        minDamage = damage;
        bestDefender = member.name;
      }
    });

    // 全員が等倍以上で受ける場合、そのタイプは一貫性タイプと見なす
    if (minDamage >= 1.0) {
      weaknesses.push({
        type: attackType,
        minDamage: minDamage,
        currentDefender: bestDefender
      });
    }
  });

  // 一貫性タイプを最大3タイプまでに制限（弱点の強い順）
  return weaknesses
    .sort((a, b) => b.minDamage - a.minDamage)
    .slice(0, 3);
}

/**
 * 補完候補のスコアリング
 * Score = (解消できる一貫性タイプの数 × 100) + 使用率ボーナス
 */
function calculateTopTenCoverageBonus(candidate, topRankedPokemon) {
  if (!topRankedPokemon || topRankedPokemon.length === 0) {
    return 0;
  }

  let coveredCount = 0;
  topRankedPokemon.forEach(topPokemon => {
    if (!topPokemon.types || topPokemon.types.length === 0) {
      return;
    }

    const worstDamage = topPokemon.types
      .map(type => calculateDamageTaken(type, candidate.types))
      .reduce((max, damage) => Math.max(max, damage), 0);

    if (worstDamage <= 1.0) {
      coveredCount += 1;
    }
  });

  return coveredCount * 30;
}

function scoreCandidate(candidate, currentWeaknesses, buildType = null, party = [], topRankedPokemon = []) {
  const resistantTypes = [];

  // このポケモンが受けられるタイプを調べる
  currentWeaknesses.forEach(weakness => {
    const damage = calculateDamageTaken(weakness.type, candidate.types);
    if (damage <= 0.5) {
      resistantTypes.push(weakness.type);
    }
  });

  // スコア計算
  const typeScore = resistantTypes.length * 100;
  const usageBonus = getUsageBonus(candidate.name);
  const topTenBonus = calculateTopTenCoverageBonus(candidate, topRankedPokemon);
  let buildBonus = 0;

  // 構築タイプによるボーナス
  if (buildType) {
    const stats = calculateTotalStats(candidate);
    switch (buildType) {
      case 'expansion':
        // 積み構築: 高耐久を優先 (防御+特防が高い)
        if (candidate.stats) {
          const defense = candidate.stats.defense || 0;
          const specialDefense = candidate.stats['special-defense'] || 0;
          buildBonus = (defense + specialDefense) * 5; // 係数を大きく
        }
        break;
      case 'cycle':
        // サイクル構築: 高火力・高素早さを優先
        if (candidate.stats) {
          const attack = candidate.stats.attack || 0;
          const specialAttack = candidate.stats['special-attack'] || 0;
          const speed = candidate.stats.speed || 0;
          buildBonus = (attack + specialAttack + speed) * 3; // 係数を大きく
        }
        break;
      case 'stall':
        // 受けループ: 高耐久・回復技持ちを優先
        if (candidate.stats) {
          const hp = candidate.stats.hp || 0;
          const defense = candidate.stats.defense || 0;
          const specialDefense = candidate.stats['special-defense'] || 0;
          buildBonus = (hp + defense + specialDefense) * 5; // 係数を大きく
        }
        break;
    }
  }

  // メガシンカボーナス（パーティにメガシンカが2匹未満の場合）
  const currentMegaCount = countMegaPokemon(party);
  const megaBonus = (currentMegaCount < 2 && isMegaPokemon(candidate.name)) ? 50 : 0;

  const totalScore = typeScore + usageBonus + buildBonus + megaBonus + topTenBonus;

  return {
    pokemon: candidate.name,
    totalScore: totalScore,
    typeScore: typeScore,
    usageBonus: usageBonus,
    buildBonus: buildBonus,
    megaBonus: megaBonus,
    topTenBonus: topTenBonus,
    coversTypes: resistantTypes,
    coverCount: resistantTypes.length
  };
}

/**
 * 最適な補完パーティを提案（7種類）
 * 高使用率パーティ、中間使用率パーティ、低使用率パーティ、弱点なしパーティ、最小弱点パーティ、完全弱点なしパーティ、最高種族値パーティ
 */
function suggestComplementaryParties(initialParty, candidatePool, buildType = null, maxPartySize = 6) {
  const generateParty = (usageWeight, targetWeaknessCount = null, prioritizeStats = false, sharedUsed = null) => {
    const topRankedPokemon = [...candidatePool]
      .filter(candidate => USAGE_RANKINGS[candidate.name.toLowerCase()]?.rank)
      .sort((a, b) => (USAGE_RANKINGS[a.name.toLowerCase()]?.rank || Number.MAX_SAFE_INTEGER) - (USAGE_RANKINGS[b.name.toLowerCase()]?.rank || Number.MAX_SAFE_INTEGER))
      .slice(0, 10);

    const party = [...initialParty];
    const used = sharedUsed || new Set();
    if (!sharedUsed) {
      initialParty.forEach(p => {
        used.add(p.name.toLowerCase());
        used.add(getBaseName(p.name).toLowerCase());
      });
    }
    const availableCandidates = candidatePool.filter(candidate => {
      const name = candidate.name.toLowerCase();
      const baseName = getBaseName(candidate.name).toLowerCase();
      return !used.has(name) && !used.has(baseName);
    });

    while (party.length < maxPartySize) {
      const weaknesses = identifyWeaknesses(party);

      // 目標弱点数に達したら終了
      if (targetWeaknessCount !== null && weaknesses.length <= targetWeaknessCount) break;

      // 弱点が0個になったら終了（targetWeaknessCountが0の場合）
      if (targetWeaknessCount === 0 && weaknesses.length === 0) break;

      const remainingCandidates = availableCandidates.filter(candidate => {
        const name = candidate.name.toLowerCase();
        const baseName = getBaseName(candidate.name).toLowerCase();
        return !used.has(name) && !used.has(baseName);
      });
      if (remainingCandidates.length === 0) break;

      // メガシンカが2匹を超えないようにフィルタリング
      const currentMegaCount = countMegaPokemon(party);
      let filteredCandidates = remainingCandidates;
      if (currentMegaCount >= 2) {
        filteredCandidates = remainingCandidates.filter(candidate => !isMegaPokemon(candidate.name));
        if (filteredCandidates.length === 0) {
          // メガシンカ以外がない場合はメガシンカも選択可能
          filteredCandidates = remainingCandidates;
        }
      }

      // 構築タイプに基づくフィルタリング
      if (buildType && filteredCandidates.length > 5) { // 候補が十分にある場合のみフィルタリング
        switch (buildType) {
          case 'expansion':
            // 積み構築: 攻撃力の低いポケモンを優先（攻撃関連が平均以下のポケモンを残す）
            const avgAttack = filteredCandidates.reduce((sum, c) => sum + (c.stats?.attack || 0), 0) / filteredCandidates.length;
            const avgSpecialAttack = filteredCandidates.reduce((sum, c) => sum + (c.stats?.['special-attack'] || 0), 0) / filteredCandidates.length;
            filteredCandidates = filteredCandidates.filter(c => 
              (c.stats?.attack || 0) <= avgAttack && (c.stats?.['special-attack'] || 0) <= avgSpecialAttack
            );
            break;
          case 'cycle':
            // サイクル構築: 耐久の低いポケモンを優先（HP+防御+特防が平均以下のポケモンを残す）
            const avgHp = filteredCandidates.reduce((sum, c) => sum + (c.stats?.hp || 0), 0) / filteredCandidates.length;
            const avgDefense = filteredCandidates.reduce((sum, c) => sum + (c.stats?.defense || 0), 0) / filteredCandidates.length;
            const avgSpecialDefense = filteredCandidates.reduce((sum, c) => sum + (c.stats?.['special-defense'] || 0), 0) / filteredCandidates.length;
            filteredCandidates = filteredCandidates.filter(c => 
              (c.stats?.hp || 0) + (c.stats?.defense || 0) + (c.stats?.['special-defense'] || 0) <= avgHp + avgDefense + avgSpecialDefense
            );
            break;
          case 'stall':
            // 受けループ: 高耐久ポケモンを優先（HP+防御+特防が高いポケモンを残す）
            const avgDurability = filteredCandidates.reduce((sum, c) => 
              sum + ((c.stats?.hp || 0) + (c.stats?.defense || 0) + (c.stats?.['special-defense'] || 0)), 0
            ) / filteredCandidates.length;
            filteredCandidates = filteredCandidates.filter(c => 
              (c.stats?.hp || 0) + (c.stats?.defense || 0) + (c.stats?.['special-defense'] || 0) >= avgDurability
            );
            break;
        }
        // フィルタリング後、候補が少なすぎる場合は元に戻す
        if (filteredCandidates.length < 3) {
          filteredCandidates = remainingCandidates.filter(candidate => !isMegaPokemon(candidate.name) || currentMegaCount < 2);
        }
      }

      // 候補のスコアリング（使用率の重みを調整）
      const scores = filteredCandidates
        .map(candidate => {
          if (prioritizeStats) {
            // 種族値優先の場合
            const statsScore = calculateTotalStats(candidate);
            return {
              pokemon: candidate.name,
              totalScore: statsScore,
              typeScore: 0,
              usageBonus: 0,
              buildBonus: 0,
              megaBonus: 0,
              topTenBonus: 0,
              coversTypes: [],
              coverCount: 0
            };
          } else {
            // 通常の弱点カバーロジック
            return scoreCandidate(candidate, weaknesses, buildType, party, topRankedPokemon);
          }
        })
        .sort((a, b) => b.totalScore - a.totalScore);

      if (scores.length === 0) break;

      const best = scores[0];
      const pokemon = remainingCandidates.find(p => p.name === best.pokemon);
      party.push(pokemon);
      used.add(pokemon.name.toLowerCase());
      used.add(getBaseName(pokemon.name).toLowerCase());
    }

    return {
      finalParty: party,
      remainingWeaknesses: identifyWeaknesses(party),
      isCoverageComplete: identifyWeaknesses(party).length === 0
    };
  };

  // 3つのパーティ間で重複を防ぐための共有usedセット
  const sharedUsed = new Set();
  initialParty.forEach(p => {
    sharedUsed.add(p.name.toLowerCase());
    sharedUsed.add(getBaseName(p.name).toLowerCase());
  });

  // 高使用率パーティ（使用率ボーナスを2倍）
  const highUsageParty = generateParty(2.0, null, false, sharedUsed);

  return {
    highUsage: highUsageParty
  };
}

module.exports = {
  identifyWeaknesses,
  scoreCandidate,
  suggestComplementaryParties,
  buildTypes: {
    'サイクル構築': {
      name: 'サイクル構築',
      description: '**サイクル構築**とは、有利なポケモンへ交代を繰り返しながら戦い、ステルスロックや高火力技で相手を少しずつ削って勝つ構築です。\n\n**長所**：柔軟に立ち回れ、幅広い相手に対応できる\n**短所**：相手の型や交代先を読む必要があり、扱うのが難しい\n\n簡単に言うと、**交代を駆使して有利対面を作り続けながら勝つ構築**です。',
      strategy: 'cycle'
    },
    '受けループ': {
      name: '受けループ',
      description: '**受けループ（受け構築）**とは、高耐久ポケモンで相手の攻撃を受け続け、毒やステルスロックなどの定数ダメージで少しずつ削って勝つ構築です。\n\n**長所**：耐久力が高く安定して戦える\n**短所**：高火力アタッカーやアンコール、トリックなどで崩されやすい\n\n簡単に言うと、**相手の攻撃を受け切りながらじわじわ削って勝つ構築**です。',
      strategy: 'stall'
    }
  }
};
