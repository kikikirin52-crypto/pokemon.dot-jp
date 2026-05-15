import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ポケモン検索
export const searchPokemon = async (name) => {
  try {
    const response = await client.post('/search', { name });
    return response.data.pokemon;
  } catch (error) {
    console.error('ポケモン検索エラー:', error);
    throw error;
  }
};

// ポケモン候補検索
export const getSearchSuggestions = async (query) => {
  try {
    const response = await client.get('/search-suggestions', { params: { q: query } });
    return response.data.suggestions;
  } catch (error) {
    console.error('候補検索エラー:', error);
    return [];
  }
};

// パーティ分析
export const analyzeParty = async (partyMembers) => {
  try {
    const response = await client.post('/analyze', { partyMembers });
    return response.data.partyAnalysis;
  } catch (error) {
    console.error('パーティ分析エラー:', error);
    throw error;
  }
};

// パーティ補完提案
export const suggestComplementaryParty = async (partyMembers, buildType = null) => {
  try {
    const response = await client.post('/suggest', { partyMembers, buildType });
    return response.data.suggestions || response.data.suggestion;
  } catch (error) {
    console.error('パーティ提案エラー:', error);
    throw error;
  }
};
// 構築タイプ取得
export const getBuildTypes = async () => {
  try {
    const response = await client.get('/build-types');
    return response.data.buildTypes;
  } catch (error) {
    console.error('構築タイプ取得エラー:', error);
    throw error;
  }
};
// 使用率ランキング取得
export const getRankings = async () => {
  try {
    const response = await client.get('/rankings');
    return response.data.rankings;
  } catch (error) {
    console.error('ランキング取得エラー:', error);
    throw error;
  }
};

// ヘルスチェック
export const checkHealth = async () => {
  try {
    const response = await client.get('/health');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('ヘルスチェックエラー:', error);
    return false;
  }
};

export default client;
