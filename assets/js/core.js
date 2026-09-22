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
