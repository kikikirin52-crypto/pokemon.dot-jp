import React, { useState, useEffect } from 'react';
import PokemonSearch from './components/PokemonSearch';
import ResistanceMatrix from './components/ResistanceMatrix';
import PartySuggestion from './components/PartySuggestion';
import { analyzeParty, suggestComplementaryParty, getBuildTypes } from './api/client';
import './App.css';

function App() {
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const [partyAnalysis, setPartyAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buildTypes, setBuildTypes] = useState([]);
  const [selectedBuildType, setSelectedBuildType] = useState(null);

  // 構築タイプを取得
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

  // ポケモンが選択されたときの処理
  const handlePokemonSelect = (pokemon) => {
    if (selectedPokemons.length < 3) {
      setSelectedPokemons([...selectedPokemons, pokemon]);
    } else {
      alert('最大3匹まで選択できます');
    }
  };

  // パーティを分析
  const handleAnalyzeParty = async () => {
    if (selectedPokemons.length === 0) {
      alert('ポケモンを1匹以上選択してください');
      return;
    }

    try {
      setIsLoading(true);
      const analysis = await analyzeParty(selectedPokemons);
      setPartyAnalysis(analysis);
    } catch (error) {
      alert('パーティの分析に失敗しました');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // パーティを自動生成
  const handleAutoComplete = async () => {
    if (selectedPokemons.length === 0) {
      alert('ポケモンを1匹以上選択してください');
      return;
    }

    try {
      setIsLoading(true);
      const suggestionResult = await suggestComplementaryParty(selectedPokemons, selectedBuildType?.strategy);
      setSuggestions(suggestionResult);
    } catch (error) {
      alert('パーティの自動生成に失敗しました');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 選択をリセット
  const handleReset = () => {
    setSelectedPokemons([]);
    setPartyAnalysis(null);
    setSuggestions(null);
  };

  // 提案されたパーティを使用
  const handleUseSuggestion = (suggestedParty) => {
    if (suggestedParty && suggestedParty.finalParty) {
      setSelectedPokemons(suggestedParty.finalParty);
      setPartyAnalysis(null);
      setSuggestions(null);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎮 ポケモン構築補完システム</h1>
        <p>最強の相性補完パーティを自動生成</p>
      </header>

      <main className="container">
        <section className="input-section">
          <h2>ステップ1: ポケモンを選択</h2>
          <PokemonSearch
            onPokemonSelect={handlePokemonSelect}
            selectedPokemons={selectedPokemons}
          />

          {buildTypes.length > 0 && (
            <div className="build-type-selection">
              <h3>構築タイプを選択</h3>
              <select
                value={selectedBuildType?.name || ''}
                onChange={(e) => {
                  const selected = buildTypes.find(type => type.name === e.target.value);
                  setSelectedBuildType(selected);
                }}
                className="build-type-select"
              >
                <option value="">構築タイプを選択してください</option>
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

          {selectedPokemons.length > 0 && (
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={handleAnalyzeParty}
                disabled={isLoading}
              >
                {isLoading ? '分析中...' : '耐性を分析'}
              </button>
              <button
                className="btn btn-success"
                onClick={handleAutoComplete}
                disabled={isLoading}
              >
                {isLoading ? '生成中...' : 'パーティを自動生成'}
              </button>
              <button className="btn btn-danger" onClick={handleReset}>
                リセット
              </button>
            </div>
          )}
        </section>

        {partyAnalysis && (
          <section className="analysis-section">
            <h2>ステップ2: 耐性分析</h2>
            <ResistanceMatrix partyAnalysis={partyAnalysis} />
          </section>
        )}

        {suggestions && (
          <section className="suggestion-section">
            <h2>ステップ3: パーティ提案</h2>
            <PartySuggestion suggestions={suggestions} selectedBuildType={selectedBuildType} onUseSuggestion={handleUseSuggestion} />
          </section>
        )}

        {!partyAnalysis && !suggestions && selectedPokemons.length === 0 && (
          <section className="info-section">
            <h2>使い方</h2>
            <ol>
              <li>1〜3匹のポケモンを選択します</li>
              <li>「耐性を分析」ボタンでパーティの弱点を確認</li>
              <li>「パーティを自動生成」で相性補完ポケモンを提案</li>
              <li>18タイプすべてに対応したチームを完成させます</li>
            </ol>
          </section>
        )}
      </main>

      <footer className="App-footer">
        <p>ポケモン構築補完＆自動生成システム © 2024</p>
      </footer>
    </div>
  );
}

export default App;
