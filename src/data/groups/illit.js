/**
 * ILLIT 資料檔
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 src/data/groups/_template.js
 */
export default {
  id: 'illit',
  order: 6,
  name: 'ILLIT',
  nameKo: '아일릿',
  agency: 'BELIFT LAB（HYBE）',
  country: '韓國',
  debut: '2024.03.25',
  debutNote: '出道專輯《SUPER REAL ME》，主打歌〈Magnetic〉',
  fandom: 'GLLIT',
  tagline: '團名結合 "I WILL" 與 "IT"，唱的是「我會成為那個 IT」的宣言。',

  theme: { accent: '#ff8fb1', accent2: '#8fb3ff' },

  intro: [
    'ILLIT（아일릿）是 HYBE 旗下 BELIFT LAB 於 2024 年推出的五人女團，成員由選秀節目《R U Next?》選出，團名結合 "I WILL" 與 "IT"，意思是「我會成為那個 IT」。',
    '2024 年 3 月 25 日以《SUPER REAL ME》出道，主打歌〈Magnetic〉憑藉輕盈的 easy listening 曲風迅速走紅，成為出道即衝上國際排行榜的話題新人。',
    '之後〈Cherish (My Love)〉、〈Tick-Tack〉、〈Do the Dance〉、〈jellyous〉延續清新路線；2026 年 4 月的迷你四輯《Mamihlapinatapai》以〈It’s Me〉轉向電子曲風，第五張迷你專輯《Break even》預計 2026 年 10 月 26 日發行。'
  ],

  facts: [
    { label: '出道日', value: '2024.03.25' },
    { label: '成員', value: '5 人' },
    { label: '官方粉絲名', value: 'GLLIT' },
    { label: '所屬公司', value: 'BELIFT LAB' }
  ],

  links: {
    instagram: 'https://www.instagram.com/illit_official/',
    youtube: 'https://www.youtube.com/@ILLIT_official'
  },

  members: [
    {
      id: 'yunah',
      stageName: 'YUNAH',
      nameZh: '尹阿',
      nameKo: '윤아',
      nameEn: 'Yoon Yunah',
      birth: '2004.01.15',
      nationality: '韓國',
      roles: ['隊內最年長', 'Vocalist'],
      color: '#ff8fb1',
      bio: '隊內最年長，沉穩的個性與穩定的演唱，是團體在舞台與訪談上的支柱。',
      facts: ['隊內最年長', '《R U Next?》出身']
    },
    {
      id: 'minju',
      stageName: 'MINJU',
      nameZh: '珉周',
      nameKo: '민주',
      nameEn: 'Yoo Minju',
      birth: '2004.05.11',
      nationality: '韓國',
      roles: ['Vocalist'],
      color: '#ffd166',
      bio: '柔亮的音色適合 ILLIT 輕盈的曲風，是副歌裡最容易被記住的聲線之一。',
      facts: ['Vocal Line', '《R U Next?》出身']
    },
    {
      id: 'moka',
      stageName: 'MOKA',
      nameZh: '萌香',
      nameKo: '모카',
      nameEn: 'Sakai Moka',
      birth: '2004.10.08',
      nationality: '日本',
      roles: ['Rapper', 'Dancer'],
      color: '#b28cff',
      bio: '日本籍成員，擔任團內的 rap 段落。自 2026 年 6 月起因健康因素暫停活動，休養中。',
      facts: ['日本籍成員', 'Rap Line', '休養中']
    },
    {
      id: 'wonhee',
      stageName: 'WONHEE',
      nameZh: '元熙',
      nameKo: '원희',
      nameEn: 'Hong Wonhee',
      birth: '2007.06.26',
      nationality: '韓國',
      roles: ['Vocalist', 'Dancer'],
      color: '#8fb3ff',
      bio: '出道即以清晰的五官與舞台表情受到關注，是團體視覺上的亮點。',
      facts: ['視覺擔當', '《R U Next?》出身']
    },
    {
      id: 'iroha',
      stageName: 'IROHA',
      nameZh: '伊呂波',
      nameKo: '이로하',
      nameEn: 'Takahashi Iroha',
      birth: '2008.02.04',
      nationality: '日本',
      roles: ['忙內', 'Dancer'],
      color: '#7ee0c0',
      bio: '隊內忙內，舞蹈底子扎實，是編舞中負責關鍵動作的成員。',
      facts: ['忙內', '日本籍成員']
    }
  ],

  videos: [
    { title: 'Magnetic', youtubeId: 'Vk5-c_v4gMU', date: '2024.03.25', kind: '出道主打 M/V', note: '出道即登上國際排行榜的代表作。' },
    { title: 'Lucky Girl Syndrome', youtubeId: 'UCmgGZbfjmk', date: '2024.03.25', kind: '出道專輯收錄曲 M/V', note: '' },
    { title: 'Cherish (My Love)', youtubeId: 'repxDl9wybU', date: '2024.10.21', kind: '迷你二輯主打 M/V', note: '' },
    { title: 'Tick-Tack (Performance ver.)', youtubeId: '1yMzV0NdB9g', date: '2024.11.17', kind: 'Performance M/V', note: '' },
    { title: 'jellyous', youtubeId: 'GkG60kISnfc', date: '2025.07.07', kind: '迷你三輯收錄曲 M/V', note: '《Bomb》專輯收錄曲。' },
    { title: 'NOT CUTE ANYMORE', youtubeId: 'x_RYZsOfpKY', date: '2025.11.24', kind: '單曲專輯主打 M/V', note: '' },
    { title: 'It’s Me', youtubeId: 'bMhDJ0S0OBA', date: '2026.04.30', kind: '迷你四輯主打 M/V', note: '轉向電子曲風的轉型之作。' },
    { title: 'I Got Your Back (Feat. JISOO, MOMOKA of HANA)', youtubeId: '_Pk6xfju3l0', date: '2026.07.26', kind: '日本單曲 M/V', note: '第二張日本單曲。' }
  ],

  variety: [
    {
      title: '〈Magnetic〉＋〈Lucky Girl Syndrome〉舞台',
      youtubeId: 'MBCEOQK5Ass',
      show: '아는 형님 435회',
      date: '2024.05.25',
      note: 'JTBC 아는 형님 出演'
    },
    {
      title: '從〈Magnetic〉到翻唱，表演合輯',
      youtubeId: 'R9J-aFEVrn0',
      show: '아는 형님',
      date: '2024.05.25',
      note: '아형 하이라이트'
    },
    {
      title: '「留言全在意的話我會垮掉」前輩們的真心建議',
      youtubeId: 'ypjwl88a198',
      show: '아는 형님',
      date: '2024.05.25',
      note: '出道不久的煩惱與前輩建議'
    },
    {
      title: '新人 ILLIT 藏起來的煩惱，Super Junior 的現實建議',
      youtubeId: 'ii9Qsf3PBDk',
      show: '아는 형님',
      date: '2024.05.25',
      note: '아형 하이라이트'
    }
  ],

  varietyChannels: [
    'UCOHM2N1YQdb-cHWxJxwBMLQ', // 아는형님 Knowingbros
    'UCaKod3X1Tn4c7Ci0iUKcvzQ', // 런닝맨 SBS
    '@idolhumandocu'            // 아이돌 인간극장
  ],

  releases: [
    { date: '2024.03.25', title: 'SUPER REAL ME', type: '迷你一輯', note: '出道專輯，主打〈Magnetic〉', youtubeId: 'Vk5-c_v4gMU' },
    { date: '2024.10.21', title: 'I’LL LIKE YOU', type: '迷你二輯', note: '主打〈Cherish (My Love)〉', youtubeId: 'repxDl9wybU' },
    { date: '2025.06.16', title: 'Bomb', type: '迷你三輯', note: '主打〈Do the Dance〉，收錄〈jellyous〉', youtubeId: 'GkG60kISnfc' },
    { date: '2025.11.24', title: 'Not Cute Anymore', type: '單曲專輯', note: '主打〈NOT CUTE ANYMORE〉', youtubeId: 'x_RYZsOfpKY' },
    { date: '2026.04.30', title: 'Mamihlapinatapai', type: '迷你四輯', note: '主打〈It’s Me〉', youtubeId: 'bMhDJ0S0OBA' },
    { date: '2026.07.26', title: 'I Got Your Back', type: '日本單曲二輯', note: '與 JISOO、MOMOKA (HANA) 合作', youtubeId: '_Pk6xfju3l0' }
  ]
};
