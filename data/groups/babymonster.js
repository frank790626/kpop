/**
 * BABYMONSTER 資料檔
 * 整理時間：2026-09（資料來自公開報導與官方社群，若官方有更新請直接修改本檔）
 * 欄位說明請見 data/groups/_template.js
 *
 * 【成員頭像】優先序：photo → instagram 帳號的大頭貼 → 代表色首字母。
 * photo 已先指向 assets/img/<成員id>.jpg，把照片放進去就會自動顯示；
 * 檔案不存在時會自動往下退到 IG 大頭貼，再退到首字母頭像，不會出現破圖。
 */
KPOP.register({
  id: 'babymonster',
  name: 'BABYMONSTER',
  nameKo: '베이비몬스터',
  nameZh: '寶貝怪獸',
  agency: 'YG Entertainment',
  country: '韓國',
  debut: '2024.04.01',
  debutNote: '出道專輯《BABYMONS7ER》，主打歌〈SHEESH〉',
  fandom: 'MONSTIEZ',
  tagline: 'YG 睽違七年推出的新女團，七名成員來自韓國、日本與泰國。',

  theme: {
    accent: '#ff2d6f',
    accent2: '#7c4dff'
  },

  intro: [
    'BABYMONSTER（베이비몬스터）是 YG Entertainment 在 BLACKPINK 之後推出的新女團，由生存實境節目《BABYMONSTERS》選出，成員橫跨韓國、日本與泰國三個國籍。',
    '2023 年 11 月 27 日以先行單曲〈BATTER UP〉出道前亮相，2024 年 4 月 1 日帶著首張迷你專輯《BABYMONS7ER》與主打歌〈SHEESH〉正式出道；〈SHEESH〉MV 上線 10 天即突破 1 億觀看，創下 K-POP 女團出道曲的最快紀錄。',
    '2024 年 11 月推出首張正規專輯《DRIP》，李彩英（AHYEON）回歸後完整七人體制登場；2025 年 10 月的第二張迷你專輯《WE GO UP》與後續 B-side MV〈PSYCHO〉再次刷新團體成績。',
    '2026 年 5 月 4 日發行第三張迷你專輯《CHOOM》，主打歌〈춤 (CHOOM)〉MV 僅花 14 天破 1 億觀看，是 2026 年最快達標的 K-POP MV，也是團體第 11 支破億 MV。'
  ],

  facts: [
    { label: '出道日', value: '2024.04.01' },
    { label: '成員', value: '7 人' },
    { label: '官方粉絲名', value: 'MONSTIEZ' },
    { label: '所屬公司', value: 'YG Entertainment' }
  ],

  links: {
    instagram: 'https://www.instagram.com/babymonster_ygofficial/',
    youtube: 'https://www.youtube.com/@BABYMONSTER',
    x: 'https://x.com/YGBABYMONSTER_',
    tiktok: 'https://www.tiktok.com/@babymonster_yg_tiktok',
    website: 'https://ygfamily.com/'
  },

  // ─── 成員（依隊內年齡排序） ───────────────────────────────
  members: [
    {
      id: 'asa',
      stageName: 'ASA',
      nameZh: '麻紗',
      nameKo: '아사',
      nameEn: 'Enami Asa',
      birth: '2006.04.17',
      nationality: '日本',
      roles: ['Rapper', 'Dancer'],
      color: '#ffd23d',
      bio: '以爆發力十足的 rap 與舞台掌控力著稱，是團內舞蹈與 rap 雙線的主力。',
      facts: ['Rap Line', 'Dance Line'],
      photo: 'assets/img/asa.jpg',
      instagram: 'asa.babymonster'
    },
    {
      id: 'ruka',
      stageName: 'RUKA',
      nameZh: '瑠夏',
      nameKo: '루카',
      nameEn: 'Watanabe Ruka',
      birth: '2002.03.20',
      nationality: '日本',
      roles: ['隊長', 'Rapper', 'Dancer'],
      color: '#ff2d6f',
      bio: '隊內最年長的成員，也是帶著團隊往前走的隊長。低沉厚實的 rap 音色與穩定台風，是 BABYMONSTER 舞台上的重心。',
      facts: ['隊長', '隊內最年長', 'Rap Line'],
      photo: 'assets/img/ruka.jpg',
      instagram: 'ruka.babymonster'
    },
    {
      id: 'pharita',
      stageName: 'PHARITA',
      nameZh: '帕莉塔',
      nameKo: '파리타',
      nameEn: 'Pharita Chanthaset',
      birth: '2005.08.26',
      nationality: '泰國',
      roles: ['Vocalist'],
      color: '#ff8a3d',
      bio: '來自泰國的主唱之一，音色明亮帶有辨識度，訪談與綜藝中常是氣氛的潤滑劑。',
      facts: ['Vocal Line', '泰國籍成員'],
      photo: 'assets/img/pharita.jpg',
      instagram: 'pharita.babymonster'
    },
    {
      id: 'ahyeon',
      stageName: 'AHYEON',
      nameZh: '娥賢',
      nameKo: '아현',
      nameEn: 'Lee Ahyeon',
      birth: '2007.04.11',
      nationality: '韓國',
      roles: ['Vocalist', 'Rapper', 'Dancer'],
      color: '#4dd8ff',
      bio: '唱、跳、rap 三項皆能的全能型成員。出道前曾因健康因素暫停活動，於 2024 年正規專輯《DRIP》回歸，完成七人完整體制。',
      facts: ['All-rounder', '《DRIP》回歸'],
      photo: 'assets/img/ahyeon.jpg',
      instagram: 'ahyeons__babymonster'
    },
    {
      id: 'rora',
      stageName: 'RORA',
      nameZh: '蘿拉',
      nameKo: '로라',
      nameEn: 'Shin Rora',
      birth: '2008.08.14',
      nationality: '韓國',
      roles: ['Vocalist', 'Dancer'],
      color: '#ff5fd2',
      bio: '甜而不膩的音色搭配俐落的舞蹈線條，是舞台上視覺與歌聲反差感的來源。',
      facts: ['Vocal Line', 'Dance Line'],
      photo: 'assets/img/rora.jpg',
      instagram: 'rora_babymonsters'
    },
    {
      id: 'chiquita',
      stageName: 'CHIQUITA',
      nameZh: '奇奇塔',
      nameKo: '치키타',
      nameEn: 'Chiquita',
      birth: '2009.02.17',
      nationality: '泰國',
      roles: ['忙內', 'Rapper', 'Vocalist'],
      color: '#3ddc97',
      bio: '隊內最年幼的忙內，年紀小但舞台上的自信與 rap 存在感十足。',
      facts: ['忙內', '泰國籍成員'],
      photo: 'assets/img/chiquita.jpg',
      instagram: 'chiquita_babymonsterr'
    },
    {
      id: 'rami',
      stageName: 'RAMI',
      nameZh: '拉米',
      nameKo: '라미',
      nameEn: 'Seo Rami',
      birth: '2007.10.17',
      nationality: '韓國',
      roles: ['Vocalist'],
      color: '#7c4dff',
      bio: '乾淨透亮的嗓音是團內抒情段落的定心丸，現場演唱穩定度極高。',
      facts: ['Vocal Line', '高音擔當'],
      photo: 'assets/img/rami.jpg',
      instagram: 'babymonster_rami'
    }
  ],

  // ─── 熱門 YouTube 影片（依人氣排序，badge 為官方公布的觀看里程碑） ───
  videos: [
    {
      title: 'SHEESH',
      youtubeId: '2wA_b6YHjqQ',
      date: '2024.04.01',
      kind: '出道主打 M/V',
      badge: '破 4 億觀看',
      note: '上線 10 天破 1 億，創下 K-POP 女團出道曲最快紀錄。'
    },
    {
      title: 'BATTER UP',
      youtubeId: 'olDWm2veCrM',
      date: '2023.11.27',
      kind: '出道前單曲 M/V',
      badge: '破 3 億觀看',
      note: '七人首次完整亮相的先行單曲。'
    },
    {
      title: 'DRIP',
      youtubeId: 'Zp-Jhuhq0bQ',
      date: '2024.11.01',
      kind: '正規一輯主打 M/V',
      badge: '',
      note: 'AHYEON 回歸後的完整體出擊。'
    },
    {
      title: 'PSYCHO',
      youtubeId: 'yd_uG3TtREs',
      date: '2025.11.19',
      kind: 'B-side M/V',
      badge: '破 2 億觀看',
      note: '以「惡夢」為題的黑暗概念，上線當日拿下 YouTube 全球 24 小時觀看第一。'
    },
    {
      title: '춤 (CHOOM)',
      youtubeId: 'x3eqqoZPV_E',
      date: '2026.05.04',
      kind: '迷你三輯主打 M/V',
      badge: '14 天破 1 億',
      note: '2026 年最快破億的 K-POP MV，團體第 11 支破億作品。'
    },
    {
      title: 'WE GO UP',
      youtubeId: 'wlHwjkYpSr0',
      date: '2025.10.10',
      kind: '迷你二輯主打 M/V',
      badge: '4 天破 5000 萬',
      note: '第二張迷你專輯的同名主打。'
    },
    {
      title: 'CLIK CLAK',
      youtubeId: 'o0oW3lPoOXM',
      date: '2024.11',
      kind: '正規一輯雙主打 M/V',
      badge: '',
      note: '《DRIP》專輯中節奏最強烈的一首。'
    },
    {
      title: 'FOREVER',
      youtubeId: 'eJCHKjt0MPw',
      date: '2024.07.01',
      kind: '先行單曲 M/V',
      badge: '',
      note: '夏日感十足的先行曲。'
    }
  ],

  // ─── 作品年表 ─────────────────────────────────────────
  releases: [
    { date: '2023.11.27', title: 'BATTER UP', type: '數位單曲', note: '出道前先行曲', youtubeId: 'olDWm2veCrM' },
    { date: '2024.04.01', title: 'BABYMONS7ER', type: '迷你一輯', note: '主打歌〈SHEESH〉', youtubeId: '2wA_b6YHjqQ' },
    { date: '2024.07.01', title: 'FOREVER', type: '先行單曲', note: '正規一輯先行曲', youtubeId: 'eJCHKjt0MPw' },
    { date: '2024.11.01', title: 'DRIP', type: '正規一輯', note: '主打〈DRIP〉、〈CLIK CLAK〉', youtubeId: 'Zp-Jhuhq0bQ' },
    { date: '2025.10.10', title: 'WE GO UP', type: '迷你二輯', note: '主打〈WE GO UP〉，B-side〈PSYCHO〉MV 於 11.19 公開', youtubeId: 'wlHwjkYpSr0' },
    { date: '2026.05.04', title: 'CHOOM', type: '迷你三輯', note: '主打歌〈춤 (CHOOM)〉，MV 14 天破 1 億觀看', youtubeId: 'x3eqqoZPV_E' }
  ]
});
