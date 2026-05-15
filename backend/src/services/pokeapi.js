const axios = require('axios');
const { translateToEnglish, translateToJapanese, translateTypeToJapanese } = require('./japaneseNames');

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// PokeAPIのデフォルトフォームマッピング
const POKEAPI_DEFAULT_FORMS = {
  'aegislash': 'aegislash-shield',
  'mimikyu': 'mimikyu-disguised',
  // 他のフォーム違いが必要なポケモンを追加
};

/**
 * PokeAPI用のポケモン名を正規化
 */
function normalizeForPokeAPI(name) {
  const lowerName = name.toLowerCase();
  return POKEAPI_DEFAULT_FORMS[lowerName] || lowerName;
}

/**
 * PokeAPI から全ポケモンデータを取得
 */
async function fetchAllPokemon() {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=1000&offset=0`);
    return response.data.results;
  } catch (error) {
    console.error('PokeAPI からのポケモン取得エラー:', error.message);
    throw error;
  }
}

/**
 * 特定のポケモンの詳細情報を取得
 */
async function fetchPokemonDetails(nameOrId) {
  try {
    const normalizedName = translateToEnglish(nameOrId);
    const pokeApiName = normalizeForPokeAPI(normalizedName);
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${pokeApiName}`);
    const pokemon = response.data;

    // 種族値を計算
    const stats = pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});

    const types = pokemon.types.map(t => t.type.name);

    return {
      id: pokemon.id,
      name: pokemon.name,
      displayName: translateToJapanese(pokemon.name),
      japaneseName: translateToJapanese(pokemon.name),
      types: types,
      displayTypes: types.map(translateTypeToJapanese),
      imageUrl: pokemon.sprites?.front_default || pokemon.sprites?.other?.['official-artwork']?.front_default || null,
      abilities: pokemon.abilities.map(a => ({
        name: a.ability.name,
        isHidden: a.is_hidden
      })),
      stats: stats,
      height: pokemon.height,
      weight: pokemon.weight
    };
  } catch (error) {
    console.error(`ポケモン [${nameOrId}] の詳細取得エラー:`, error.message);
    throw error;
  }
}

/**
 * タイプ情報を取得
 */
async function fetchTypeEffectiveness(typeName) {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/type/${typeName}`);
    const type = response.data;

    return {
      name: type.name,
      resistantTo: type.damage_relations.half_damage_to.map(t => t.name),
      vulnerableTo: type.damage_relations.double_damage_from.map(t => t.name),
      immuneTo: type.damage_relations.no_damage_from.map(t => t.name),
      effectiveAgainst: type.damage_relations.double_damage_to.map(t => t.name)
    };
  } catch (error) {
    console.error(`タイプ [${typeName}] の情報取得エラー:`, error.message);
    throw error;
  }
}

module.exports = {
  fetchAllPokemon,
  fetchPokemonDetails,
  fetchTypeEffectiveness
};
