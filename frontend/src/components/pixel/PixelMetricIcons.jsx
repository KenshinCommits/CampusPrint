import React from 'react';

/**
 * PixelMetricIcons - 32x32 Crisp Isometric Pixel Icons
 * Palette: Golden Twilight (#000814, #001D3D, #003566, #7DD3FC, #BAE6FD, #FFC300, #FFD60A, #FFFFFF, #22C55E)
 */

/**
 * 1. PixelDocIcon: White folded paper sheet with cyan/blue text lines and yellow drop shadow
 */
export function PixelDocIcon({ size = 32, className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`pixelated ${className}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', ...style }}
    >
      {/* Yellow Drop Shadow */}
      <rect x="8" y="7" width="18" height="22" fill="#FFC300" />
      <rect x="9" y="8" width="18" height="22" fill="#FFD60A" />

      {/* Black Outer Border */}
      <rect x="5" y="3" width="19" height="25" fill="#000814" />

      {/* Main White Paper Body */}
      <rect x="6" y="4" width="17" height="23" fill="#FFFFFF" />

      {/* Folded Top-Right Corner */}
      <polygon points="19,3 24,8 19,8" fill="#000814" />
      <polygon points="19,4 23,8 19,8" fill="#BAE6FD" />
      <polygon points="20,4 23,7 20,7" fill="#7DD3FC" />

      {/* Cyan / Blue Horizontal Text Lines */}
      {/* Title Line (Mid Navy) */}
      <rect x="8" y="7" width="9" height="2" fill="#003566" />
      {/* Body Line 1 (Cyan) */}
      <rect x="8" y="11" width="13" height="2" fill="#7DD3FC" />
      {/* Body Line 2 (Light Blue) */}
      <rect x="8" y="15" width="11" height="2" fill="#38BDF8" />
      {/* Body Line 3 (Cyan) */}
      <rect x="8" y="19" width="13" height="2" fill="#7DD3FC" />
      {/* Body Line 4 (Navy Accent) */}
      <rect x="8" y="23" width="7" height="2" fill="#003566" />

      {/* Golden Accent Stamp in Corner */}
      <rect x="17" y="21" width="4" height="4" fill="#FFC300" />
    </svg>
  );
}

/**
 * 2. PixelPackageIcon: 3D isometric delivery cardboard box with yellow/gold face panels and black pixel seam tape
 */
export function PixelPackageIcon({ size = 32, className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`pixelated ${className}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', ...style }}
    >
      {/* Bottom Drop Shadow */}
      <polygon points="16,29 28,23 28,25 16,31 4,25 4,23" fill="#000814" opacity="0.6" />

      {/* Outer Outline */}
      <polygon points="16,3 28,9 28,22 16,28 4,22 4,9" fill="#000814" />

      {/* TOP FACE (Bright Golden Yellow Panel #FFD60A) */}
      <polygon points="16,5 26,10 16,15 6,10" fill="#FFD60A" />

      {/* Top Face Center Seam Tape (Navy / Black #001D3D) */}
      <polygon points="14,6 18,8 18,14 14,12" fill="#001D3D" />

      {/* LEFT FACE (Warm Golden Brown / Ochre #D97706 / #FFC300 Shaded) */}
      <polygon points="6,11 15,15 15,26 6,21" fill="#FFC300" />

      {/* RIGHT FACE (Deep Golden Amber / Navy Shading #B45309) */}
      <polygon points="17,15 26,11 26,21 17,26" fill="#D97706" />

      {/* VERTICAL CENTER SEAM TAPE (Extending down the front corner) */}
      <rect x="15" y="15" width="2" height="12" fill="#001D3D" />

      {/* HORIZONTAL CARDBOARD PACKING TAPE BAND */}
      {/* Left side tape */}
      <polygon points="6,15 15,19 15,21 6,17" fill="#001D3D" />
      {/* Right side tape */}
      <polygon points="17,19 26,15 26,17 17,21" fill="#001D3D" />

      {/* FRAGILE / CAMPUSPRINT LABEL ON FRONT FACE */}
      <polygon points="8,17 13,19 13,23 8,21" fill="#FFFFFF" />
      <rect x="9" y="19" width="3" height="1" fill="#000814" />
      <rect x="9" y="21" width="2" height="1" fill="#003566" />
    </svg>
  );
}

/**
 * 3. PixelChartIcon: 3 ascending pixel bar graph pillars (Green, Yellow, Blue) with black 1px stepped border
 */
export function PixelChartIcon({ size = 32, className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`pixelated ${className}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', ...style }}
    >
      {/* Base Grid / Baseline Axis */}
      <rect x="3" y="26" width="26" height="3" fill="#000814" />
      <rect x="3" y="27" width="26" height="1" fill="#003566" />
      <rect x="3" y="6" width="3" height="23" fill="#000814" />

      {/* BAR 1: GREEN (Lowest Pillar) */}
      {/* Black 1px Stepped Border */}
      <rect x="7" y="17" width="6" height="10" fill="#000814" />
      {/* Green Fill (#22C55E, #166534) */}
      <rect x="8" y="18" width="4" height="8" fill="#22C55E" />
      {/* Isometric Top Cap */}
      <rect x="8" y="18" width="4" height="2" fill="#86EFAC" />
      <rect x="10" y="20" width="2" height="6" fill="#15803D" />

      {/* BAR 2: YELLOW (Middle Pillar) */}
      {/* Black 1px Stepped Border */}
      <rect x="14" y="11" width="6" height="16" fill="#000814" />
      {/* Golden Yellow Fill (#FFD60A, #FFC300) */}
      <rect x="15" y="12" width="4" height="14" fill="#FFC300" />
      {/* Isometric Top Cap */}
      <rect x="15" y="12" width="4" height="2" fill="#FFD60A" />
      <rect x="17" y="14" width="2" height="12" fill="#D97706" />

      {/* BAR 3: BLUE (Highest Pillar) */}
      {/* Black 1px Stepped Border */}
      <rect x="21" y="5" width="6" height="22" fill="#000814" />
      {/* Mid / Light Blue Fill (#0284C7, #7DD3FC) */}
      <rect x="22" y="6" width="4" height="20" fill="#0284C7" />
      {/* Isometric Top Cap */}
      <rect x="22" y="6" width="4" height="2" fill="#7DD3FC" />
      <rect x="24" y="8" width="2" height="18" fill="#0369A1" />

      {/* Ascending Trend Pixel Arrow */}
      <polygon points="10,13 25,4 27,8 24,8 24,5 21,5" fill="#FFD60A" />
    </svg>
  );
}
