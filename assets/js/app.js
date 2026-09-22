/**
 * app.js — 畫面渲染與路由
 *
 * 路由格式：
 *   #/babymonster              團體頁
 *   #/babymonster/ahyeon       團體頁 + 指定成員
 *
 * 這支程式完全依照 KPOP.all() 的資料渲染，新增團體不需要動到這裡。
 */
(function () {
  'use strict';

  var main = document.getElementById('main');
  var groupNav = document.getElementById('group-nav');
  var state = { groupId: null, memberId: null };

  // ── 小工具 ───────────────────────────────────────────────
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /** 由生日推算目前年齡（只接受 YYYY.MM.DD 或 YYYY-MM-DD） */
  function ageFrom(birth) {
    var m = String(birth || '').match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
    if (!m) return null;
    var b = new Date(+m[1], +m[2] - 1, +m[3]);
    var now = new Date();
    var age = now.getFullYear() - b.getFullYear();
    var before = now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate());
    return before ? age - 1 : age;
  }

  /** 把 YYYY.MM.DD / YYYY.MM 轉成可排序的數字 */
  function dateValue(text) {
    var m = String(text || '').match(/(\d{4})(?:[.\-/](\d{1,2}))?(?:[.\-/](\d{1,2}))?/);
    if (!m) return 0;
    return new Date(+m[1], (+m[2] || 1) - 1, +m[3] || 1).getTime();
  }

  var ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 2c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.2.77-.3.3-.6.7-.8 1.2-.2.4-.3 1-.4 2.1C2.8 9.9 2.8 10.3 2.8 12s0 2.1.07 3.3c.05 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.3.3.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.06 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.2 2.1-.4.5-.2.9-.5 1.2-.8.3-.3.6-.7.8-1.2.2-.4.3-1 .4-2.1.06-1.2.07-1.6.07-3.3s0-2.1-.07-3.3c-.05-1.1-.2-1.7-.4-2.1-.2-.5-.5-.9-.8-1.2-.3-.3-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.2-.06-1.6-.07-4.7-.07z"/><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4z"/><circle cx="17.2" cy="6.8" r="1.2"/></svg>',
    youtube:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 12s0-3.5-.45-5.17a2.7 2.7 0 0 0-1.9-1.9C18.95 4.5 12 4.5 12 4.5s-6.95 0-8.65.43a2.7 2.7 0 0 0-1.9 1.9C1 8.5 1 12 1 12s0 3.5.45 5.17a2.7 2.7 0 0 0 1.9 1.9c1.7.43 8.65.43 8.65.43s6.95 0 8.65-.43a2.7 2.7 0 0 0 1.9-1.9C23 15.5 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.7 21H1.5l7.5-8.6L1.2 3h6.6l4.5 5.6L17.5 3zm-1.1 16.1h1.8L7.7 4.8H5.8l10.6 14.3z"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 2h-3v13.3a2.6 2.6 0 1 1-2.2-2.6v-3a5.6 5.6 0 1 0 5.2 5.6V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.4 4.4 0 0 1-4.3-4.4V2z"/></svg>',
    website: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.9a15.7 15.7 0 0 0-1.3-3.6A8 8 0 0 1 18.9 8zM12 4c.7 1 1.3 2.4 1.7 4h-3.4C10.7 6.4 11.3 5 12 4zM4.3 14a8 8 0 0 1 0-4h3.3a17.6 17.6 0 0 0 0 4H4.3zm.8 2h2.9c.3 1.3.8 2.5 1.3 3.6A8 8 0 0 1 5.1 16zm2.9-8H5.1a8 8 0 0 1 4.2-3.6C8.8 5.5 8.3 6.7 8 8zm4 12c-.7-1-1.3-2.4-1.7-4h3.4c-.4 1.6-1 3-1.7 4zm2.1-6H9.9a15.6 15.6 0 0 1 0-4h4.2a15.6 15.6 0 0 1 0 4zm.6 5.6c.5-1.1 1-2.3 1.3-3.6h2.9a8 8 0 0 1-4.2 3.6zM16.4 14a17.6 17.6 0 0 0 0-4h3.3a8 8 0 0 1 0 4h-3.3z"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
  };

  var LINK_LABEL = { instagram: 'Instagram', youtube: 'YouTube', x: 'X', tiktok: 'TikTok', website: '官方網站' };

  // ── 上方團體切換列 ────────────────────────────────────────
  function renderGroupNav() {
    var groups = KPOP.all();
    var html = groups
      .map(function (g) {
        return (
          '<a class="group-chip" href="#/' + esc(g.id) + '" data-group="' + esc(g.id) + '">' +
          '<span class="chip-dot" style="background:' + esc(g.theme.accent) + '"></span>' +
          esc(g.name) +
          '</a>'
        );
      })
      .join('');

    if (groups.length < 2) {
      html += '<span class="group-chip is-ghost" title="複製 data/groups/_template.js 就能新增團體">＋ 可新增團體</span>';
    }
    groupNav.innerHTML = html;
  }

  function syncGroupNav() {
    Array.prototype.forEach.call(groupNav.querySelectorAll('.group-chip'), function (a) {
      var on = a.dataset.group === state.groupId;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  // ── 區塊：Hero ───────────────────────────────────────────
  function heroHTML(g) {
    var links = Object.keys(g.links)
      .filter(function (k) { return g.links[k] && ICONS[k]; })
      .map(function (k) {
        return (
          '<a class="social" href="' + esc(g.links[k]) + '" target="_blank" rel="noopener noreferrer">' +
          ICONS[k] + '<span>' + esc(LINK_LABEL[k] || k) + '</span></a>'
        );
      })
      .join('');

    var facts = (g.facts || [])
      .map(function (f) {
        return '<div class="fact"><dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd></div>';
      })
      .join('');

    var avatar = g.links.instagram
      ? '<div class="hero-avatar">' +
        avatarHTML({ stageName: g.name, photo: g.photo, instagram: g.links.instagram, color: g.theme.accent }, 'md') +
        '<span class="hero-avatar-tag">@' + esc(KPOP.igHandle(g.links.instagram)) + '</span>' +
        '</div>'
      : '';

    return (
      '<section class="hero">' +
        '<div class="wrap hero-inner">' +
          '<div class="hero-copy">' +
            avatar +
            '<p class="eyebrow">' + esc(g.agency) + (g.debut ? ' ・ ' + esc(g.debut) + ' 出道' : '') + '</p>' +
            '<h1 class="hero-title">' + esc(g.name) + '</h1>' +
            '<p class="hero-sub">' + esc(g.nameKo) + (g.nameZh ? '　' + esc(g.nameZh) : '') + '</p>' +
            (g.tagline ? '<p class="hero-tagline">' + esc(g.tagline) + '</p>' : '') +
            (links ? '<div class="social-row">' + links + '</div>' : '') +
          '</div>' +
          (facts ? '<dl class="fact-grid">' + facts + '</dl>' : '') +
        '</div>' +
        (g.intro && g.intro.length
          ? '<div class="wrap"><div class="intro">' +
            g.intro.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
            '</div></div>'
          : '') +
      '</section>'
    );
  }

  // ── 區塊：成員 ───────────────────────────────────────────
  /**
   * 頭像：依序嘗試 photo → Instagram 大頭貼，都失敗就留下漸層首字母。
   * 失敗的接手邏輯在下面的 avatar error 監聽器。
   */
  function avatarHTML(entity, size) {
    var initial = esc((entity.stageName || entity.name || '?').charAt(0));
    var sources = KPOP.avatarSources(entity);
    var img = '';

    if (sources.length) {
      img =
        '<img src="' + esc(sources[0]) + '" alt="' + esc(entity.stageName || entity.name) + ' 的頭像" ' +
        'loading="lazy" referrerpolicy="no-referrer" ' +
        'data-avatar-fallbacks="' + esc(JSON.stringify(sources.slice(1))) + '">';
    }

    return (
      '<span class="avatar avatar--' + size + '" style="--m-color:' + esc(entity.color || 'var(--accent)') + '">' +
      '<span class="avatar-initial">' + initial + '</span>' +
      img +
      '</span>'
    );
  }

  // 圖片載不到時換下一個來源，全部失敗就移除圖片，露出底下的首字母頭像
  document.addEventListener(
    'error',
    function (e) {
      var img = e.target;
      if (!img || img.tagName !== 'IMG' || !img.closest('.avatar')) return;
      var next = [];
      try { next = JSON.parse(img.dataset.avatarFallbacks || '[]'); } catch (err) { next = []; }
      if (next.length) {
        img.dataset.avatarFallbacks = JSON.stringify(next.slice(1));
        img.src = next[0];
      } else {
        img.remove();
      }
    },
    true
  );

  function memberTabsHTML(g) {
    return (
      '<div class="member-tabs" role="tablist" aria-label="成員切換">' +
      g.members
        .map(function (m) {
          return (
            '<button class="member-tab" role="tab" type="button" id="tab-' + esc(m.id) + '" ' +
            'aria-controls="member-panel" aria-selected="false" data-member="' + esc(m.id) + '" ' +
            'style="--m-color:' + esc(m.color) + '">' +
            avatarHTML(m, 'sm') +
            '<span class="member-tab-name">' + esc(m.stageName) + '</span>' +
            '</button>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function memberPanelHTML(g, m) {
    var age = ageFrom(m.birth);
    var meta = [
      m.birth ? { label: '生日', value: m.birth + (age != null ? '（' + age + ' 歲）' : '') } : null,
      m.nationality ? { label: '國籍', value: m.nationality } : null,
      m.nameEn ? { label: '本名', value: m.nameEn } : null,
      m.nameKo ? { label: '韓文名', value: m.nameKo } : null
    ].filter(Boolean);

    var ig = m.instagram
      ? KPOP.igUrl(m.instagram)
      : 'https://www.instagram.com/explore/tags/' +
        encodeURIComponent((m.stageName || '').toLowerCase().replace(/[^a-z0-9]/g, '') + g.id.replace(/[^a-z0-9]/g, '')) +
        '/';
    var igLabel = m.instagram ? '@' + KPOP.igHandle(m.instagram) : '在 Instagram 找 ' + m.stageName;

    return (
      '<article class="member-card" style="--m-color:' + esc(m.color) + '">' +
        '<div class="member-portrait">' + avatarHTML(m, 'lg') + '</div>' +
        '<div class="member-body">' +
          '<p class="member-eyebrow">' + esc(g.name) + '</p>' +
          '<h3 class="member-name">' + esc(m.stageName) +
            (m.nameZh ? '<span class="member-name-zh">' + esc(m.nameZh) + '</span>' : '') +
          '</h3>' +
          (m.roles.length
            ? '<ul class="tag-row">' + m.roles.map(function (r) { return '<li class="tag tag--role">' + esc(r) + '</li>'; }).join('') + '</ul>'
            : '') +
          (m.bio ? '<p class="member-bio">' + esc(m.bio) + '</p>' : '') +
          (meta.length
            ? '<dl class="member-meta">' +
              meta.map(function (x) { return '<div><dt>' + esc(x.label) + '</dt><dd>' + esc(x.value) + '</dd></div>'; }).join('') +
              '</dl>'
            : '') +
          (m.facts.length
            ? '<ul class="tag-row">' + m.facts.map(function (f) { return '<li class="tag">' + esc(f) + '</li>'; }).join('') + '</ul>'
            : '') +
          '<div class="member-links">' +
            '<a class="btn btn--ig" href="' + esc(ig) + '" target="_blank" rel="noopener noreferrer">' +
              ICONS.instagram + '<span>' + esc(igLabel) + '</span></a>' +
            (g.links.youtube
              ? '<a class="btn btn--ghost" href="' + esc(g.links.youtube) + '" target="_blank" rel="noopener noreferrer">' +
                ICONS.youtube + '<span>官方頻道</span></a>'
              : '') +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function membersSectionHTML(g) {
    return (
      '<section class="section" id="members">' +
        '<div class="wrap">' +
          '<header class="section-head">' +
            '<h2>成員介紹</h2>' +
            '<p class="section-sub">點選頭像切換成員，也可以用鍵盤左右鍵。</p>' +
          '</header>' +
          memberTabsHTML(g) +
          '<div class="member-panel" id="member-panel" role="tabpanel" tabindex="0"></div>' +
        '</div>' +
      '</section>'
    );
  }

  // ── 區塊：近期發行 ────────────────────────────────────────
  function latestSectionHTML(g) {
    if (!g.releases.length) return '';

    var latest = g.releases
      .slice()
      .sort(function (a, b) { return dateValue(b.date) - dateValue(a.date); })
      .slice(0, 3);

    var cards = latest
      .map(function (r, i) {
        var mv = r.youtubeId
          ? '<a class="release-link" href="https://www.youtube.com/watch?v=' + encodeURIComponent(r.youtubeId) +
            '" target="_blank" rel="noopener noreferrer">看 M/V →</a>'
          : '';
        return (
          '<article class="release-card' + (i === 0 ? ' is-newest' : '') + '">' +
            '<div class="release-head">' +
              '<span class="release-date">' + esc(r.date) + '</span>' +
              (i === 0 ? '<span class="release-flag">最新</span>' : '') +
            '</div>' +
            '<h3 class="release-title">' + esc(r.title) + '</h3>' +
            (r.type ? '<p class="release-type">' + esc(r.type) + '</p>' : '') +
            (r.note ? '<p class="release-note">' + esc(r.note) + '</p>' : '') +
            mv +
          '</article>'
        );
      })
      .join('');

    return (
      '<section class="section" id="latest">' +
        '<div class="wrap">' +
          '<header class="section-head">' +
            '<h2>近期發行</h2>' +
            '<p class="section-sub">最新的專輯與單曲，依發行日排序。</p>' +
          '</header>' +
          '<div class="release-grid">' + cards + '</div>' +
        '</div>' +
      '</section>'
    );
  }

  // ── 區塊：熱門影片 ────────────────────────────────────────
  function videosSectionHTML(g) {
    if (!g.videos.length) return '';
    var cards = g.videos
      .map(function (v) {
        var url = 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.youtubeId);
        return (
          '<article class="video-card">' +
            '<div class="video-frame" data-yt="' + esc(v.youtubeId) + '" data-title="' + esc(v.title) + '">' +
              '<img class="video-thumb" src="https://i.ytimg.com/vi/' + esc(v.youtubeId) + '/hqdefault.jpg" ' +
                'alt="" loading="lazy" onerror="this.closest(\'.video-frame\').classList.add(\'no-thumb\')">' +
              '<button class="video-play" type="button" aria-label="播放 ' + esc(v.title) + '">' + ICONS.play + '</button>' +
              (v.badge ? '<span class="video-badge">' + esc(v.badge) + '</span>' : '') +
            '</div>' +
            '<div class="video-meta">' +
              '<h3 class="video-title">' + esc(v.title) + '</h3>' +
              '<p class="video-sub">' + esc(v.kind) + (v.date ? '　' + esc(v.date) : '') + '</p>' +
              (v.note ? '<p class="video-note">' + esc(v.note) + '</p>' : '') +
              '<a class="video-link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">在 YouTube 觀看 →</a>' +
            '</div>' +
          '</article>'
        );
      })
      .join('');

    return (
      '<section class="section section--alt" id="videos">' +
        '<div class="wrap">' +
          '<header class="section-head">' +
            '<h2>熱門影片</h2>' +
            '<p class="section-sub">依人氣排序，點縮圖即可直接在頁面播放。</p>' +
          '</header>' +
          '<div class="video-grid">' + cards + '</div>' +
        '</div>' +
      '</section>'
    );
  }

  // ── 區塊：社群 ───────────────────────────────────────────
  function socialSectionHTML(g) {
    var keys = Object.keys(g.links).filter(function (k) { return g.links[k] && ICONS[k]; });
    if (!keys.length) return '';
    var cards = keys
      .map(function (k) {
        return (
          '<a class="social-card" href="' + esc(g.links[k]) + '" target="_blank" rel="noopener noreferrer">' +
            '<span class="social-card-icon">' + ICONS[k] + '</span>' +
            '<span class="social-card-text"><strong>' + esc(LINK_LABEL[k] || k) + '</strong>' +
            '<em>' + esc(g.links[k].replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')) + '</em></span>' +
          '</a>'
        );
      })
      .join('');

    return (
      '<section class="section" id="social">' +
        '<div class="wrap">' +
          '<header class="section-head">' +
            '<h2>官方社群</h2>' +
            '<p class="section-sub">Instagram 最新貼文、YouTube 影片都在這裡更新。</p>' +
          '</header>' +
          '<div class="social-grid">' + cards + '</div>' +
        '</div>' +
      '</section>'
    );
  }

  // ── 區塊：作品年表 ────────────────────────────────────────
  function releasesSectionHTML(g) {
    if (!g.releases.length) return '';
    var items = g.releases
      .map(function (r) {
        return (
          '<li class="timeline-item">' +
            '<span class="timeline-date">' + esc(r.date) + '</span>' +
            '<div class="timeline-body">' +
              '<h3>' + esc(r.title) + (r.type ? '<span class="timeline-type">' + esc(r.type) + '</span>' : '') + '</h3>' +
              (r.note ? '<p>' + esc(r.note) + '</p>' : '') +
            '</div>' +
          '</li>'
        );
      })
      .join('');

    return (
      '<section class="section section--alt" id="releases">' +
        '<div class="wrap">' +
          '<header class="section-head"><h2>作品年表</h2></header>' +
          '<ol class="timeline">' + items + '</ol>' +
        '</div>' +
      '</section>'
    );
  }

  // ── 成員切換 ─────────────────────────────────────────────
  function selectMember(g, memberId, opts) {
    var member = g.members.filter(function (m) { return m.id === memberId; })[0] || g.members[0];
    if (!member) return;
    state.memberId = member.id;

    var panel = document.getElementById('member-panel');
    if (panel) {
      panel.innerHTML = memberPanelHTML(g, member);
      panel.setAttribute('aria-labelledby', 'tab-' + member.id);
    }

    Array.prototype.forEach.call(document.querySelectorAll('.member-tab'), function (tab) {
      var on = tab.dataset.member === member.id;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
    });

    var hash = '#/' + g.id + '/' + member.id;
    if (location.hash !== hash) {
      if (opts && opts.replace) history.replaceState(null, '', hash);
      else history.pushState(null, '', hash);
    }
  }

  // ── 渲染團體頁 ───────────────────────────────────────────
  function renderGroup(g, memberId) {
    state.groupId = g.id;
    document.documentElement.style.setProperty('--accent', g.theme.accent);
    document.documentElement.style.setProperty('--accent-2', g.theme.accent2);
    document.title = g.name + '｜K-POP HUB';

    main.innerHTML =
      heroHTML(g) +
      membersSectionHTML(g) +
      latestSectionHTML(g) +
      videosSectionHTML(g) +
      socialSectionHTML(g) +
      releasesSectionHTML(g);

    syncGroupNav();
    selectMember(g, memberId, { replace: true });
    bindGroupEvents(g);
  }

  function bindGroupEvents(g) {
    var tabs = document.querySelector('.member-tabs');
    if (tabs) {
      tabs.addEventListener('click', function (e) {
        var tab = e.target.closest('.member-tab');
        if (tab) selectMember(g, tab.dataset.member);
      });
      tabs.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var ids = g.members.map(function (m) { return m.id; });
        var i = ids.indexOf(state.memberId);
        var next = ids[(i + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length];
        selectMember(g, next);
        var btn = document.querySelector('.member-tab[data-member="' + next + '"]');
        if (btn) btn.focus();
      });
    }

    // YouTube：點了才載入 iframe，避免一進頁面就拖慢速度
    main.addEventListener('click', function (e) {
      var frame = e.target.closest('.video-frame');
      if (!frame || frame.classList.contains('is-playing')) return;
      var id = frame.dataset.yt;
      frame.classList.add('is-playing');
      frame.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
        '?autoplay=1&rel=0" title="' + esc(frame.dataset.title) +
        '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    });
  }

  function renderEmpty() {
    main.innerHTML =
      '<section class="section"><div class="wrap empty">' +
      '<h1>還沒有任何團體資料</h1>' +
      '<p>複製 <code>data/groups/_template.js</code>，填好資料後在 <code>index.html</code> 加上一行 script 就會出現在這裡。</p>' +
      '</div></section>';
  }

  // ── 路由 ─────────────────────────────────────────────────
  function route() {
    var groups = KPOP.all();
    if (!groups.length) return renderEmpty();

    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var group = KPOP.get(parts[0]) || groups[0];
    var memberId = parts[1];

    if (group.id !== state.groupId) {
      renderGroup(group, memberId);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else if (memberId && memberId !== state.memberId) {
      selectMember(group, memberId, { replace: true });
    }
  }

  renderGroupNav();
  window.addEventListener('hashchange', route);
  window.addEventListener('popstate', route);
  route();
})();
