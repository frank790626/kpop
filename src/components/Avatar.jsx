import { useEffect, useState } from 'react';
import { avatarSources } from '../lib/registry.js';

/**
 * 頭像：依序嘗試 photo → Instagram 大頭貼，全部失敗就只留漸層首字母，
 * 不會出現破圖。
 */
/**
 * 個別照片的構圖修正：photoFocus: { position: '50% 40%', zoom: 1 }
 *   position → 裁切時對準的位置（CSS object-position）
 *   zoom     → 小頭像的放大倍率（預設 1.3，臉部特寫的照片可設成 1）
 *   lgZoom   → 成員卡大頭像的放大倍率（預設 1；全身照、臉很小的照片才需要）
 * 放大時以 position 為中心，臉就不會被推出框外。
 */
function focusStyle(focus) {
  if (!focus) return undefined;
  return {
    ...(focus.position && { objectPosition: focus.position, '--avatar-origin': focus.position }),
    ...(focus.zoom != null && { '--avatar-zoom': focus.zoom }),
    ...(focus.lgZoom != null && { '--avatar-lg-zoom': focus.lgZoom })
  };
}

export default function Avatar({ entity, size, onActiveChange }) {
  const sources = avatarSources(entity);
  const [index, setIndex] = useState(0);

  // 換人時重新從第一個來源試起
  useEffect(() => setIndex(0), [entity.id, entity.photo, entity.wikiPhoto, entity.instagram]);

  const src = sources[index];

  // 讓外層知道現在顯示的是哪張圖（用來決定要不要標註照片出處）
  useEffect(() => {
    onActiveChange?.(src || '');
  }, [src, onActiveChange]);
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
          style={focusStyle(entity.photoFocus)}
          onError={() => setIndex((i) => i + 1)}
        />
      )}
    </span>
  );
}
