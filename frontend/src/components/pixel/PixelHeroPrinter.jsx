import React from 'react';

/**
 * PixelHeroPrinter - Student Dashboard Hero Workstation Scene
 * Palette: Golden Twilight (#000814, #001D3D, #003566, #7DD3FC, #BAE6FD, #FFC300, #FFD60A, #FFFFFF, #22C55E, #15803D)
 * ViewBox: 0 0 320 180
 */
export function PixelHeroPrinter({ width = '100%', height = 180, className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 180"
      width={width}
      height={height}
      className={`pixelated ${className}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', ...style }}
    >
      {/* Background Soft Sky / Campus Horizon */}
      <rect width="320" height="180" fill="#F8FAFC" />

      {/* DISTANT CAMPUS DORM BUILDING SILHOUETTES (Light Blue #BAE6FD / #E0F2FE with pixel windows) */}
      {/* Building 1 (Far Left) */}
      <rect x="10" y="30" width="44" height="110" fill="#E0F2FE" />
      <rect x="12" y="32" width="40" height="106" fill="#BAE6FD" />
      {/* Windows Building 1 */}
      <g fill="#7DD3FC">
        <rect x="18" y="42" width="6" height="8" />
        <rect x="30" y="42" width="6" height="8" />
        <rect x="42" y="42" width="6" height="8" />
        <rect x="18" y="56" width="6" height="8" />
        <rect x="30" y="56" width="6" height="8" />
        <rect x="42" y="56" width="6" height="8" />
        <rect x="18" y="70" width="6" height="8" />
        <rect x="30" y="70" width="6" height="8" />
        <rect x="42" y="70" width="6" height="8" />
      </g>

      {/* Building 2 (Mid Center Left) */}
      <rect x="58" y="48" width="52" height="92" fill="#E0F2FE" />
      <polygon points="58,48 84,30 110,48" fill="#BAE6FD" />
      {/* Lit Golden Windows */}
      <g fill="#FFD60A">
        <rect x="70" y="56" width="6" height="7" />
        <rect x="92" y="56" width="6" height="7" />
        <rect x="81" y="42" width="6" height="6" />
      </g>
      <g fill="#7DD3FC">
        <rect x="70" y="70" width="6" height="7" />
        <rect x="81" y="70" width="6" height="7" />
        <rect x="92" y="70" width="6" height="7" />
      </g>

      {/* Building 3 (Far Right) */}
      <rect x="252" y="24" width="58" height="116" fill="#E0F2FE" />
      <rect x="254" y="26" width="54" height="112" fill="#BAE6FD" />
      {/* Windows Building 3 */}
      <g fill="#7DD3FC">
        <rect x="262" y="36" width="6" height="8" />
        <rect x="276" y="36" width="6" height="8" />
        <rect x="290" y="36" width="6" height="8" />
        <rect x="262" y="52" width="6" height="8" />
        <rect x="276" y="52" width="6" height="8" fill="#FFD60A" />
        <rect x="290" y="52" width="6" height="8" />
        <rect x="262" y="68" width="6" height="8" />
        <rect x="276" y="68" width="6" height="8" />
        <rect x="290" y="68" width="6" height="8" />
      </g>

      {/* DESK SURFACE (Isometric Workstation Table) */}
      <rect x="0" y="140" width="320" height="40" fill="#000814" />
      {/* Desk Top Bevel */}
      <rect x="0" y="136" width="320" height="4" fill="#003566" />
      <rect x="0" y="140" width="320" height="2" fill="#001D3D" />
      {/* Wood / Metal front face highlight */}
      <rect x="0" y="144" width="320" height="2" fill="#FFC300" opacity="0.4" />

      {/* LEFT: POTTED DESK PLANT / PIXEL BONSAI */}
      {/* Pot Shadow */}
      <rect x="18" y="140" width="22" height="3" fill="#000814" />
      {/* Pot Outline & Body */}
      <rect x="19" y="122" width="20" height="18" fill="#000814" />
      <rect x="20" y="123" width="18" height="16" fill="#FFC300" />
      {/* Pot Rim & Campus Logo Badge */}
      <rect x="18" y="121" width="22" height="4" fill="#001D3D" />
      <rect x="26" y="129" width="6" height="4" fill="#001D3D" />
      <rect x="27" y="128" width="4" height="2" fill="#FFD60A" />
      {/* Plant Stems & Foliage */}
      <rect x="28" y="112" width="3" height="10" fill="#14532D" />
      <rect x="22" y="104" width="14" height="10" rx="2" fill="#15803D" />
      <rect x="20" y="98" width="18" height="10" fill="#22C55E" />
      <rect x="24" y="92" width="10" height="8" fill="#4ADE80" />
      {/* Leaf Highlights */}
      <rect x="22" y="100" width="4" height="4" fill="#86EFAC" />
      <rect x="30" y="106" width="4" height="3" fill="#14532D" />

      {/* LEFT: SMALL PIXEL TERMINAL MONITOR */}
      {/* Monitor Stand */}
      <rect x="52" y="132" width="16" height="8" fill="#000814" />
      <rect x="48" y="138" width="24" height="3" fill="#001D3D" />
      {/* Monitor Chassis */}
      <rect x="44" y="94" width="32" height="38" rx="2" fill="#000814" />
      <rect x="46" y="96" width="28" height="34" fill="#001D3D" />
      {/* Monitor Screen */}
      <rect x="48" y="98" width="24" height="26" fill="#003566" />
      {/* Screen CampusPrint Logo / Code Lines */}
      <rect x="56" y="102" width="8" height="4" fill="#FFD60A" />
      <rect x="52" y="110" width="16" height="2" fill="#7DD3FC" />
      <rect x="52" y="114" width="12" height="2" fill="#7DD3FC" />
      <rect x="52" y="118" width="14" height="2" fill="#38BDF8" />
      {/* Power LED */}
      <rect x="70" y="126" width="2" height="2" fill="#22C55E" />

      {/* --- MAIN WORKSTATION ISOMETRIC PRINTER (CENTER) --- */}
      {/* Ground Cast Shadow */}
      <ellipse cx="165" cy="142" rx="68" ry="8" fill="#000814" opacity="0.8" />

      {/* TOP PAPER INPUT TRAY & CLEAN WHITE PAPER LOADED */}
      {/* Paper Slot Tray Backing */}
      <rect x="134" y="44" width="62" height="32" fill="#000814" />
      <rect x="136" y="46" width="58" height="28" fill="#003566" />
      {/* White Loaded Paper Sheets */}
      <rect x="140" y="38" width="50" height="28" fill="#000814" />
      <rect x="142" y="40" width="46" height="26" fill="#F1F5F9" />
      <rect x="144" y="42" width="42" height="24" fill="#FFFFFF" />
      {/* Paper Top Fold / Corner */}
      <polygon points="182,42 186,46 182,46" fill="#E2E8F0" />
      {/* Blue Header watermark on paper */}
      <rect x="148" y="46" width="22" height="3" fill="#BAE6FD" />
      <rect x="148" y="52" width="34" height="2" fill="#CBD5E1" />
      <rect x="148" y="56" width="28" height="2" fill="#CBD5E1" />

      {/* MAIN PRINTER CHUNKY CHASSIS (Dark Navy #001D3D with #000814 Outline) */}
      {/* Chassis Outer Outline */}
      <rect x="108" y="66" width="114" height="74" rx="4" fill="#000814" />
      {/* Chassis Top Lid Face (Stepped 3D Depth) */}
      <rect x="110" y="68" width="110" height="14" fill="#003566" />
      <rect x="110" y="80" width="110" height="2" fill="#000814" />
      {/* Golden Accent Strip Across Top */}
      <rect x="110" y="68" width="110" height="3" fill="#FFC300" />
      <rect x="110" y="70" width="110" height="1" fill="#FFD60A" />

      {/* Chassis Front Main Body */}
      <rect x="110" y="82" width="110" height="56" fill="#001D3D" />
      {/* Left Bevel Shading */}
      <rect x="110" y="82" width="10" height="56" fill="#001428" />
      {/* Right Bevel Shading */}
      <rect x="210" y="82" width="10" height="56" fill="#002855" />

      {/* FRONT CONTROL PANEL (Right Side of Printer Face) */}
      <rect x="180" y="88" width="34" height="26" fill="#000814" />
      <rect x="182" y="90" width="30" height="22" fill="#003566" />
      {/* Mini LCD Display Matrix */}
      <rect x="184" y="92" width="18" height="8" fill="#001D3D" />
      <rect x="186" y="94" width="14" height="4" fill="#7DD3FC" />
      {/* TWO GLOWING YELLOW PIXEL DISPLAY INDICATOR LEDS (#FFD60A) */}
      <rect x="204" y="92" width="5" height="4" fill="#FFD60A" />
      <rect x="204" y="98" width="5" height="4" fill="#22C55E" />
      {/* Keypad Buttons */}
      <rect x="184" y="104" width="5" height="4" fill="#FFC300" />
      <rect x="191" y="104" width="5" height="4" fill="#FFC300" />
      <rect x="198" y="104" width="5" height="4" fill="#FFC300" />

      {/* CampusPrint Graduation Cap Logo Emblem on Printer Front */}
      <rect x="124" y="88" width="22" height="12" fill="#000814" />
      <rect x="125" y="89" width="20" height="10" fill="#003566" />
      {/* Yellow Cap Diamond */}
      <polygon points="135,90 142,94 135,97 128,94" fill="#FFD60A" />
      <rect x="133" y="95" width="4" height="2" fill="#FFC300" />

      {/* FRONT FEEDER SLOT & EJECTING CLEAN WHITE A4 DOCUMENT */}
      {/* Feeder Slot Recess */}
      <rect x="122" y="108" width="86" height="12" fill="#000814" />
      <rect x="124" y="110" width="82" height="8" fill="#000814" />

      {/* EJECTING A4 DOCUMENT WITH BLACK HORIZONTAL TEXT LINES */}
      {/* Document Shadow */}
      <polygon points="130,112 198,112 210,154 118,154" fill="#000814" />
      {/* White Document Body */}
      <polygon points="131,113 197,113 208,152 120,152" fill="#FFFFFF" />
      <polygon points="133,114 195,114 205,150 123,150" fill="#F8FAFC" />

      {/* Document Horizontal Text Lines (Simulating printed content) */}
      <g fill="#000814">
        {/* Title Header Line */}
        <rect x="136" y="118" width="36" height="3" />
        <rect x="176" y="118" width="16" height="3" fill="#003566" />
        {/* Body Line 1 */}
        <rect x="132" y="125" width="64" height="2" />
        {/* Body Line 2 */}
        <rect x="130" y="130" width="70" height="2" />
        {/* Body Line 3 */}
        <rect x="128" y="135" width="58" height="2" />
        {/* Body Line 4 */}
        <rect x="126" y="140" width="74" height="2" />
        {/* Signature / Stamp Seal */}
        <rect x="180" y="144" width="14" height="4" fill="#FFC300" />
      </g>

      {/* RIGHT: PAPER CATCH TRAY WITH LOOSE SHEET FLUTTERING DOWN */}
      {/* Catch Tray Arm */}
      <polygon points="218,126 260,136 260,140 218,132" fill="#000814" />
      <polygon points="219,127 258,136 258,138 219,130" fill="#003566" />

      {/* Stack of printed sheets in tray */}
      <rect x="238" y="132" width="28" height="4" fill="#E2E8F0" />
      <rect x="236" y="130" width="28" height="3" fill="#FFFFFF" />
      <rect x="236" y="129" width="28" height="1" fill="#000814" />

      {/* Fluttering Loose Sheet in Mid-Air */}
      <g transform="rotate(14 250 100)">
        <rect x="236" y="90" width="24" height="32" fill="#000814" />
        <rect x="238" y="92" width="20" height="28" fill="#FFFFFF" />
        <rect x="242" y="96" width="12" height="2" fill="#003566" />
        <rect x="242" y="100" width="14" height="2" fill="#94A3B8" />
        <rect x="242" y="104" width="10" height="2" fill="#94A3B8" />
        <rect x="242" y="108" width="12" height="2" fill="#94A3B8" />
      </g>

      {/* 4-5 FLOATING 8-BIT SPARKLE CROSSES (+) in #FFD60A */}
      <g fill="#FFD60A">
        {/* Sparkle 1 (Top Left) */}
        <rect x="94" y="32" width="7" height="3" />
        <rect x="96" y="30" width="3" height="7" />
        <rect x="97" y="33" width="1" height="1" fill="#FFFFFF" />

        {/* Sparkle 2 (Above Paper Feeder) */}
        <rect x="178" y="18" width="5" height="2" />
        <rect x="179.5" y="16.5" width="2" height="5" />

        {/* Sparkle 3 (Top Right of Printer) */}
        <rect x="226" y="48" width="7" height="3" />
        <rect x="228" y="46" width="3" height="7" />
        <rect x="229" y="49" width="1" height="1" fill="#FFFFFF" />

        {/* Sparkle 4 (Far Right floating) */}
        <rect x="286" y="82" width="5" height="2" />
        <rect x="287.5" y="80.5" width="2" height="5" />

        {/* Sparkle 5 (Near Desk Left) */}
        <rect x="36" y="86" width="5" height="2" />
        <rect x="37.5" y="84.5" width="2" height="5" />
      </g>
    </svg>
  );
}
