/**
 * ATEEZ 資料檔
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 src/data/groups/_template.js
 */
export default {
  id: 'ateez',
  order: 11,
  name: 'ATEEZ',
  nameKo: '에이티즈',
  agency: 'KQ Entertainment',
  country: '韓國',
  debut: '2018.10.24',
  debutNote: '出道專輯《TREASURE EP.1 : All To Zero》，主打歌〈Pirate King〉',
  fandom: 'ATINY（에이티니）',
  commonsCategory: 'Ateez',
  // MV 放在 KQ ENTERTAINMENT 頻道（和同公司其他團體共用），每日更新時只收標題有 ATEEZ 的影片
  mvChannel: 'UCQdq-lqPEq_yZ_wP_kuVB9Q',
  sharedChannel: true,
  tagline: '「舞台上的海盜」——以爆發力十足的表演征服全球的八人男團。',

  theme: { accent: '#ff8a1f', accent2: '#ffd166' },

  intro: [
    'ATEEZ（에이티즈）是 KQ Entertainment 推出的八人男團，團名是 "A TEEnager Z" 的縮寫，意思是「從 A 到 Z，包含所有青春的樣貌」。2018 年 10 月 24 日出道，以「海盜」世界觀與高強度的表演打響名號。',
    '〈WONDERLAND〉、〈BOUNCY (K-HOT CHILLI PEPPERS)〉、〈WORK〉、〈Ice On My Teeth〉等歌曲讓他們在海外人氣飆升，多次拿下美國 Billboard 200 專輯榜冠軍，也站上 Coachella 舞台，是第四代男團中全球巡演最強的團體之一。',
    '2026 年接連發行《GOLDEN HOUR : Part.4》（主打〈Adrenaline〉）與 6 月的《GOLDEN HOUR : Part.5》（主打〈BAD〉）。'
  ],

  facts: [
    { label: '出道日', value: '2018.10.24' },
    { label: '成員', value: '8 人' },
    { label: '官方粉絲名', value: 'ATINY' },
    { label: '所屬公司', value: 'KQ Entertainment' }
  ],

  links: {
    instagram: 'https://www.instagram.com/ateez_official_/',
    youtube: 'https://www.youtube.com/@ATEEZofficial'
  },

  members: [
    {
      id: 'hongjoong', stageName: 'HONGJOONG', nameKo: '홍중', nameEn: 'Kim Hong-joong', wiki: 'Hongjoong',
      birth: '1998.11.07', nationality: '韓國', roles: ['隊長', 'Rapper', '製作'], color: '#ff8a1f',
      bio: '隊長兼主 Rapper，也參與大部分歌曲的作詞作曲，是 ATEEZ 音樂方向的核心。', facts: ['隊長', '作詞作曲']
    },
    {
      id: 'seonghwa', stageName: 'SEONGHWA', nameKo: '성화', nameEn: 'Park Seong-hwa',
      birth: '1998.04.03', nationality: '韓國', roles: ['Vocalist', 'Performance'], color: '#b48cff',
      bio: '隊內最年長，舞台上的表情與線條細膩，私下是照顧大家的「媽媽」角色。', facts: ['隊內最年長']
    },
    {
      id: 'yunho', stageName: 'YUNHO', nameKo: '윤호', nameEn: 'Jeong Yun-ho', wiki: 'Jeong Yun-ho',
      birth: '1999.03.23', nationality: '韓國', roles: ['Main Dancer', 'Vocalist'], color: '#4fc3ff',
      bio: '主舞之一，長手長腳讓動作特別有張力；也曾參與戲劇演出。', facts: ['Dance Line', '演員']
    },
    {
      id: 'yeosang', stageName: 'YEOSANG', nameKo: '여상', nameEn: 'Kang Yeo-sang',
      birth: '1999.06.15', nationality: '韓國', roles: ['Vocalist', 'Dancer', 'Visual'], color: '#8fe3c4',
      bio: '安靜細膩的歌聲搭配精準的舞蹈，被粉絲稱為 ATEEZ 的門面之一。', facts: ['Visual']
    },
    {
      id: 'san', stageName: 'SAN', nameKo: '산', nameEn: 'Choi San', wiki: 'San (singer)',
      birth: '1999.07.10', nationality: '韓國', roles: ['Main Vocalist', 'Performance'], color: '#ff5d6c',
      bio: '主唱之一，舞台上的眼神與爆發力極具代表性，也常上綜藝節目。', facts: ['舞台魅力', '《Running Man》']
    },
    {
      id: 'mingi', stageName: 'MINGI', nameKo: '민기', nameEn: 'Song Min-gi',
      birth: '1999.08.09', nationality: '韓國', roles: ['Main Rapper'], color: '#ffd166',
      bio: '低沉厚實的嗓音是招牌，饒舌段落總能把歌曲推向高潮。', facts: ['Rap Line']
    },
    {
      id: 'wooyoung', stageName: 'WOOYOUNG', nameKo: '우영', nameEn: 'Jung Woo-young',
      birth: '1999.11.26', nationality: '韓國', roles: ['Main Dancer', 'Vocalist'], color: '#ff9ecf',
      bio: '主舞，舞蹈力道與細節兼具，個性活潑，是團內的開心果。', facts: ['Dance Line', '開心果']
    },
    {
      id: 'jongho', stageName: 'JONGHO', nameKo: '종호', nameEn: 'Choi Jong-ho',
      birth: '2000.10.12', nationality: '韓國', roles: ['Main Vocalist', '忙內'], color: '#7aa2ff',
      bio: '忙內兼主唱，穩定又有穿透力的高音是 ATEEZ 現場的定心丸。', facts: ['忙內', '高音擔當']
    }
  ],

  videos: [
    { title: 'WONDERLAND', youtubeId: 'Z_BhMhZpAug', date: '2019.10.08', kind: 'M/V', note: '奠定「海盜」形象的代表作。' },
    { title: 'BOUNCY (K-HOT CHILLI PEPPERS)', youtubeId: 'U0G5OA6ZH5w', date: '2023.06.16', kind: 'M/V', note: '' },
    { title: 'WORK', youtubeId: 'VGnOpZhsPk4', date: '2024.05.31', kind: 'M/V', note: '' },
    { title: 'Ice On My Teeth', youtubeId: '5OflOlcHLb8', date: '2024.11.15', kind: 'M/V', note: '' },
    { title: 'Lemon Drop', youtubeId: 'H4H99b1CjPU', date: '2025.06.13', kind: 'M/V', note: '' },
    { title: 'Adrenaline', youtubeId: 'vqkfEUqjl6Y', date: '2026.02.06', kind: 'M/V', note: '' },
    { title: 'BAD', youtubeId: '-q_S27LbNKU', date: '2026.06.26', kind: 'M/V', note: '' }
  ],

  variety: [
    {
      title: '身體搞笑天分爆發的 SAN',
      youtubeId: 'PQQZYDRzwpI',
      show: 'Running Man',
      date: '',
      note: 'SAN 與韓志恩一起出演'
    }
  ],

  varietyChannels: [
    'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
    'UCaKod3X1Tn4c7Ci0iUKcvzQ', // 런닝맨 SBS
    '@idolhumandocu'            // 아이돌 인간극장
  ],

  releases: [
    { date: '2023.06.16', title: 'THE WORLD EP.2 : OUTLAW', type: '迷你專輯', note: '主打〈BOUNCY (K-HOT CHILLI PEPPERS)〉', youtubeId: 'U0G5OA6ZH5w' },
    { date: '2024.05.31', title: 'GOLDEN HOUR : Part.1', type: '迷你十輯', note: '主打〈WORK〉', youtubeId: 'VGnOpZhsPk4' },
    { date: '2024.11.15', title: 'GOLDEN HOUR : Part.2', type: '迷你十一輯', note: '主打〈Ice On My Teeth〉', youtubeId: '5OflOlcHLb8' },
    { date: '2025.06.13', title: 'GOLDEN HOUR : Part.3', type: '迷你十二輯', note: '主打〈Lemon Drop〉', youtubeId: 'H4H99b1CjPU' },
    { date: '2026.02.06', title: 'GOLDEN HOUR : Part.4', type: '迷你十三輯', note: '主打〈Adrenaline〉', youtubeId: 'vqkfEUqjl6Y' },
    { date: '2026.06.26', title: 'GOLDEN HOUR : Part.5', type: '迷你十四輯', note: '主打〈BAD〉', youtubeId: '-q_S27LbNKU' }
  ]
};
