/**
 * NMIXX 資料檔
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 src/data/groups/_template.js
 */
export default {
  id: 'nmixx',
  order: 8,
  name: 'NMIXX',
  nameKo: '엔믹스',
  agency: 'JYP Entertainment',
  country: '韓國',
  debut: '2022.02.22',
  debutNote: '出道單曲《AD MARE》，主打歌〈O.O〉',
  fandom: 'NSWER（엔써）',
  commonsCategory: 'NMIXX', // Wikimedia Commons 上的分類名稱，抓成員照片用
  tagline: '「MIX POP」——把兩三種截然不同的曲風混進同一首歌，是 JYP 最敢玩的女團。',

  theme: { accent: '#4f8dff', accent2: '#c6f04d' },

  intro: [
    'NMIXX（엔믹스）是 JYP Entertainment 繼 ITZY 之後推出的女團，2022 年 2 月 22 日以〈O.O〉出道。團名結合代表「新組合」的 N 與「混合」的 MIX，象徵多元的個性與可能性。',
    '招牌是自創的「MIX POP」：一首歌裡突然換曲風、換節奏，一開始評價兩極，靠著紮實的現場唱功慢慢打開口碑。〈Love Me Like This〉、〈DASH〉、〈별별별（See that?）〉、〈KNOW ABOUT ME〉一路累積人氣，2025 年 10 月發行首張正規專輯《Blue Valentine》。',
    '2026 年 5 月發行迷你五輯《Heavy Serenade》，9 月在 THE FACT MUSIC AWARDS 拿下出道後第一個大賞；迷你六輯《Strange Muse》（主打〈Birthday Wish〉）預定 10 月 19 日發行。'
  ],

  facts: [
    { label: '出道日', value: '2022.02.22' },
    { label: '成員', value: '6 人' },
    { label: '官方粉絲名', value: 'NSWER' },
    { label: '所屬公司', value: 'JYP' }
  ],

  links: {
    instagram: 'https://www.instagram.com/nmixx_official/',
    youtube: 'https://www.youtube.com/@NMIXXOfficial'
  },

  members: [
    {
      id: 'lily',
      stageName: 'LILY',
      nameKo: '릴리',
      nameEn: 'Lily Jin Park',
      wiki: 'Lily (singer, born 2002)',
      birth: '2002.10.17',
      nationality: '澳洲',
      roles: ['Main Vocalist'],
      color: '#ffb3d1',
      bio: '在澳洲墨爾本長大的韓裔澳洲人，英文是母語。音域寬、爆發力強的高音是 NMIXX 現場的招牌。',
      facts: ['隊內最年長', '高音擔當', '英文母語']
    },
    {
      id: 'haewon',
      stageName: 'HAEWON',
      nameKo: '해원',
      nameEn: 'Oh Hae-won',
      birth: '2003.02.25',
      nationality: '韓國',
      roles: ['隊長', 'Main Vocalist'],
      color: '#4f8dff',
      bio: '隊長兼主唱，穩定的唱功撐起 MIX POP 的急轉彎；綜藝感也很好，上《認識的哥哥》時被誇「美聲又好笑」。',
      facts: ['隊長', 'Vocal Line', '綜藝擔當']
    },
    {
      id: 'sullyoon',
      stageName: 'SULLYOON',
      nameKo: '설윤',
      nameEn: 'Seol Yoon-a',
      birth: '2004.01.26',
      nationality: '韓國',
      roles: ['Vocalist', 'Visual'],
      color: '#9fd8ff',
      bio: '柔和的嗓音與清純形象讓她成為團內人氣擔當，2026 年拿下 THE FACT MUSIC AWARDS「My Star Award」。',
      facts: ['Visual', 'Vocal Line']
    },
    {
      id: 'bae',
      stageName: 'BAE',
      nameKo: '배이',
      nameEn: 'Bae Jin-sol',
      birth: '2004.12.28',
      nationality: '韓國',
      roles: ['Vocalist', 'Dancer'],
      color: '#b98cff',
      bio: '唱跳兼具，舞台上表情豐富，私下是個性直率的「反差萌」成員。',
      facts: ['Vocal Line', 'Dance Line']
    },
    {
      id: 'jiwoo',
      stageName: 'JIWOO',
      nameKo: '지우',
      nameEn: 'Kim Ji-woo',
      birth: '2005.04.13',
      nationality: '韓國',
      roles: ['Rapper', 'Vocalist'],
      color: '#c6f04d',
      bio: '主要負責 rap，低沉的聲線讓 MIX POP 轉場更有衝擊力，也是團內的氣氛製造機。',
      facts: ['Rap Line', '氣氛製造機']
    },
    {
      id: 'kyujin',
      stageName: 'KYUJIN',
      nameKo: '규진',
      nameEn: 'Jang Kyu-jin',
      birth: '2006.05.26',
      nationality: '韓國',
      roles: ['Main Dancer', 'Rapper', '忙內'],
      color: '#ff8a5b',
      bio: '忙內兼主舞，力道與線條俱佳，是 NMIXX 舞台表現的核心。',
      facts: ['忙內', 'Dance Leader']
    }
  ],

  videos: [
    { title: 'O.O', youtubeId: '3GWscde8rM8', date: '2022.02.22', kind: '出道曲 M/V', note: '《AD MARE》出道主打，MIX POP 的第一步。' },
    { title: 'Love Me Like This', youtubeId: 'EDnwWcFpObo', date: '2023.03.20', kind: '迷你一輯主打 M/V', note: '' },
    { title: 'DASH', youtubeId: '7UecFm_bSTU', date: '2024.01.15', kind: '迷你二輯主打 M/V', note: '《Fe3O4: BREAK》主打，人氣起飛的轉捩點。' },
    { title: '별별별 (See that?)', youtubeId: '_Q8Jskeps9w', date: '2024.08.19', kind: '迷你三輯主打 M/V', note: '' },
    { title: 'KNOW ABOUT ME', youtubeId: 'aFrQIJ5cbRc', date: '2025.03.17', kind: '迷你四輯主打 M/V', note: '' },
    { title: 'Blue Valentine', youtubeId: 'EmeW6li6bbo', date: '2025.10.13', kind: '正規一輯主打 M/V', note: '首張正規專輯同名曲。' },
    { title: 'Heavy Serenade', youtubeId: '6Ycn9qZK09I', date: '2026.05.11', kind: '迷你五輯主打 M/V', note: '' }
  ],

  variety: [
    {
      title: '海元的音色讓哥哥們都驚豔，還有滿滿綜藝感',
      youtubeId: 'n-7i6dhfpko',
      show: '認識的哥哥',
      date: '2024.05.18',
      note: 'HAEWON 精華合輯'
    },
    {
      title: '金英哲送海元小卡，被其他哥哥們吐槽',
      youtubeId: 'qd99RA0J9zc',
      show: '認識的哥哥',
      date: '2024.05.18',
      note: ''
    }
  ],

  varietyChannels: [
    'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
    'UCaKod3X1Tn4c7Ci0iUKcvzQ', // 런닝맨 SBS
    '@idolhumandocu'            // 아이돌 인간극장
  ],

  releases: [
    { date: '2022.02.22', title: 'AD MARE', type: '單曲一輯', note: '出道作，主打〈O.O〉', youtubeId: '3GWscde8rM8' },
    { date: '2023.03.20', title: 'expérgo', type: '迷你一輯', note: '主打〈Love Me Like This〉', youtubeId: 'EDnwWcFpObo' },
    { date: '2024.01.15', title: 'Fe3O4: BREAK', type: '迷你二輯', note: '主打〈DASH〉', youtubeId: '7UecFm_bSTU' },
    { date: '2024.08.19', title: 'Fe3O4: STICK OUT', type: '迷你三輯', note: '主打〈별별별 (See that?)〉', youtubeId: '_Q8Jskeps9w' },
    { date: '2025.03.17', title: 'Fe3O4: FORWARD', type: '迷你四輯', note: '主打〈KNOW ABOUT ME〉', youtubeId: 'aFrQIJ5cbRc' },
    { date: '2025.10.13', title: 'Blue Valentine', type: '正規一輯', note: '主打〈Blue Valentine〉', youtubeId: 'EmeW6li6bbo' },
    { date: '2026.05.11', title: 'Heavy Serenade', type: '迷你五輯', note: '主打〈Heavy Serenade〉', youtubeId: '6Ycn9qZK09I' }
  ]
};
