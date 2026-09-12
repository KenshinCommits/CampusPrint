import { PixelArt, SPRITES } from './pixel/PixelArt.jsx';

export function EmptyState({ icon = 'parcelBox', title, subtitle, action }) {
  const isSprite = typeof icon === 'string' && SPRITES[icon];

  return (
    <div className="state-block">
      <div className="state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        {isSprite ? <PixelArt name={icon} size={72} /> : icon}
      </div>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {action}
    </div>
  );
}

export function Loader({ label = 'GETTING THINGS READY…' }) {
  return (
    <div className="state-block">
      <div className="loading-dots" style={{ marginBottom: 16 }}>
        <span />
        <span />
        <span />
      </div>
      <h2>{label}</h2>
    </div>
  );
}
