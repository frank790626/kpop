/**
 * 新增團體範本
 * ──────────────────────────────────────────────────────────
 * 1. 複製這個檔案，改名成團體 id，例如 src/data/groups/blackpink.js
 * 2. 填好下面的資料（沒有的欄位可以直接刪掉，程式會補預設值）
 * 3. 存檔，就這樣 —— src/data/groups/ 底下的檔案會被自動掃描載入，
 *    不需要去 import 或改任何程式。
 *
 * 切換列的順序由 order 欄位決定（數字小的在前，沒填預設 100）。
 * 注意：檔名以 _ 開頭代表這只是範本，不會被載入。
 */
export default {
  id: 'group-id',            // 網址用的英文 id（#/group-id），不可重複
  order: 2,                  // 團體切換列的排序，數字小的在前
  type: 'group',             // 個人歌手填 'solo'：成員區改成單人版面（members 只放一位）
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
      photoFocus: { position: '50% 30%', zoom: 1.3, lgZoom: 1 }, // 選填；照片構圖特殊時調整頭像的焦點與放大倍率（lgZoom＝成員卡大頭像）
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

  // 綜藝節目片段（選填）
  variety: [
    {
      title: '片段標題',
      youtubeId: 'dQw4w9WgXcQ',
      show: '節目名稱',
      date: '2020.01.01',
      note: '一句話說明。'
    }
  ],

  // 想自動追蹤綜藝片段就填要監看的頻道（UC 開頭的 channelId 或 @handle 皆可）。
  // 每天會掃這些頻道的 RSS，把標題提到團名的新片補到綜藝清單最前面。
  varietyChannels: [],

  // MV 不在 links.youtube 那個頻道時（例如放在經紀公司頻道）才需要：UC 開頭的 channelId 或 @handle
  // mvChannel: 'UCxxxxxxxxxxxxxxxxxxxxxx',
  // 共用頻道（公司所有藝人的 MV 都放一起）就設 true，每日更新只收標題有提到本團的 MV
  // sharedChannel: true,

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
};
