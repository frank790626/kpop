import { groups } from '../lib/registry.js';

export default function Header({ currentId }) {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            K-POP<strong>HUB</strong>
          </span>
        </a>
        <nav className="group-nav" aria-label="團體切換">
          {groups.map((g) => {
            const active = g.id === currentId;
            return (
              <a
                key={g.id}
                className={`group-chip${active ? ' is-active' : ''}`}
                href={`#/${g.id}`}
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
      </div>
    </header>
  );
}
