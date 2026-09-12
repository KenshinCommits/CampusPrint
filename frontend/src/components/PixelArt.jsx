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
