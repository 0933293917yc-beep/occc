import { Character, Relationship, WorldSetting, CreatorProfile } from '../types/character';

// Image paths generated from the design specification
const CHARLOTTE_AVATAR = '/src/assets/images/charlotte_avatar_1793426975684.jpg';
const CHARLOTTE_TACHIE = '/src/assets/images/charlotte_tachie_1793426976035.jpg';
const YELAN_AVATAR = '/src/assets/images/yelan_avatar_1793426978713.jpg';
const EILEEN_AVATAR = '/src/assets/images/eileen_avatar_1793426977875.jpg';
const ROY_AVATAR = '/src/assets/images/roy_avatar_1793426978487.jpg';

export const INITIAL_CREATOR_PROFILE: CreatorProfile = {
  name: '星辰繪者',
  title: '原創角色世界觀主理人',
  bio: '熱愛角色設計、世界觀建構與服裝企劃。致力於讓每位原創角色都有屬於自己的故事空間。',
  avatar: CHARLOTTE_AVATAR,
  bannerQuote: '今天也要繼續為你的角色注入靈魂嗎？'
};

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char-charlotte',
    name: '夏洛特',
    romanizedName: 'Charlotte',
    title: '星芒之詠 · 秘術研修生',
    avatar: CHARLOTTE_AVATAR,
    tachie: CHARLOTTE_TACHIE,
    tags: ['少女', '魔法', '溫柔', '古典'],
    quote: '「……沒關係的，我會一直在。」',
    age: '17歲',
    height: '162cm',
    birthday: '4月14日',
    gender: '女性',
    personality: '溫柔、堅強、有點怕生',
    background: '來自某個被遺忘的星空王國，在漂泊旅途中尋找著屬於自己的未來。擁有與古代星界共鳴的稀有天賦，身邊時常浮動著微小的星輝晶片。',
    factionId: 'faction-astral-academy',
    isFavorite: true,
    lastEdited: '10/16',
    outfits: [
      {
        id: 'outfit-char-1',
        name: '學院制服',
        type: 'casual',
        image: CHARLOTTE_TACHIE,
        paletteName: '靛白 · 星河夜藍',
        colors: ['#283556', '#FFFFFF', '#6C7EA3', '#A5B4D6'],
        keyFeatures: ['緞帶蝴蝶結', '層次百褶短裙', '學院星徽刺繡', '高筒白襪與皮質長靴'],
        notes: '艾斯特拉皇家學院的高階魔法研究制服，便於攜帶厚重的星象手札與法器。',
        seasonOrOccasion: '常規授課 / 魔法實習'
      },
      {
        id: 'outfit-char-2',
        name: '星輝日常洋裝',
        type: 'casual',
        image: CHARLOTTE_AVATAR,
        paletteName: '冰晶藍 · 雲柔白',
        colors: ['#E0E7FF', '#F8FAFC', '#93C5FD', '#FDE047'],
        keyFeatures: ['蕾絲荷葉邊', '水滴水晶胸針', '束腰緞帶', '蓬鬆泡泡袖'],
        notes: '休假時漫步城鎮或市集時常穿的私服，輕盈柔軟且易於活動。',
        seasonOrOccasion: '週末休閒 / 圖書館'
      },
      {
        id: 'outfit-char-3',
        name: '秘境調查戰鬥裝',
        type: 'combat',
        image: CHARLOTTE_TACHIE,
        paletteName: '深海夜藍 · 符文銀',
        colors: ['#1E293B', '#38BDF8', '#E2E8F0', '#475569'],
        keyFeatures: ['附魔護腕', '抗魔短披風', '法杖束帶', '輕量化防護皮甲'],
        notes: '深入古代遺跡或異常魔力空洞時的特裝配備，具備抵禦環境侵蝕的高階咒文。',
        seasonOrOccasion: '遺跡探索 / 戰鬥任務'
      },
      {
        id: 'outfit-char-4',
        name: '星宴盛典禮服',
        type: 'ceremonial',
        image: CHARLOTTE_AVATAR,
        paletteName: '星曜紫 · 珍珠粉',
        colors: ['#4C1D95', '#F5D0FE', '#DDD6FE', '#FBBF24'],
        keyFeatures: ['漸層拖尾長裙', '星之寶冠', '金絲刺繡絲帶', '露肩古典剪裁'],
        notes: '一年一度觀星盛典時所穿著的正統儀式禮服，整件衣料在月光下會微光閃爍。',
        seasonOrOccasion: '觀星慶典 / 皇室宮廷晚宴'
      }
    ],
    artworks: [
      {
        id: 'art-char-1',
        title: '星空下的低語',
        image: CHARLOTTE_AVATAR,
        category: 'illustration',
        date: '2026-09-12',
        caption: '夏洛特在天文台眺望遠方浮空島的速寫。'
      },
      {
        id: 'art-char-2',
        title: '初入學院的午後',
        image: CHARLOTTE_TACHIE,
        category: 'concept',
        date: '2026-08-30',
        caption: '夏洛特第一天拿到學院制服時的角色概念設定立繪。'
      }
    ]
  },
  {
    id: 'char-yelan',
    name: '夜嵐',
    romanizedName: 'Yelan',
    title: '夜巡之刃 · 深淵調查部員',
    avatar: YELAN_AVATAR,
    tachie: YELAN_AVATAR,
    tags: ['御姐', '刺客', '沉著', '暗夜'],
    quote: '「夜色會抹平所有痕跡，包括我的猶豫。」',
    age: '20歲',
    height: '169cm',
    birthday: '11月03日',
    gender: '女性',
    personality: '冷靜理性、寡言敏銳、重情義',
    background: '隱藏於繁華都市陰影中的深淵調查專家。雖然平時神情嚴肅，但在關鍵時刻總能第一時間守護夥伴。與夏洛特在一場遺跡突發事件中結下不解之緣。',
    factionId: 'faction-abyss-investigators',
    isFavorite: true,
    lastEdited: '10/14',
    outfits: [
      {
        id: 'outfit-yelan-1',
        name: '夜行風衣戰鬥服',
        type: 'combat',
        image: YELAN_AVATAR,
        paletteName: '深邃夜藍 · 鋼鐵灰',
        colors: ['#0F172A', '#1E3A8A', '#94A3B8', '#38BDF8'],
        keyFeatures: ['銀質搭扣長風衣', '隱藏暗袋', '緊身皮褲', '露指戰術手套'],
        notes: '專門為了夜間潜伏與快速突襲量身剪裁，材質經過特殊消音處理。',
        seasonOrOccasion: '夜間巡視 / 機密調查'
      },
      {
        id: 'outfit-yelan-2',
        name: '便服長版針織衫',
        type: 'casual',
        image: YELAN_AVATAR,
        paletteName: '炭灰 · 霧藍',
        colors: ['#334155', '#64748B', '#CBD5E1'],
        keyFeatures: ['高領針織', '銀色流蘇耳飾', '修身休閒長褲'],
        notes: '平日在酒館蒐集情報時的低調裝束。',
        seasonOrOccasion: '休假日常 / 情報蒐集'
      }
    ],
    artworks: [
      {
        id: 'art-yelan-1',
        title: '雨夜都市的視線',
        image: YELAN_AVATAR,
        category: 'illustration',
        date: '2026-10-02',
        caption: '在霓虹倒映的街道上回眸的夜嵐。'
      }
    ]
  },
  {
    id: 'char-eileen',
    name: '艾琳',
    romanizedName: 'Eileen',
    title: '智慧金瞳 · 圖書館司書',
    avatar: EILEEN_AVATAR,
    tachie: EILEEN_AVATAR,
    tags: ['學者', '溫暖', '開朗', '博學'],
    quote: '「每一本古籍裡，都藏著星星的低語。」',
    age: '18歲',
    height: '158cm',
    birthday: '6月21日',
    gender: '女性',
    personality: '開朗熱情、充滿好奇心、善於傾聽',
    background: '皇家中央大圖書館最年輕的副司書，夏洛特的摯友。對於古代失落文字與星象符號有著驚人的記憶力，是整個團隊的知識智囊。',
    factionId: 'faction-astral-academy',
    isFavorite: true,
    lastEdited: '10/11',
    outfits: [
      {
        id: 'outfit-eileen-1',
        name: '司書長袍日常服',
        type: 'casual',
        image: EILEEN_AVATAR,
        paletteName: '書頁暖杏 · 金羽青',
        colors: ['#FFFBEB', '#1E293B', '#10B981', '#F59E0B'],
        keyFeatures: ['金羽胸針', '褶皺花邊襯衫', '雙排扣背心', '羊毛長披巾'],
        notes: '大圖書館配給司書的制式常服，溫暖舒適，適合長時間翻閱書籍。',
        seasonOrOccasion: '圖書館整理 / 文獻考證'
      }
    ],
    artworks: [
      {
        id: 'art-eileen-1',
        title: '在書堆中的午後陽光',
        image: EILEEN_AVATAR,
        category: 'illustration',
        date: '2026-09-28',
        caption: '陽光穿透高聳的彩繪玻璃窗，照在專注讀書的艾琳身上。'
      }
    ]
  },
  {
    id: 'char-roy',
    name: '羅仔',
    romanizedName: 'Roy',
    title: '荒野尋跡者 · 冒險家獵手',
    avatar: ROY_AVATAR,
    tachie: ROY_AVATAR,
    tags: ['少年', '冒險家', '活力', '荒野'],
    quote: '「指南針壞了？太棒了，這代表我們走在沒人去過的路！」',
    age: '17歲',
    height: '168cm',
    birthday: '8月09日',
    gender: '男性',
    personality: '開朗樂天、行動派、粗中有細',
    background: '巡林獵手同盟的新星，精通地貌辨識與野生動物溝通。戴著一頂插有飛鳥羽毛的寬沿帽，腰間總是掛著各種工具與自製的小道具。',
    factionId: 'faction-ranger-alliance',
    isFavorite: true,
    lastEdited: '10/08',
    outfits: [
      {
        id: 'outfit-roy-1',
        name: '荒野探險便服',
        type: 'casual',
        image: ROY_AVATAR,
        paletteName: '大地棕 · 叢林綠',
        colors: ['#78350F', '#FEF3C7', '#15803D', '#451A03'],
        keyFeatures: ['羽毛寬沿獵人帽', '多口袋機能背心', '厚帆布後背包', '耐磨工裝靴'],
        notes: '為了在密林與荒野長時間跋涉設計的服飾，具備防水防刮特點。',
        seasonOrOccasion: '荒野探險 / 扎營野宿'
      }
    ],
    artworks: [
      {
        id: 'art-roy-1',
        title: '翻越高原的晨風',
        image: ROY_AVATAR,
        category: 'illustration',
        date: '2026-09-15',
        caption: '站在山崖頂端回頭向夥伴揮手大笑的羅仔。'
      }
    ]
  }
];

export const INITIAL_RELATIONSHIPS: Relationship[] = [
  {
    id: 'rel-1',
    sourceId: 'char-charlotte',
    targetId: 'char-yelan',
    label: '守護與信賴',
    description: '在一次古代空洞爆發中，夜嵐救下了陷入魔力失控的夏洛特；夏洛特則為夜嵐解開了童年的心結。',
    type: 'positive'
  },
  {
    id: 'rel-2',
    sourceId: 'char-charlotte',
    targetId: 'char-eileen',
    label: '摯友 · 研讀夥伴',
    description: '兩人自入學起便經常在圖書館共同研究古代文獻，夏洛特總能為艾琳解讀失落的星象符文。',
    type: 'positive'
  },
  {
    id: 'rel-3',
    sourceId: 'char-charlotte',
    targetId: 'char-roy',
    label: '旅途嚮導',
    description: '羅仔是帶領夏洛特踏上大陸探尋遺忘王國線索的第一位嚮導，個性互補卻極具默契。',
    type: 'positive'
  },
  {
    id: 'rel-4',
    sourceId: 'char-yelan',
    targetId: 'char-roy',
    label: '情報交流 · 拌嘴搭檔',
    description: '一個嚴謹暗殺調查，一個隨性野性冒險，碰面時常常鬥嘴，但在行動中總是互相照應後背。',
    type: 'neutral'
  },
  {
    id: 'rel-5',
    sourceId: 'char-eileen',
    targetId: 'char-roy',
    label: '委託人與記錄者',
    description: '艾琳時常委託羅仔在野外採集稀有的古代植物標本與礦石供學術記錄。',
    type: 'positive'
  }
];

export const INITIAL_WORLD_SETTING: WorldSetting = {
  title: '艾斯特拉大陸 (Aetheria)',
  subtitle: '星穹與齒輪交織的魔法科技文明',
  overview: '這是一個魔法與科技共存的世界。在表面的繁榮與和平之下，隱藏著千年前「星之王國」墜落的未解之謎。浮空群島在雲海之上漂浮，地面聯邦則依靠古代星核能量運轉。不同陣營為了探求失落的核心技術與真相展開博弈。',
  magicSystem: '「星蝕與共鳴體系」：每個人體內皆蘊含微弱星輝，少數具備高共鳴天賦者可引導星象符文，轉化為守護、治癒或攻擊魔力。科技工坊則研製出能儲存星核能量的魔導迴路。',
  geography: '包含高聳的中央王都「阿斯托利亞」、雲霧繚繞的「浮空聖域」、繁華霓虹交錯的「深淵地下城」，以及廣袤無垠的「翡翠原始荒原」。',
  factions: [
    {
      id: 'faction-astral-academy',
      name: '皇家星象學院',
      englishName: 'Royal Astral Academy',
      emblem: '✦',
      color: '#6366F1',
      description: '大陸最古老的學術殿堂，致力於研究古代星辰軌跡與失落文明哲學。守護著中央大圖書館的無數機密手稿。',
      baseLocation: '王都 · 晴空塔'
    },
    {
      id: 'faction-abyss-investigators',
      name: '深淵調查團',
      englishName: 'Abyss Survey Corps',
      emblem: '◈',
      color: '#0EA5E9',
      description: '游走於暗夜與地下遺跡中的精英調查組織，專門防範異常魔力侵蝕與古代機械失控。',
      baseLocation: '地下城 · 靜音港'
    },
    {
      id: 'faction-ranger-alliance',
      name: '巡林獵手同盟',
      englishName: 'Ranger Alliance',
      emblem: '▲',
      color: '#10B981',
      description: '由野外嚮導、獵手與冒險者組成的自由同盟，熟悉整片大陸的地貌與生態，熱愛自由。',
      baseLocation: '翡翠之森 · 風笛驛站'
    }
  ],
  timeline: [
    {
      id: 'event-1',
      year: '曆法前 320 年',
      title: '天穹之梯墜落',
      description: '傳說中連接大地與神殿的浮空天梯解體，星之核心碎片散落整座大陸，古代王國沉入歷史迷霧。',
      category: '大災變',
      involvedCharacterIds: ['char-charlotte']
    },
    {
      id: 'event-2',
      year: '光輝曆 742 年',
      title: '皇家星象學院建立',
      description: '首任大導師整合星界咒文體系，建立了庇護各族魔法研究者的學院，並設立中央大圖書館。',
      category: '文明開端',
      involvedCharacterIds: ['char-eileen']
    },
    {
      id: 'event-3',
      year: '光輝曆 918 年',
      title: '深淵裂隙第一次共鳴',
      description: '地下城深處魔力劇烈湧動，深淵調查團應運而生，確立了夜巡者的隱秘守則。',
      category: '陣營歷史',
      involvedCharacterIds: ['char-yelan']
    },
    {
      id: 'event-4',
      year: '現行曆 935 年（當前）',
      title: '星辰命定之邂逅',
      description: '夏洛特攜帶失落王國的徽章踏入王都，與夜嵐、艾琳、羅仔相遇，命運的齒輪再度轉動。',
      category: '當前事件',
      involvedCharacterIds: ['char-charlotte', 'char-yelan', 'char-eileen', 'char-roy']
    }
  ]
};
