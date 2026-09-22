import { useState } from 'react';
import { ICONS } from './icons.jsx';

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const [noThumb, setNoThumb] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(video.youtubeId)}`;

  return (
    <article className="video-card">
      <div
        className={`video-frame${noThumb ? ' no-thumb' : ''}${playing ? ' is-playing' : ''}`}
        onClick={() => setPlaying(true)}
      >
        {playing ? (
          // 點了才載入 iframe，避免一進站就被多支影片拖慢
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              className="video-thumb"
              src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              onError={() => setNoThumb(true)}
            />
            <button className="video-play" type="button" aria-label={`播放 ${video.title}`}>
              {ICONS.play}
            </button>
            {video.badge && <span className="video-badge">{video.badge}</span>}
          </>
        )}
      </div>

      <div className="video-meta">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-sub">
          {video.kind}
          {video.date ? `　${video.date}` : ''}
        </p>
        {video.note && <p className="video-note">{video.note}</p>}
        <a className="video-link" href={watchUrl} target="_blank" rel="noopener noreferrer">
          在 YouTube 觀看 →
        </a>
      </div>
    </article>
  );
}

export default function Videos({ group }) {
  if (!group.videos.length) return null;

  return (
    <section className="section section--alt" id="videos">
      <div className="wrap">
        <header className="section-head">
          <h2>熱門影片</h2>
          <p className="section-sub">依人氣排序，點縮圖即可直接在頁面播放。</p>
        </header>
        <div className="video-grid">
          {group.videos.map((v) => (
            <VideoCard key={v.youtubeId || v.title} video={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
