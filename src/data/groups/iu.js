/**
 * IU 資料檔（個人歌手）
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 src/data/groups/_template.js
 */
export default {
  id: 'iu',
  order: 2,
  type: 'solo', // 個人歌手：成員區改為單人版面
  name: 'IU',
  nameKo: '아이유',
  nameZh: '李知恩',
  agency: 'EDAM Entertainment',
  country: '韓國',
  debut: '2008.09.18',
  debutNote: '出道專輯《Lost and Found》，出道曲〈미아（Lost Child）〉',
  fandom: 'UAENA（유애나）',
  commonsCategory: 'IU (singer)', // Wikimedia Commons 上的分類名稱，抓照片用
  tagline: '韓國的「國民妹妹」，也是作詞作曲、演戲都一流的全方位藝人。',

  theme: { accent: '#b98cff', accent2: '#ff9ec7' },

  intro: [
    'IU（아이유，本名李知恩）是韓國最具代表性的個人歌手之一，2008 年 15 歲出道。藝名取自「I（我）＋ You（你）」，意思是透過音樂讓我和你合而為一。',
    '2010 年〈좋은 날（Good Day）〉的「三段高音」讓她一夕爆紅，被稱為「國民妹妹」；之後逐漸轉型為自己作詞作曲的創作歌手，〈Palette〉、〈Blueming〉、〈LILAC〉、〈strawberry moon〉等歌曲長年霸榜。',
    '演員身分同樣亮眼，主演《我的大叔》、《德魯納酒店》、電影《掮客》與 Netflix《苦盡柑來遇見你》等作品。2026 年 9 月 10 日發行數位單曲《From This Star》，是睽違一年的新歌。'
  ],

  facts: [
    { label: '出道日', value: '2008.09.18' },
    { label: '類型', value: '個人歌手・演員' },
    { label: '官方粉絲名', value: 'UAENA' },
    { label: '所屬公司', value: 'EDAM' }
  ],

  links: {
    instagram: 'https://www.instagram.com/dlwlrma/',
    youtube: 'https://www.youtube.com/@dlwlrma'
  },

  members: [
    {
      id: 'iu',
      stageName: 'IU',
      nameZh: '李知恩',
      nameKo: '이지은',
      nameEn: 'Lee Ji-eun',
      wiki: 'IU (singer)',
      birth: '1993.05.16',
      nationality: '韓國',
      roles: ['歌手', '作詞作曲', '演員'],
      color: '#b98cff',
      instagram: 'dlwlrma',
      bio: '15 歲出道，從「國民妹妹」一路成長為自己寫詞作曲的創作型歌手，也是韓國最賣座的演員之一。歌聲細膩、舞台自然，擅長把日常情感寫成讓人共鳴的歌。',
      facts: ['三段高音', '創作型歌手', '《我的大叔》', '《苦盡柑來遇見你》']
    }
  ],

  videos: [
    { title: '좋은 날 (Good Day)', youtubeId: 'jeqdYqsrsA0', date: '2010.12.09', kind: '迷你三輯主打 M/V', note: '「三段高音」讓她一夕爆紅的代表作。' },
    { title: 'Palette (feat. G-DRAGON)', youtubeId: 'd9IxdwEFk1c', date: '2017.04.21', kind: '正規四輯主打 M/V', note: '25 歲的自我告白，與 G-DRAGON 合作。' },
    { title: 'Blueming', youtubeId: 'D1PvIWdJ8xo', date: '2019.11.18', kind: '迷你五輯主打 M/V', note: '《Love poem》主打歌。' },
    { title: 'LILAC', youtubeId: 'v7bnOxV4jAc', date: '2021.03.25', kind: '正規五輯主打 M/V', note: '向 20 代告別的正規專輯同名曲。' },
    { title: 'strawberry moon', youtubeId: 'sqgxcCjD04s', date: '2021.10.19', kind: '數位單曲 M/V', note: '' },
    { title: 'Love wins all', youtubeId: 'JleoAppaxi0', date: '2024.01.24', kind: '先行曲 M/V', note: '《The Winning》先行曲，與 V（BTS）共演。' },
    { title: 'Dear my crazy soulmate', youtubeId: 'RdUV9Ms5GM4', date: '2026.09.10', kind: '數位單曲 M/V', note: '《From This Star》雙主打之一，與沈達璣共演。' }
  ],

  variety: [
    {
      title: '與 SUGA 合唱〈에잇（eight）〉',
      youtubeId: '5nKeukjERiA',
      show: 'IU’s Palette',
      date: '2023.04',
      note: 'IU 自己主持的音樂談話節目'
    },
    {
      title: '與 D.O. 合唱〈Love wins all〉',
      youtubeId: 'BahC2CxQzD0',
      show: 'IU’s Palette',
      date: '',
      note: 'IU 自己主持的音樂談話節目'
    }
  ],

  varietyChannels: [
    'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
    'UCaKod3X1Tn4c7Ci0iUKcvzQ', // 런닝맨 SBS
    '@idolhumandocu'            // 아이돌 인간극장
  ],

  releases: [
    { date: '2008.09.18', title: 'Lost and Found', type: '迷你一輯', note: '出道專輯，出道曲〈미아〉' },
    { date: '2010.12.09', title: 'Real', type: '迷你三輯', note: '主打〈좋은 날〉', youtubeId: 'jeqdYqsrsA0' },
    { date: '2017.04.21', title: 'Palette', type: '正規四輯', note: '主打〈Palette〉', youtubeId: 'd9IxdwEFk1c' },
    { date: '2019.11.18', title: 'Love poem', type: '迷你五輯', note: '主打〈Blueming〉', youtubeId: 'D1PvIWdJ8xo' },
    { date: '2021.03.25', title: 'LILAC', type: '正規五輯', note: '主打〈LILAC〉', youtubeId: 'v7bnOxV4jAc' },
    { date: '2024.02.20', title: 'The Winning', type: '迷你六輯', note: '主打〈Shopper〉，先行曲〈Love wins all〉', youtubeId: 'JleoAppaxi0' },
    { date: '2026.09.10', title: 'From This Star', type: '數位單曲', note: '雙主打〈From This Star〉、〈Dear my crazy soulmate〉', youtubeId: 'RdUV9Ms5GM4' }
  ]
};
