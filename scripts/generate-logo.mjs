import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// ImageMagick 7 is the only build-time dependency. No browser, network or fonts.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const work = mkdtempSync(join(tmpdir(), 'vessyl-signature-logo-'));
const source = readFileSync(join(root, 'assets/vessyl-logo.svg'), 'utf8');
const magick = process.env.MAGICK_BIN || 'magick';
const background = '#311500';

function run(args) {
  const result = spawnSync(magick, args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message);
}

function frame(opacity, name) {
  const svg = join(work, `${name}.svg`);
  const png = join(work, `${name}.png`);
  // The first path is the official seal. Letterforms stay fully visible.
  // Opacity changes light only; coordinates and shape remain untouched.
  const markup = source.replace(
    '<path class="cls-1"',
    `<path opacity="${opacity.toFixed(5)}" class="cls-1"`,
  );
  writeFileSync(svg, markup);
  run([
    '-background', background, svg,
    '-alpha', 'remove', '-alpha', 'off',
    '-resize', '300x248!', '-depth', '8', '-strip', png,
  ]);
  return png;
}

try {
  const complete = frame(1, 'complete');
  run([complete, '-strip', join(root, 'assets/vessyl-signature-static.png')]);

  // 1.8 s complete hold + 2.4 s soft breathing + 1.8 s complete hold.
  // A first-frame-only email client always shows the full official lockup.
  const frames = ['-delay', '180', complete];
  const images = [complete];
  for (let i = 1; i <= 24; i++) {
    const phase = i / 24;
    const opacity = 1 - 0.18 * Math.sin(Math.PI * phase) ** 2;
    const image = frame(opacity, `breath-${String(i).padStart(2, '0')}`);
    images.push(image);
    frames.push('-delay', '10', image);
  }
  frames.push('-delay', '180', complete);
  // One palette prevents static letter edges from changing between frames.
  const palette = join(work, 'palette.png');
  run([...images, '-append', '+dither', '-colors', '128', '-unique-colors', palette]);
  run([
    ...frames, '+dither', '-remap', palette,
    '-loop', '0', '-layers', 'Optimize', '-strip',
    join(root, 'assets/vessyl-signature.gif'),
  ]);
  console.log('Generated VESSYL GIF and static PNG (300 × 248 px, #311500).');
} finally {
  rmSync(work, { recursive: true, force: true });
}
