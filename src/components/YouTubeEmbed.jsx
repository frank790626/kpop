import { useState } from 'react';
import { ICONS } from './icons.jsx';

/**
 * 輕量 YouTube 預覽：先只放縮圖，點下去才載入 iframe，
 * 避免一進站就同時初始化多支影片。影片區與近期發行共用這支。
 */
export default function YouTubeEmbed({ youtubeId, title, badge }) {
  const [playing, setPlaying] = useState(false);
  const [noThumb, setNoThumb] = useState(false);

  if (!youtubeId) return null;

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
      )}
    </div>
  );
}
