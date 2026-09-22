import { dateValue } from '../lib/registry.js';
import YouTubeEmbed from './YouTubeEmbed.jsx';

export default function Latest({ group }) {
  if (!group.releases.length) return null;

  const latest = [...group.releases].sort((a, b) => dateValue(b.date) - dateValue(a.date)).slice(0, 3);

  return (
    <section className="section" id="latest">
      <div className="wrap">
        <header className="section-head">
          <h2>近期發行</h2>
          <p className="section-sub">最新的專輯與單曲，點縮圖可直接播放主打歌 M/V。</p>
        </header>

        <div className="release-grid">
          {latest.map((r, i) => (
            <article className={`release-card${i === 0 ? ' is-newest' : ''}`} key={`${r.date}-${r.title}`}>
              <YouTubeEmbed youtubeId={r.youtubeId} title={r.title} badge={i === 0 ? '最新' : ''} />

              <div className="release-body">
                <div className="release-head">
                  <span className="release-date">{r.date}</span>
                  {i === 0 && !r.youtubeId && <span className="release-flag">最新</span>}
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
                    在 YouTube 觀看 →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
