import { useCallback, useEffect, useRef, useState } from 'react';
import { groups, getGroup } from './lib/registry.js';
import { FAVORITES_PATH, pageMeta, pagePath } from './lib/site.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Members from './components/Members.jsx';
import Latest from './components/Latest.jsx';
import Videos from './components/Videos.jsx';
import Variety from './components/Variety.jsx';
import Social from './components/Social.jsx';
import Timeline from './components/Timeline.jsx';
import Favorites from './components/Favorites.jsx';

/**
 * 路由格式（真正的網址路徑，每一頁都有建置時預先產生的 HTML，搜尋引擎抓得到）：
 *   /kpop/                   首頁（顯示第一個團體）
 *   /kpop/babymonster/       團體頁
 *   /kpop/babymonster/ahyeon/ 團體頁 + 指定成員
 * 舊的 #/babymonster/ahyeon 連結會自動轉成新網址。
 */
const BASE = import.meta.env.BASE_URL; // 例：/kpop/

function currentParts() {
  const { pathname } = window.location;
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '');
  return rest.split('/').filter(Boolean);
}

function useRoute() {
  const [parts, setParts] = useState(() => {
    const legacy = window.location.hash.match(/^#\/(.+)/);
    if (legacy) {
      const p = legacy[1].split('/').filter(Boolean);
      window.history.replaceState(null, '', `${BASE}${p.map((x) => `${x}/`).join('')}`);
      return p;
    }
    return currentParts();
  });

  useEffect(() => {
    const onPop = () => setParts(currentParts());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((path, { replace = false } = {}) => {
    window.history[replace ? 'replaceState' : 'pushState'](null, '', `${BASE}${path}`);
    setParts(path.split('/').filter(Boolean));
  }, []);

  return [parts, navigate];
}

export default function App() {
  const [parts, navigate] = useRoute();
  const prevGroupId = useRef(null);

  const isFavorites = parts[0] === FAVORITES_PATH;
  const routeGroup = isFavorites ? null : getGroup(parts[0]);
  const group = routeGroup || groups[0] || null;
  const routeMember = routeGroup?.members.find((m) => m.id === parts[1]) || null;
  const member = routeMember || group?.members[0] || null;

  // 找不到的團體或成員：把網址修正成實際顯示的那一頁
  useEffect(() => {
    if (isFavorites) {
      if (parts.length > 1) navigate(`${FAVORITES_PATH}/`, { replace: true });
    } else if (parts.length && !routeGroup) navigate('', { replace: true });
    else if (parts.length > 1 && !routeMember && routeGroup) navigate(pagePath(routeGroup), { replace: true });
  }, [parts, isFavorites, routeGroup, routeMember, navigate]);

  // 主題色與標題跟著頁面走
  useEffect(() => {
    if (!group) return;
    document.documentElement.style.setProperty('--accent', group.theme.accent);
    document.documentElement.style.setProperty('--accent-2', group.theme.accent2);
    document.title = pageMeta({ groups, group: routeGroup, member: routeMember, favorites: isFavorites }).title;
  }, [group, routeGroup, routeMember, isFavorites]);

  // 換團體時回到頁首（第一次載入不動）
  useEffect(() => {
    if (!group) return;
    const pageId = isFavorites ? FAVORITES_PATH : group.id;
    if (prevGroupId.current && prevGroupId.current !== pageId) window.scrollTo({ top: 0 });
    prevGroupId.current = pageId;
  }, [group, isFavorites]);

  /** 站內連結：一般點擊就不重新載入頁面，Ctrl／Cmd＋點擊照樣開新分頁 */
  const linkTo = useCallback(
    (path) => ({
      href: `${BASE}${path}`,
      onClick: (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(path);
      }
    }),
    [navigate]
  );

  const selectMember = useCallback(
    (memberId) => {
      if (!group) return;
      const m = group.members.find((x) => x.id === memberId);
      if (m) navigate(pagePath(group, m));
    },
    [group, navigate]
  );

  return (
    <>
      <a className="skip-link" href="#main">
        跳到主要內容
      </a>

      <Header currentId={isFavorites ? FAVORITES_PATH : routeGroup?.id} linkTo={linkTo} />

      <main id="main" className="app" aria-live="polite">
        {isFavorites ? (
          <Favorites linkTo={linkTo} />
        ) : group ? (
          <>
            <Hero group={group} />
            <Members group={group} memberId={member?.id} onSelect={selectMember} />
            <Variety group={group} />
            <Latest group={group} />
            <Videos group={group} />
            <Social group={group} />
            <Timeline group={group} />
          </>
        ) : (
          <section className="section">
            <div className="wrap empty">
              <h1>還沒有任何團體資料</h1>
              <p>
                複製 <code>src/data/groups/_template.js</code>，填好資料存檔就會自動出現在這裡。
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p className="footer-note">
            本站為非官方粉絲介紹頁，所有圖片、影片與商標版權屬於原經紀公司與各平台所有。
          </p>
          <p className="footer-note muted">
            資料整理自公開報導與官方社群，若有更新或誤植，請直接修改 <code>src/data/groups/</code> 內的資料檔。
          </p>
        </div>
      </footer>
    </>
  );
}
