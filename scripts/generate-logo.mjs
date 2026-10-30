import { mkdtempSync, readFileSync, writeFileSync, rmSync, copyFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const work = mkdtempSync(join(tmpdir(), 'vessyl-signature-logo-'));
const source = join(root, 'assets/vessyl-logo.svg');
const complete = join(work, 'complete.png');
const magick = process.env.MAGICK_BIN || 'magick';
const background = [49, 21, 0];
const width = 300;
const height = 248;
const fps = 25;
const phaseSeconds = 4;
const phaseFrames = fps * phaseSeconds;
const feather = 0.9;

function run(args) {
  const result = spawnSync(magick, args, { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message);
}

function ppm(path, pixels, w = width, h = height) {
  writeFileSync(path, Buffer.concat([Buffer.from(`P6\n${w} ${h}\n255\n`), pixels]));
}

try {
  // Render the official SVG as-is; frames change only row opacity.
  run(['-background', '#311500', source, '-alpha', 'remove', '-alpha', 'off',
    '-resize', `${width}x${height}!`, '-depth', '8', '-strip', complete]);
  const raw = join(work, 'complete.rgb');
  run([complete, '-depth', '8', `rgb:${raw}`]);
  const artwork = readFileSync(raw);
  let top = height - 1;
  let bottom = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      if (artwork[i] > background[0] + 2) {
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }

  // A shared color ramp prevents changing dither patterns during the fade.
  const colors = Buffer.alloc(256 * 3);
  for (let i = 0; i < 256; i++) {
    for (let c = 0; c < 3; c++) colors[i * 3 + c] = Math.round(background[c] + (255 - background[c]) * i / 255);
  }
  const palette = join(work, 'palette.ppm');
  ppm(palette, colors, 256, 1);

  const frames = [];
  // Rotate the loop to its complete-logo boundary for static-only email clients.
  for (const phase of ['out', 'in']) {
    for (let frame = 0; frame < phaseFrames; frame++) {
      const time = frame / phaseFrames;
      const progress = (1 - Math.cos(Math.PI * time)) / 2;
      const pixels = Buffer.alloc(artwork.length);
      for (let y = 0; y < height; y++) {
        const row = Math.max(0, Math.min(1, (y - top) / (bottom - top)));
        const ramp = Math.max(0, Math.min(1, (progress * (1 + feather) - (1 - row)) / feather));
        const reveal = ramp * ramp * (3 - 2 * ramp);
        const opacity = phase === 'in' ? reveal : 1 - reveal;
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 3;
          for (let c = 0; c < 3; c++) pixels[i + c] = Math.round(background[c] + (artwork[i + c] - background[c]) * opacity);
        }
      }
      const image = join(work, `${phase}-${String(frame).padStart(3, '0')}.ppm`);
      ppm(image, pixels);
      frames.push('-delay', String(100 / fps), image);
    }
  }

  const gif = join(work, 'vessyl-signature.gif');
  run([...frames, '+dither', '-remap', palette, '-loop', '0', '-layers', 'Optimize', '-strip', gif]);
  copyFileSync(gif, join(root, 'assets/vessyl-signature.gif'));
  copyFileSync(complete, join(root, 'assets/vessyl-signature-static.png'));
  const metadata = {
    artwork: 'vessyl-logo.svg',
    artworkSha256: createHash('sha256').update(readFileSync(source)).digest('hex'),
    size: [width, height], fps, sourceFrames: phaseFrames * 2,
    durationMs: phaseSeconds * 2 * 1000,
    fadeInMs: 4000, fadeOutMs: 4000, direction: 'bottom-to-top',
    featherFraction: feather, temporalEasing: 'cosine', spatialEasing: 'smoothstep',
    encodedOrder: ['fade-out', 'fade-in'], firstFrame: 'complete logo',
    background: '#311500', bytes: statSync(gif).size,
  };
  writeFileSync(join(root, 'assets/animation-fade.json'), JSON.stringify(metadata, null, 2) + '\n');
  console.log(`Generated VESSYL soft fade: 8.000s, ${phaseFrames * 2} source frames, ${statSync(gif).size} bytes.`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
