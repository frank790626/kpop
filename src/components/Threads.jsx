import { useState } from 'react';

/** 「3 小時前」這類相對時間 */
function timeAgo(iso) {
  const t = Date.parse(iso);
  if (!t) return '';
  const min = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (min < 60) return `${min || 1} 分鐘前`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} 小時前`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day} 天前`;
  return new Date(t).toLocaleDateString('zh-TW');
}

/** 貼文的圖片或影片；Threads 的媒體網址會過期，載不到就整塊隱藏 */
function PostMedia({ post }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;

  if (post.mediaType === 'VIDEO' && post.mediaUrl) {
    return (
      <video
        className="thread-media"
        src={post.mediaUrl}
        poster={post.thumbnailUrl || undefined}
        controls
        playsInline
        preload="none"
        onError={() => setBroken(true)}
      />
    );
  }
  const src = post.thumbnailUrl || post.mediaUrl;
  if (!src) return null;
  return (
    <img
      className="thread-media"
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
    />
  );
}

function ThreadPost({ post }) {
  const [open, setOpen] = useState(false);
  const long = post.text.length > 160;

  return (
    <article className="thread-card">
      <header className="thread-head">
        <span className="thread-avatar" aria-hidden="true">
          {(post.username || '?').slice(0, 1).toUpperCase()}
        </span>
        <span className="thread-user">@{post.username || '匿名'}</span>
        <time className="thread-time" dateTime={post.timestamp}>
          {timeAgo(post.timestamp)}
        </time>
      </header>
      <p className={`thread-text${long && !open ? ' is-clamped' : ''}`}>{post.text}</p>
      {long && (
        <button type="button" className="thread-more" onClick={() => setOpen((v) => !v)}>
          {open ? '收合' : '顯示全文'}
        </button>
      )}
      <PostMedia post={post} />
    </article>
  );
}

/** Threads 熱門貼文：每 6 小時由 scripts/update-threads.mjs 更新，內容直接顯示在頁面上 */
export default function Threads({ group }) {
  if (!group.threads.length) return null;

  return (
    <section className="section" id="threads">
      <div className="wrap">
        <header className="section-head">
          <h2>Threads 熱門討論</h2>
          <p className="section-sub">
            Threads 上關於 {group.name} 的熱門貼文，每 6 小時更新。
            {group.threadsUpdatedAt && (
              <span className="section-stamp">更新於 {new Date(group.threadsUpdatedAt).toLocaleString('zh-TW', { hour12: false })}</span>
            )}
          </p>
        </header>
        <div className="thread-grid">
          {group.threads.map((p) => (
            <ThreadPost key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
