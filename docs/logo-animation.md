# VESSYL signature logo

## Artwork authority

`assets/vessyl-logo.svg` is our official VESSYL-only white vertical lockup,
originally supplied by Blueprint at public/brand/logo-vertical-white.svg.
Its path data has not been altered. The existing viewBox 120 120 740 612 keeps
clear space around the seal and wordmark. No logo pixels, lettering or paths
from the email reference are used in this animation.

## Reference motion

The user requests the same motion as the original email GIF, using our own logo.
Read-only analysis of that GIF found a bottom-to-top reveal: lettering first,
then the seal, then a complete hold. The source is 113 frames × 30 ms = 3.390 s.
`assets/animation-reveal.json` stores only derived numerical reveal positions
and frame delays mapped to our SVG coordinates. It contains no reference image.

The cyclic sequence begins at source phase93 (the complete-logo hold), then
continues through the blank and reveal phases in their original order. This
phase rotation preserves the loop and timings while giving email clients that
stop animation a fully readable first frame.

## Rendering

The generator renders our SVG once to an opaque 300 × 248 PNG on #311500.
Each frame masks the area above its numeric reveal boundary with the same
background. This avoids SVG clipPath inconsistencies in ImageMagick and
preserves the logo geometry. There is no opacity pulsing or new deformation.

- GIF: 300 × 248, 113 frames, 3.390 seconds, 32,031 bytes, infinite loop.
- Display size: 120 × 99 px in both preview and exported signature.
- All coalesced frames are opaque on exact RGB(49,21,0).
- 60 distinct decoded frame states; first20 complete, next27 blank, remaining66
  reveal the wordmark and seal upward. First and last frames are complete.
- Our SVG is byte-for-byte unchanged by this revision.
- Static PNG remains the complete version for reduced-motion preview.

ImageMagick7 is the sole generation dependency. Rebuild locally:

```sh
node scripts/generate-logo.mjs
```

The script reads only the checked-in official SVG and numerical trace. It does
not fetch or read the reference GIF. Temporary frame files are removed afterward.
The earlier breathing animation remains recoverable from the initial published
Git commit. This revised animation was approved for publication. The exported image URL
includes a version query so email image proxies request the updated GIF.
