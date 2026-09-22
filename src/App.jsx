import { useCallback, useEffect, useRef, useState } from 'react';
import { groups, getGroup } from './lib/registry.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Members from './components/Members.jsx';
import Latest from './components/Latest.jsx';
import Videos from './components/Videos.jsx';
import Variety from './components/Variety.jsx';
import Social from './components/Social.jsx';
import Timeline from './components/Timeline.jsx';

/**
 * 路由格式（用 hash，GitHub Pages 這類靜態空間不需要伺服器設定）：
 *   #/babymonster            團體頁
 *   #/babymonster/ahyeon     團體頁 + 指定成員
 */
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('popstate', onChange);
    };
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (replace) {
      window.history.replaceState(null, '', to);
      setHash(to);
    } else {
      window.location.hash = to;
    }
  }, []);

  return [hash, navigate];
}

export default function App() {
  const [hash, navigate] = useHash();
  const prevGroupId = useRef(null);

  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const group = getGroup(parts[0]) || groups[0] || null;
  const member = group ? group.members.find((m) => m.id === parts[1]) || group.members[0] : null;
  const canonical = group ? (member ? `#/${group.id}/${member.id}` : `#/${group.id}`) : '';

  // 網址補成完整形式，例如 #/babymonster → #/babymonster/asa
  useEffect(() => {
    if (canonical && hash !== canonical) navigate(canonical, { replace: true });
  }, [canonical, hash, navigate]);

  // 主題色與標題跟著團體走
  useEffect(() => {
    if (!group) return;
    document.documentElement.style.setProperty('--accent', group.theme.accent);
    document.documentElement.style.setProperty('--accent-2', group.theme.accent2);
    document.title = `${group.name}｜K-POP HUB`;
  }, [group]);

  // 換團體時回到頁首（第一次載入不動）
  useEffect(() => {
    if (!group) return;
    if (prevGroupId.current && prevGroupId.current !== group.id) window.scrollTo({ top: 0 });
    prevGroupId.current = group.id;
  }, [group]);

  const selectMember = useCallback(
    (memberId) => {
      if (group) navigate(`#/${group.id}/${memberId}`);
    },
    [group, navigate]
  );

  return (
    <>
      <a className="skip-link" href="#main">
        跳到主要內容
      </a>

      <Header currentId={group?.id} />

      <main id="main" className="app" aria-live="polite">
        {group ? (
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
