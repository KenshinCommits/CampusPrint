import React from 'react';

/**
 * NeoCard: Neo-Brutalist card wrapper
 * Tokens: 2px solid black border, 4px hard black shadow, rounded-2xl
 */
export function NeoCard({
  children,
  className = '',
  style = {},
  variant = 'default', // 'default' (white), 'cream', 'yellow', 'dashed', 'navy'
  onClick,
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cream':
        return { backgroundColor: '#FDFBF7' };
      case 'yellow':
        return { backgroundColor: '#FEF08A' };
      case 'arcade-yellow':
        return { backgroundColor: '#FFC300' };
      case 'sky':
        return { backgroundColor: '#BAE6FD' };
      case 'mint':
        return { backgroundColor: '#BBF7D0' };
      case 'lavender':
        return { backgroundColor: '#C7D2FE' };
      case 'dashed':
        return {
          backgroundColor: '#FFFFFF',
          borderStyle: 'dashed',
        };
      case 'dashed-yellow':
        return {
          backgroundColor: '#FEF08A',
          borderStyle: 'dashed',
        };
      case 'navy':
        return {
          backgroundColor: '#001D3D',
          color: '#FFFFFF',
        };
      case 'default':
      default:
        return { backgroundColor: '#FFFFFF' };
    }
  };

  const baseStyle = {
    border: '2px solid #000000',
    borderRadius: '16px', // rounded-2xl
    boxShadow: '4px 4px 0px 0px #000000',
    transition: 'all 0.15s ease',
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
