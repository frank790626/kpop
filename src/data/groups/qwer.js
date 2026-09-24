/**
 * QWER 資料檔（女子樂團）
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 src/data/groups/_template.js
 */
export default {
  id: 'qwer',
  order: 10,
  name: 'QWER',
  nameKo: '큐더블유이알',
  agency: 'Tamago Production',
  country: '韓國',
  debut: '2023.10.18',
  debutNote: '出道單曲《Harmony from Discord》，主打歌〈Discord〉',
  fandom: '',
  commonsCategory: 'QWER',
  tagline: '自己彈、自己唱的四人女子樂團，用清爽的搖滾樂團聲響打進排行榜。',

  theme: { accent: '#ff6fae', accent2: '#7cc8ff' },

  intro: [
    'QWER 是 Tamago Production 推出的四人女子樂團，由鼓手兼隊長 CHODAN、貝斯手 MAGENTA、吉他／鍵盤 HINA 與主唱兼吉他 SIYEON 組成，團名取自四位成員的代表字母。2023 年 10 月 18 日以單曲〈Discord〉出道。',
    '2024 年迷你一輯主打〈고민중독（T.B.H）〉在音源榜長紅，讓「偶像樂團」這個路線一炮而紅；之後〈내 이름 맑음〉在音樂節目拿下多冠，2025 年〈Dear（눈물참기）〉由全員參與製作。',
    '2026 年 4 月 27 日發行迷你四輯《CEREMONY》，並完成首次世界巡演「ROCKATION」；7 月也登上台北 ACON 2026 舞台。'
  ],

  facts: [
    { label: '出道日', value: '2023.10.18' },
    { label: '成員', value: '4 人' },
    { label: '類型', value: '女子樂團' },
    { label: '所屬公司', value: 'Tamago Production' }
  ],

  links: {
    instagram: 'https://www.instagram.com/qwerband_official/',
    youtube: 'https://www.youtube.com/@QWER_Band_official'
  },

  members: [
    {
      id: 'chodan',
      stageName: 'CHODAN',
      nameKo: '쵸단',
      nameEn: 'Hong Ji-hye',
      birth: '1998.11.01',
      nationality: '韓國',
      roles: ['隊長', '鼓手'],
      color: '#ff6fae',
      bio: '隊長兼鼓手，舞台上打鼓時的笑容是招牌，也負責帶動全團的氣氛。',
      facts: ['隊長', 'Drums']
    },
    {
      id: 'magenta',
      stageName: 'MAGENTA',
      nameKo: '마젠타',
      birth: '1997.06.02',
      nationality: '韓國',
      roles: ['貝斯手'],
      color: '#c86bff',
      bio: '貝斯手，穩穩撐住 QWER 的節奏，現場搖頭甩髮的舞台魅力十足。',
      facts: ['Bass', '隊內最年長']
    },
    {
      id: 'hina',
      stageName: 'HINA',
      nameKo: '히나',
      nameEn: 'Jang Na-young',
      birth: '2001.01.30',
      nationality: '韓國',
      roles: ['吉他', '鍵盤', '忙內'],
      color: '#7cc8ff',
      bio: '忙內，負責吉他與鍵盤，清亮的和聲讓樂團的聲音更飽滿。',
      facts: ['忙內', 'Guitar / Keyboard']
    },
    {
      id: 'siyeon',
      stageName: 'SIYEON',
      nameKo: '시연',
      nameEn: 'Lee Si-yeon',
      birth: '2000.05.16',
      nationality: '韓國',
      roles: ['主唱', '吉他'],
      color: '#ffcf5c',
      bio: '主唱兼吉他手，爆發力十足的高音是 QWER 歌曲的核心。',
      facts: ['Main Vocal', 'Guitar']
    }
  ],

  videos: [
    { title: 'Discord（디스코드）', youtubeId: 'WGm2HmXeeRI', date: '2023.10.18', kind: '出道曲 M/V', note: '' },
    { title: '고민중독（T.B.H）', youtubeId: 'ImuWa3SJulY', date: '2024.04.01', kind: '迷你一輯主打 M/V', note: '讓 QWER 爆紅的代表作。' },
    { title: '내 이름 맑음', youtubeId: 'AlirzLFEHUI', date: '2024.09.23', kind: '迷你二輯主打 M/V', note: '' },
    { title: 'Dear（눈물참기）', youtubeId: 'pifz9JH1Re8', date: '2025.06.09', kind: '迷你三輯主打 M/V', note: '全員參與製作。' },
    { title: 'CEREMONY', youtubeId: 'A8d2Gx91zwk', date: '2026.04.27', kind: '迷你四輯主打 M/V', note: '' }
  ],

  variety: [],

  varietyChannels: [
    'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
    'UCaKod3X1Tn4c7Ci0iUKcvzQ', // 런닝맨 SBS
    '@idolhumandocu'            // 아이돌 인간극장
  ],

  releases: [
    { date: '2023.10.18', title: 'Harmony from Discord', type: '單曲一輯', note: '出道作，主打〈Discord〉', youtubeId: 'WGm2HmXeeRI' },
    { date: '2024.04.01', title: 'MANITO', type: '迷你一輯', note: '主打〈고민중독〉', youtubeId: 'ImuWa3SJulY' },
    { date: '2024.09.23', title: "Algorithm's Blossom", type: '迷你二輯', note: '主打〈내 이름 맑음〉', youtubeId: 'AlirzLFEHUI' },
    { date: '2025.06.09', title: '난 네 편이야, 온 세상이 불협일지라도', type: '迷你三輯', note: '主打〈Dear（눈물참기）〉', youtubeId: 'pifz9JH1Re8' },
    { date: '2026.04.27', title: 'CEREMONY', type: '迷你四輯', note: '主打〈CEREMONY〉', youtubeId: 'A8d2Gx91zwk' }
  ]
};
