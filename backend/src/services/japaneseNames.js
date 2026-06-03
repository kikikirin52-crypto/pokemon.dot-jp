const { isOfficialChampionsPagePokemon, OFFICIAL_CHAMPIONS_PAGE_POKEMON } = require('./championsPagePokemon');

const JAPANESE_NAME_MAP = {
  'pikachu': 'ピカチュウ',
  'raichu': 'ライチュウ',
  'charizard': 'リザードン',
  'charmeleon': 'リザード',
  'charmander': 'ヒトカゲ',
  'blastoise': 'カメックス',
  'wartortle': 'カメール',
  'squirtle': 'ゼニガメ',
  'venusaur': 'フシギバナ',
  'ivysaur': 'フシギソウ',
  'bulbasaur': 'フシギダネ',
  'alakazam': 'フーディン',
  'kadabra': 'ユンゲラー',
  'abra': 'ケーシィ',
  'machamp': 'カイリキー',
  'machoke': 'ゴーリキー',
  'machop': 'ワンリキー',
  'golem': 'ゴローニャ',
  'graveler': 'ゴローン',
  'geodude': 'イシツブテ',
  'arcanine': 'ウインディ',
  'rapidash': 'ギャロップ',
  'growlithe': 'ガーディ',
  'ninetales': 'キュウコン',
  'lapras': 'ラプラス',
  'iron-moth': 'テツノドクガ',
  'great-tusk': 'イダイナキバ',
  'iron-hands': 'テツノカイナ',
  'snorlax': 'カビゴン',
  'articuno': 'フリーザー',
  'zapdos': 'サンダー',
  'moltres': 'ファイヤー',
  'dragonite': 'カイリュー',
  'mewtwo': 'ミュウツー',
  'mew': 'ミュウ',
  'psyduck': 'コダック',
  'golduck': 'ゴルダック',
  'jigglypuff': 'プリン',
  'wigglytuff': 'プクリン',
  'meowth': 'ニャース',
  'persian': 'ペルシアン',
  'ponyta': 'ポニータ',
  'magnemite': 'コイル',
  'magneton': 'レアコイル',
  'exeggcute': 'タマタマ',
  'exeggutor': 'ナッシー',
  'cubone': 'カラカラ',
  'marowak': 'ガラガラ',
  'hitmonlee': 'サワムラー',
  'hitmonchan': 'エビワラー',
  'lickitung': 'ベロリンガ',
  'koffing': 'ドガース',
  'weezing': 'マタドガス',
  'rhyhorn': 'サイホーン',
  'rhydon': 'サイドン',
  'chansey': 'ラッキー',
  'tangela': 'モンジャラ',
  'kangaskhan': 'ガルーラ',
  'horsea': 'タッツー',
  'seadra': 'シードラ',
  'goldeen': 'トサキント',
  'staryu': 'ヒトデマン',
  'starmie': 'スターミー',
  'marill': 'マリル',
  'azumarill': 'マリルリ',
  'magikarp': 'コイキング',
  'gyarados': 'ギャラドス',
  'eevee': 'イーブイ',
  'vaporeon': 'シャワーズ',
  'jolteon': 'サンダース',
  'flareon': 'ブースター',
  'porygon': 'ポリゴン',
  'omanyte': 'オムナイト',
  'omastar': 'オムスター',
  'kabuto': 'カブト',
  'kabutops': 'カブトプス',
  'aerodactyl': 'プテラ',
  'dratini': 'ミニリュウ',
  'dragonair': 'ハクリュー',
  'tinkaton': 'デカヌチャン',
  'gastrodon': 'ドリトドン',
  // メガシンカポケモン
  'venusaur-mega': 'メガフシギバナ',
  'charizard-mega-x': 'メガリザードンX',
  'charizard-mega-y': 'メガリザードンY',
  'blastoise-mega': 'メガカメックス',
  'gyarados-mega': 'メガギャラドス',
  'aerodactyl-mega': 'メガプテラ',
  'alakazam-mega': 'メガフーディン',
  'gengar-mega': 'メガゲンガー',
  'kangaskhan-mega': 'メガガルーラ',
  'pinsir-mega': 'メガカイロス',
  'tyranitar-mega': 'メガバンギラス',
  'metagross-mega': 'メガメタグロス',
  'salamence-mega': 'メガボーマンダ',
  'garchomp-mega': 'メガガブリアス',
  'lucario-mega': 'メガルカリオ',
  'abomasnow-mega': 'メガユキノオー',
  // 追加のメガシンカ（ユーザーリクエスト）
  'meganium-mega': 'メガメガニウム',
  'starmie-mega': 'メガスターミー',
  'floette-mega': 'メガフラエッテ',
  'dragonite-mega': 'メガカイリュー',
  'glimmora-mega': 'メガキラフロル',
  'delphox-mega': 'メガマフォクシー',
  'chesnaught-mega': 'メガブリガロン',
  'greninja-mega': 'メガゲッコウガ',
  'clefable-mega': 'メガピクシー',
  'slowbro-mega': 'メガヤドラン',
  'chimecho-mega': 'メガチリーン',
  'heracross-mega': 'メガヘラクロス',
  'froslass-mega': 'メガユキメノコ',
  'skarmory-mega': 'メガエアームド',
  'scovillain-mega': 'メガスコヴィラン',
  'victreebel-mega': 'メガウツボット',
  'absol-mega': 'メガアブソル',
  'feraligatr-mega': 'メガオーダイル',
  'emboar-mega': 'メガエンブオー',
  'ampharos-mega': 'メガデンリュウ',
  // 第1世代追加
  'beedrill': 'スピアー',
  'beedrill-mega': 'メガスピアー',
  'pidgeot': 'ピジョット',
  'pidgeot-mega': 'メガピジョット',
  // 第2・3世代追加
  'steelix': 'ハガネール',
  'steelix-mega': 'メガハガネール',
  'aggron': 'ボスゴドラ',
  'aggron-mega': 'メガボスゴドラ',
  'manectric': 'ライボルト',
  'manectric-mega': 'メガライボルト',
  'sharpedo': 'サメハダー',
  'sharpedo-mega': 'メガサメハダー',
  'snorunt': 'ポワルン',
  // 第4・5世代追加
  'roserade': 'ロズレイド',
  'lopunny': 'ミミロップ',
  'lopunny-mega': 'メガミミロップ',
  'pignite': 'ミルホッグ',
  'liepard': 'レパルダス',
  'snivy': 'ヤナッキー',
  'tepig': 'バオッキー',
  'oshawott': 'ヒヤッキー',
  'audino': 'タブンネ',
  'audino-mega': 'メガタブンネ',
  'throh': 'ペンドラー',
  'sawk': 'デスカーン',
  'garbodor': 'ダストダス',
  'vanillite': 'バイバニラ',
  'emolga': 'エモンガ',
  // 第6世代以降追加
  'klefki': 'クレッフィ',
  'avalugg': 'ゴロンダ',
  'meowstic': 'トリミアン',
  'aegislash': 'ギルガルド',
  'aegislash-shield': 'ギルガルド',
  'mimikyu-disguised': 'ミミッキュ',
  'barbaracle': 'ガチゴラス',
  'amaura': 'アマルルガ',
  'tyrunt': 'バリコオル',
  'pyroar': 'デスバーン'
};

// ランキングポケモンの追加 (地域別フォームと特別フォーム)
const RANKING_NAMES = {
  'tyranitar': 'バンギラス',
  'metagross': 'メタグロス',
  'salamence': 'ボーマンダ',
  'garchomp': 'ガブリアス',
  'latios': 'ラティオス',
  'latias': 'ラティアス',
  'gengar': 'ゲンガー',
  'scizor': 'ハッサム',
  'rotom-heat': 'ヒートロトム',
  'rotom-wash': 'ウォッシュロトム',
  'rotom-frost': 'フロストロトム',
  'rotom-mow': 'カットロトム',
  'rotom-spin': 'スピンロトム',
  'jirachi': 'ジラーチ',
  'slaking': 'ケッキング',
  'infernape': 'ゴウカザル',
  'lucario': 'ルカリオ',
  'blissey': 'ハピナス',
  'ninetales-alola': 'キュウコン (アローラ)',
  'arcanine-hisui': 'ウインディ (ヒスイ)',
  'goodra-hisui': 'ヌメルゴン (ヒスイ)',
  'slowking-galar': 'ヤドキング (ガラル)',
  'slowbro-galar': 'ヤドラン (ガラル)',
  'basculegion-male': 'イダイトウ (オス)',
  'basculegion-female': 'イダイトウ (メス)',
  'floette-eternal': 'フラエッテ:永遠',
  'aegislash': 'ギルガルド',
  'tauros-paldea-blaze': 'ケンタロス:炎',
  'tauros-paldea-aqua': 'ケンタロス:水',
  'tauros-paldea-combat': 'ケンタロス:格',
  'sneasler': 'オオニューラ',
  'lilligant-hisui': 'アマージョ',
  'decidueye-hisui': 'ジュナイパー (ヒスイ)',
  'samurott-hisui': 'ダイケンキ (ヒスイ)',
  'typhlosion-hisui': 'バクフーン (ヒスイ)',
  'zoroark-hisui': 'ゾロアーク (ヒスイ)',
  'kleavor': 'バサギリ',
  'mimikyu': 'ミミッキュ',
  'meowscarada': 'マスカーニャ',
  'armarouge': 'グレンアルマ',
  'ceruledge': 'ソウブレイズ',
  'glimmora': 'キラフロル',
  'sandaconda': 'サダイジャ',
  // チャンピオンズページ掲載の他のポケモン
  'primarina': 'アシレーヌ',
  'archaludon': 'ブリジュラス',
  'corviknight': 'アーマーガア',
  'hippowdon': 'カバルドン',
  'kingambit': 'ドドゲザン',
  'hydreigon': 'サザンドラ',
  'umbreon': 'ブラッキー',
  'delphox': 'マフォクシー',
  'meganium': 'メガニウム',
  'greninja': 'ゲッコウガ',
  'volcarona': 'ウルガモス',
  'clefable': 'ピクシー',
  'sylveon': 'ニンフィア',
  'skeledirge': 'ラウドボーン',
  'dragapult': 'ドラパルト',
  'toxapex': 'ドヒドイデ',
  'espathra': 'クエスパトラ',
  'bellibolt': 'ハラバリー',
  'pelipper': 'ペリッパー',
  'mamoswine': 'マンムー',
  'diggersby': 'ホルード',
  'empoleon': 'エンペルト',
  'scovillain': 'スコヴィラン',
  'excadrill': 'ドリュウズ',
  'froslass': 'ユキメノコ',
  'skarmory': 'エアームド',
  'gardevoir': 'サーナイト',
  'victreebel': 'ウツボット',
  'araquanid': 'オニシズクモ',
  'whimsicott': 'エルフーン',
  'gallade': 'エルレイド',
  'incineroar': 'ガオガエン',
  'banette': 'ジュペッタ',
  'milotic': 'ミロカロス',
  'hatterene': 'ブリムオン',
  'serperior': 'ジャローダ',
  'heracross': 'ヘラクロス',
  'conkeldurr': 'ローブシン',
  'chandelure': 'シャンデラ',
  'ditto': 'メタモン',
  'chesnaught': 'ブリガロン',
  'slowbro': 'ヤドラン',
  'orthworm': 'ミミズズ',
  'heliolisk': 'エレザード',
  'sinistcha': 'ヤバソチャ',
  'sableye': 'ヤミラミ',
  'palafin': 'イルカマン',
  'espeon': 'エーフィ',
  'quaquaval': 'ウェーニバル',
  'feraligatr': 'オーダイル',
  'toucannon': 'ドデカバシ',
  'hawlucha': 'ルチャブル',
  'polteageist': 'ポットデス',
  'maushold': 'イッカネズミ',
  'weavile': 'マニューラ',
  'crabominable': 'ケケンカニ',
  'talonflame': 'ファイアロー',
  'pinsir': 'カイロス',
  'chimecho': 'チリーン',
  'vivillon': 'ビビヨン',
  'garganacl': 'キョジオーン',
  'abomasnow': 'ユキノオー',
  'mudsdale': 'バンバドロ',
  'manectric': 'ライボルト',
  'lycanroc-dusk': 'ルガルガン (たそがれ)',
  'altaria': 'チルタリス',
  'gliscor': 'グライオン',
  'emboar': 'エンブオー',
  'jolteon': 'サンダース',
  'salazzle': 'エンニュート',
  'vanilluxe': 'バイバニラ',
  'ampharos': 'デンリュウ',
  'torterra': 'ドダイトス',
  'kommo-o': 'ジャラランガ',
  'runerigus': 'デスバーン',
  'glaceon': 'グレイシア',
  'torkoal': 'コータス',
  'krookodile': 'ワルビアル',
  'medicham': 'チャーレム',
  'forretress': 'フォレトス',
  'tsareena': 'アマージョ',
  'politoed': 'ニョロトノ',
  'cofagrigus': 'デスカーン',
  'goodra': 'ヌメルゴン',
  'drampa': 'ジジーロン',
  'noivern': 'オンバーン',
  'ariados': 'アリアドス',
  'slurpuff': 'ペロリーム',
  'absol': 'アブソル',
  'glalie': 'オニゴーリ',
  'farigiraf': 'リキキリン',
  'slowking': 'ヤドキング',
  'clawitzer': 'ブロスター',
  'zoroark': 'ゾロアーク',
  'rhyperior': 'ドサイドン',
  'hydrapple': 'カミツオロチ',
  'spiritomb': 'ミカルゲ',
  'avalugg-hisui': 'クレベース (ヒスイ)',
  'morpeko': 'モルペコ',
  'houndoom': 'ヘルガー',
  'golurk': 'ゴルーグ',
  'alcremie': 'マホイップ',
  'reuniclus': 'ランクルス'
};

// JAPANESE_NAME_MAP にランキングポケモンを追加
Object.assign(JAPANESE_NAME_MAP, RANKING_NAMES);

const TYPE_NAME_MAP = {
  normal: 'ノーマル',
  fighting: 'かくとう',
  flying: 'ひこう',
  poison: 'どく',
  ground: 'じめん',
  rock: 'いわ',
  bug: 'むし',
  ghost: 'ゴースト',
  steel: 'はがね',
  fire: 'ほのお',
  water: 'みず',
  grass: 'くさ',
  electric: 'でんき',
  psychic: 'エスパー',
  ice: 'こおり',
  dragon: 'ドラゴン',
  dark: 'あく',
  fairy: 'フェアリー'
};

const JAPANESE_TO_ENGLISH = Object.entries(JAPANESE_NAME_MAP).reduce((acc, [en, jp]) => {
  acc[jp] = en;
  return acc;
}, {});

const normalize = (value) => {
  let normalized = value.toString().trim();

  normalized = normalized.replace(/^(ヒスイ|ガラル|アローラ)の(.+)$/u, '$2 ($1)');
  normalized = normalized.replace(/^(サンダー|ファイヤー|フリーザー)の(.+)$/u, '$2 ($1)');

  return normalized
    .toLowerCase()
    .replace(/[-\sー－―]/g, '')
    .replace(/[()（）:：・\.。]/g, '')
    .replace(/の姿|のすがた/g, '')
    .replace(/メガ/g, 'mega')
    .replace(/♀/g, 'f')
    .replace(/♂/g, 'm');
};

function isEnglishLikeQuery(value) {
  return /^[a-z0-9-]+$/i.test(value.toString().trim());
}

function findClosestPokemonName(query) {
  if (!query) return null;
  const normalizedQuery = normalize(query);

  const candidates = Object.entries(JAPANESE_NAME_MAP)
    .filter(([english, japanese]) => {
      const normalizedEnglish = normalize(english);
      const normalizedJapanese = normalize(japanese);
      return normalizedEnglish.includes(normalizedQuery) || normalizedJapanese.includes(normalizedQuery);
    });

  if (candidates.length === 1) {
    return candidates[0][0];
  }

  const startsWith = candidates.filter(([english, japanese]) => {
    const normalizedEnglish = normalize(english);
    const normalizedJapanese = normalize(japanese);
    return normalizedEnglish.startsWith(normalizedQuery) || normalizedJapanese.startsWith(normalizedQuery);
  });

  if (startsWith.length === 1) {
    return startsWith[0][0];
  }

  return null;
}

const NORMALIZED_ENGLISH_TO_ENGLISH = Object.keys(JAPANESE_NAME_MAP).reduce((acc, englishName) => {
  acc[normalize(englishName)] = englishName;
  return acc;
}, {});

const NORMALIZED_JAPANESE_TO_ENGLISH = Object.entries(JAPANESE_NAME_MAP).reduce((acc, [englishName, japaneseName]) => {
  acc[normalize(japaneseName)] = englishName;
  return acc;
}, {});

function translateToEnglish(name) {
  if (!name) return null;
  const trimmedName = name.toString().trim();
  const normalized = normalize(trimmedName);

  if (NORMALIZED_ENGLISH_TO_ENGLISH[normalized]) {
    return NORMALIZED_ENGLISH_TO_ENGLISH[normalized];
  }

  if (NORMALIZED_JAPANESE_TO_ENGLISH[normalized]) {
    return NORMALIZED_JAPANESE_TO_ENGLISH[normalized];
  }

  if (isEnglishLikeQuery(trimmedName)) {
    return trimmedName.toLowerCase();
  }

  const bestMatch = findClosestPokemonName(trimmedName);
  if (bestMatch) {
    return bestMatch;
  }

  return trimmedName.toLowerCase();
}

function translateToJapanese(name) {
  if (!name) return null;
  const trimmedName = name.toString().trim();
  const normalized = normalize(trimmedName);
  const englishName = NORMALIZED_ENGLISH_TO_ENGLISH[normalized] || trimmedName;

  if (JAPANESE_NAME_MAP[englishName]) {
    return JAPANESE_NAME_MAP[englishName];
  }

  const baseName = englishName.split('-')[0];
  if (JAPANESE_NAME_MAP[baseName]) {
    return JAPANESE_NAME_MAP[baseName];
  }

  return trimmedName;
}

function translateTypeToJapanese(typeName) {
  if (!typeName) return null;
  return TYPE_NAME_MAP[typeName.toLowerCase()] || typeName;
}

function getJapaneseSuggestions(query) {
  const normalized = normalize(query);

  const championSuggestions = OFFICIAL_CHAMPIONS_PAGE_POKEMON
    .filter(({ japaneseName, englishName }) => {
      const normalizedJapanese = normalize(japaneseName);
      const normalizedEnglish = englishName ? normalize(englishName) : '';
      return normalizedJapanese.includes(normalized) || normalizedEnglish.includes(normalized);
    })
    .map(({ japaneseName, englishName }) => ({
      english: englishName && JAPANESE_NAME_MAP[englishName] === japaneseName ? englishName : undefined,
      japanese: japaneseName
    }));

  const officialEnglishNames = new Set(
    OFFICIAL_CHAMPIONS_PAGE_POKEMON
      .map(({ englishName }) => englishName)
      .filter(Boolean)
  );

  const megaSuggestions = Object.entries(JAPANESE_NAME_MAP)
    .filter(([en, jp]) => en.includes('-mega'))
    .filter(([en, jp]) => {
      const baseEnglish = en.replace(/-mega(-[xy])?$/, '');
      return officialEnglishNames.has(baseEnglish) && (normalize(jp).includes(normalized) || normalize(en).includes(normalized));
    })
    .map(([en, jp]) => ({ english: en, japanese: jp }));

  const suggestions = [...championSuggestions, ...megaSuggestions];
  const seen = new Set();
  const uniqueSuggestions = [];

  for (const suggestion of suggestions) {
    const key = suggestion.english || suggestion.japanese;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSuggestions.push(suggestion);
    }
  }

  return uniqueSuggestions.slice(0, 20);
}

/**
 * メガポケモンのベースポケモン名を取得
 */
function getBasePokemonName(pokemonName) {
  if (!pokemonName) return pokemonName;

  const normalizedName = pokemonName.toString().toLowerCase();

  // メガシンカの英語名ならベース名を取得
  if (normalizedName.includes('-mega')) {
    return normalizedName.replace(/-mega(-[xy])?$/, '');
  }

  return normalizedName;
}

module.exports = {
  translateToEnglish,
  translateToJapanese,
  translateTypeToJapanese,
  getJapaneseSuggestions,
  getBasePokemonName,
  JAPANESE_NAME_MAP,
  JAPANESE_TO_ENGLISH
};
