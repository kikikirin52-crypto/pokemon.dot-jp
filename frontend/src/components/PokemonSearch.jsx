import React, { useState, useEffect } from 'react';
import { searchPokemon, getSearchSuggestions } from '../api/client';
import '../styles/PokemonSearch.css';

/**
 * ポケモン検索・入力フォーム
 * インクリメンタルサーチ機能付き
 */
function PokemonSearch({ onPokemonSelect, selectedPokemons = [] }) {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // インクリメンタルサーチ
  useEffect(() => {
    if (searchInput.length < 1) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        console.log('検索候補取得開始:', searchInput);
        const results = await getSearchSuggestions(searchInput);
        console.log('検索候補取得結果:', results);
        setSuggestions(results.slice(0, 10));
      } catch (error) {
        console.error('検索候補取得エラー:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchInput]);

  // Enter キーでの検索
  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      e.preventDefault();
      await performSearch(searchInput.trim());
    }
  };

  // ポケモン検索実行
  const performSearch = async (pokemonName) => {
    if (!pokemonName) return;

    setIsLoading(true);
    setError('');
    try {
      const pokemon = await searchPokemon(pokemonName);
      setSearchInput('');
      setSuggestions([]);
      onPokemonSelect(pokemon);
    } catch (error) {
      setError(`「${pokemonName}」が見つかりません`);
      console.error('ポケモン検索エラー:', error);
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 候補をクリック
  const handleSuggestionClick = (suggestion) => {
    const pokemonName = typeof suggestion === 'string' ? suggestion : suggestion.english || suggestion.japanese;
    performSearch(pokemonName);
  };

  // 削除ボタン（選択済みポケモンから削除するにはApp.jsxで実装が必要）

  return (
    <div className="pokemon-search-container">
      <h3>ポケモンを検索・追加</h3>
      <div className="search-box">
        <input
          type="text"
          placeholder="ポケモン名を入力して Enter キーを押してください"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
          disabled={isLoading}
          autoFocus
        />
        {isLoading && <span className="loading">読み込み中...</span>}
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => {
            const label = typeof suggestion === 'string'
              ? suggestion
              : suggestion.english
                ? `${suggestion.japanese} (${suggestion.english})`
                : suggestion.japanese;

            return (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}

      <div className="selected-pokemons">
        <h4>選択済みポケモン ({selectedPokemons.length}/3)</h4>
        {selectedPokemons.length === 0 ? (
          <p className="no-pokemon">ポケモンをまだ選択していません</p>
        ) : (
          <ul className="pokemon-list">
            {selectedPokemons.map((pokemon, index) => (
              <li key={index} className="pokemon-item">
                <img
                  src={pokemon.imageUrl || 'https://via.placeholder.com/80'}
                  alt={pokemon.japaneseName || pokemon.displayName || pokemon.name}
                  className="pokemon-image"
                />
                <div className="pokemon-info">
                  <span className="pokemon-name">{pokemon.japaneseName || pokemon.displayName || pokemon.name}</span>
                  <span className="pokemon-types">
                    {pokemon.displayTypes ? pokemon.displayTypes.join(' / ') : pokemon.types ? pokemon.types.join(', ') : 'タイプ不明'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PokemonSearch;
