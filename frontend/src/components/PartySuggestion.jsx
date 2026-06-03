import React from 'react';
import '../styles/PartySuggestion.css';

/**
 * パーティ提案表示
 * 自動生成されたパーティと使用率を表示
 */
function PartySuggestion({ suggestions, selectedBuildType, onUseSuggestion }) {
  const renderParty = (title, partyData) => {
    if (!partyData || !partyData.finalParty) {
      return null;
    }

    return (
      <div className="suggestion-block">
        <h4>{title}</h4>
        <div className="suggested-party-list">
          {partyData.finalParty.map((pokemon, index) => (
            <div key={`${title}-${index}`} className="party-slot">
              <div className="slot-number">#{index + 1}</div>
              <img
                src={pokemon.imageUrl || 'https://via.placeholder.com/120?text=No+Image'}
                alt={pokemon.japaneseName || pokemon.displayName || pokemon.name}
                className="party-pokemon-image"
              />
              <div className="pokemon-info">
                <h4>{pokemon.japaneseName || pokemon.displayName || pokemon.name}</h4>
                <p className="types">
                  {pokemon.displayTypes ? pokemon.displayTypes.join(' / ') : pokemon.types && pokemon.types.join(' / ')}
                </p>
                {pokemon.usageRank && (
                  <p className="usage-rank">
                    使用率: #{pokemon.usageRank}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {partyData.consistentTypes && (
          <div className="weaknesses-info">
            <h5>一貫性を取られているタイプ: {partyData.consistentTypes.length}個</h5>
            <ul>
              {partyData.consistentTypes.length > 0 ? (
                partyData.consistentTypes.map((weakness, index) => (
                  <li key={`${title}-weakness-${index}`}>{weakness.displayType || weakness.type}</li>
                ))
              ) : (
                <li>一貫性を取られているタイプはありません</li>
              )}
            </ul>
          </div>
        )}

        {partyData.isCoverageComplete && (
          <div className="perfect-coverage">
            ✨ 完璧な構築です！全タイプに対策済み！
          </div>
        )}
      </div>
    );
  };

  if (!suggestions) {
    return (
      <div className="party-suggestion-container">
        <p className="placeholder">
          ポケモンを選択し、「自動生成」ボタンをクリックしてください
        </p>
      </div>
    );
  }

  const isMulti = suggestions.highUsage || suggestions.perfectNoWeakness;

  return (
    <div className="party-suggestion-container">
      <h3>提案されたパーティ</h3>
      <p className="suggestion-note">この提案はあくまで構築の目安です。初心者向けの参考としてご利用ください。</p>
      {selectedBuildType && (
        <div className="selected-build-type">
          <h4>選択された構築タイプ: {selectedBuildType.name}</h4>
        </div>
      )}
      {isMulti ? (
        <>
          {renderParty('高使用率パーティ', suggestions.highUsage)}
          {renderParty('完全弱点なしパーティ', suggestions.perfectNoWeakness)}
        </>
      ) : (
        renderParty('推奨パーティ', suggestions)
      )}

      {onUseSuggestion && (
        <button className="use-suggestion-btn" onClick={onUseSuggestion}>
          このパーティを使用
        </button>
      )}
    </div>
  );
}

export default PartySuggestion;
