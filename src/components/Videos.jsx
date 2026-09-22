import YouTubeEmbed from './YouTubeEmbed.jsx';

export function VideoCard({ video }) {
  return (
    <article className="video-card">
      <YouTubeEmbed
        youtubeId={video.youtubeId}
        title={video.title}
        badge={video.badge}
        noEmbed={video.noEmbed}
      />
      <div className="video-meta">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-sub">
          {video.kind}
          {video.date ? `　${video.date}` : ''}
        </p>
        {video.note && <p className="video-note">{video.note}</p>}
        <a
          className="video-link"
          href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.youtubeId)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
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
          <p className="section-sub">
            依人氣排序，點縮圖即可直接在頁面播放。
            {group.videosUpdatedAt && <span className="section-stamp">資料更新於 {group.videosUpdatedAt}</span>}
          </p>
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
