import { useState } from 'react';
import Avatar from './Avatar.jsx';
import { ICONS } from './icons.jsx';
import { ageFrom, igHandle, igUrl } from '../lib/registry.js';

/** Commons 的照片多為 CC BY／CC BY-SA，依授權必須標註作者與授權條款 */
function PhotoCredit({ credit }) {
  return (
    <p className="photo-credit">
      照片：
      <a href={credit.source} target="_blank" rel="noopener noreferrer">
        {credit.artist}
      </a>
      {credit.license && (
        <>
          {' · '}
          {credit.licenseUrl ? (
            <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">
              {credit.license}
            </a>
          ) : (
            credit.license
          )}
        </>
      )}
      {' · Wikimedia Commons'}
    </p>
  );
}

function MemberCard({ group, member }) {
  const [activeSrc, setActiveSrc] = useState('');
  const showCredit = member.photoCredit && activeSrc && activeSrc === member.wikiPhoto;
  const age = ageFrom(member.birth);
  const meta = [
    member.birth && { label: '生日', value: `${member.birth}${age != null ? `（${age} 歲）` : ''}` },
    member.nationality && { label: '國籍', value: member.nationality },
    member.nameEn && { label: '本名', value: member.nameEn },
    member.nameKo && { label: '韓文名', value: member.nameKo }
  ].filter(Boolean);

  const tagFallback = `${(member.stageName || '').toLowerCase().replace(/[^a-z0-9]/g, '')}${group.id.replace(/[^a-z0-9]/g, '')}`;
  const igLink = member.instagram
    ? igUrl(member.instagram)
    : `https://www.instagram.com/explore/tags/${encodeURIComponent(tagFallback)}/`;
  const igLabel = member.instagram ? `@${igHandle(member.instagram)}` : `在 Instagram 找 ${member.stageName}`;

  return (
    <article className="member-card" style={{ '--m-color': member.color }}>
      <div className="member-portrait">
        <Avatar entity={member} size="lg" onActiveChange={setActiveSrc} />
        {showCredit && <PhotoCredit credit={member.photoCredit} />}
      </div>
      <div className="member-body">
        <p className="member-eyebrow">{group.name}</p>
        <h3 className="member-name">
          {member.stageName}
          {member.nameZh && <span className="member-name-zh">{member.nameZh}</span>}
        </h3>

        {member.roles.length > 0 && (
          <ul className="tag-row">
            {member.roles.map((r) => (
              <li className="tag tag--role" key={r}>
                {r}
              </li>
            ))}
          </ul>
        )}

        {member.bio && <p className="member-bio">{member.bio}</p>}

        {meta.length > 0 && (
          <dl className="member-meta">
            {meta.map((x) => (
              <div key={x.label}>
                <dt>{x.label}</dt>
                <dd>{x.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {member.facts.length > 0 && (
          <ul className="tag-row">
            {member.facts.map((f) => (
              <li className="tag" key={f}>
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="member-links">
          <a className="btn btn--ig" href={igLink} target="_blank" rel="noopener noreferrer">
            {ICONS.instagram}
            <span>{igLabel}</span>
          </a>
          {group.links.youtube && (
            <a className="btn btn--ghost" href={group.links.youtube} target="_blank" rel="noopener noreferrer">
              {ICONS.youtube}
              <span>官方頻道</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Members({ group, memberId, onSelect }) {
  if (!group.members.length) return null;
  const member = group.members.find((m) => m.id === memberId) || group.members[0];

  function onKeyDown(e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const ids = group.members.map((m) => m.id);
    const i = ids.indexOf(member.id);
    const next = ids[(i + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length];
    onSelect(next);
    document.querySelector(`.member-tab[data-member="${next}"]`)?.focus();
  }

  return (
    <section className="section" id="members">
      <div className="wrap">
        <header className="section-head">
          <h2>成員介紹</h2>
          <p className="section-sub">點選頭像切換成員，也可以用鍵盤左右鍵。</p>
        </header>

        <div className="member-tabs" role="tablist" aria-label="成員切換" onKeyDown={onKeyDown}>
          {group.members.map((m) => {
            const active = m.id === member.id;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                id={`tab-${m.id}`}
                className={`member-tab${active ? ' is-active' : ''}`}
                data-member={m.id}
                aria-selected={active}
                aria-controls="member-panel"
                tabIndex={active ? 0 : -1}
                style={{ '--m-color': m.color }}
                onClick={() => onSelect(m.id)}
              >
                <Avatar entity={m} size="sm" />
                <span className="member-tab-name">{m.stageName}</span>
              </button>
            );
          })}
        </div>

        <div className="member-panel" id="member-panel" role="tabpanel" tabIndex={0} aria-labelledby={`tab-${member.id}`}>
          <MemberCard key={member.id} group={group} member={member} />
        </div>
      </div>
    </section>
  );
}
