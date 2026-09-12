import React from 'react';
import { PixelStatusDot } from '../PixelArt.jsx';

/**
 * StatusBadge: Modern Pixel-Art Inspired Status Pill
 * Tokens: rounded-full, 2px solid black border, uppercase font-black text-xs, pastel fills with 8-bit square dot
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
          dot: '#166534',
          color: '#000814',
          defaultText: norm === 'paid' ? 'PAID' : norm === 'ready' ? 'READY' : 'COMPLETED',
        };
      case 'accepted':
      case 'active':
        return {
          bg: '#BAE6FD', // Sky blue
          dot: '#003566', // Secondary blue
          color: '#000814',
          defaultText: 'ACCEPTED',
        };
      case 'processing':
      case 'printing':
        return {
          bg: '#C7D2FE', // Lavender / Indigo
          dot: '#3730A3',
          color: '#000814',
          defaultText: norm === 'printing' ? 'PRINTING' : 'PROCESSING',
        };
      case 'rejected':
      case 'cancelled':
      case 'failed':
        return {
          bg: '#FECACA', // Soft red / coral
          dot: '#991B1B',
          color: '#000814',
          defaultText: norm.toUpperCase(),
        };
      case 'placed':
      case 'pending':
      default:
        return {
          bg: '#FEF08A', // Pale yellow
          dot: '#854D0E',
          color: '#000814',
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
    border: '2px solid #000814',
    borderRadius: '9999px',
    padding: '3px 10px',
    fontSize: '0.72rem',
    fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    boxShadow: '1.5px 1.5px 0px 0px #000814',
    ...style,
  };

  return (
    <span className={`status-badge ${className}`} style={baseStyle}>
      <PixelStatusDot color={config.dot} size={6} />
      <span>{text}</span>
    </span>
  );
}

export default StatusBadge;
