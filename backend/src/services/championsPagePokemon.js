const fs = require('fs');
const path = require('path');

// 日本語名から英語名へのマッピング（循環依存を避けるため直接定義）
const JAPANESE_TO_ENGLISH = {
  'ピカチュウ': 'pikachu',
  'ライチュウ': 'raichu',
  'リザードン': 'charizard',
  'リザード': 'charmeleon',
  'ヒトカゲ': 'charmander',
  'カメックス': 'blastoise',
  'カメール': 'wartortle',
  'ゼニガメ': 'squirtle',
  'フシギバナ': 'venusaur',
  'フシギソウ': 'ivysaur',
  'フシギダネ': 'bulbasaur',
  'フーディン': 'alakazam',
  'ユンゲラー': 'kadabra',
  'ケーシィ': 'abra',
  'カイリキー': 'machamp',
  'ゴーリキー': 'machoke',
  'ワンリキー': 'machop',
  'ゴローニャ': 'golem',
  'ゴローン': 'graveler',
  'イシツブテ': 'geodude',
  'ウインディ': 'arcanine',
  'ギャロップ': 'rapidash',
  'ガーディ': 'growlithe',
  'キュウコン': 'ninetales',
  'ラプラス': 'lapras',
  'テツノドクガ': 'iron-moth',
  'イダイナキバ': 'great-tusk',
  'テツノカイナ': 'iron-hands',
  'カビゴン': 'snorlax',
  'カイリュー': 'dragonite',
  "ガブリアス": "garchomp",
  "アシレーヌ": "primarina",
  "ブリジュラス": "archaludon",
  "アーマーガア": "corviknight",
  "カバルドン": "hippowdon",
  "ゲンガー": "gengar",
  "ギルガルド": "aegislash",
  "ハッサム": "scizor",
  "マスカーニャ": "meowscarada",
  "イダイトウ (オス)": "basculegion-male",
  "ドドゲザン": "kingambit",
  "ミミッキュ": "mimikyu",
  "ミミロップ": "lopunny",
  "キラフロル": "glimmora",
  "サザンドラ": "hydreigon",
  "ウォッシュロトム": "rotom-wash",
  "ルカリオ": "lucario",
  "ブラッキー": "umbreon",
  "ギャラドス": "gyarados",
  "ガルーラ": "kangaskhan",
  "マフォクシー": "delphox",
  "メガニウム": "meganium",
  "フラエッテ:永遠": "floette-eternal",
  "ゲッコウガ": "greninja",
  "ウルガモス": "volcarona",
  "オオニューラ": "sneasler",
  "ピクシー": "clefable",
  "スターミー": "starmie",
  "バンギラス": "tyranitar",
  "ニンフィア": "sylveon",
  "ヒートロトム": "rotom-heat",
  "ラウドボーン": "skeledirge",
  "ドラパルト": "dragapult",
  "ドヒドイデ": "toxapex",
  "クエスパトラ": "espathra",
  "ハラバリー": "bellibolt",
  "ペリッパー": "pelipper",
  "マリルリ": "azumarill",
  "マンムー": "mamoswine",
  "ホルード": "diggersby",
  "ソウブレイズ": "ceruledge",
  "エンペルト": "empoleon",
  "スコヴィラン": "scovillain",
  "ドリュウズ": "excadrill",
  "ユキメノコ": "froslass",
  "エアームド": "skarmory",
  "サーナイト": "gardevoir",
  "ウツボット": "victreebel",
  "キュウコン (アローラ)": "ninetales-alola",
  "ヌメルゴン (ヒスイ)": "goodra-hisui",
  "オニシズクモ": "araquanid",
  "エルフーン": "whimsicott",
  "バサギリ": "kleavor",
  "エルレイド": "gallade",
  "ゾロアーク (ヒスイ)": "zoroark-hisui",
  "ガオガエン": "incineroar",
  "ジュペッタ": "banette",
  "ヤドキング (ガラル)": "slowking-galar",
  "ミロカロス": "milotic",
  "ブリムオン": "hatterene",
  "ダイケンキ (ヒスイ)": "samurott-hisui",
  "ジャローダ": "serperior",
  "ヘラクロス": "heracross",
  "デカヌチャン": "tinkaton",
  "ローブシン": "conkeldurr",
  "グレンアルマ": "armarouge",
  "シャンデラ": "chandelure",
  "ウインディ (ヒスイ)": "arcanine-hisui",
  "メタモン": "ditto",
  "プテラ": "aerodactyl",
  "ブリガロン": "chesnaught",
  "ヤドラン": "slowbro",
  "ボスゴドラ": "aggron",
  "ミミズズ": "orthworm",
  "エレザード": "heliolisk",
  "ヤバソチャ": "sinistcha",
  "ヤミラミ": "sableye",
  "イルカマン": "palafin",
  "サメハダー": "sharpedo",
  "エーフィ": "espeon",
  "ウェーニバル": "quaquaval",
  "オーダイル": "feraligatr",
  "ドデカバシ": "toucannon",
  "ルチャブル": "hawlucha",
  "ポットデス": "polteageist",
  "スピアー": "beedrill",
  "イッカネズミ": "maushold",
  "マニューラ": "weavile",
  "ケケンカニ": "crabominable",
  "ゴウカザル": "infernape",
  "シャワーズ": "vaporeon",
  "イダイトウ (メス)": "basculegion-female",
  "ファイアロー": "talonflame",
  "カイロス": "pinsir",
  "チリーン": "chimecho",
  "ビビヨン": "vivillon",
  "バクフーン (ヒスイ)": "typhlosion-hisui",
  "キョジオーン": "garganacl",
  "ヤドラン (ガラル)": "slowbro-galar",
  "ユキノオー": "abomasnow",
  "バンバドロ": "mudsdale",
  "ライボルト": "manectric",
  "ルガルガン (たそがれ)": "lycanroc-dusk",
  "ピジョット": "pidgeot",
  "チルタリス": "altaria",
  "グライオン": "gliscor",
  "エンブオー": "emboar",
  "サンダース": "jolteon",
  "エンニュート": "salazzle",
  "ケンタロス:炎": "tauros-paldea-blaze",
  "ケンタロス:水": "tauros-paldea-aqua",
  "ケンタロス:格": "tauros-paldea-combat",
  "カットロトム": "rotom-mow",
  "ジュナイパー (ヒスイ)": "decidueye-hisui",
  "バイバニラ": "vanilluxe",
  "デンリュウ": "ampharos",
  "ドダイトス": "torterra",
  "ジャラランガ": "kommo-o",
  "デスバーン": "runerigus",
  "グレイシア": "glaceon",
  "コータス": "torkoal",
  "ワルビアル": "krookodile",
  "チャーレム": "medicham",
  "フォレトス": "forretress",
  "アマージョ": "tsareena",
  "ハガネール": "steelix",
  "ニョロトノ": "politoed",
  "デスカーン": "cofagrigus",
  "ヌメルゴン": "goodra",
  "ジジーロン": "drampa",
  "オンバーン": "noivern",
  "アリアドス": "ariados",
  "ペロリーム": "slurpuff",
  "アブソル": "absol",
  "オニゴーリ": "glalie",
  "リキキリン": "farigiraf",
  "ヤドキング": "slowking",
  "ブロスター": "clawitzer",
  "ゾロアーク": "zoroark",
  "ドサイドン": "rhyperior",
  "クレベース": "avalugg",
  "カミツオロチ": "hydrapple",
  "ミカルゲ": "spiritomb",
  "クレベース (ヒスイ)": "avalugg-hisui",
  "ロズレイド": "roserade",
  "クレッフィ": "klefki",
  "モルペコ": "morpeko",
  "ヘルガー": "houndoom",
  "ゴルーグ": "golurk",
  "サダイジャ": "sandaconda",
  "マホイップ": "alcremie",
  "ランクルス": "reuniclus"
  // 他のポケモンも追加
};

function translateToEnglish(name) {
  if (!name) return null;
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 英語名のまま入力された場合はそのまま返す
  if (JAPANESE_TO_ENGLISH[name]) {
    return JAPANESE_TO_ENGLISH[name];
  }

  // 日本語名から英語名へ変換
  const englishKey = Object.keys(JAPANESE_TO_ENGLISH).find((jpName) => jpName.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized);
  if (englishKey) {
    return JAPANESE_TO_ENGLISH[englishKey];
  }

  return normalized;
}

const dataFilePath = path.resolve(__dirname, '..', '..', 'data', 'champions-page-pokemon.json');
let rawChampionNames = [];

try {
  rawChampionNames = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
} catch (error) {
  console.error(`公式チャンピオンズページのポケモン一覧の読み込みに失敗しました: ${error.message}`);
}

const OFFICIAL_CHAMPIONS_PAGE_POKEMON = rawChampionNames.map(japaneseName => {
  const englishName = translateToEnglish(japaneseName);
  return {
    japaneseName,
    englishName,
    normalizedEnglishName: englishName ? englishName.toLowerCase() : null
  };
});

const OFFICIAL_CHAMPIONS_PAGE_NAME_SET = new Set(
  OFFICIAL_CHAMPIONS_PAGE_POKEMON
    .map(pokemon => pokemon.normalizedEnglishName || pokemon.japaneseName.toLowerCase())
);

function getOfficialChampionsPagePokemon() {
  return OFFICIAL_CHAMPIONS_PAGE_POKEMON;
}

function isOfficialChampionsPagePokemon(name) {
  if (!name) return false;
  const normalized = translateToEnglish(name).toLowerCase();
  return OFFICIAL_CHAMPIONS_PAGE_NAME_SET.has(normalized);
}

module.exports = {
  OFFICIAL_CHAMPIONS_PAGE_POKEMON,
  OFFICIAL_CHAMPIONS_PAGE_NAME_SET,
  getOfficialChampionsPagePokemon,
  isOfficialChampionsPagePokemon
};
