import React from 'react';

/**
 * Handcrafted Pixel-Art SVG Components matching the user's authentic design
 * Palette: #000814, #001D3D, #003566, #FFC300, #FFD60A, #F8F5ED, #38BDF8, #86EFAC
 */

// 1. Pixel Printer (128x128 authentic pixel art)
export function PixelPrinterGraphic({ size = 128, style = {}, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      style={{ filter: "drop-shadow(4px 4px 0px #000814)", ...style }}
    >
      {/* Shadow */}
      <rect x="28" y="103" width="72" height="6" fill="#000814"/>
      <rect x="22" y="97" width="84" height="6" fill="#000814"/>

      {/* Printer body */}
      <rect x="22" y="48" width="84" height="49" fill="#001D3D"/>
      <rect x="28" y="42" width="72" height="12" fill="#001D3D"/>
      <rect x="34" y="36" width="60" height="10" fill="#001D3D"/>

      {/* Yellow top */}
      <rect x="34" y="32" width="60" height="6" fill="#FFC300"/>
      <rect x="40" y="28" width="48" height="6" fill="#FFD60A"/>

      {/* Top control panel */}
      <rect x="70" y="38" width="24" height="12" fill="#003566"/>
      <rect x="74" y="41" width="5" height="5" fill="#86EFAC"/>
      <rect x="81" y="41" width="5" height="5" fill="#FFD60A"/>
      <rect x="88" y="41" width="3" height="3" fill="#38BDF8"/>

      {/* Keypad */}
      <rect x="36" y="40" width="26" height="12" fill="#000814"/>
      <rect x="39" y="43" width="4" height="3" fill="#F8FAFC"/>
      <rect x="45" y="43" width="4" height="3" fill="#F8FAFC"/>
      <rect x="51" y="43" width="4" height="3" fill="#F8FAFC"/>
      <rect x="39" y="48" width="4" height="2" fill="#38BDF8"/>
      <rect x="45" y="48" width="4" height="2" fill="#38BDF8"/>
      <rect x="51" y="48" width="4" height="2" fill="#38BDF8"/>

      {/* Front panel */}
      <rect x="28" y="56" width="72" height="35" fill="#003566"/>
      <rect x="34" y="61" width="60" height="24" fill="#000814"/>

      {/* Paper slot */}
      <rect x="38" y="70" width="52" height="8" fill="#001D3D"/>
      <rect x="42" y="72" width="44" height="3" fill="#000814"/>

      {/* Paper */}
      <rect x="43" y="73" width="42" height="32" fill="#FFFFFF"/>
      <rect x="47" y="77" width="34" height="4" fill="#001D3D"/>
      <rect x="47" y="84" width="26" height="3" fill="#003566"/>
      <rect x="47" y="90" width="31" height="3" fill="#38BDF8"/>
      <rect x="47" y="96" width="19" height="3" fill="#001D3D"/>

      {/* Paper pixel corner */}
      <rect x="77" y="73" width="8" height="8" fill="#F8FAFC"/>
      <rect x="77" y="73" width="8" height="3" fill="#38BDF8"/>

      {/* Side highlights */}
      <rect x="22" y="58" width="6" height="25" fill="#FFC300"/>
      <rect x="100" y="58" width="6" height="25" fill="#FFD60A"/>

      {/* LED */}
      <rect x="86" y="58" width="5" height="5" fill="#86EFAC"/>
      <rect x="93" y="58" width="5" height="5" fill="#FFD60A"/>
    </svg>
  );
}

// 2. Pixel Upload Documents with Fold & Arrow (128x128 authentic pixel art)
export function PixelUploadDoc({ size = 128, style = {}, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      style={{ filter: "drop-shadow(4px 4px 0px #000814)", ...style }}
    >
      {/* BACK PAPER */}
      <rect x="30" y="24" width="56" height="70" fill="#000814"/>
      <rect x="34" y="20" width="56" height="70" fill="#001D3D"/>
      <rect x="40" y="24" width="46" height="60" fill="#FFFFFF"/>

      {/* Fold */}
      <rect x="76" y="24" width="10" height="10" fill="#38BDF8"/>
      <rect x="80" y="28" width="6" height="6" fill="#F8FAFC"/>

      {/* Lines */}
      <rect x="46" y="38" width="31" height="4" fill="#001D3D"/>
      <rect x="46" y="46" width="25" height="3" fill="#003566"/>
      <rect x="46" y="53" width="31" height="3" fill="#003566"/>
      <rect x="46" y="60" width="21" height="3" fill="#38BDF8"/>

      {/* FRONT PAPER */}
      <rect x="24" y="38" width="56" height="70" fill="#000814"/>
      <rect x="29" y="33" width="56" height="70" fill="#F8FAFC"/>
      <rect x="35" y="39" width="44" height="58" fill="#FFFFFF"/>

      {/* Fold */}
      <rect x="69" y="33" width="16" height="16" fill="#003566"/>
      <rect x="73" y="37" width="12" height="12" fill="#F8FAFC"/>

      {/* Text */}
      <rect x="40" y="54" width="27" height="4" fill="#001D3D"/>
      <rect x="40" y="62" width="34" height="3" fill="#003566"/>
      <rect x="40" y="69" width="27" height="3" fill="#003566"/>
      <rect x="40" y="76" width="20" height="3" fill="#38BDF8"/>

      {/* Upload Arrow */}
      <rect x="82" y="63" width="12" height="36" fill="#000814"/>
      <rect x="78" y="54" width="20" height="14" fill="#000814"/>
      <rect x="74" y="48" width="28" height="12" fill="#000814"/>

      <rect x="86" y="62" width="8" height="37" fill="#38BDF8"/>
      <rect x="82" y="54" width="16" height="10" fill="#38BDF8"/>
      <rect x="78" y="48" width="24" height="10" fill="#38BDF8"/>
      <rect x="82" y="44" width="16" height="8" fill="#38BDF8"/>

      {/* Sparkles */}
      <rect x="104" y="31" width="5" height="17" fill="#FFD60A"/>
      <rect x="98" y="37" width="17" height="5" fill="#FFD60A"/>

      <rect x="18" y="20" width="4" height="13" fill="#FFC300"/>
      <rect x="14" y="24" width="12" height="5" fill="#FFC300"/>

      <rect x="105" y="84" width="4" height="11" fill="#86EFAC"/>
      <rect x="101" y="88" width="12" height="4" fill="#86EFAC"/>
    </svg>
  );
}

// 3. Pixel Ticket / Order Token with Perforated Edges (128x128 authentic pixel art)
export function PixelTicketGraphic({ size = 128, style = {}, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      style={{ filter: "drop-shadow(4px 4px 0px #000814)", ...style }}
    >
      {/* Ticket shadow */}
      <rect x="17" y="39" width="94" height="52" fill="#000814"/>

      {/* Main ticket */}
      <rect x="22" y="34" width="84" height="52" fill="#FFD60A"/>

      {/* Jagged left edge */}
      <rect x="17" y="43" width="5" height="5" fill="#000814"/>
      <rect x="17" y="53" width="5" height="5" fill="#000814"/>
      <rect x="17" y="63" width="5" height="5" fill="#000814"/>
      <rect x="17" y="73" width="5" height="5" fill="#000814"/>

      {/* Jagged right edge */}
      <rect x="106" y="43" width="5" height="5" fill="#000814"/>
      <rect x="106" y="53" width="5" height="5" fill="#000814"/>
      <rect x="106" y="63" width="5" height="5" fill="#000814"/>
      <rect x="106" y="73" width="5" height="5" fill="#000814"/>

      {/* Ticket outline */}
      <rect x="22" y="34" width="84" height="5" fill="#000814"/>
      <rect x="22" y="81" width="84" height="5" fill="#000814"/>
      <rect x="22" y="34" width="5" height="52" fill="#000814"/>
      <rect x="101" y="34" width="5" height="52" fill="#000814"/>

      {/* Divider */}
      <rect x="74" y="39" width="4" height="42" fill="#001D3D"/>
      <rect x="74" y="44" width="4" height="5" fill="#FFD60A"/>
      <rect x="74" y="56" width="4" height="5" fill="#FFD60A"/>
      <rect x="74" y="68" width="4" height="5" fill="#FFD60A"/>

      {/* Token label */}
      <rect x="31" y="46" width="28" height="5" fill="#001D3D"/>
      <rect x="31" y="56" width="37" height="4" fill="#003566"/>

      {/* Token number */}
      <rect x="31" y="65" width="34" height="9" fill="#000814"/>
      <rect x="35" y="67" width="5" height="5" fill="#FFD60A"/>
      <rect x="43" y="67" width="5" height="5" fill="#FFD60A"/>
      <rect x="51" y="67" width="5" height="5" fill="#FFD60A"/>
      <rect x="59" y="67" width="3" height="5" fill="#FFD60A"/>

      {/* Check badge */}
      <rect x="82" y="48" width="14" height="14" fill="#001D3D"/>
      <rect x="86" y="46" width="6" height="18" fill="#86EFAC"/>
      <rect x="82" y="52" width="14" height="6" fill="#86EFAC"/>
      <rect x="89" y="49" width="4" height="4" fill="#001D3D"/>
      <rect x="85" y="53" width="4" height="4" fill="#001D3D"/>

      {/* Status lines */}
      <rect x="82" y="68" width="14" height="4" fill="#001D3D"/>
      <rect x="82" y="75" width="10" height="3" fill="#003566"/>
    </svg>
  );
}

// 4. Pixel Speed Stopwatch (128x128 authentic pixel art)
export function PixelSpeedWatch({ size = 128, style = {}, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      style={{ filter: "drop-shadow(4px 4px 0px #000814)", ...style }}
    >
      {/* SPEED LINES */}
      <rect x="10" y="39" width="26" height="5" fill="#38BDF8"/>
      <rect x="4" y="49" width="19" height="4" fill="#003566"/>
      <rect x="13" y="59" width="27" height="5" fill="#38BDF8"/>
      <rect x="8" y="73" width="18" height="4" fill="#003566"/>
      <rect x="15" y="84" width="24" height="5" fill="#38BDF8"/>

      {/* Stopwatch top button */}
      <rect x="58" y="10" width="14" height="8" fill="#000814"/>
      <rect x="62" y="6" width="10" height="7" fill="#FFC300"/>

      {/* Outer casing */}
      <rect x="45" y="17" width="45" height="7" fill="#000814"/>
      <rect x="38" y="24" width="59" height="7" fill="#000814"/>
      <rect x="32" y="31" width="71" height="52" fill="#000814"/>
      <rect x="38" y="83" width="59" height="7" fill="#000814"/>
      <rect x="45" y="90" width="45" height="7" fill="#000814"/>

      {/* Yellow casing */}
      <rect x="45" y="24" width="45" height="7" fill="#FFC300"/>
      <rect x="39" y="31" width="57" height="45" fill="#FFD60A"/>
      <rect x="45" y="76" width="45" height="7" fill="#FFC300"/>

      {/* Clock face */}
      <rect x="48" y="36" width="39" height="34" fill="#FFFFFF"/>
      <rect x="54" y="32" width="27" height="4" fill="#FFFFFF"/>
      <rect x="54" y="70" width="27" height="4" fill="#FFFFFF"/>

      {/* Clock ticks */}
      <rect x="65" y="38" width="5" height="7" fill="#001D3D"/>
      <rect x="48" y="50" width="6" height="4" fill="#001D3D"/>
      <rect x="74" y="50" width="6" height="4" fill="#001D3D"/>
      <rect x="65" y="61" width="5" height="7" fill="#001D3D"/>

      {/* Hands: fast */}
      <rect x="66" y="43" width="5" height="18" fill="#001D3D"/>
      <rect x="70" y="56" width="13" height="5" fill="#001D3D"/>
      <rect x="65" y="55" width="7" height="7" fill="#F43F5E"/>

      {/* Digital time */}
      <rect x="51" y="78" width="33" height="7" fill="#001D3D"/>
      <rect x="54" y="80" width="8" height="3" fill="#38BDF8"/>
      <rect x="65" y="80" width="3" height="3" fill="#FFFFFF"/>
      <rect x="71" y="80" width="8" height="3" fill="#86EFAC"/>

      {/* Speed accent */}
      <rect x="92" y="44" width="13" height="4" fill="#F43F5E"/>
      <rect x="98" y="51" width="18" height="5" fill="#FFC300"/>
      <rect x="94" y="59" width="12" height="4" fill="#38BDF8"/>

      {/* Pixel sparkle */}
      <rect x="107" y="73" width="5" height="15" fill="#FFD60A"/>
      <rect x="102" y="78" width="15" height="5" fill="#FFD60A"/>
    </svg>
  );
}

// Aliases and helpers
export const PixelPrinter = PixelPrinterGraphic;
export const PixelDoc = PixelUploadDoc;

export function PixelLogo({ size = 24, color = "#FFC300" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="2" width="10" height="6" fill="#F8F5ED" stroke="#000814" strokeWidth="1.5" />
      <rect x="9" y="4" width="6" height="1" fill="#003566" />
      <rect x="3" y="7" width="18" height="11" rx="2" fill="#003566" stroke="#000814" strokeWidth="1.5" />
      <rect x="6" y="11" width="12" height="4" fill="#000814" />
      <rect x="7" y="13" width="10" height="8" rx="1" fill={color} stroke="#000814" strokeWidth="1.5" />
      <rect x="9" y="16" width="6" height="1" fill="#000814" />
      <rect x="9" y="18" width="4" height="1" fill="#000814" />
      <rect x="17.5" y="9" width="2" height="2" fill="#FFD60A" stroke="#000814" strokeWidth="0.5" />
      <rect x="14.5" y="9" width="2" height="2" fill="#86EFAC" stroke="#000814" strokeWidth="0.5" />
    </svg>
  );
}

export function PixelSparkles({ color1 = "#FFC300", color2 = "#38BDF8" }) {
  return (
    <div style={{ position: "relative", width: "70px", height: "50px", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 4, left: 10, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000814" }} />
      <div style={{ position: "absolute", top: 12, left: 2, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000814" }} />
      <div style={{ position: "absolute", top: 12, left: 18, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000814" }} />
      <div style={{ position: "absolute", top: 20, left: 10, width: 8, height: 8, background: color1, boxShadow: "0 0 0 2px #000814" }} />
      <div style={{ position: "absolute", top: 26, left: 45, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000814" }} />
      <div style={{ position: "absolute", top: 32, left: 39, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000814" }} />
      <div style={{ position: "absolute", top: 32, left: 51, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000814" }} />
      <div style={{ position: "absolute", top: 38, left: 45, width: 6, height: 6, background: color2, boxShadow: "0 0 0 2px #000814" }} />
    </div>
  );
}

export function PixelStatusDot({ color = "#FFC300", size = 8 }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        border: '1.5px solid #000814',
        borderRadius: '1px',
        boxShadow: '1px 1px 0px #000814',
        flexShrink: 0,
      }}
    />
  );
}

// 5. Pixel Graduation Cap (Top Header Logo)
export function PixelGraduationCap({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={{ filter: "drop-shadow(2px 2px 0px #000814)" }}
    >
      {/* Cap top diamond - yellow with black outline */}
      <polygon points="24,6 44,17 24,28 4,17" fill="#FFC300" stroke="#000814" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="24,10 40,17 24,24 8,17" fill="#FFD60A" />
      {/* Cap crown underneath */}
      <path d="M12,22 L12,32 Q24,39 36,32 L36,22" fill="#001D3D" stroke="#000814" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Pages/scroll under cap */}
      <path d="M16,30 Q24,35 32,30 L32,34 Q24,39 16,34 Z" fill="#F8F5ED" stroke="#000814" strokeWidth="1.5" />
      {/* Tassel cord and bead */}
      <path d="M24,17 L41,25 L40,35" fill="none" stroke="#000814" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="36" r="3" fill="#FFC300" stroke="#000814" strokeWidth="1.5" />
    </svg>
  );
}

// 6. Pixel Campus Building (Sidebar Bottom)
export function PixelCampusBuilding({ width = 190, height = 150, className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 160"
      className={className}
      style={{ overflow: 'hidden', display: 'block' }}
    >
      {/* Sky background */}
      <rect x="0" y="0" width="200" height="160" fill="#001D3D" />

      {/* Pixel Clouds */}
      <rect x="15" y="20" width="30" height="8" fill="#BAE6FD" opacity="0.3" />
      <rect x="25" y="14" width="20" height="6" fill="#BAE6FD" opacity="0.3" />
      <rect x="150" y="30" width="35" height="8" fill="#BAE6FD" opacity="0.3" />
      <rect x="160" y="24" width="20" height="6" fill="#BAE6FD" opacity="0.3" />

      {/* Main Center Clock Tower */}
      {/* Tower Roof Spire */}
      <polygon points="100,20 86,45 114,45" fill="#C2410C" stroke="#000814" strokeWidth="2" />
      <rect x="98" y="12" width="4" height="9" fill="#000814" />
      <circle cx="100" cy="10" r="2.5" fill="#FFD60A" />

      {/* Tower Body */}
      <rect x="86" y="45" width="28" height="75" fill="#E2B17B" stroke="#000814" strokeWidth="2" />

      {/* Tower Clock Face */}
      <rect x="91" y="52" width="18" height="18" fill="#FFFFFF" stroke="#000814" strokeWidth="2" />
      <circle cx="100" cy="61" r="7" fill="#F8F5ED" stroke="#000814" strokeWidth="1.5" />
      {/* Clock Hands at 2:40 */}
      <line x1="100" y1="61" x2="103" y2="57" stroke="#000814" strokeWidth="2" strokeLinecap="round" />
      <line x1="100" y1="61" x2="96" y2="64" stroke="#000814" strokeWidth="2" strokeLinecap="round" />

      {/* Tower Arched Windows */}
      <rect x="92" y="77" width="6" height="12" rx="3" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="102" y="77" width="6" height="12" rx="3" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="92" y="97" width="6" height="12" rx="3" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="102" y="97" width="6" height="12" rx="3" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />

      {/* Left Wing Building */}
      <rect x="42" y="65" width="44" height="55" fill="#D99E64" stroke="#000814" strokeWidth="2" />
      <polygon points="40,65 64,50 88,65" fill="#9A3412" stroke="#000814" strokeWidth="2" />
      {/* Windows Left Wing */}
      <rect x="48" y="74" width="7" height="10" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="62" y="74" width="7" height="10" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="74" y="74" width="7" height="10" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="48" y="94" width="7" height="12" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="62" y="94" width="7" height="12" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="74" y="94" width="7" height="12" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />

      {/* Right Wing Building */}
      <rect x="114" y="65" width="44" height="55" fill="#D99E64" stroke="#000814" strokeWidth="2" />
      <polygon points="112,65 136,50 160,65" fill="#9A3412" stroke="#000814" strokeWidth="2" />
      {/* Windows Right Wing */}
      <rect x="120" y="74" width="7" height="10" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="132" y="74" width="7" height="10" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="145" y="74" width="7" height="10" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="120" y="94" width="7" height="12" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="132" y="94" width="7" height="12" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <rect x="145" y="94" width="7" height="12" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />

      {/* Main Entrance Door with Arch */}
      <rect x="91" y="116" width="18" height="18" rx="4" fill="#000814" />
      <rect x="94" y="120" width="12" height="14" fill="#003566" />
      <line x1="100" y1="120" x2="100" y2="134" stroke="#000814" strokeWidth="1.5" />

      {/* Front Steps */}
      <rect x="80" y="132" width="40" height="4" fill="#E5E7EB" stroke="#000814" strokeWidth="1.5" />
      <rect x="74" y="136" width="52" height="4" fill="#CBD5E1" stroke="#000814" strokeWidth="1.5" />

      {/* Flanking Pixel Green Trees */}
      {/* Far Left Tree */}
      <rect x="8" y="105" width="8" height="25" fill="#78350F" stroke="#000814" strokeWidth="1.5" />
      <circle cx="12" cy="98" r="14" fill="#16A34A" stroke="#000814" strokeWidth="2" />
      <circle cx="10" cy="94" r="9" fill="#22C55E" />

      {/* Left Mid Tree */}
      <rect x="26" y="112" width="6" height="20" fill="#78350F" stroke="#000814" strokeWidth="1.5" />
      <circle cx="29" cy="106" r="12" fill="#15803D" stroke="#000814" strokeWidth="2" />
      <circle cx="28" cy="102" r="8" fill="#4ADE80" />

      {/* Right Mid Tree */}
      <rect x="168" y="112" width="6" height="20" fill="#78350F" stroke="#000814" strokeWidth="1.5" />
      <circle cx="171" cy="106" r="12" fill="#15803D" stroke="#000814" strokeWidth="2" />
      <circle cx="172" cy="102" r="8" fill="#4ADE80" />

      {/* Far Right Tree */}
      <rect x="184" y="105" width="8" height="25" fill="#78350F" stroke="#000814" strokeWidth="1.5" />
      <circle cx="188" cy="98" r="14" fill="#16A34A" stroke="#000814" strokeWidth="2" />
      <circle cx="186" cy="94" r="9" fill="#22C55E" />

      {/* Ground Grass Plinth */}
      <rect x="0" y="139" width="200" height="21" fill="#000814" />
      <rect x="0" y="139" width="200" height="4" fill="#22C55E" />
    </svg>
  );
}

// 7. Pixel Hero Printer Scene (Desktop Student Dashboard Hero)
export function PixelHeroPrinterScene({ width = 380, height = 200, className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 380 200"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Background City Window */}
      <rect x="90" y="10" width="280" height="150" fill="#BAE6FD" rx="4" />
      {/* Distant pixel city skyline */}
      <rect x="110" y="70" width="30" height="70" fill="#E0F2FE" />
      <rect x="150" y="45" width="35" height="95" fill="#93C5FD" />
      <rect x="195" y="60" width="40" height="80" fill="#BAE6FD" />
      <rect x="245" y="35" width="45" height="105" fill="#93C5FD" />
      <rect x="300" y="55" width="35" height="85" fill="#CBD5E1" />
      {/* Skyline windows */}
      <rect x="158" y="55" width="5" height="5" fill="#FFFFFF" />
      <rect x="168" y="55" width="5" height="5" fill="#FFFFFF" />
      <rect x="158" y="70" width="5" height="5" fill="#FFFFFF" />
      <rect x="255" y="45" width="6" height="6" fill="#FEF08A" />
      <rect x="267" y="45" width="6" height="6" fill="#FEF08A" />
      <rect x="255" y="60" width="6" height="6" fill="#FFFFFF" />
      {/* Pixel Tree foliage outside window */}
      <circle cx="120" cy="130" r="16" fill="#22C55E" />
      <circle cx="340" cy="125" r="18" fill="#16A34A" />

      {/* Desk Surface */}
      <rect x="20" y="150" width="350" height="40" fill="#E2E8F0" stroke="#000814" strokeWidth="2.5" />
      <line x1="20" y1="156" x2="370" y2="156" stroke="#94A3B8" strokeWidth="2" />

      {/* Potted desk plant on right */}
      <rect x="290" y="105" width="16" height="24" fill="#78350F" stroke="#000814" strokeWidth="2" />
      <circle cx="298" cy="98" r="12" fill="#15803D" stroke="#000814" strokeWidth="2" />
      <circle cx="296" cy="94" r="8" fill="#4ADE80" />

      {/* Big Dark Navy Pixel Printer */}
      {/* Shadow */}
      <rect x="80" y="145" width="190" height="12" rx="4" fill="#000814" opacity="0.3" />

      {/* Paper entering from top feeder */}
      <rect x="135" y="18" width="65" height="50" fill="#FFFFFF" stroke="#000814" strokeWidth="2.5" />
      <line x1="145" y1="30" x2="185" y2="30" stroke="#CBD5E1" strokeWidth="2.5" />
      <line x1="145" y1="38" x2="175" y2="38" stroke="#CBD5E1" strokeWidth="2.5" />
      <line x1="145" y1="46" x2="188" y2="46" stroke="#CBD5E1" strokeWidth="2.5" />

      {/* Printer main body */}
      <rect x="90" y="55" width="165" height="95" rx="6" fill="#001D3D" stroke="#000814" strokeWidth="3" />
      {/* Yellow top panel accent */}
      <rect x="90" y="55" width="165" height="12" fill="#FFC300" stroke="#000814" strokeWidth="2.5" />
      <rect x="95" y="57" width="155" height="4" fill="#FFD60A" />

      {/* Control panel and display */}
      <rect x="180" y="74" width="65" height="30" rx="3" fill="#000814" stroke="#003566" strokeWidth="1.5" />
      <rect x="184" y="78" width="30" height="22" fill="#003566" />
      <rect x="188" y="82" width="14" height="4" fill="#86EFAC" />
      <rect x="188" y="90" width="22" height="4" fill="#38BDF8" />
      {/* Keypad buttons */}
      <rect x="220" y="78" width="8" height="6" fill="#FFD60A" stroke="#000814" strokeWidth="1" />
      <rect x="232" y="78" width="8" height="6" fill="#FFD60A" stroke="#000814" strokeWidth="1" />
      <rect x="220" y="88" width="8" height="6" fill="#BAE6FD" stroke="#000814" strokeWidth="1" />
      <rect x="232" y="88" width="8" height="6" fill="#86EFAC" stroke="#000814" strokeWidth="1" />

      {/* Output paper mouth */}
      <rect x="105" y="95" width="70" height="8" rx="2" fill="#000814" />
      {/* Printed Sheet sliding out */}
      <rect x="100" y="98" width="75" height="50" rx="2" fill="#FFFFFF" stroke="#000814" strokeWidth="2" />
      <line x1="110" y1="108" x2="160" y2="108" stroke="#003566" strokeWidth="2.5" />
      <line x1="110" y1="116" x2="150" y2="116" stroke="#001D3D" strokeWidth="2" />
      <line x1="110" y1="124" x2="165" y2="124" stroke="#38BDF8" strokeWidth="2" />
      <line x1="110" y1="132" x2="140" y2="132" stroke="#001D3D" strokeWidth="2" />

      {/* Printed Sheet resting on the side */}
      <g transform="rotate(8 300 135)">
        <rect x="290" y="110" width="45" height="48" fill="#FFFFFF" stroke="#000814" strokeWidth="2" />
        <line x1="296" y1="118" x2="325" y2="118" stroke="#003566" strokeWidth="2" />
        <line x1="296" y1="126" x2="320" y2="126" stroke="#003566" strokeWidth="2" />
        <line x1="296" y1="134" x2="328" y2="134" stroke="#003566" strokeWidth="2" />
      </g>
    </svg>
  );
}

// 8. Pixel Shop Printer Scene (Right Widget Header)
export function PixelShopPrinterScene({ width = 310, height = 120, className = '' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 310 120"
      className={className}
      style={{ display: 'block', borderRadius: '8px' }}
    >
      {/* Dark Navy Background */}
      <rect x="0" y="0" width="310" height="120" rx="8" fill="#001D3D" />

      {/* Left Stack of Clean Printed Sheets */}
      <rect x="18" y="60" width="40" height="42" fill="#FFFFFF" stroke="#000814" strokeWidth="2" />
      <line x1="18" y1="68" x2="58" y2="68" stroke="#000814" strokeWidth="1.5" />
      <line x1="18" y1="76" x2="58" y2="76" stroke="#000814" strokeWidth="1.5" />
      <line x1="18" y1="84" x2="58" y2="84" stroke="#000814" strokeWidth="1.5" />
      <line x1="18" y1="92" x2="58" y2="92" stroke="#000814" strokeWidth="1.5" />

      {/* Small green bush on left */}
      <circle cx="16" cy="98" r="10" fill="#22C55E" stroke="#000814" strokeWidth="1.5" />

      {/* Center Pixel Printer */}
      <rect x="90" y="42" width="130" height="64" rx="4" fill="#003566" stroke="#000814" strokeWidth="2.5" />
      {/* Top Yellow Bar */}
      <rect x="90" y="42" width="130" height="8" fill="#FFC300" stroke="#000814" strokeWidth="1.5" />
      {/* Input Paper */}
      <rect x="125" y="16" width="55" height="32" fill="#FFFFFF" stroke="#000814" strokeWidth="2" />
      <line x1="135" y1="24" x2="170" y2="24" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="135" y1="30" x2="165" y2="30" stroke="#94A3B8" strokeWidth="1.5" />
      {/* Front Slot & Output paper */}
      <rect x="105" y="66" width="100" height="8" rx="2" fill="#000814" />
      <rect x="115" y="70" width="60" height="34" rx="2" fill="#FFFFFF" stroke="#000814" strokeWidth="1.5" />
      <line x1="122" y1="78" x2="165" y2="78" stroke="#001D3D" strokeWidth="1.5" />
      <line x1="122" y1="84" x2="158" y2="84" stroke="#003566" strokeWidth="1.5" />
      <line x1="122" y1="90" x2="162" y2="90" stroke="#38BDF8" strokeWidth="1.5" />

      {/* Right High Stack of Documents */}
      <rect x="245" y="32" width="46" height="70" fill="#FFFFFF" stroke="#000814" strokeWidth="2" />
      <line x1="245" y1="42" x2="291" y2="42" stroke="#000814" strokeWidth="1.5" />
      <line x1="245" y1="52" x2="291" y2="52" stroke="#000814" strokeWidth="1.5" />
      <line x1="245" y1="62" x2="291" y2="62" stroke="#000814" strokeWidth="1.5" />
      <line x1="245" y1="72" x2="291" y2="72" stroke="#000814" strokeWidth="1.5" />
      <line x1="245" y1="82" x2="291" y2="82" stroke="#000814" strokeWidth="1.5" />
      <line x1="245" y1="92" x2="291" y2="92" stroke="#000814" strokeWidth="1.5" />

      {/* Yellow Star Accents */}
      <rect x="70" y="24" width="4" height="4" fill="#FFD60A" />
      <rect x="235" y="18" width="5" height="5" fill="#FFD60A" />
    </svg>
  );
}

// 9. Pixel Icons for Metrics and Shop
export function PixelDocumentIcon({ size = 26, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 3H14L20 9V21H4V3Z" fill="#FFFFFF" stroke="#000814" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 3V9H20" fill="#E2E8F0" stroke="#000814" strokeWidth="2" strokeLinejoin="round" />
      <line x1="7" y1="12" x2="14" y2="12" stroke="#000814" strokeWidth="2" />
      <line x1="7" y1="16" x2="16" y2="16" stroke="#000814" strokeWidth="2" />
    </svg>
  );
}

export function PixelBoxIcon({ size = 26, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Isometric box top */}
      <polygon points="12,2 22,7 12,12 2,7" fill="#FFD60A" stroke="#000814" strokeWidth="2" strokeLinejoin="round" />
      {/* Left side */}
      <polygon points="2,7 12,12 12,22 2,17" fill="#D97706" stroke="#000814" strokeWidth="2" strokeLinejoin="round" />
      {/* Right side */}
      <polygon points="12,12 22,7 22,17 12,22" fill="#B45309" stroke="#000814" strokeWidth="2" strokeLinejoin="round" />
      {/* Tape center */}
      <line x1="12" y1="2" x2="12" y2="12" stroke="#000814" strokeWidth="1.5" />
    </svg>
  );
}

export function PixelChartIcon({ size = 26, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Bar 1 (green) */}
      <rect x="3" y="13" width="4" height="9" fill="#22C55E" stroke="#000814" strokeWidth="1.8" />
      {/* Bar 2 (yellow) */}
      <rect x="10" y="7" width="4" height="15" fill="#FFD60A" stroke="#000814" strokeWidth="1.8" />
      {/* Bar 3 (blue) */}
      <rect x="17" y="2" width="4" height="20" fill="#38BDF8" stroke="#000814" strokeWidth="1.8" />
    </svg>
  );
}

export function PixelShopIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Store roof/awning */}
      <path d="M2 7L4 3H20L22 7V9H2V7Z" fill="#FFC300" stroke="#000814" strokeWidth="2" strokeLinejoin="round" />
      <rect x="4" y="9" width="16" height="12" fill="#FFFFFF" stroke="#000814" strokeWidth="2" />
      <rect x="8" y="13" width="8" height="8" fill="#001D3D" stroke="#000814" strokeWidth="1.5" />
      <circle cx="14" cy="17" r="1" fill="#FFD60A" />
    </svg>
  );
}

export function PixelStudentAvatar({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      {/* Circle base */}
      <circle cx="16" cy="16" r="15" fill="#38BDF8" stroke="#000814" strokeWidth="2" />
      {/* Hair */}
      <path d="M7 14 C7 7, 25 7, 25 14 Z" fill="#001D3D" />
      <rect x="9" y="11" width="14" height="4" fill="#001D3D" />
      {/* Face */}
      <rect x="9" y="14" width="14" height="10" rx="2" fill="#FED7AA" />
      {/* Eyes */}
      <rect x="12" y="16" width="2" height="3" fill="#000814" />
      <rect x="18" y="16" width="2" height="3" fill="#000814" />
      {/* Smile */}
      <path d="M14 21 Q16 23 18 21" stroke="#000814" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Shirt */}
      <path d="M6 31 C6 25, 26 25, 26 31 Z" fill="#FFD60A" stroke="#000814" strokeWidth="1.5" />
      <polygon points="16,26 13,29 19,29" fill="#001D3D" />
    </svg>
  );
}
