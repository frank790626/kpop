import Avatar from './Avatar.jsx';
import FavButton from './FavButton.jsx';
import { favKey, favSnapshot } from '../lib/favorites.js';
import { ICONS, LINK_LABEL } from './icons.jsx';
import { igHandle } from '../lib/registry.js';

export default function Hero({ group }) {
  const linkKeys = Object.keys(group.links).filter((k) => group.links[k] && ICONS[k]);

  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          {group.links.instagram && (
            <div className="hero-avatar">
              <Avatar
                entity={{
                  id: `${group.id}-official`,
                  stageName: group.name,
                  photo: group.photo,
                  instagram: group.links.instagram,
                  color: group.theme.accent
                }}
                size="md"
              />
              <span className="hero-avatar-tag">@{igHandle(group.links.instagram)}</span>
            </div>
          )}

          <p className="eyebrow">
            {group.agency}
            {group.debut ? ` ・ ${group.debut} 出道` : ''}
          </p>
          <h1 className="hero-title">{group.name}</h1>
          <p className="hero-sub">
            {group.nameKo}
            {group.nameZh ? `　${group.nameZh}` : ''}
          </p>
          {group.tagline && <p className="hero-tagline">{group.tagline}</p>}

          <div className="hero-actions">
            <FavButton
              type="group"
              favKey={favKey.group(group)}
              snapshot={favSnapshot.group(group)}
              label={group.name}
            />
          </div>

          {linkKeys.length > 0 && (
            <div className="social-row">
              {linkKeys.map((k) => (
                <a key={k} className="social" href={group.links[k]} target="_blank" rel="noopener noreferrer">
                  {ICONS[k]}
                  <span>{LINK_LABEL[k] || k}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {group.facts.length > 0 && (
          <dl className="fact-grid">
            {group.facts.map((f) => (
              <div className="fact" key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {group.intro.length > 0 && (
        <div className="wrap">
          <div className="intro">
            {group.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
