import { mkdtempSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Render only our official VESSYL SVG. The reference supplies timing, not pixels.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const work = mkdtempSync(join(tmpdir(), 'vessyl-signature-logo-'));
const source = join(root, 'assets/vessyl-logo.svg');
const complete = join(work, 'complete.png');
const trace = JSON.parse(readFileSync(join(root, 'assets/animation-reveal.json'), 'utf8'));
const magick = process.env.MAGICK_BIN || 'magick';
const background = '#311500';

function run(args) {
  const result = spawnSync(magick, args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message);
}

function frame(clipTop, name) {
  const png = join(work, `${name}.png`);
  const [, y, , height] = trace.viewBox;
  const cut = clipTop === null ? 248 : Math.max(0, Math.min(248, Math.ceil((clipTop - y) * 248 / height)));
  if (cut === 0) {
    copyFileSync(complete, png);
  } else {
    // Mask only pixels rendered from our SVG; no reference image is ever read.
    run([complete, '+antialias', '-fill', background, '-stroke', 'none',
      '-draw', `rectangle 0,0 299,${cut - 1}`, '-strip', png]);
  }
  return png;
}

try {
  run(['-background', background, source, '-alpha', 'remove', '-alpha', 'off',
    '-resize', '300x248!', '-depth', '8', '-strip', complete]);
  const palette = join(work, 'palette.png');
  run([complete, '+dither', '-colors', '128', '-unique-colors', palette]);

  // Start the identical cycle at its complete-logo hold for static-only clients.
  const start = trace.firstCompleteFrame;
  const ordered = [...trace.frames.slice(start), ...trace.frames.slice(0, start)];
  const frames = [];
  for (const [index, step] of ordered.entries()) {
    const image = frame(step.clipTop, `reveal-${String(index).padStart(3, '0')}`);
    frames.push('-delay', String(step.delayMs / 10), image);
  }
  const gif = join(work, 'vessyl-signature.gif');
  run([
    ...frames, '+dither', '-remap', palette,
    '-loop', '0', '-layers', 'Optimize', '-strip', gif,
  ]);
  copyFileSync(gif, join(root, 'assets/vessyl-signature.gif'));
  copyFileSync(complete, join(root, 'assets/vessyl-signature-static.png'));
  console.log('Generated official VESSYL reveal: 113 source frames, 3.390 s, #311500.');
} finally {
  rmSync(work, { recursive: true, force: true });
}
