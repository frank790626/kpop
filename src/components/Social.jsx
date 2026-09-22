import { ICONS, LINK_LABEL } from './icons.jsx';

export default function Social({ group }) {
  const keys = Object.keys(group.links).filter((k) => group.links[k] && ICONS[k]);
  if (!keys.length) return null;

  return (
    <section className="section" id="social">
      <div className="wrap">
        <header className="section-head">
          <h2>官方社群</h2>
          <p className="section-sub">Instagram 最新貼文、YouTube 影片都在這裡更新。</p>
        </header>
        <div className="social-grid">
          {keys.map((k) => (
            <a key={k} className="social-card" href={group.links[k]} target="_blank" rel="noopener noreferrer">
              <span className="social-card-icon">{ICONS[k]}</span>
              <span className="social-card-text">
                <strong>{LINK_LABEL[k] || k}</strong>
                <em>{group.links[k].replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</em>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
