/**
 * 新增團體範本
 * ──────────────────────────────────────────────────────────
 * 1. 複製這個檔案，改名成團體 id，例如 data/groups/blackpink.js
 * 2. 填好下面的資料（沒有的欄位可以直接刪掉，程式會補預設值）
 * 3. 到 index.html 的「團體資料」區塊多加一行：
 *      <script src="data/groups/blackpink.js"></script>
 *    順序就是網站上方團體切換列的順序。
 *
 * 注意：這個檔名以 _ 開頭，代表它只是範本，不會被 index.html 載入。
 */
KPOP.register({
  id: 'group-id',            // 網址用的英文 id（#/group-id），不可重複
  name: 'GROUP NAME',        // 團名（英文／羅馬拼音）
  nameKo: '그룹 이름',        // 韓文團名，選填
  nameZh: '中文團名',         // 選填
  agency: '經紀公司',
  country: '韓國',
  debut: '2020.01.01',       // 出道日
  debutNote: '出道專輯與主打歌',
  fandom: '粉絲名',
  tagline: '一句話介紹，顯示在團名下方。',

  // 主題色：會套用到按鈕、標籤、漸層等所有強調色
  theme: { accent: '#ff2d6f', accent2: '#7c4dff' },

  intro: [
    '第一段團體介紹。',
    '第二段團體介紹（可以放很多段，每段一個字串）。'
  ],

  // 首頁的重點數據小卡
  facts: [
    { label: '出道日', value: '2020.01.01' },
    { label: '成員', value: '4 人' }
  ],

  // 官方社群；沒有的留空或刪掉，該按鈕就不會出現
  links: {
    instagram: 'https://www.instagram.com/xxx/',
    youtube: 'https://www.youtube.com/@xxx',
    x: 'https://x.com/xxx',
    tiktok: 'https://www.tiktok.com/@xxx',
    website: 'https://example.com/'
  },

  members: [
    {
      id: 'member-id',           // 網址用（#/group-id/member-id）
      stageName: 'NAME',         // 藝名
      nameZh: '中文名',           // 選填
      nameKo: '한국 이름',        // 選填
      nameEn: 'Full Name',       // 選填
      birth: '2000.01.01',
      nationality: '韓國',
      roles: ['隊長', 'Vocalist'],   // 顯示成標籤
      color: '#ff2d6f',              // 個人代表色（頭像漸層用）
      // 頭像優先序：photo → instagram 大頭貼 → 代表色首字母
      photo: 'assets/img/xxx.jpg',   // 本地照片或任何圖片網址；最穩定
      instagram: 'xxx',              // IG 帳號（或完整網址）；填了就自動抓該帳號大頭貼
      bio: '成員介紹文字。',
      facts: ['特色標籤一', '特色標籤二']
    }
  ],

  // 熱門影片：依想呈現的人氣順序由上往下排
  videos: [
    {
      title: '歌名',
      youtubeId: 'dQw4w9WgXcQ',   // 只要 watch?v= 後面那一串
      date: '2020.01.01',
      kind: 'M/V',                 // 影片類型標籤
      badge: '破 1 億觀看',         // 選填，右上角徽章
      note: '一句話說明。'          // 選填
    }
  ],

  // 作品年表。最新的三筆會自動出現在「近期發行」區塊（在熱門影片上方）
  releases: [
    {
      date: '2020.01.01',
      title: '專輯名',
      type: '迷你一輯',
      note: '主打歌〈XXX〉',
      youtubeId: 'dQw4w9WgXcQ' // 選填；有填「近期發行」卡片就會出現看 M/V 連結
    }
  ]
});
