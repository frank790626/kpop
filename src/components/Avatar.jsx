import { useEffect, useState } from 'react';
import { avatarSources } from '../lib/registry.js';

/**
 * 頭像：依序嘗試 photo → Instagram 大頭貼，全部失敗就只留漸層首字母，
 * 不會出現破圖。
 */
export default function Avatar({ entity, size }) {
  const sources = avatarSources(entity);
  const [index, setIndex] = useState(0);

  // 換人時重新從第一個來源試起
  useEffect(() => setIndex(0), [entity.id, entity.photo, entity.instagram]);

  const src = sources[index];
  const label = entity.stageName || entity.name || '';

  return (
    <span className={`avatar avatar--${size}`} style={{ '--m-color': entity.color || 'var(--accent)' }}>
      <span className="avatar-initial">{(label || '?').charAt(0)}</span>
      {src && (
        <img
          src={src}
          alt={`${label} 的頭像`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setIndex((i) => i + 1)}
        />
      )}
    </span>
  );
}
