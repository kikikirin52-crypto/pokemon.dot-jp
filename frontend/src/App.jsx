import React, { useState, useEffect, useRef } from 'react';
import PokemonSearch from './components/PokemonSearch';
import PartySuggestion from './components/PartySuggestion';
import FeedbackForm from './components/FeedbackForm';
import { suggestComplementaryParty, getBuildTypes } from './api/client';
import './App.css';

function App() {
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buildTypes, setBuildTypes] = useState([]);
  const [selectedBuildType, setSelectedBuildType] = useState(null);
  const [appError, setAppError] = useState('');
  const suggestionSectionRef = useRef(null);

  useEffect(() => {
    const fetchBuildTypes = async () => {
      try {
        const types = await getBuildTypes();
        setBuildTypes(types);
      } catch (error) {
        console.error('構築タイプ取得エラー:', error);
      }
    };
    fetchBuildTypes();
  }, []);

  const handlePokemonSelect = (pokemon) => {
    const alreadySelected = selectedPokemons.some(
      (selected) => selected.name.toLowerCase() === pokemon.name.toLowerCase()
    );
    if (alreadySelected) {
      setAppError(`${pokemon.japaneseName || pokemon.displayName || pokemon.name} はすでに選択されています`);
      return;
    }

    if (selectedPokemons.length < 5) {
      setSelectedPokemons([...selectedPokemons, pokemon]);
      setAppError('');
    } else {
      setAppError('最大5匹まで選択できます');
    }
  };

  const handleRemovePokemon = (index) => {
    setSelectedPokemons(selectedPokemons.filter((_, i) => i !== index));
  };

  const handleAutoComplete = async () => {
    if (selectedPokemons.length === 0) {
      setAppError('ポケモンを1匹以上選択してください');
      return;
    }

    try {
      setIsLoading(true);
      const suggestionResult = await suggestComplementaryParty(selectedPokemons, selectedBuildType?.strategy);
      setSuggestions(suggestionResult);
      setAppError('');
    } catch (error) {
      setAppError('パーティの自動生成に失敗しました');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedPokemons([]);
    setSuggestions(null);
    setAppError('');
  };

  const handleUseSuggestion = (suggestedParty) => {
    if (suggestedParty && suggestedParty.finalParty) {
      setSelectedPokemons(suggestedParty.finalParty);
      setSuggestions(null);
    }
  };

  useEffect(() => {
    if (suggestions) {
      suggestionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [suggestions]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="hero-copy">
          <span className="eyebrow">Champion League Ready</span>
          <h1>ポケモン構築補完システム</h1>
          <p>
            公式チャンピオンズ掲載ポケモンに特化した、直感的で動きのある構築提案。
            最大5匹の選択から補完パーティまで、すばやく最適化します。
          </p>
          <div className="hero-actions">
            <button
              type="button"
              onClick={handleAutoComplete}
              disabled={selectedPokemons.length === 0 || isLoading}
            >
              {isLoading ? '生成中...' : 'パーティ自動生成'}
            </button>
          </div>
          {appError && (
            <div className="app-error-message">⚠️ {appError}</div>
          )}
        </div>
      </header>

      <main className="App-content">
        <div className="panel-grid">
          <section className="panel panel-left">
            <div className="panel-heading">
              <span>STEP 1</span>
              <h2>ポケモンを選択</h2>
            </div>
            <PokemonSearch
              onPokemonSelect={handlePokemonSelect}
              selectedPokemons={selectedPokemons}
              onPokemonRemove={handleRemovePokemon}
            />
            {buildTypes.length > 0 && (
              <div className="build-type-selection">
                <label htmlFor="build-type-select">構築タイプ</label>
                <select
                  id="build-type-select"
                  value={selectedBuildType?.name || ''}
                  onChange={(e) => {
                    const selected = buildTypes.find(type => type.name === e.target.value);
                    setSelectedBuildType(selected);
                  }}
                  className="build-type-select"
                >
                  <option value="">構築タイプを選択</option>
                  {buildTypes.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {selectedBuildType && (
                  <div className="build-type-description">
                    <p>{selectedBuildType.description}</p>
                  </div>
                )}
              </div>
            )}

            <div className="action-buttons">
                <button
                type="button"
                className="btn btn-success"
                onClick={handleAutoComplete}
                disabled={selectedPokemons.length === 0 || isLoading}
              >
                {isLoading ? '生成中...' : 'パーティ自動生成'}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleReset}
              >
                リセット
              </button>
            </div>
          </section>
        </div>

        {suggestions && (
          <section ref={suggestionSectionRef} className="suggestion-section">
            <h2>パーティ提案</h2>
            <PartySuggestion suggestions={suggestions} selectedBuildType={selectedBuildType} onUseSuggestion={handleUseSuggestion} />
          </section>
        )}
      </main>

      <footer className="App-footer">
        <p>ポケモン構築補完＆自動生成システム</p>
      </footer>

      <FeedbackForm />
    </div>
  );
}

export default App;
