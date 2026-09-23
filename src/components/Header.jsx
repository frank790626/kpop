import { useCallback, useEffect, useRef, useState } from 'react';
import { groups } from '../lib/registry.js';
import { FAVORITES_PATH, pagePath } from '../lib/site.js';
import { HEART } from './icons.jsx';
import { useFavorites } from '../lib/favorites.js';

export default function Header({ currentId, linkTo }) {
  const navRef = useRef(null);
  const { items: favorites } = useFavorites();

  // 切換列放不下時兩端顯示「‹ ›」，看得出後面還有、也能點著捲
  const [edges, setEdges] = useState({ left: false, right: false });
  const updateEdges = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const max = nav.scrollWidth - nav.clientWidth;
    setEdges({ left: nav.scrollLeft > 2, right: nav.scrollLeft < max - 2 });
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    updateEdges();
    nav.addEventListener('scroll', updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(nav);
    return () => {
      nav.removeEventListener('scroll', updateEdges);
      ro.disconnect();
    };
  }, [updateEdges]);

  const scrollNav = (dir) => {
    const nav = navRef.current;
    if (nav) nav.scrollBy({ left: dir * nav.clientWidth * 0.7, behavior: 'smooth' });
  };

  // 切換列放不下時，把目前團體捲進可視範圍（只動切換列，不動整頁）
  useEffect(() => {
    const nav = navRef.current;
    const chip = nav?.querySelector('.group-chip.is-active');
    if (!nav || !chip) return;
    const left = chip.offsetLeft - nav.offsetLeft;
    if (left < nav.scrollLeft || left + chip.offsetWidth > nav.scrollLeft + nav.clientWidth) {
      nav.scrollLeft = left - (nav.clientWidth - chip.offsetWidth) / 2;
    }
    updateEdges();
  }, [currentId, updateEdges]);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="brand" {...linkTo('')}>
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            Frank 的私房<strong>K-POP</strong>
          </span>
        </a>
        <div className={`group-nav-wrap${edges.left ? ' can-left' : ''}${edges.right ? ' can-right' : ''}`}>
        {edges.left && (
          <button type="button" className="nav-arrow nav-arrow--left" aria-label="顯示前面的團體" onClick={() => scrollNav(-1)}>
            ‹
          </button>
        )}
        <nav className="group-nav" aria-label="團體切換" ref={navRef}>
          {groups.map((g) => {
            const active = g.id === currentId;
            return (
              <a
                key={g.id}
                className={`group-chip${active ? ' is-active' : ''}`}
                {...linkTo(pagePath(g))}
                aria-current={active ? 'page' : undefined}
              >
                <span className="chip-dot" style={{ background: g.theme.accent }} />
                {g.name}
              </a>
            );
          })}
          {groups.length < 2 && (
            <span className="group-chip is-ghost" title="複製 src/data/groups/_template.js 就能新增團體">
              ＋ 可新增團體
            </span>
          )}
        </nav>
        {edges.right && (
          <button type="button" className="nav-arrow nav-arrow--right" aria-label="顯示後面的團體" onClick={() => scrollNav(1)}>
            ›
          </button>
        )}
        </div>
        <a
          className={`fav-link${currentId === FAVORITES_PATH ? ' is-active' : ''}`}
          {...linkTo(`${FAVORITES_PATH}/`)}
          aria-current={currentId === FAVORITES_PATH ? 'page' : undefined}
          aria-label={`我的最愛（${favorites.length} 項）`}
        >
          {HEART}
          <span className="fav-link-text">我的最愛</span>
          {favorites.length > 0 && <span className="fav-count">{favorites.length}</span>}
        </a>
      </div>
    </header>
  );
}
