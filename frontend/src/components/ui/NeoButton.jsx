import React, { useState } from 'react';

/**
 * NeoButton: Modern Pixel-Art Chunky Graphic Button
 * Tokens: 2px solid black border, 3px hard black shadow, rounded-xl, uppercase font-black
 * Active press: translate(2px, 2px) & shadow drops to 0
 * Palette: #FFC300 primary, #FFD60A hover, #003566 secondary blue
 */
export function NeoButton({
  children,
  variant = 'primary', // 'primary' (#FFC300), 'secondary' (#003566), 'white' (#FFFFFF), 'dark' (#001D3D), 'sky' (#BAE6FD), 'mint' (#BBF7D0), 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  style = {},
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: isHovered && !disabled ? '#001D3D' : '#003566',
          color: '#FFFFFF',
        };
      case 'white':
        return {
          backgroundColor: isHovered && !disabled ? '#F8F5ED' : '#FFFFFF',
          color: '#000814',
        };
      case 'dark':
        return {
          backgroundColor: isHovered && !disabled ? '#000814' : '#001D3D',
          color: '#FFFFFF',
        };
      case 'mint':
        return {
          backgroundColor: isHovered && !disabled ? '#86EFAC' : '#BBF7D0',
          color: '#000814',
        };
      case 'sky':
        return {
          backgroundColor: isHovered && !disabled ? '#93C5FD' : '#BAE6FD',
          color: '#000814',
        };
      case 'ghost':
        return {
          backgroundColor: isHovered && !disabled ? '#FFFDEB' : 'transparent',
          color: '#000814',
        };
      case 'primary':
      default:
        return {
          backgroundColor: isHovered && !disabled ? '#FFD60A' : '#FFC300',
          color: '#000814',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 14px',
          fontSize: '0.75rem',
          borderRadius: '10px',
        };
      case 'lg':
        return {
          padding: '14px 28px',
          fontSize: '1.05rem',
          borderRadius: '14px',
        };
      case 'md':
      default:
        return {
          padding: '10px 20px',
          fontSize: '0.875rem',
          borderRadius: '12px',
        };
    }
  };

  const currentShadow = disabled
    ? 'none'
    : isActive
    ? '0px 0px 0px #000814'
    : '3px 3px 0px 0px #000814';

  const currentTransform = disabled
    ? 'none'
    : isActive
    ? 'translate(2px, 2px)'
    : 'none';

  const baseStyle = {
    border: '2px solid #000814',
    fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: currentShadow,
    transform: currentTransform,
    transition: 'transform 0.08s ease, box-shadow 0.08s ease, background-color 0.12s ease',
    userSelect: 'none',
    textDecoration: 'none',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style,
  };

  return (
    <button
      type={type}
      className={`neo-button ${className}`}
      style={baseStyle}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      {children}
    </button>
  );
}

export default NeoButton;
