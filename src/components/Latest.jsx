import { dateValue } from '../lib/registry.js';

export default function Latest({ group }) {
  if (!group.releases.length) return null;

  const latest = [...group.releases].sort((a, b) => dateValue(b.date) - dateValue(a.date)).slice(0, 3);

  return (
    <section className="section" id="latest">
      <div className="wrap">
        <header className="section-head">
          <h2>近期發行</h2>
          <p className="section-sub">最新的專輯與單曲，依發行日排序。</p>
        </header>

        <div className="release-grid">
          {latest.map((r, i) => (
            <article className={`release-card${i === 0 ? ' is-newest' : ''}`} key={`${r.date}-${r.title}`}>
              <div className="release-head">
                <span className="release-date">{r.date}</span>
                {i === 0 && <span className="release-flag">最新</span>}
              </div>
              <h3 className="release-title">{r.title}</h3>
              {r.type && <p className="release-type">{r.type}</p>}
              {r.note && <p className="release-note">{r.note}</p>}
              {r.youtubeId && (
                <a
                  className="release-link"
                  href={`https://www.youtube.com/watch?v=${encodeURIComponent(r.youtubeId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  看 M/V →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
