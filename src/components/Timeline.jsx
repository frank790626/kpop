export default function Timeline({ group }) {
  if (!group.releases.length) return null;

  return (
    <section className="section section--alt" id="releases">
      <div className="wrap">
        <header className="section-head">
          <h2>作品年表</h2>
        </header>
        <ol className="timeline">
          {group.releases.map((r) => (
            <li className="timeline-item" key={`${r.date}-${r.title}`}>
              <span className="timeline-date">{r.date}</span>
              <div className="timeline-body">
                <h3>
                  {r.title}
                  {r.type && <span className="timeline-type">{r.type}</span>}
                </h3>
                {r.note && <p>{r.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
