/**
 * aespa 資料檔
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 src/data/groups/_template.js
 */
export default {
  id: 'aespa',
  order: 4,
  name: 'aespa',
  nameKo: '에스파',
  agency: 'SM Entertainment',
  country: '韓國',
  debut: '2020.11.17',
  debutNote: '出道單曲《Black Mamba》',
  fandom: 'MY',
  tagline: '團名結合 "æ"（avatar × experience）與 aspect，四名成員各自對應一位虛擬分身。',

  theme: { accent: '#00e5ff', accent2: '#7c4dff' },

  intro: [
    'aespa（에스파）是 SM Entertainment 於 2020 年推出的四人女團，團名由代表虛擬化身的「æ」與意為「兩面」的 aspect 組合而成，每位成員都有一位對應的虛擬分身 ae，構成貫穿作品的世界觀。',
    '2020 年 11 月 17 日以〈Black Mamba〉出道，隔年〈Next Level〉與〈Savage〉成為現象級熱曲；2024 年〈Supernova〉、〈Armageddon〉、〈Whiplash〉連續大獲成功，鞏固頂級女團地位。',
    '2026 年 5 月 29 日發行第二張正規專輯《LEMONADE》，先行曲〈WDA (Whole Different Animal)〉找來 BIGBANG 的 G-DRAGON 合作。'
  ],

  facts: [
    { label: '出道日', value: '2020.11.17' },
    { label: '成員', value: '4 人' },
    { label: '官方粉絲名', value: 'MY' },
    { label: '所屬公司', value: 'SM Entertainment' }
  ],

  links: {
    instagram: 'https://www.instagram.com/aespa_official/',
    youtube: 'https://www.youtube.com/@aespa'
  },

  members: [
    {
      id: 'karina',
      stageName: 'KARINA',
      nameZh: '劉知敏',
      nameKo: '카리나',
      nameEn: 'Yu Jimin',
      birth: '2000.04.11',
      nationality: '韓國',
      roles: ['隊長', 'Dancer', 'Rapper'],
      color: '#00e5ff',
      bio: '隊長，兼具舞蹈與 rap 的全能型成員，未來感十足的形象是 aespa 世界觀的核心印象。',
      facts: ['隊長', '隊內最年長']
    },
    {
      id: 'giselle',
      stageName: 'GISELLE',
      nameZh: '吉賽兒',
      nameKo: '지젤',
      nameEn: 'Uchinaga Aeri',
      birth: '2000.10.30',
      nationality: '日本',
      roles: ['Rapper', 'Vocalist'],
      color: '#ff5fd2',
      bio: '日韓混血，能說日、韓、英三語，慵懶質感的 rap 是團體歌曲的重要色彩。',
      facts: ['日本籍成員', '三語能力']
    },
    {
      id: 'winter',
      stageName: 'WINTER',
      nameZh: '金旼炡',
      nameKo: '윈터',
      nameEn: 'Kim Minjeong',
      birth: '2001.01.01',
      nationality: '韓國',
      roles: ['Main Vocalist', 'Dancer'],
      color: '#7c4dff',
      bio: '主唱兼舞蹈擔當，能一邊高強度跳舞一邊穩定演唱，現場實力備受肯定。',
      facts: ['主唱', '現場穩定度高']
    },
    {
      id: 'ningning',
      stageName: 'NINGNING',
      nameZh: '寧藝卓',
      nameKo: '닝닝',
      nameEn: 'Ning Yizhuo',
      birth: '2002.10.23',
      nationality: '中國',
      roles: ['忙內', 'Main Vocalist'],
      color: '#3ddc97',
      bio: '隊內忙內與主唱，厚實的音色與爆發力，常負責歌曲的最高音段落。',
      facts: ['忙內', '中國籍成員']
    }
  ],

  videos: [
    { title: 'Supernova', youtubeId: 'phuiiNCxRMg', date: '2024.05.13', kind: '正規一輯先行曲 M/V', note: '2024 年最具代表性的韓語歌曲之一。' },
    { title: 'Next Level', youtubeId: '4TWR90KJl84', date: '2021.05.17', kind: '單曲 M/V', note: '讓 aespa 一舉成名的現象級熱曲。' },
    { title: 'Savage', youtubeId: 'WPdWvnAAurg', date: '2021.10.05', kind: '迷你一輯主打 M/V', note: '' },
    { title: 'Armageddon', youtubeId: 'nFYwcndNuOY', date: '2024.05.27', kind: '正規一輯主打 M/V', note: '' },
    { title: 'Whiplash', youtubeId: 'jWQx2f-CErU', date: '2024.10.21', kind: '迷你五輯主打 M/V', note: '' },
    { title: 'Black Mamba', youtubeId: 'i0_gM5bifeo', date: '2020.11.17', kind: '出道曲 M/V', note: '出道曲，aespa 世界觀的起點。' },
    { title: 'WDA (Whole Different Animal) feat. G-DRAGON', youtubeId: 'iTJSbJtS8MU', date: '2026.05.11', kind: '正規二輯先行曲 M/V', note: '與 BIGBANG G-DRAGON 合作。' },
    { title: 'LEMONADE', youtubeId: '83C3TZ4Zm_o', date: '2026.05.29', kind: '正規二輯主打 M/V', note: '' },
    { title: 'Dirty Work', youtubeId: 'M2WTUoy4y6E', date: '2025.06.27', kind: '單曲 M/V', note: '' }
  ],

  variety: [
    {
      title: '「其實我跟 OO 有點尷尬」真心話大冒險',
      youtubeId: 'EbOspOKYk5s',
      show: '아이돌 인간극장',
      date: '',
      note: '沒有劇本的真實紀錄型綜藝'
    },
    {
      title: '〈I’m〉開頭是 KARINA，〈Drama〉換 WINTER 負責',
      youtubeId: 'DutiwizDLaY',
      show: '아는 형님 410회',
      date: '2023.11.25',
      note: ''
    },
    {
      title: 'KARINA 的《頂樓》千瑞真模仿秀',
      youtubeId: '0Xav2_Lk8R4',
      show: '아는 형님 283회',
      date: '2021.06.05',
      note: '出道初期的個人才藝'
    }
  ],
  varietyChannels: [
    'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
    'UCaKod3X1Tn4c7Ci0iUKcvzQ', // 런닝맨 SBS
    '@idolhumandocu'            // 아이돌 인간극장
  ],

  releases: [
    { date: '2020.11.17', title: 'Black Mamba', type: '出道單曲', note: '出道曲', youtubeId: 'i0_gM5bifeo' },
    { date: '2021.10.05', title: 'Savage', type: '迷你一輯', note: '主打〈Savage〉', youtubeId: 'WPdWvnAAurg' },
    { date: '2024.05.27', title: 'Armageddon', type: '正規一輯', note: '主打〈Armageddon〉，先行曲〈Supernova〉', youtubeId: 'nFYwcndNuOY' },
    { date: '2024.10.21', title: 'Whiplash', type: '迷你五輯', note: '主打〈Whiplash〉', youtubeId: 'jWQx2f-CErU' },
    { date: '2025.09.05', title: 'Rich Man', type: '迷你六輯', note: '主打〈Rich Man〉' },
    { date: '2026.05.29', title: 'LEMONADE', type: '正規二輯', note: '主打〈LEMONADE〉，先行曲〈WDA〉feat. G-DRAGON', youtubeId: '83C3TZ4Zm_o' }
  ]
};
