/**
 * ポケモン使用率データベース
 * 公式チャンピオンズページのポケモンリストから自動生成
 */

const { getOfficialChampionsPagePokemon } = require('./championsPagePokemon');
const { JAPANESE_TO_ENGLISH, translateToEnglish } = require('./japaneseNames');

// 公式チャンピオンズページのポケモンからランキングを生成
function buildUsageRankings() {
  const officialList = getOfficialChampionsPagePokemon();
  const rankings = {};

  officialList.forEach((pokemon, index) => {
    // japaneseName が JAPANESE_TO_ENGLISH に直接キーとして存在するか確認
    if (JAPANESE_TO_ENGLISH[pokemon.japaneseName]) {
      const englishName = JAPANESE_TO_ENGLISH[pokemon.japaneseName];
      // ランクは1ベース、使用率は高いものを上位に
      const rank = index + 1;
      const usageRate = 1.0 - (index / officialList.length) * 0.8; // 最高1.0、最低0.2
      
      rankings[englishName.toLowerCase()] = {
        rank: rank,
        usageRate: Math.max(0.2, usageRate),
        tier: rank <= 10 ? 'S' : rank <= 30 ? 'A' : rank <= 70 ? 'B' : 'C'
      };
    }
  });

  return rankings;
}

const USAGE_RANKINGS = buildUsageRankings();

function isBanned(pokemonName) {
  // チャンピオンズページ掲載ポケモン以外は自動的に除外される
  return false;
}

function filterChampionsOnly(pokemons) {
  return pokemons.filter((pokemon) => {
    const lower = translateToEnglish(pokemon).toLowerCase();
    return lower in USAGE_RANKINGS && !isBanned(lower);
  });
}

function getUsageBonus(pokemonName) {
  const data = USAGE_RANKINGS[pokemonName.toLowerCase()];
  if (!data) return 0;

  // ボーナス = 使用率 × 100 + ランクボーナス
  return data.usageRate * 100 + (100 - data.rank);
}

function isChampionsPokemon(pokemonName) {
  return pokemonName.toLowerCase() in USAGE_RANKINGS;
}

function getRankingData(pokemonName) {
  return USAGE_RANKINGS[pokemonName.toLowerCase()] || null;
}

function getSortedRankings() {
  return Object.keys(USAGE_RANKINGS)
    .map((pokemon) => ({
      pokemon,
      ...USAGE_RANKINGS[pokemon]
    }))
    .sort((a, b) => a.rank - b.rank);
}

module.exports = {
  USAGE_RANKINGS,
  getUsageBonus,
  isChampionsPokemon,
  getRankingData,
  getSortedRankings,
  isBanned,
  filterChampionsOnly
};
