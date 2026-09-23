import { VideoCard } from './Videos.jsx';

/** 綜藝節目片段。卡片與熱門影片共用，只是把「M/V」換成節目名稱。 */
export default function Variety({ group }) {
  if (!group.variety.length) return null;

  return (
    <section className="section section--alt" id="variety">
      <div className="wrap">
        <header className="section-head">
          <h2>綜藝節目</h2>
          <p className="section-sub">
            上過的節目片段，點縮圖直接播放。
            {group.varietyUpdatedAt && <span className="section-stamp">資料更新於 {group.varietyUpdatedAt}</span>}
          </p>
        </header>
        <div className="video-grid">
          {group.variety.map((v) => (
            <VideoCard key={v.youtubeId || v.title} video={v} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
