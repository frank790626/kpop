/**
 * core.js — 團體資料註冊中心
 *
 * 每個團體資料檔只要呼叫 KPOP.register({...}) 就會自動出現在網站上，
 * 不需要改動任何畫面程式。資料格式說明請見 data/groups/_template.js。
 */
(function (global) {
  'use strict';

  var groups = [];
  var byId = Object.create(null);

  /**
   * 頭像設定
   * igAvatarProxy：把 Instagram 帳號換成大頭貼圖片網址的服務。
   * Instagram 官方不允許直接連圖，所以透過代理服務取得；
   * 之後若這個服務失效，只要改這一行，全站頭像就會跟著換來源。
   * {handle} 會被替換成 Instagram 帳號（不含 @）。
   */
  var config = {
    igAvatarProxy: 'https://unavatar.io/instagram/{handle}?fallback=false'
  };

  /** 從網址或 @帳號 取出乾淨的 Instagram 帳號 */
  function igHandle(value) {
    if (!value) return '';
    var v = String(value).trim();
    var m = v.match(/instagram\.com\/([^/?#]+)/i);
    if (m) return m[1];
    return v.replace(/^@/, '');
  }

  /** 把帳號轉成 Instagram 個人頁網址 */
  function igUrl(value) {
    var handle = igHandle(value);
    return handle ? 'https://www.instagram.com/' + handle + '/' : '';
  }

  /** 由帳號取得大頭貼網址 */
  function igAvatar(value) {
    var handle = igHandle(value);
    return handle ? config.igAvatarProxy.replace('{handle}', encodeURIComponent(handle)) : '';
  }

  /**
   * 頭像來源的優先順序：
   *   1. photo（自己放在 assets/img/ 的照片，最穩定）
   *   2. Instagram 大頭貼（有填 instagram 時自動抓）
   *   3. 都沒有 → 用代表色漸層 + 名字首字母
   */
  function avatarSources(entity) {
    return [entity.photo, igAvatar(entity.instagram)].filter(Boolean);
  }

  function slug(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /** 補齊預設值，讓資料檔可以只寫有把握的欄位 */
  function normalizeGroup(raw) {
    var group = Object.assign(
      {
        id: slug(raw.name),
        name: '',
        nameKo: '',
        nameZh: '',
        agency: '',
        debut: '',
        debutNote: '',
        fandom: '',
        tagline: '',
        intro: [],
        facts: [],
        theme: {},
        links: {},
        members: [],
        videos: [],
        releases: []
      },
      raw
    );

    group.theme = Object.assign({ accent: '#ff3d7f', accent2: '#8b5cf6' }, raw.theme);

    group.members = (raw.members || []).map(function (m, i) {
      return Object.assign(
        {
          id: m.id || slug(m.stageName || 'member-' + i),
          stageName: '',
          nameKo: '',
          nameEn: '',
          birth: '',
          nationality: '',
          roles: [],
          facts: [],
          bio: '',
          color: group.theme.accent,
          photo: '',
          instagram: ''
        },
        m
      );
    });

    group.videos = (raw.videos || []).map(function (v) {
      return Object.assign({ title: '', youtubeId: '', date: '', badge: '', note: '', kind: 'M/V' }, v);
    });

    return group;
  }

  var KPOP = {
    /** 註冊一個團體 */
    register: function (raw) {
      if (!raw || !raw.name) {
        console.warn('[KPOP] 團體資料缺少 name，已略過', raw);
        return;
      }
      var group = normalizeGroup(raw);
      if (byId[group.id]) {
        console.warn('[KPOP] 團體 id 重複：' + group.id);
        return;
      }
      byId[group.id] = group;
      groups.push(group);
      return group;
    },
    config: config,
    igHandle: igHandle,
    igUrl: igUrl,
    igAvatar: igAvatar,
    avatarSources: avatarSources,
    all: function () {
      return groups.slice();
    },
    get: function (id) {
      return byId[id] || null;
    },
    slug: slug
  };

  global.KPOP = KPOP;
})(window);
