// Node.js script to generate valid PNG icons for PWA
import fs from 'node:fs';
import zlib from 'node:zlib';

function createPNG(width, height, drawPixel) {
  // RGBA buffer with filter byte at beginning of each scanline (0 = None)
  const lineSize = width * 4 + 1;
  const rawData = Buffer.alloc(lineSize * height);

  for (let y = 0; y < height; y++) {
    const lineOffset = y * lineSize;
    rawData[lineOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      const pxOffset = lineOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const combined = Buffer.concat([typeBuf, data]);

    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(combined), 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Precomputed CRC table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = createChunk('IHDR', ihdrData);
  const idat = createChunk('IDAT', deflated);
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function iceCreamPixel(x, y, w, h) {
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Soft rounded square background
  const cornerRadius = 0.75;
  const inCard = Math.abs(nx) < 0.92 && Math.abs(ny) < 0.92;
  
  // Background pastel gradient: pink #fce7f3 to #fbcfe8
  const bgR = 252 - Math.floor((ny + 1) * 10);
  const bgG = 231 - Math.floor((ny + 1) * 20);
  const bgB = 243 - Math.floor((ny + 1) * 10);

  // Waffle cone: triangle from ny: 0.1 to 0.75
  const coneTop = 0.1;
  const coneBottom = 0.75;
  if (ny >= coneTop && ny <= coneBottom) {
    const halfWidth = 0.45 * (1 - (ny - coneTop) / (coneBottom - coneTop));
    if (Math.abs(nx) < halfWidth) {
      // Waffle lines
      const grid = Math.sin((nx + ny) * 35) * Math.cos((nx - ny) * 35);
      if (grid > 0.4) {
        return [180, 83, 9, 255]; // Dark waffle lines
      }
      return [245, 158, 11, 255]; // Golden cone
    }
  }

  // Cherry on top (ny: -0.65 to -0.45, nx: -0.05 to 0.05)
  const cherryDist = Math.hypot(nx - 0.02, ny - (-0.55));
  if (cherryDist < 0.12) {
    if (cherryDist < 0.04 && nx < 0) return [255, 220, 230, 255]; // Highlight
    return [225, 29, 72, 255]; // Red cherry
  }
  // Cherry stem
  if (ny < -0.55 && ny > -0.75 && Math.abs(nx - (ny * -0.2)) < 0.025) {
    return [34, 197, 94, 255]; // Green stem
  }

  // Top Scoop (Strawberry/Pink, center: [0, -0.28], radius: 0.28)
  const topScoopDist = Math.hypot(nx, ny - (-0.28));
  if (topScoopDist < 0.28) {
    // Sprinkle highlights
    if (Math.abs(nx - 0.08) < 0.04 && Math.abs(ny - (-0.35)) < 0.015) return [59, 130, 246, 255]; // blue
    if (Math.abs(nx + 0.12) < 0.04 && Math.abs(ny - (-0.22)) < 0.015) return [234, 179, 8, 255]; // yellow
    if (Math.abs(nx - 0.12) < 0.04 && Math.abs(ny - (-0.20)) < 0.015) return [168, 85, 247, 255]; // purple
    return [244, 63, 94, 255]; // Strawberry pink
  }

  // Middle Scoop Left (Vanilla/Yellow, center: [-0.18, 0.02], radius: 0.26)
  const leftScoopDist = Math.hypot(nx - (-0.18), ny - 0.02);
  if (leftScoopDist < 0.26) {
    return [253, 224, 71, 255]; // Vanilla yellow
  }

  // Middle Scoop Right (Chocolate, center: [0.18, 0.02], radius: 0.26)
  const rightScoopDist = Math.hypot(nx - 0.18, ny - 0.02);
  if (rightScoopDist < 0.26) {
    return [120, 53, 15, 255]; // Chocolate brown
  }

  // Decorative border ring
  if (dist > 0.88 && dist < 0.93) {
    return [244, 114, 182, 255];
  }

  if (inCard) {
    return [bgR, bgG, bgB, 255];
  }

  return [255, 255, 255, 0];
}

const p192 = createPNG(192, 192, iceCreamPixel);
fs.writeFileSync('public/pwa-192x192.png', p192);

const p512 = createPNG(512, 512, iceCreamPixel);
fs.writeFileSync('public/pwa-512x512.png', p512);

const pMaskable = createPNG(512, 512, (x, y, w, h) => {
  // Maskable needs solid background to edges with safe inner zone
  const p = iceCreamPixel(x, y, w, h);
  if (p[3] === 0) {
    return [252, 231, 243, 255];
  }
  return p;
});
fs.writeFileSync('public/pwa-maskable-512x512.png', pMaskable);

fs.writeFileSync('public/apple-touch-icon.png', p192);

console.log('PWA PNG icons generated successfully!');
