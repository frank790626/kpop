/**
 * IVE 資料檔
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 src/data/groups/_template.js
 */
export default {
  id: 'ive',
  order: 3,
  name: 'IVE',
  nameKo: '아이브',
  agency: 'Starship Entertainment',
  country: '韓國',
  debut: '2021.12.01',
  debutNote: '出道單曲《ELEVEN》',
  fandom: 'DIVE',
  tagline: '團名取自 "I HAVE"，唱的是「我擁有的樣子就是我」的自信宣言。',

  theme: { accent: '#ff3b5c', accent2: '#ffb26b' },

  intro: [
    'IVE（아이브）是 Starship Entertainment 於 2021 年底推出的六人女團，團名源自 "I HAVE"，主題一貫圍繞「我擁有的、我展現的自信」。',
    '成員安兪真與張員瑛出身於《PRODUCE 48》與 IZ*ONE，出道曲〈ELEVEN〉即打開知名度；隨後〈LOVE DIVE〉、〈After LIKE〉連續成為年度代表曲，奠定「IVE 式自信」的風格。',
    '2026 年 2 月 23 日發行第二張正規專輯《REVIVE+》，採雙主打〈BANG BANG〉與〈BLACKHOLE〉，其中〈BANG BANG〉於 2 月 9 日先行公開。'
  ],

  facts: [
    { label: '出道日', value: '2021.12.01' },
    { label: '成員', value: '6 人' },
    { label: '官方粉絲名', value: 'DIVE' },
    { label: '所屬公司', value: 'Starship' }
  ],

  links: {
    instagram: 'https://www.instagram.com/ivestarship/',
    youtube: 'https://www.youtube.com/@IVEstarship'
  },

  members: [
    {
      id: 'gaeul',
      stageName: 'GAEUL',
      nameZh: '秋天',
      nameKo: '가을',
      nameEn: 'Kim Gaeul',
      birth: '2002.09.24',
      nationality: '韓國',
      roles: ['Rapper', 'Dancer'],
      color: '#ff8a3d',
      bio: '隊內最年長，低音域的 rap 與俐落舞蹈是團體歌曲裡的轉折點。',
      facts: ['隊內最年長', 'Rap Line']
    },
    {
      id: 'yujin',
      stageName: 'AN YUJIN',
      nameZh: '安兪真',
      nameKo: '안유진',
      nameEn: 'An Yujin',
      birth: '2003.09.01',
      nationality: '韓國',
      roles: ['隊長', 'Vocalist'],
      color: '#ff3b5c',
      photoFocus: { position: '50% 38%', zoom: 1 }, // 維基照片是臉部特寫，不放大
      bio: '隊長，IZ*ONE 出身。反應快、口條好，長期擔任音樂節目主持，是團體的對外門面。',
      facts: ['隊長', 'IZ*ONE 出身']
    },
    {
      id: 'rei',
      stageName: 'REI',
      nameZh: '玲',
      nameKo: '레이',
      nameEn: 'Naoi Rei',
      birth: '2004.02.03',
      nationality: '日本',
      roles: ['Rapper', 'Vocalist'],
      color: '#ffb26b',
      bio: '日本籍成員，語氣獨特的 rap 段落辨識度極高，也參與部分歌曲的作詞。',
      facts: ['日本籍成員', 'Rap Line']
    },
    {
      id: 'wonyoung',
      stageName: 'JANG WONYOUNG',
      nameZh: '張員瑛',
      nameKo: '장원영',
      nameEn: 'Jang Wonyoung',
      birth: '2004.08.31',
      nationality: '韓國',
      roles: ['Center', 'Vocalist'],
      color: '#ff5fd2',
      bio: 'IZ*ONE 出身的門面擔當，高挑身形與舞台存在感讓她成為團體最具代表性的視覺符號。',
      facts: ['Center', 'IZ*ONE 出身']
    },
    {
      id: 'liz',
      stageName: 'LIZ',
      nameZh: '莉茲',
      nameKo: '리즈',
      nameEn: 'Kim Jiwon',
      birth: '2004.11.21',
      nationality: '韓國',
      roles: ['Main Vocalist'],
      color: '#7c4dff',
      bio: '主唱擔當，透亮乾淨的高音撐起多首主打歌的副歌。',
      facts: ['主唱', '高音擔當']
    },
    {
      id: 'leeseo',
      stageName: 'LEESEO',
      nameZh: '李瑞',
      nameKo: '이서',
      nameEn: 'Lee Hyunseo',
      birth: '2007.02.21',
      nationality: '韓國',
      roles: ['忙內', 'Vocalist', 'Dancer'],
      color: '#4dd8ff',
      bio: '隊內忙內，出道時年僅 14 歲，成長幅度是粉絲一路看著累積的。',
      facts: ['忙內', '出道時 14 歲']
    }
  ],

  videos: [
    { title: 'LOVE DIVE', youtubeId: 'Y8JFxS1HlDo', date: '2022.04.05', kind: '單曲二輯主打 M/V', note: '橫掃各大年度獎項的代表作。' },
    { title: 'After LIKE', youtubeId: 'F0B7HDiY-10', date: '2022.08.22', kind: '單曲三輯主打 M/V', note: '取樣 Gloria Gaynor〈I Will Survive〉。' },
    { title: 'Baddie', youtubeId: 'Da4P2uT4mVc', date: '2023.10.13', kind: '改版專輯主打 M/V', note: '' },
    { title: 'REBEL HEART', youtubeId: 'g36q0ZLvygQ', date: '2025', kind: '正規專輯主打 M/V', note: '' },
    { title: 'BLACKHOLE', youtubeId: '1Lmy7qwmSMc', date: '2026.02.23', kind: '正規二輯主打 M/V', note: '《REVIVE+》雙主打之一。' },
    { title: 'BANG BANG', youtubeId: '9qkpcLK422o', date: '2026.02.09', kind: '先行曲 M/V', note: '《REVIVE+》先行公開。' }
  ],

  variety: [
    {
      title: '張員瑛 VS 安兪真，冰箱首度公開',
      youtubeId: '8lMbrQq8Tic',
      show: '냉장고를 부탁해',
      date: '2026.03.01',
      note: 'JTBC 拜託了冰箱'
    },
    {
      title: '掉進 IVE 的多彩魅力裡',
      youtubeId: 'Ab3mIm2TlXU',
      show: '아는 형님',
      date: '2022.08.27',
      note: '아형 하이라이트'
    },
    {
      title: '被哥哥們發掘的綜藝寶石 REI',
      youtubeId: '25nCaL33DoM',
      show: '아는 형님',
      date: '2022.08.27',
      note: 'REI 活躍片段'
    },
    {
      title: '毫不留情的爆料大會',
      youtubeId: 'd0GgXSrrIjA',
      show: '아는 형님',
      date: '2023.04.15',
      note: '아형 하이라이트'
    },
    {
      title: '什麼都偷看過的張員瑛',
      youtubeId: 'S29S7vyPgbc',
      show: '아는 형님',
      date: '2022.08.29',
      note: ''
    }
  ],
  varietyChannels: [
    'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
    'UCaKod3X1Tn4c7Ci0iUKcvzQ', // 런닝맨 SBS
    '@idolhumandocu'            // 아이돌 인간극장
  ],

  releases: [
    { date: '2021.12.01', title: 'ELEVEN', type: '單曲一輯', note: '出道單曲' },
    { date: '2022.04.05', title: 'LOVE DIVE', type: '單曲二輯', note: '主打〈LOVE DIVE〉', youtubeId: 'Y8JFxS1HlDo' },
    { date: '2022.08.22', title: 'After LIKE', type: '單曲三輯', note: '主打〈After LIKE〉', youtubeId: 'F0B7HDiY-10' },
    { date: '2023.10.13', title: 'IVE SWITCH／改版', type: '改版專輯', note: '主打〈Baddie〉', youtubeId: 'Da4P2uT4mVc' },
    { date: '2025', title: 'IVE EMPATHY', type: '正規專輯', note: '主打〈REBEL HEART〉', youtubeId: 'g36q0ZLvygQ' },
    { date: '2026.02.23', title: 'REVIVE+', type: '正規二輯', note: '雙主打〈BANG BANG〉、〈BLACKHOLE〉', youtubeId: '1Lmy7qwmSMc' }
  ]
};
