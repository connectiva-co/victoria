import * as THREE from 'three';

// Procedural Canvas Textures for PBR Materials (Zero external 404 dependencies)

export function createFaceTexture(expression: 'happy' | 'smile' | 'wink' | 'cheerful' = 'happy'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Skin tone base
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(0, 0, 256, 256);

  // Big sparkling cartoon eyes
  const eyeY = 120;
  const leftEyeX = 85;
  const rightEyeX = 171;

  if (expression === 'wink') {
    // Left eye open
    drawEye(ctx, leftEyeX, eyeY);
    // Right eye wink arc
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY + 4, 18, 0.1 * Math.PI, 0.9 * Math.PI, false);
    ctx.strokeStyle = '#291d17';
    ctx.lineWidth = 6;
    ctx.stroke();
  } else {
    // Both eyes open with cute anime shine
    drawEye(ctx, leftEyeX, eyeY);
    drawEye(ctx, rightEyeX, eyeY);
  }

  // Rosy blushing cheeks
  ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
  ctx.beginPath();
  ctx.ellipse(65, 148, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(191, 148, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute warm smile
  ctx.beginPath();
  ctx.arc(128, 148, 26, 0.15 * Math.PI, 0.85 * Math.PI, false);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#9f1239';
  ctx.stroke();

  // Small open smile fill with pink tongue
  ctx.fillStyle = '#fda4af';
  ctx.beginPath();
  ctx.arc(128, 148, 24, 0.2 * Math.PI, 0.8 * Math.PI, false);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Eye outer
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight 1 (big top shine)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - 5, y - 7, 7, 0, Math.PI * 2);
  ctx.fill();

  // Highlight 2 (small bottom shine)
  ctx.beginPath();
  ctx.arc(x + 5, y + 8, 4, 0, Math.PI * 2);
  ctx.fill();

  // Eyelashes
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 18);
  ctx.lineTo(x - 8, y - 24);
  ctx.moveTo(x + 2, y - 22);
  ctx.lineTo(x + 8, y - 26);
  ctx.stroke();
}

// Procedural Floral Dress Pattern Texture (inspired by Victoria's dress in photo!)
export function createFloralDressTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Cream base
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(0, 0, 256, 256);

  // Tiny scattered pink flowers and pastel green leaves
  for (let i = 0; i < 48; i++) {
    const fx = (i * 47) % 256;
    const fy = ((i * 83) + 17) % 256;

    // Small green leaf
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.ellipse(fx + 6, fy + 4, 4, 2, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // 5-petal pink flower
    ctx.fillStyle = i % 2 === 0 ? '#f472b6' : '#fb7185';
    for (let p = 0; p < 5; p++) {
      const angle = (p * Math.PI * 2) / 5;
      const px = fx + Math.cos(angle) * 4;
      const py = fy + Math.sin(angle) * 4;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // Flower center
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(fx, fy, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Waffle Cone Texture
export function createWaffleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, 0, 128, 128);

  // Crisp diamond waffle grooves
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 4;
  for (let i = -128; i < 256; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 128, 128);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 128);
    ctx.lineTo(i + 128, 0);
    ctx.stroke();
  }

  // Waffle grid highlights
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.lineWidth = 2;
  for (let i = -128; i < 256; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i + 2, 0);
    ctx.lineTo(i + 130, 128);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Marble Counter Texture
export function createMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Smooth warm cream marble base
  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(0, 0, 256, 256);

  // Marble veins
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.12)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.bezierCurveTo(80, 120, 150, 60, 256, 180);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(236, 72, 153, 0.08)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.bezierCurveTo(120, 100, 180, 160, 220, 256);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
