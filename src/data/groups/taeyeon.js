/**
 * 太妍 TAEYEON 資料檔（個人歌手，少女時代隊長）
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 src/data/groups/_template.js
 */
export default {
  id: 'taeyeon',
  order: 9,
  type: 'solo',
  name: 'TAEYEON',
  nameKo: '태연',
  nameZh: '太妍',
  agency: 'SM Entertainment',
  country: '韓國',
  debut: '2015.10.07',
  debutNote: '個人出道迷你專輯《I》；2007 年以少女時代出道',
  fandom: 'SONE（소원）',
  commonsCategory: 'Taeyeon', // Wikimedia Commons 上的分類名稱，抓照片用
  // 太妍的 MV 都放在 SMTOWN 共用頻道，每日更新時只收標題有提到她的影片
  sharedChannel: true,
  tagline: '少女時代隊長，也是韓國公認的「最強女 Solo 歌手」之一。',

  theme: { accent: '#7fb8ff', accent2: '#f4a6c8' },

  intro: [
    '太妍（태연，本名金泰耎）是少女時代的隊長兼主唱，2007 年隨團出道；2015 年 10 月以迷你專輯《I》個人出道，主打〈I (feat. Verbal Jint)〉一推出就橫掃各大音源榜。',
    '清亮又有穿透力的嗓音是她的招牌，〈Rain〉、〈Fine〉、〈四季 (Four Seasons)〉、〈INVU〉等歌曲長年霸榜，被譽為韓國最具代表性的女 Solo 歌手之一。也曾是 tvN《驚人的星期六》固定班底，綜藝感一樣出色。',
    '2025 年 12 月發行個人出道十週年精選輯《Panorama : The Best of TAEYEON》；2026 年 6 月翻唱日本創作歌手 tuki. 的〈晚餐歌〉推出韓文版〈만찬가〉，發行當天就打進 Melon TOP 100。SM 也公布第四張正規專輯預定 2026 年第四季推出。'
  ],

  facts: [
    { label: 'Solo 出道', value: '2015.10.07' },
    { label: '類型', value: '個人歌手' },
    { label: '所屬團體', value: '少女時代' },
    { label: '所屬公司', value: 'SM' }
  ],

  links: {
    instagram: 'https://www.instagram.com/taeyeon_ss/',
    youtube: 'https://www.youtube.com/@SMTOWN'
  },

  members: [
    {
      id: 'taeyeon',
      stageName: 'TAEYEON',
      nameZh: '太妍',
      nameKo: '김태연',
      nameEn: 'Kim Tae-yeon',
      wiki: 'Taeyeon',
      birth: '1989.03.09',
      nationality: '韓國',
      roles: ['歌手', '少女時代隊長'],
      color: '#7fb8ff',
      instagram: 'taeyeon_ss',
      bio: '少女時代的隊長兼主唱，Solo 後以抒情與流行搖滾兩種路線都駕馭得很好，被稱為「韓國 OST 女王」，〈If〉、〈All About You〉等戲劇 OST 同樣經典。',
      facts: ['OST 女王', '《驚人的星期六》', '少女時代']
    }
  ],

  videos: [
    { title: 'I (feat. Verbal Jint)', youtubeId: '4OrCA1OInoo', date: '2015.10.07', kind: 'Solo 出道曲 M/V', note: '個人出道就橫掃音源榜的代表作。' },
    { title: '사계 (Four Seasons)', youtubeId: '4HG_CJzyX6A', date: '2019.03.24', kind: '數位單曲 M/V', note: '' },
    { title: 'Weekend', youtubeId: 'RmuL-BPFi2Q', date: '2021.07.06', kind: '數位單曲 M/V', note: '' },
    { title: 'INVU', youtubeId: 'AbZH7XWDW_k', date: '2022.02.14', kind: '正規三輯主打 M/V', note: '' },
    { title: 'To. X', youtubeId: '5_n6t9G2TUQ', date: '2023.11.27', kind: '迷你五輯主打 M/V', note: '' },
    { title: 'Letter To Myself', youtubeId: 'wqN1vLPX-no', date: '2024.11.18', kind: '迷你六輯主打 M/V', note: '' },
    { title: '인사 (Panorama)', youtubeId: 'xGhaNqnjgr4', date: '2025.12.01', kind: '精選輯主打 M/V', note: 'Solo 出道十週年精選輯新歌。' },
    { title: '만찬가 (晩餐歌)', youtubeId: 'VVO05mYGFY8', date: '2026.06.29', kind: '翻唱單曲 M/V', note: 'tuki.〈晚餐歌〉韓文版，J-POP REMAKE 第一彈。' }
  ],

  variety: [
    {
      title: '從來賓變成固定班底！太妍活躍片段合輯',
      youtubeId: 'oDATlfAkF7A',
      show: '驚人的星期六',
      date: '2020.11',
      note: 'tvN《놀라운 토요일》EP.135 精華'
    },
    {
      title: '太妍人生第一次被畫上搞笑妝',
      youtubeId: '7SySNHErzUA',
      show: '驚人的星期六',
      date: '2021.01.30',
      note: 'EP.145'
    },
    {
      title: '「聽到了聽到了！」太妍的超強聽寫',
      youtubeId: 'tKd3IphSHEs',
      show: '驚人的星期六',
      date: '2020.03',
      note: 'EP.99'
    }
  ],

  varietyChannels: [
    'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
    'UCaKod3X1Tn4c7Ci0iUKcvzQ', // 런닝맨 SBS
    '@idolhumandocu'            // 아이돌 인간극장
  ],

  releases: [
    { date: '2015.10.07', title: 'I', type: '迷你一輯', note: 'Solo 出道，主打〈I〉', youtubeId: '4OrCA1OInoo' },
    { date: '2017.02.28', title: 'My Voice', type: '正規一輯', note: '主打〈Fine〉' },
    { date: '2019.10.28', title: 'Purpose', type: '正規二輯', note: '主打〈Spark〉' },
    { date: '2022.02.14', title: 'INVU', type: '正規三輯', note: '主打〈INVU〉', youtubeId: 'AbZH7XWDW_k' },
    { date: '2023.11.27', title: 'To. X', type: '迷你五輯', note: '主打〈To. X〉', youtubeId: '5_n6t9G2TUQ' },
    { date: '2024.11.18', title: 'Letter To Myself', type: '迷你六輯', note: '主打〈Letter To Myself〉', youtubeId: 'wqN1vLPX-no' },
    { date: '2025.12.01', title: 'Panorama : The Best of TAEYEON', type: '精選輯', note: '新歌〈인사 (Panorama)〉', youtubeId: 'xGhaNqnjgr4' },
    { date: '2026.06.29', title: '만찬가 (晩餐歌)', type: '翻唱單曲', note: 'tuki.〈晚餐歌〉韓文版（J-POP REMAKE Vol.1），發行當天就進 Melon TOP 100', youtubeId: 'VVO05mYGFY8' }
  ]
};
