import React, { useState, useEffect } from 'react';
import { searchPokemon, getSearchSuggestions } from '../api/client';
import '../styles/PokemonSearch.css';

/**
 * ポケモン検索・入力フォーム
 * インクリメンタルサーチ機能付き
 */
function PokemonSearch({ onPokemonSelect, selectedPokemons = [], onPokemonRemove }) {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // インクリメンタルサーチ（デバウンス）
  useEffect(() => {
    if (searchInput.length < 1) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const results = await getSearchSuggestions(searchInput);
        setSuggestions(results.slice(0, 10));
      } catch (error) {
        console.error('検索候補取得エラー:', error);
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
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

  // 選択済みポケモンを削除
  const handleRemovePokemon = (index) => {
    if (typeof onPokemonRemove === 'function') {
      onPokemonRemove(index);
    }
  };

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
        <h4>選択済みポケモン ({selectedPokemons.length}/5)</h4>
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
                <button
                  type="button"
                  className="remove-pokemon-button"
                  onClick={() => handleRemovePokemon(index)}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PokemonSearch;
