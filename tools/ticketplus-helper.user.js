// ==UserScript==
// @name         TicketPlus 預選區域小幫手
// @namespace    https://github.com/frank790626/kpop
// @version      1.0.0
// @description  在遠大售票 (ticketplus.com.tw) 活動頁自動點「立即售票 / 立即購買」，進入選位頁後依你預先輸入的區域名稱自動選區、加張數。驗證碼與最後送出仍由你自己操作。
// @match        https://ticketplus.com.tw/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(() => {
  'use strict';

  // ---------- 設定 ----------
  // 優先序：網址 hash (#area=A區,B區&qty=2) > 面板儲存的值
  const DEFAULTS = { enabled: true, areas: '', qty: 1, url: '' };
  const load = () => ({ ...DEFAULTS, ...JSON.parse(GM_getValue('cfg', '{}')) });
  const save = (cfg) => GM_setValue('cfg', JSON.stringify(cfg));

  const cfg = load();
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.has('area')) cfg.areas = hash.get('area');
  if (hash.has('qty')) cfg.qty = Math.max(1, parseInt(hash.get('qty'), 10) || 1);
  if (hash.has('area') || hash.has('qty')) save(cfg);

  const keywords = () => cfg.areas.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean);

  // ---------- 工具 ----------
  const norm = (s) => (s || '').replace(/\s+/g, '').toUpperCase();
  const visible = (el) => !!(el && el.offsetParent !== null && el.getClientRects().length);
  const disabled = (el) =>
    el.disabled ||
    el.getAttribute('aria-disabled') === 'true' ||
    el.classList.contains('v-btn--disabled') ||
    el.classList.contains('disabled');
  const SOLD_OUT = /(售完|已售罄|SOLDOUT|剩餘0(?!\d)|剩餘：0(?!\d))/;

  const BUY_TEXT = /^(立即售票|立即購買|立即購票|購買|購票|BUYNOW)$/;
  const clickables = () =>
    [...document.querySelectorAll('button, a, .v-btn, [role="button"]')].filter(visible);

  let status = '待命中';
  const setStatus = (s) => {
    status = s;
    const el = document.getElementById('tph-status');
    if (el) el.textContent = s;
  };

  // ---------- 步驟 1：活動頁 → 點「立即售票」 ----------
  function tryClickBuy() {
    const btn = clickables().find((el) => BUY_TEXT.test(norm(el.textContent)) && !disabled(el));
    if (btn) {
      setStatus('已點擊：' + btn.textContent.trim());
      btn.click();
      return true;
    }
    return false;
  }

  // ---------- 步驟 2：選位頁 → 依關鍵字選區 ----------
  // 遠大選位頁的每個區域是 Vuetify 的 expansion panel；抓不到時退回「含關鍵字的最小可點元素」。
  function areaCandidates() {
    const panels = [...document.querySelectorAll('.v-expansion-panel')].filter(visible);
    if (panels.length) {
      return panels.map((p) => ({
        root: p,
        header: p.querySelector('.v-expansion-panel-header, .v-expansion-panel-title, button') || p,
        text: norm(p.querySelector('.v-expansion-panel-header, .v-expansion-panel-title')?.textContent || p.textContent),
      }));
    }
    return [...document.querySelectorAll('li, tr, .area, [class*="area"], [class*="zone"]')]
      .filter(visible)
      .map((el) => ({ root: el, header: el, text: norm(el.textContent) }));
  }

  let pickedArea = null;
  function tryPickArea() {
    const keys = keywords();
    if (!keys.length) return false;
    const cands = areaCandidates();
    if (!cands.length) return false;

    for (const key of keys) {
      const k = norm(key);
      // 精準相同優先，其次包含
      const matches = [
        ...cands.filter((c) => c.text.startsWith(k)),
        ...cands.filter((c) => !c.text.startsWith(k) && c.text.includes(k)),
      ].filter((c) => !SOLD_OUT.test(c.text) && !disabled(c.header));
      if (matches.length) {
        const m = matches[0];
        const expanded =
          m.root.classList.contains('v-expansion-panel--active') ||
          m.header.getAttribute('aria-expanded') === 'true';
        if (!expanded) m.header.click();
        m.root.scrollIntoView({ block: 'center' });
        m.root.style.outline = '3px solid #ff2d7a';
        pickedArea = m.root;
        setStatus('已選區：' + key);
        return true;
      }
    }
    setStatus('找不到可選的區域（或都已售完）：' + keys.join('、'));
    return false;
  }

  // ---------- 步驟 3：加張數 ----------
  let qtyDone = false;
  let plusClicks = 0;
  function trySetQty() {
    if (!pickedArea || qtyDone) return qtyDone;
    const target = Math.max(1, cfg.qty | 0);

    // 下拉選單式
    const select = pickedArea.querySelector('select');
    if (select) {
      select.value = String(target);
      select.dispatchEvent(new Event('change', { bubbles: true }));
      qtyDone = true;
      return true;
    }

    // +/- 按鈕式：預設 0 張，每個 tick 按一次「+」直到達到張數
    const plus = [...pickedArea.querySelectorAll('button, .v-btn')]
      .filter(visible)
      .find((b) => b.querySelector('.mdi-plus') || norm(b.textContent) === '+');
    if (!plus || disabled(plus)) return false;
    plus.click();
    plusClicks++;
    if (plusClicks >= target) {
      qtyDone = true;
      setStatus(`已選區並設定 ${target} 張，請輸入驗證碼後自行送出`);
    }
    return qtyDone;
  }

  // ---------- 主迴圈 ----------
  let lastPath = '';
  let buyClicked = false;
  function tick() {
    if (!cfg.enabled) return;
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      buyClicked = false;
      pickedArea = null;
      qtyDone = false;
      plusClicks = 0;
    }
    if (location.pathname.startsWith('/activity/')) {
      if (!buyClicked) {
        buyClicked = tryClickBuy();
        if (!buyClicked) setStatus('等待「立即售票」按鈕開放…');
      }
    } else if (location.pathname.startsWith('/order/') || areaCandidates().length) {
      if (!pickedArea) tryPickArea();
      else trySetQty();
    }
  }
  setInterval(tick, 300);

  // ---------- 控制面板 ----------
  function panel() {
    const box = document.createElement('div');
    box.id = 'tph-panel';
    box.innerHTML = `
      <style>
        #tph-panel{position:fixed;right:12px;bottom:12px;z-index:99999;width:260px;
          font:13px/1.4 system-ui,sans-serif;background:#16161d;color:#eee;border-radius:10px;
          box-shadow:0 6px 24px rgba(0,0,0,.4);padding:10px 12px}
        #tph-panel label{display:block;margin:6px 0 2px;color:#aaa}
        #tph-panel input,#tph-panel textarea{width:100%;box-sizing:border-box;background:#24242e;
          color:#fff;border:1px solid #3a3a48;border-radius:6px;padding:5px 7px;font:inherit}
        #tph-panel textarea{height:52px;resize:vertical}
        #tph-panel .row{display:flex;gap:6px;margin-top:8px}
        #tph-panel button{flex:1;border:0;border-radius:6px;padding:6px;cursor:pointer;
          background:#ff2d7a;color:#fff;font:inherit}
        #tph-panel button.ghost{background:#33333f}
        #tph-panel .hd{display:flex;justify-content:space-between;align-items:center;font-weight:600}
        #tph-status{margin-top:8px;color:#ffd166;word-break:break-all}
        #tph-panel.min .bd{display:none}
      </style>
      <div class="hd"><span>🎫 預選區域小幫手</span>
        <label style="margin:0;color:#eee"><input type="checkbox" id="tph-on" style="width:auto"> 啟用</label></div>
      <div class="bd">
        <label>活動網址</label>
        <input id="tph-url" placeholder="https://ticketplus.com.tw/activity/...">
        <label>區域名稱（可多個，用逗號或換行分隔，依序嘗試）</label>
        <textarea id="tph-areas" placeholder="例：VIP, 紅2A, 搖滾區"></textarea>
        <label>張數</label>
        <input id="tph-qty" type="number" min="1" max="4">
        <div class="row"><button id="tph-save">儲存</button><button id="tph-go" class="ghost">儲存並前往</button></div>
      </div>
      <div id="tph-status"></div>`;
    document.body.appendChild(box);

    const $ = (id) => box.querySelector('#' + id);
    $('tph-on').checked = cfg.enabled;
    $('tph-url').value = cfg.url || (location.pathname.startsWith('/activity/') ? location.href.split('#')[0] : '');
    $('tph-areas').value = cfg.areas;
    $('tph-qty').value = cfg.qty;
    $('tph-status').textContent = status;

    const read = () => {
      cfg.enabled = $('tph-on').checked;
      cfg.url = $('tph-url').value.trim();
      cfg.areas = $('tph-areas').value;
      cfg.qty = Math.max(1, parseInt($('tph-qty').value, 10) || 1);
      save(cfg);
    };
    $('tph-on').onchange = () => { read(); setStatus(cfg.enabled ? '已啟用' : '已暫停'); };
    $('tph-save').onclick = () => { read(); pickedArea = null; qtyDone = false; plusClicks = 0; setStatus('已儲存'); };
    $('tph-go').onclick = () => {
      read();
      if (!/^https:\/\/ticketplus\.com\.tw\//.test(cfg.url)) return setStatus('請輸入 ticketplus.com.tw 的網址');
      location.href = cfg.url;
    };
  }
  panel();
})();
