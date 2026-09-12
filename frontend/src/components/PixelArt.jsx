import React from 'react';

/**
 * Modern Pixel-Art SVG Icons and Illustrations
 * Colors: #000814, #001D3D, #003566, #FFC300, #FFD60A, #F8F5ED
 */

export function PixelLogo({ size = 24, color = "#FFC300" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top paper */}
      <rect x="7" y="2" width="10" height="6" fill="#F8F5ED" stroke="#000000" strokeWidth="1.5" />
      <rect x="9" y="4" width="6" height="1" fill="#003566" />
      {/* Printer main body in deep navy / blue */}
      <rect x="3" y="7" width="18" height="11" rx="2" fill="#003566" stroke="#000000" strokeWidth="1.5" />
      {/* Output paper slot */}
      <rect x="6" y="11" width="12" height="4" fill="#000814" />
      {/* Ejected sheet in bright yellow */}
      <rect x="7" y="13" width="10" height="8" rx="1" fill={color} stroke="#000000" strokeWidth="1.5" />
      <rect x="9" y="16" width="6" height="1" fill="#000814" />
      <rect x="9" y="18" width="4" height="1" fill="#000814" />
      {/* LED indicators */}
      <rect x="17.5" y="9" width="2" height="2" fill="#FFD60A" stroke="#000000" strokeWidth="0.5" />
      <rect x="14.5" y="9" width="2" height="2" fill="#86EFAC" stroke="#000000" strokeWidth="0.5" />
    </svg>
  );
}

export function PixelPrinter({ width = 280, height = 220 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(6px 6px 0px #000000)" }}
    >
      {/* Feed Paper Top */}
      <rect x="90" y="20" width="140" height="70" rx="4" fill="#F8F5ED" stroke="#000000" strokeWidth="4" />
      <rect x="110" y="38" width="100" height="8" fill="#CBD5E1" />
      <rect x="110" y="54" width="80" height="8" fill="#CBD5E1" />

      {/* Printer Main Chassis (Blue Secondary #003566 & Navy #001D3D) */}
      <rect x="30" y="80" width="260" height="110" rx="12" fill="#003566" stroke="#000000" strokeWidth="5" />
      <rect x="35" y="85" width="250" height="20" fill="#001D3D" />

      {/* Control Panel / Display */}
      <rect x="210" y="105" width="65" height="35" rx="4" fill="#000814" stroke="#000000" strokeWidth="3" />
      <rect x="216" y="111" width="53" height="23" fill="#86EFAC" />
      <rect x="220" y="117" width="25" height="3" fill="#047857" />
      <rect x="220" y="123" width="38" height="3" fill="#047857" />

      {/* Power & Status Buttons */}
      <circle cx="218" cy="155" r="6" fill="#FFC300" stroke="#000000" strokeWidth="2.5" />
      <circle cx="236" cy="155" r="6" fill="#EF4444" stroke="#000000" strokeWidth="2.5" />
      <circle cx="254" cy="155" r="6" fill="#38BDF8" stroke="#000000" strokeWidth="2.5" />

      {/* Dispenser Slot */}
      <rect x="65" y="115" width="130" height="28" rx="4" fill="#000814" stroke="#000000" strokeWidth="3.5" />

      {/* Paper Ejecting Out */}
      <g transform="rotate(3 130 130)">
        <rect x="80" y="128" width="115" height="85" rx="4" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
        <rect x="95" y="145" width="85" height="7" fill="#64748B" />
        <rect x="95" y="160" width="75" height="7" fill="#64748B" />
        <rect x="95" y="175" width="65" height="7" fill="#64748B" />
        <rect x="95" y="190" width="80" height="7" fill="#FFC300" />
      </g>

      {/* Bottom Base Tray */}
      <rect x="50" y="180" width="220" height="22" rx="4" fill="#000814" stroke="#000000" strokeWidth="4" />
    </svg>
  );
}

export function PixelDoc({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document page */}
      <rect x="18" y="10" width="44" height="60" rx="4" fill="#F8F5ED" stroke="#000000" strokeWidth="4" />
      {/* Folded corner */}
      <path d="M46 10L62 26H46V10Z" fill="#CBD5E1" stroke="#000000" strokeWidth="3" />
      {/* Lines */}
      <rect x="26" y="32" width="28" height="4" fill="#003566" />
      <rect x="26" y="40" width="20" height="4" fill="#003566" />
      {/* Arcade Yellow circle badge with black pixel arrow */}
      <circle cx="52" cy="54" r="16" fill="#FFC300" stroke="#000000" strokeWidth="3.5" />
      <path d="M52 45L46 52H50V61H54V52H58L52 45Z" fill="#000000" />
    </svg>
  );
}

export function PixelSparkles({ color1 = "#FFC300", color2 = "#38BDF8" }) {
  return (
    <div style={{ position: "relative", width: "70px", height: "50px", pointerEvents: "none" }}>
      {/* Pixel cluster 1 */}
      <div style={{ position: "absolute", top: 4, left: 10, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000000" }} />
      <div style={{ position: "absolute", top: 12, left: 2, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000000" }} />
      <div style={{ position: "absolute", top: 12, left: 18, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000000" }} />
      <div style={{ position: "absolute", top: 20, left: 10, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000000" }} />

      {/* Pixel cluster 2 */}
      <div style={{ position: "absolute", top: 26, left: 45, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000000" }} />
      <div style={{ position: "absolute", top: 32, left: 39, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000000" }} />
      <div style={{ position: "absolute", top: 32, left: 51, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000000" }} />
      <div style={{ position: "absolute", top: 38, left: 45, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000000" }} />
    </div>
  );
}

/** 8-bit square status indicator dot */
export function PixelStatusDot({ color = "#FFC300", size = 8 }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        border: '1.5px solid #000000',
        borderRadius: '1px',
        boxShadow: '1px 1px 0px #000000',
        flexShrink: 0,
      }}
    />
  );
}

/** 8-bit Pixel Checkmark Icon */
export function PixelCheck({ size = 16, color = "#000000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="3" width="2" height="2" />
      <rect x="10" y="5" width="2" height="2" />
      <rect x="8" y="7" width="2" height="2" />
      <rect x="6" y="9" width="2" height="2" />
      <rect x="4" y="7" width="2" height="2" />
      <rect x="2" y="5" width="2" height="2" />
      <rect x="6" y="11" width="2" height="2" />
    </svg>
  );
}

/** 8-bit Pixel Clock Icon */
export function PixelClock({ size = 16, color = "#000000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="2" />
      <rect x="4" y="13" width="8" height="2" />
      <rect x="1" y="4" width="2" height="8" />
      <rect x="13" y="4" width="2" height="8" />
      <rect x="2" y="2" width="2" height="2" />
      <rect x="12" y="2" width="2" height="2" />
      <rect x="2" y="12" width="2" height="2" />
      <rect x="12" y="12" width="2" height="2" />
      <rect x="7" y="4" width="2" height="5" />
      <rect x="8" y="8" width="4" height="2" />
    </svg>
  );
}
