/**
 * TWS 資料檔
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 src/data/groups/_template.js
 */
export default {
  id: 'tws',
  order: 6,
  name: 'TWS',
  nameKo: '투어스',
  agency: 'PLEDIS Entertainment（HYBE）',
  country: '韓國',
  debut: '2024.01.22',
  debutNote: '出道專輯《Sparkling Blue》，主打歌〈첫 만남은 계획대로 되지 않아〉',
  fandom: '42（SAI）',
  commonsCategory: 'TWS', // Wikimedia Commons 上的分類名稱，抓成員照片用
  tagline: '團名是 "TWENTY FOUR SEVEN WITH US" 的縮寫——一天 24 小時、一週 7 天都和你在一起。',

  theme: { accent: '#3ea8ff', accent2: '#7ee0c0' },

  intro: [
    'TWS（투어스）是 HYBE 旗下 PLEDIS Entertainment 繼 SEVENTEEN 之後推出的男團，團名是 "TWENTY FOUR SEVEN WITH US" 的縮寫，意思是一天 24 小時、一週 7 天都和粉絲在一起。',
    '2024 年 1 月 22 日以《Sparkling Blue》出道，主打歌〈첫 만남은 계획대로 되지 않아（plot twist）〉以清爽的「少年感」一炮而紅，拿下多項年度新人獎；粉絲名「42」唸作「사이（SAI）」，同時代表 24/7 與韓文的「關係」。',
    '之後〈내가 S면 넌 나의 N이 되어줘〉、〈마지막 축제〉、〈마음 따라 뛰는 건 멋지지 않아?〉延續清新路線；2026 年 4 月 27 日發行迷你五輯《NO TRAGEDY》，主打歌〈널 따라가（You, You）〉。'
  ],

  facts: [
    { label: '出道日', value: '2024.01.22' },
    { label: '成員', value: '6 人' },
    { label: '官方粉絲名', value: '42（SAI）' },
    { label: '所屬公司', value: 'PLEDIS' }
  ],

  links: {
    instagram: 'https://www.instagram.com/tws_pledis/',
    youtube: 'https://www.youtube.com/@TWS_PLEDIS'
  },

  members: [
    {
      id: 'shinyu',
      stageName: 'SHINYU',
      nameKo: '신유',
      birth: '2003.11.07',
      nationality: '韓國',
      roles: ['隊長', 'Rapper'],
      color: '#3ea8ff',
      bio: '隊長，出身忠清南道禮山。帶著大哥的沉穩照顧弟弟們，舞台上負責主要的 rap 段落。',
      facts: ['隊長', '隊內最年長']
    },
    {
      id: 'dohoon',
      stageName: 'DOHOON',
      nameKo: '도훈',
      birth: '2005.01.30',
      nationality: '韓國',
      roles: ['Vocalist', 'Center'],
      color: '#7ee0c0',
      bio: '主唱之一，也常站在舞台中央，清亮的音色是 TWS「少年感」的代表聲線。',
      facts: ['Center', 'Vocal Line']
    },
    {
      id: 'youngjae',
      stageName: 'YOUNGJAE',
      nameKo: '영재',
      birth: '2005.05.31',
      nationality: '韓國',
      roles: ['Vocalist', 'Dancer'],
      color: '#ffd166',
      bio: '主唱兼舞蹈，唱跳兩頭都穩，是團內實力擔當之一。',
      facts: ['Vocal Line', 'Dance Line']
    },
    {
      id: 'hanjin',
      stageName: 'HANJIN',
      nameZh: '韓振',
      nameKo: '한진',
      nameEn: 'Han Zhen',
      birth: '2006.01.05',
      nationality: '中國',
      roles: ['Vocalist', 'Visual'],
      color: '#b28cff',
      bio: '來自中國河南新鄉，團內唯一的外籍成員，以精緻的外型與溫和的個性受到喜愛。',
      facts: ['中國籍成員', '河南新鄉出身']
    },
    {
      id: 'jihoon',
      stageName: 'JIHOON',
      nameKo: '지훈',
      birth: '2006.03.28',
      nationality: '韓國',
      roles: ['Main Dancer', 'Vocalist'],
      color: '#ff8fb1',
      bio: '主舞，動作乾淨有力，是 TWS 舞台上編舞完成度的重要支柱。',
      facts: ['主舞', 'Dance Line']
    },
    {
      id: 'kyungmin',
      stageName: 'KYUNGMIN',
      nameKo: '경민',
      birth: '2007.10.02',
      nationality: '韓國',
      roles: ['忙內', 'Vocalist'],
      color: '#ff8a3d',
      bio: '隊內忙內，活潑的個性讓他在綜藝和直播中格外討喜。',
      facts: ['忙內']
    }
  ],

  videos: [
    { title: '첫 만남은 계획대로 되지 않아 (plot twist)', youtubeId: 'hVAc1Vf2ITU', date: '2024.01.22', kind: '出道主打 M/V', note: '一炮而紅的出道曲。' },
    { title: '내가 S면 넌 나의 N이 되어줘', youtubeId: 'NRgZuuwD2WY', date: '2024.06.24', kind: '迷你二輯主打 M/V', note: '《SUMMER BEAT!》主打歌。' },
    { title: '마지막 축제 (Last Festival)', youtubeId: '-XHCYeCGlgw', date: '2024.11.25', kind: '單曲一輯主打 M/V', note: '' },
    { title: '마음 따라 뛰는 건 멋지지 않아? (Countdown!)', youtubeId: 'Csaj3X6PKxY', date: '2025.04.21', kind: '迷你三輯主打 M/V', note: '《TRY WITH US》主打歌。' },
    { title: '널 따라가 (You, You)', youtubeId: 'MiO16KlMPaU', date: '2026.04.27', kind: '迷你五輯主打 M/V', note: '《NO TRAGEDY》主打歌。' }
  ],

  variety: [
    {
      title: '回歸前的特訓！從清爽偶像變身綜藝偶像',
      youtubeId: 'SzLSF2ggMKQ',
      show: '아이돌 인간극장',
      date: '2024.06',
      note: '沒有劇本的真實紀錄型綜藝'
    }
  ],

  varietyChannels: [
    'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
    'UCaKod3X1Tn4c7Ci0iUKcvzQ', // 런닝맨 SBS
    '@idolhumandocu'            // 아이돌 인간극장
  ],

  releases: [
    { date: '2024.01.22', title: 'Sparkling Blue', type: '迷你一輯', note: '出道專輯，主打〈첫 만남은 계획대로 되지 않아〉', youtubeId: 'hVAc1Vf2ITU' },
    { date: '2024.06.24', title: 'SUMMER BEAT!', type: '迷你二輯', note: '主打〈내가 S면 넌 나의 N이 되어줘〉', youtubeId: 'NRgZuuwD2WY' },
    { date: '2024.11.25', title: 'Last Bell', type: '單曲一輯', note: '主打〈마지막 축제〉', youtubeId: '-XHCYeCGlgw' },
    { date: '2025.04.21', title: 'TRY WITH US', type: '迷你三輯', note: '主打〈마음 따라 뛰는 건 멋지지 않아?〉', youtubeId: 'Csaj3X6PKxY' },
    { date: '2026.04.27', title: 'NO TRAGEDY', type: '迷你五輯', note: '主打〈널 따라가 (You, You)〉', youtubeId: 'MiO16KlMPaU' }
  ]
};
