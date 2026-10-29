# VESSYL signature logo

The email lockup contains only the official VESSYL seal and wordmark. No AKEN
or other brand appears in these assets.

## Sources and geometry

- `assets/vessyl-logo.svg` is the official white vertical lockup supplied in
  Blueprint at `public/brand/logo-vertical-white.svg`.
- The official path data is unchanged. Its empty outer artboard was reduced
  from `0 0 980 848.78` to `120 120 740 612`, retaining 40 SVG units of clear
  space around the visible mark. No path is rotated, stretched or redrawn.
- `assets/vessyl-symbol.svg` is Blueprint's official white seal, copied without
  modification from `public/brand/symbol-white.svg`.

## Delivered formats

- `vessyl-signature.gif`: 300 × 248 px, six-second infinite loop, composited on
  exact dark copper `#311500`. Appropriate display size: 120 × 99.2 px (or an
  integer 120 × 99 px). It can also be displayed at 150 × 124 px for a 2× asset.
- `vessyl-signature-static.png`: the matching complete lockup and copper canvas.

The first frame is complete and fully visible. It holds for 1.8 seconds, the
seal gently breathes between 100% and 82% opacity over 2.4 seconds, and the full
lockup holds for another 1.8 seconds. The wordmark never fades. No geometry
changes. Clients displaying only the first frame still show the complete brand.
GIF delta-frame optimization may use transparent unchanged pixels internally;
the composited image remains opaque throughout the animation.

## Verified output

- GIF: 150,808 bytes, 26 frames, exactly 6.000 seconds.
- Static PNG: 43,258 bytes, 300 × 248 px.
- Every coalesced frame is opaque and its canvas pixel is exact RGB(49, 21, 0).
- The first frame was visually checked: complete seal plus VESSYL wordmark.
- Comparison confirms only the SVG viewBox changed; official paths are identical.

## Rebuild

Install ImageMagick 7 from its official package, then run from the repository:

```sh
node scripts/generate-logo.mjs
magick identify assets/vessyl-signature.gif
```

The script reads only the checked-in official SVG, uses a temporary frame
directory and deletes only that directory after export. It does not need
network access, private fonts or credentials. `MAGICK_BIN` may specify the
ImageMagick executable when it is not on PATH.
