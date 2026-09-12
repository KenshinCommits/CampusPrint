import React from 'react';

// Normalized coordinates (viewBox percentages on /final.png)
// Grid layout on 3x5 / 4x4 matrix matching authentic pixel sprite sheet:
export const SPRITES = {
  // Row 1
  printer:      { x: 3,   y: 2,   w: 29,  h: 28, file: '/sprites/printer.png' },
  paperStack:   { x: 33,  y: 6,   w: 17,  h: 21, file: '/sprites/paper_stack.png' },
  binders:      { x: 52,  y: 5,   w: 20,  h: 23, file: '/sprites/binders.png' },
  terminal:     { x: 74,  y: 3,   w: 24,  h: 25, file: '/sprites/computer.png' },
  
  // Row 2
  pdfBadge:     { x: 3,   y: 36,  w: 8,   h: 11, file: '/sprites/file_pdf.png' },
  wordBadge:    { x: 13,  y: 36,  w: 8,   h: 11, file: '/sprites/file_word.png' },
  imageBadge:   { x: 23,  y: 36,  w: 8,   h: 11, file: '/sprites/file_image.png' },
  folder:       { x: 34,  y: 35,  w: 13,  h: 12, file: '/sprites/folder.png' },
  studentCard:  { x: 50,  y: 35,  w: 20,  h: 13, file: '/sprites/student_id.png' },
  rupeeCoin:    { x: 74,  y: 35,  w: 10,  h: 13, file: '/sprites/coin_rupee.png' },
  pixelClock:   { x: 87,  y: 35,  w: 10,  h: 13, file: '/sprites/clock.png' },
  
  // Row 3
  goodIdeasDoc: { x: 3,   y: 52,  w: 18,  h: 21, file: '/sprites/poster_papers.png' },
  signBoard:    { x: 23,  y: 52,  w: 12,  h: 21, file: '/sprites/standing_board.png' },
  ticketToken:  { x: 39,  y: 54,  w: 23,  h: 15, file: '/sprites/print_token.png' },
  parcelBox:    { x: 66,  y: 52,  w: 17,  h: 16, file: '/sprites/delivery_box.png' },
  pottedPlant:  { x: 87,  y: 52,  w: 10,  h: 17, file: '/sprites/potted_plant.png' },
  
  // Row 4
  receptionDesk:{ x: 3,   y: 77,  w: 32,  h: 14, file: '/sprites/stationery_counter.png' },
  waitingBench: { x: 39,  y: 76,  w: 27,  h: 16, file: '/sprites/waiting_bench.png' },
  printShopSign:{ x: 73,  y: 75,  w: 25,  h: 16, file: '/sprites/direction_sign.png' }
};

/**
 * PixelArt - Reusable Sprite Component extracting authentic 16-bit handcrafted pixel assets
 * Can render either via CSS sprite sheet clipping on /final.png or crisp extracted sprite PNG
 */
export function PixelArt({ name, size = 48, useSpriteFile = true, className = '', style = {} }) {
  const sprite = SPRITES[name];
  if (!sprite) {
    console.warn(`[PixelArt] Unknown sprite name: "${name}"`);
    return null;
  }

  const height = Math.round(size * (sprite.h / sprite.w));

  // If using individual sprite file for 100% boundary isolation:
  if (useSpriteFile && sprite.file) {
    return (
      <img
        src={sprite.file}
        alt={name}
        className={`inline-block select-none ${className}`}
        style={{
          width: `${size}px`,
          height: `${height}px`,
          objectFit: 'contain',
          imageRendering: 'pixelated',
          ...style
        }}
        role="img"
      />
    );
  }

  // Calculate percentage-based background positions on /final.png:
  // xOffset = (x / (100 - w)) * 100
  const xPercent = (sprite.x / (100 - sprite.w)) * 100;
  const yPercent = (sprite.y / (100 - sprite.h)) * 100;
  const bgWidth = (100 / sprite.w) * 100;
  const bgHeight = (100 / sprite.h) * 100;

  return (
    <div
      className={`inline-block select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${height}px`,
        backgroundImage: `url('/final.png')`,
        backgroundPosition: `${xPercent}% ${yPercent}%`,
        backgroundSize: `${bgWidth}% ${bgHeight}%`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        ...style
      }}
      aria-label={name}
      role="img"
    />
  );
}

export default PixelArt;
