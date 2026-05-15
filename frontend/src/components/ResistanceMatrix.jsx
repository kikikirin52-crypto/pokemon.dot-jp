import React, { useEffect, useState } from 'react';
import '../styles/ResistanceMatrix.css';

/**
 * 耐性マトリックスの可視化
 * 18タイプのそれぞれについて、現在のパーティが「一貫」「対策済み」かを表示
 */
function ResistanceMatrix({ partyAnalysis }) {
  const [matrixData, setMatrixData] = useState([]);

  useEffect(() => {
    if (partyAnalysis && partyAnalysis.weaknesses) {
      // weaknesses = [
      //   { type: 'fire', minDamage: 1.2, currentDefender: 'Pokemon1' },
      //   ...
      // ]
      setMatrixData(partyAnalysis.weaknesses);
    }
  }, [partyAnalysis]);

  const allTypes = [
    { key: 'normal', label: 'ノーマル' },
    { key: 'fighting', label: 'かくとう' },
    { key: 'flying', label: 'ひこう' },
    { key: 'poison', label: 'どく' },
    { key: 'ground', label: 'じめん' },
    { key: 'rock', label: 'いわ' },
    { key: 'bug', label: 'むし' },
    { key: 'ghost', label: 'ゴースト' },
    { key: 'steel', label: 'はがね' },
    { key: 'fire', label: 'ほのお' },
    { key: 'water', label: 'みず' },
    { key: 'grass', label: 'くさ' },
    { key: 'electric', label: 'でんき' },
    { key: 'psychic', label: 'エスパー' },
    { key: 'ice', label: 'こおり' },
    { key: 'dragon', label: 'ドラゴン' },
    { key: 'dark', label: 'あく' },
    { key: 'fairy', label: 'フェアリー' }
  ];

  const typeColors = {
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC'
  };

  const isWeakType = (type) => {
    return matrixData.some(w => w.type === type);
  };

  return (
    <div className="resistance-matrix-container">
      <h3>耐性マトリックス（18タイプ）</h3>
      <p className="matrix-description">
        ✓ = タイプ対策済み | × = タイプが一貫している（穴）
      </p>

      <div className="matrix-grid">
        {allTypes.map((typeInfo, index) => {
          const typeKey = typeInfo.key;
          const isWeak = isWeakType(typeKey);

          return (
            <div
              key={index}
              className={`matrix-cell ${isWeak ? 'weak' : 'covered'}`}
              style={{
                borderColor: typeColors[typeKey]
              }}
            >
              <span className="type-name">{typeInfo.label}</span>
              <span className="status">{isWeak ? '✕' : '○'}</span>
            </div>
          );
        })}
      </div>

      {partyAnalysis && !partyAnalysis.isCoverageComplete && (
        <div className="remaining-weaknesses">
          <h4>残る弱点タイプ: {partyAnalysis.weaknessCount}個</h4>
          <ul>
            {partyAnalysis.weaknesses.map((weakness, index) => (
              <li key={index}>
                <strong>{weakness.displayType || weakness.type}</strong> - 最小ダメージ: {weakness.minDamage}倍
                {weakness.currentDefender && (
                  <span> (現在: {weakness.currentDefender}が受け)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {partyAnalysis && partyAnalysis.isCoverageComplete && (
        <div className="coverage-complete">
          ✨ 全てのタイプに対策済み！完璧なパーティです！
        </div>
      )}
    </div>
  );
}

export default ResistanceMatrix;
