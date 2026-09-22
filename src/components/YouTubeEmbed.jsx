import { useState } from 'react';
import { ICONS } from './icons.jsx';

/**
 * 輕量 YouTube 預覽：先只放縮圖，點下去才載入 iframe，
 * 避免一進站就同時初始化多支影片。影片區與近期發行共用這支。
 */
export default function YouTubeEmbed({ youtubeId, title, badge, noEmbed = false }) {
  const [playing, setPlaying] = useState(false);
  const [noThumb, setNoThumb] = useState(false);

  if (!youtubeId) return null;

  const thumb = (
    <>
      <img
        className="video-thumb"
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        onError={() => setNoThumb(true)}
      />
      <button className="video-play" type="button" aria-label={`播放 ${title}`}>
        {ICONS.play}
      </button>
      {badge && <span className="video-badge">{badge}</span>}
    </>
  );

  // 電視台的片段常常禁止外站嵌入，這種就直接開 YouTube，
  // 免得使用者點下去只看到「無法播放」
  if (noEmbed) {
    return (
      <a
        className={`video-frame${noThumb ? ' no-thumb' : ''}`}
        href={`https://www.youtube.com/watch?v=${encodeURIComponent(youtubeId)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`在 YouTube 觀看 ${title}`}
      >
        {thumb}
        <span className="video-external">在 YouTube 開啟</span>
      </a>
    );
  }

  return (
    <div
      className={`video-frame${noThumb ? ' no-thumb' : ''}${playing ? ' is-playing' : ''}`}
      onClick={() => setPlaying(true)}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        thumb
      )}
    </div>
  );
}
