import React from 'react';

/**
 * StatusBadge: Neo-Brutalist Pill Badge
 * Tokens: rounded-full, 2px solid black border, uppercase font-black text-xs, pastel fills
 */
export function StatusBadge({
  status = 'placed',
  label,
  className = '',
  style = {},
}) {
  const norm = String(status || '').toLowerCase().trim();

  const getBadgeConfig = () => {
    switch (norm) {
      case 'completed':
      case 'ready':
      case 'paid':
      case 'success':
        return {
          bg: '#BBF7D0', // Mint green
          color: '#000000',
          defaultText: norm === 'paid' ? 'PAID' : norm === 'ready' ? 'READY' : 'COMPLETED',
        };
      case 'accepted':
      case 'active':
        return {
          bg: '#BAE6FD', // Sky blue
          color: '#000000',
          defaultText: 'ACCEPTED',
        };
      case 'processing':
      case 'printing':
        return {
          bg: '#C7D2FE', // Lavender / Indigo
          color: '#000000',
          defaultText: norm === 'printing' ? 'PRINTING' : 'PROCESSING',
        };
      case 'rejected':
      case 'cancelled':
      case 'failed':
        return {
          bg: '#FECACA', // Soft red / coral
          color: '#000000',
          defaultText: norm.toUpperCase(),
        };
      case 'placed':
      case 'pending':
      default:
        return {
          bg: '#FEF08A', // Pale yellow
          color: '#000000',
          defaultText: 'PLACED',
        };
    }
  };

  const config = getBadgeConfig();
  const text = label || config.defaultText;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    backgroundColor: config.bg,
    color: config.color,
    border: '2px solid #000000',
    borderRadius: '9999px', // rounded-full
    padding: '4px 12px',
    fontSize: '0.75rem', // text-xs
    fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    ...style,
  };

  return (
    <span className={`status-badge ${className}`} style={baseStyle}>
      {text}
    </span>
  );
}

export default StatusBadge;
