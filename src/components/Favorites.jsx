import Avatar from './Avatar.jsx';
import AccountPanel from './AccountPanel.jsx';
import FavButton from './FavButton.jsx';
import { VideoCard } from './Videos.jsx';
import { getGroup } from '../lib/registry.js';
import { pagePath } from '../lib/site.js';
import { useFavorites } from '../lib/favorites.js';
import { useAccount } from '../lib/account.js';

/** 收藏當下存的是 snapshot；能在目前資料找到就用最新的（照片、noEmbed 等），找不到才用 snapshot */
function resolve(item) {
  const s = item.snapshot || {};
  const group = getGroup(s.groupId);
  if (item.type === 'group') return { group, name: group?.name || s.name };
  if (item.type === 'member') {
    const member = group?.members.find((m) => m.id === s.memberId);
    return {
      group,
      member: member || { id: s.memberId, stageName: s.name, color: s.color },
      groupName: group?.name || s.groupName
    };
  }
  const latest = group && [...group.videos, ...group.variety].find((v) => v.youtubeId === s.youtubeId);
  return { group, video: latest || s };
}

export default function Favorites({ linkTo }) {
  const { items } = useFavorites();
  const { status } = useAccount();
  const groups = items.filter((x) => x.type === 'group').map((x) => ({ item: x, ...resolve(x) }));
  const members = items.filter((x) => x.type === 'member').map((x) => ({ item: x, ...resolve(x) }));
  const videos = items.filter((x) => x.type === 'video').map((x) => ({ item: x, ...resolve(x) }));

  return (
    <>
      <section className="hero hero--compact">
        <div className="wrap">
          <p className="eyebrow">
            {status === 'signedIn' ? '已登入，收藏同步到雲端' : '存在這台裝置的瀏覽器裡，不用登入也能用'}
          </p>
          <h1 className="hero-title">我的最愛</h1>
          <p className="hero-tagline">
            {items.length
              ? `收藏了 ${groups.length} 個團體、${members.length} 位成員、${videos.length} 支影片。`
              : '還沒有收藏。在團體頁、成員卡或影片旁按愛心，就會出現在這裡。'}
          </p>
          <AccountPanel />
        </div>
      </section>

      {groups.length > 0 && (
        <section className="section" id="fav-groups">
          <div className="wrap">
            <header className="section-head">
              <h2>團體・歌手</h2>
            </header>
            <ul className="fav-grid">
              {groups.map(({ item, group, name }) => (
                <li key={item.key} className="fav-tile" style={{ '--m-color': group?.theme.accent || 'var(--accent)' }}>
                  {group ? (
                    <a className="fav-tile-link" {...linkTo(pagePath(group))}>
                      <span className="chip-dot" style={{ background: group.theme.accent }} />
                      <span className="fav-tile-name">{name}</span>
                      {group.nameKo && <span className="fav-tile-sub">{group.nameKo}</span>}
                    </a>
                  ) : (
                    <span className="fav-tile-link is-missing">
                      <span className="fav-tile-name">{name}</span>
                      <span className="fav-tile-sub">已從網站移除</span>
                    </span>
                  )}
                  <FavButton type="group" favKey={item.key} snapshot={item.snapshot} label={name} variant="icon" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {members.length > 0 && (
        <section className="section section--alt" id="fav-members">
          <div className="wrap">
            <header className="section-head">
              <h2>成員</h2>
            </header>
            <ul className="fav-grid">
              {members.map(({ item, group, member, groupName }) => (
                <li key={item.key} className="fav-tile" style={{ '--m-color': member.color }}>
                  {group ? (
                    <a className="fav-tile-link" {...linkTo(pagePath(group, member))}>
                      <Avatar entity={member} size="sm" />
                      <span>
                        <span className="fav-tile-name">{member.stageName}</span>
                        <span className="fav-tile-sub">{groupName}</span>
                      </span>
                    </a>
                  ) : (
                    <span className="fav-tile-link is-missing">
                      <span className="fav-tile-name">{member.stageName}</span>
                      <span className="fav-tile-sub">{groupName}・已從網站移除</span>
                    </span>
                  )}
                  <FavButton
                    type="member"
                    favKey={item.key}
                    snapshot={item.snapshot}
                    label={`${groupName} ${member.stageName}`}
                    variant="icon"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section className="section" id="fav-videos">
          <div className="wrap">
            <header className="section-head">
              <h2>影片</h2>
              <p className="section-sub">點縮圖直接播放。</p>
            </header>
            <div className="video-grid">
              {videos.map(({ item, group, video }) => (
                <VideoCard
                  key={item.key}
                  video={video}
                  group={group || { id: item.snapshot?.groupId, name: item.snapshot?.groupName }}
                  showGroup
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
