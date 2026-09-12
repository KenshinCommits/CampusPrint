import React from 'react';

/**
 * NeoCard: Pixel-Art inspired Chunky Card Component
 * Tokens: 2px solid black border, 4px hard black shadow, rounded-2xl
 * Palette: #000814, #001D3D, #003566, #FFC300, #FFD60A, #F8F5ED
 */
export function NeoCard({
  children,
  className = '',
  style = {},
  variant = 'default', // 'default' (#FFFFFF), 'cream' (#F8F5ED), 'blue' (#003566), 'navy' (#001D3D), 'yellow' (#FEF08A), 'arcade-yellow' (#FFC300), 'sky', 'mint', 'dashed', 'dashed-yellow'
  onClick,
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cream':
        return { backgroundColor: '#F8F5ED', color: '#000814' };
      case 'yellow':
        return { backgroundColor: '#FEF08A', color: '#000814' };
      case 'arcade-yellow':
        return { backgroundColor: '#FFC300', color: '#000814' };
      case 'sky':
        return { backgroundColor: '#BAE6FD', color: '#000814' };
      case 'mint':
        return { backgroundColor: '#BBF7D0', color: '#000814' };
      case 'lavender':
        return { backgroundColor: '#C7D2FE', color: '#000814' };
      case 'blue':
        return { backgroundColor: '#003566', color: '#FFFFFF' };
      case 'navy':
        return { backgroundColor: '#001D3D', color: '#FFFFFF' };
      case 'dashed':
        return {
          backgroundColor: '#FFFFFF',
          borderStyle: 'dashed',
          color: '#000814',
        };
      case 'dashed-yellow':
        return {
          backgroundColor: '#FEF08A',
          borderStyle: 'dashed',
          color: '#000814',
        };
      case 'default':
      default:
        return { backgroundColor: '#FFFFFF', color: '#000814' };
    }
  };

  const baseStyle = {
    border: '2px solid #000814',
    borderRadius: '16px',
    boxShadow: '4px 4px 0px 0px #000814',
    transition: 'all 0.12s ease',
    ...getVariantStyles(),
    ...style,
  };

  return (
    <div
      className={`neo-card ${className}`}
      style={baseStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default NeoCard;
