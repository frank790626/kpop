import { HEART } from './icons.jsx';
import { useFavorites } from '../lib/favorites.js';

/**
 * 收藏愛心按鈕。
 * variant="icon" 只有圖示（影片卡用），variant="pill" 附文字（成員卡、團體頁用）
 */
export default function FavButton({ type, favKey, snapshot, label, variant = 'pill' }) {
  const { has, toggle } = useFavorites();
  const active = has(favKey);
  const text = active ? '已收藏' : '收藏';

  return (
    <button
      type="button"
      className={`fav-btn fav-btn--${variant}${active ? ' is-active' : ''}`}
      aria-pressed={active}
      aria-label={`${active ? '取消收藏' : '收藏'} ${label}`}
      title={active ? '從我的最愛移除' : '加入我的最愛'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(type, favKey, snapshot);
      }}
    >
      {HEART}
      {variant === 'pill' && <span>{text}</span>}
    </button>
  );
}
