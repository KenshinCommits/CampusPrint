// Neo-Brutalist 8-Bit Pixel Art Assets matching the CampusPrint design system

export function PixelLogo({ size = 22, color = "#000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top paper */}
      <rect x="7" y="2" width="10" height="6" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
      <rect x="9" y="4" width="6" height="1.5" fill="#94A3B8" />
      {/* Printer main body */}
      <rect x="3" y="7" width="18" height="11" rx="2" fill="#2563EB" stroke={color} strokeWidth="1.5" />
      {/* Output paper slot */}
      <rect x="6" y="11" width="12" height="4" fill="#0F172A" />
      {/* Ejected sheet */}
      <rect x="7" y="13" width="10" height="8" rx="1" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
      <rect x="9" y="16" width="6" height="1" fill="#64748B" />
      <rect x="9" y="18" width="4" height="1" fill="#64748B" />
      {/* LED indicators */}
      <circle cx="18" cy="9.5" r="1" fill="#FFD028" />
      <circle cx="15.5" cy="9.5" r="1" fill="#86EFAC" />
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
      <rect x="90" y="20" width="140" height="70" rx="4" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
      <rect x="110" y="38" width="100" height="8" fill="#CBD5E1" />
      <rect x="110" y="54" width="80" height="8" fill="#CBD5E1" />

      {/* Printer Main Chassis */}
      <rect x="30" y="80" width="260" height="110" rx="12" fill="#1D4ED8" stroke="#000000" strokeWidth="5" />
      <rect x="35" y="85" width="250" height="20" fill="#2563EB" />

      {/* Control Panel / Display */}
      <rect x="210" y="105" width="65" height="35" rx="4" fill="#0F172A" stroke="#000000" strokeWidth="3" />
      <rect x="216" y="111" width="53" height="23" fill="#86EFAC" />
      <rect x="220" y="117" width="25" height="3" fill="#047857" />
      <rect x="220" y="123" width="38" height="3" fill="#047857" />

      {/* Power & Status Buttons */}
      <circle cx="218" cy="155" r="6" fill="#FFD028" stroke="#000000" strokeWidth="2.5" />
      <circle cx="236" cy="155" r="6" fill="#EF4444" stroke="#000000" strokeWidth="2.5" />
      <circle cx="254" cy="155" r="6" fill="#3B82F6" stroke="#000000" strokeWidth="2.5" />

      {/* Dispenser Slot */}
      <rect x="65" y="115" width="130" height="28" rx="4" fill="#0B132B" stroke="#000000" strokeWidth="3.5" />

      {/* Paper Ejecting Out */}
      <g transform="rotate(3 130 130)">
        <rect x="80" y="128" width="115" height="85" rx="4" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
        <rect x="95" y="145" width="85" height="7" fill="#64748B" />
        <rect x="95" y="160" width="75" height="7" fill="#64748B" />
        <rect x="95" y="175" width="65" height="7" fill="#64748B" />
        <rect x="95" y="190" width="80" height="7" fill="#3B82F6" />
      </g>

      {/* Bottom Base Tray */}
      <rect x="50" y="180" width="220" height="22" rx="4" fill="#0F172A" stroke="#000000" strokeWidth="4" />
    </svg>
  );
}

export function PixelDoc({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document page */}
      <rect x="18" y="10" width="44" height="60" rx="4" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
      {/* Folded corner */}
      <path d="M46 10L62 26H46V10Z" fill="#E2E8F0" stroke="#000000" strokeWidth="3" />
      {/* Lines */}
      <rect x="26" y="32" width="28" height="4" fill="#94A3B8" />
      <rect x="26" y="40" width="20" height="4" fill="#94A3B8" />
      {/* Blue circle badge with arrow */}
      <circle cx="52" cy="54" r="16" fill="#2563EB" stroke="#000000" strokeWidth="3.5" />
      <path d="M52 45L46 52H50V61H54V52H58L52 45Z" fill="#FFFFFF" />
    </svg>
  );
}

export function PixelSparkles({ color1 = "#FFD028", color2 = "#38BDF8" }) {
  return (
    <div style={{ position: "relative", width: "70px", height: "50px", pointerEvents: "none" }}>
      {/* Pixel cluster 1 */}
      <div style={{ position: "absolute", top: 4, left: 10, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000" }} />
      <div style={{ position: "absolute", top: 12, left: 2, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000" }} />
      <div style={{ position: "absolute", top: 12, left: 18, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000" }} />
      <div style={{ position: "absolute", top: 20, left: 10, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000" }} />

      {/* Pixel cluster 2 */}
      <div style={{ position: "absolute", top: 26, left: 45, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000" }} />
      <div style={{ position: "absolute", top: 32, left: 39, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000" }} />
      <div style={{ position: "absolute", top: 32, left: 51, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000" }} />
      <div style={{ position: "absolute", top: 38, left: 45, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000" }} />
    </div>
  );
}
