const express = require('express');
const router = express.Router();
const { fetchPokemonDetails } = require('../services/pokeapi');
const { buildTypes, identifyWeaknesses, suggestComplementaryParties } = require('../services/partyCompletion');
const { USAGE_RANKINGS, filterChampionsOnly } = require('../services/usageRankings');
const { getOfficialChampionsPagePokemon, isOfficialChampionsPagePokemon } = require('../services/championsPagePokemon');
const { getJapaneseSuggestions, translateToEnglish, translateToJapanese, translateTypeToJapanese } = require('../services/japaneseNames');

/**
 * GET /api/search-suggestions
 * ポケモン名の候補を取得
 */
router.get('/search-suggestions', (req, res) => {
  try {
    const query = req.query.q || '';

    if (query.length < 1) {
      return res.json({ suggestions: [] });
    }

    const suggestions = getJapaneseSuggestions(query);
    console.log(`[API] 候補検索: "${query}" -> ${suggestions.length}件`);

    res.json({
      success: true,
      suggestions: suggestions
    });
  } catch (error) {
    console.error(`[API] 候補検索エラー: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '候補検索に失敗しました'
    });
  }
});

/**
 * POST /api/search
 * ポケモンを名前で検索
 */
router.post('/search', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'ポケモン名が必要です' });
    }

    const searchName = translateToEnglish(name);
    if (!isOfficialChampionsPagePokemon(searchName)) {
      return res.status(404).json({
        success: false,
        error: `ポケモン「${name}」は公式チャンピオンズページに掲載されていません。`
      });
    }

    console.log(`[API] ポケモン検索: ${searchName}`);
    const pokemon = await fetchPokemonDetails(searchName);

    console.log(`[API] 検索成功: ${pokemon.name}`);
    res.json({
      success: true,
      pokemon: {
        ...pokemon,
        displayName: translateToJapanese(pokemon.name),
        japaneseName: translateToJapanese(pokemon.name)
      }
    });
  } catch (error) {
    console.error(`[API] ポケモン検索エラー: ${error.message}`);
    res.status(404).json({
      success: false,
      error: `ポケモン「${req.body.name}」が見つかりません。名前を確認してください。`
    });
  }
});

/**
 * POST /api/party/analyze
 * 現在のパーティを分析（一貫性を特定）
 */
router.post('/analyze', (req, res) => {
  try {
    const { partyMembers } = req.body;

    if (!partyMembers || !Array.isArray(partyMembers)) {
      return res.status(400).json({ error: 'partyMembers は配列である必要があります' });
    }

    if (partyMembers.length === 0) {
      return res.status(400).json({ error: 'パーティにポケモンを追加してください' });
    }

    const weaknesses = identifyWeaknesses(partyMembers).map(weakness => ({
      ...weakness,
      displayType: translateTypeToJapanese(weakness.type)
    }));

    res.json({
      success: true,
      partyAnalysis: {
        partySize: partyMembers.length,
        weaknesses: weaknesses,
        consistentTypes: weaknesses,
        weaknessCount: weaknesses.length,
        isCoverageComplete: weaknesses.length === 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `分析エラー: ${error.message}`
    });
  }
});

/**
 * POST /api/party/suggest
 * パーティ補完を提案
 */
router.post('/suggest', async (req, res) => {
  try {
    const { partyMembers, buildType } = req.body;

    if (!partyMembers || !Array.isArray(partyMembers)) {
      return res.status(400).json({ error: 'partyMembers は配列である必要があります' });
    }

    // partyMembersの重複を除去（同じ名前のポケモンを複数入れない）
    const seen = new Set();
    const uniquePartyMembers = partyMembers.filter(member => {
      const key = member.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const candidateNames = filterChampionsOnly(Object.keys(USAGE_RANKINGS))
      .sort((a, b) => (USAGE_RANKINGS[a]?.rank || Number.MAX_SAFE_INTEGER) - (USAGE_RANKINGS[b]?.rank || Number.MAX_SAFE_INTEGER))
      .slice(0, 50);
    const candidatePool = await Promise.all(candidateNames.map(async (name) => {
      try {
        const details = await fetchPokemonDetails(name);
        return {
          ...details,
          usageRank: USAGE_RANKINGS[name]?.rank || null
        };
      } catch (error) {
        console.error(`[API] 候補取得エラー: ${name} - ${error.message}`);
        return null;
      }
    }));

    // partyMembersにstats情報を追加
    const enhancedPartyMembers = await Promise.all(uniquePartyMembers.map(async (member) => {
      try {
        const details = await fetchPokemonDetails(member.name);
        return {
          ...member,
          stats: details.stats
        };
      } catch (error) {
        console.error(`[API] パーティメンバー取得エラー: ${member.name} - ${error.message}`);
        return member;
      }
    }));

    const validCandidatePool = candidatePool
      .filter(Boolean)
      .filter(candidate => !enhancedPartyMembers.some(member => member.name.toLowerCase() === candidate.name.toLowerCase()));

    const suggestions = suggestComplementaryParties(enhancedPartyMembers, validCandidatePool, buildType);

    const formatParty = (partyData) => {
      const totalStats = partyData.finalParty.reduce((sum, pokemon) => {
        if (!pokemon.stats) return sum;

        // statsが配列形式の場合
        if (Array.isArray(pokemon.stats)) {
          return sum + pokemon.stats.reduce((statSum, stat) => statSum + (stat.base_stat || 0), 0);
        }

        // statsがオブジェクト形式の場合
        if (typeof pokemon.stats === 'object') {
          const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
          return sum + statNames.reduce((statSum, statName) => statSum + (pokemon.stats[statName] || 0), 0);
        }

        return sum;
      }, 0);

      return {
        finalParty: partyData.finalParty
          .slice()
          .sort((a, b) => {
            const rankA = USAGE_RANKINGS[a.name.toLowerCase()]?.rank ?? Number.MAX_SAFE_INTEGER;
            const rankB = USAGE_RANKINGS[b.name.toLowerCase()]?.rank ?? Number.MAX_SAFE_INTEGER;
            return rankA - rankB;
          })
          .map(pokemon => ({
            ...pokemon,
            displayName: pokemon.displayName || translateToJapanese(pokemon.name),
            japaneseName: translateToJapanese(pokemon.name),
            displayTypes: pokemon.displayTypes || pokemon.types.map(translateTypeToJapanese),
            buildUrls: [
              `https://www.smogon.com/dex/ss/pokemon/${pokemon.name}/`,
              `https://pokemondb.net/pokedex/${pokemon.name}`,
              `https://www.serebii.net/pokedex-ss/${pokemon.name.replace('-', '')}.shtml`
            ]
          })),
        consistentTypes: partyData.remainingWeaknesses.map(weakness => ({
          ...weakness,
          displayType: translateTypeToJapanese(weakness.type)
        })),
        isCoverageComplete: partyData.isCoverageComplete,
        totalStats: totalStats
      };
    };

    res.json({
      success: true,
      suggestions: {
        highUsage: formatParty(suggestions.highUsage)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `提案エラー: ${error.message}`
    });
  }
});

/**
 * GET /api/pokemon/champions
 * 公式チャンピオンズページに掲載されているポケモン一覧を取得
 */
router.get('/champions', (req, res) => {
  try {
    const champions = getOfficialChampionsPagePokemon().map(pokemon => ({
      englishName: pokemon.englishName,
      japaneseName: pokemon.japaneseName,
      displayName: pokemon.japaneseName
    }));

    res.json({
      success: true,
      champions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `チャンピオンズページのポケモン取得エラー: ${error.message}`
    });
  }
});

/**
 * GET /api/pokemon/rankings
 * 使用率ランキングを取得
 */
router.get('/rankings', (req, res) => {
  try {
    const rankings = filterChampionsOnly(Object.keys(USAGE_RANKINGS))
      .sort((a, b) => (USAGE_RANKINGS[a]?.rank || Number.MAX_SAFE_INTEGER) - (USAGE_RANKINGS[b]?.rank || Number.MAX_SAFE_INTEGER))
      .map(name => ({
        name,
        displayName: translateToJapanese(name),
        japaneseName: translateToJapanese(name),
        ...USAGE_RANKINGS[name]
      }));

    res.json({
      success: true,
      rankings: rankings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `ランキング取得エラー: ${error.message}`
    });
  }
});

/**
 * GET /api/build-types
 * 構築タイプを取得
 */
router.get('/build-types', (req, res) => {
  try {
    res.json({
      success: true,
      buildTypes: Object.values(buildTypes)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `構築タイプ取得エラー: ${error.message}`
    });
  }
});

module.exports = router;
