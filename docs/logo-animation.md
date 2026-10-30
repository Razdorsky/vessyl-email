# VESSYL signature logo animation

The artwork remains the official VESSYL-only white vertical lockup in
`assets/vessyl-logo.svg`. Its paths and viewBox are unchanged. The generator
renders that SVG directly; no reference logo pixels are used.

## Current local motion

The user replaced the earlier sharp reveal with a soft bottom-to-top opacity
fade: appearance takes 4 seconds and disappearance takes 4 seconds. There are
no separately inserted pauses. A feather spanning 90% of the artwork height,
spatial smoothstep and temporal cosine easing replace the hard clipping edge.
Both phases travel from bottom to top.

The cyclic file starts at the complete-logo boundary, so clients that show only
the first GIF frame retain a readable logo. Its encoded order is disappearance
then appearance, 4 seconds each, with a continuous seam back to the full logo.

GIF cannot encode partial per-pixel alpha, so the opacity is composited onto
the signature's exact copper background, #311500, before palette encoding.
A single 256-shade copper-to-white palette avoids animated dithering noise.

- Canvas: 300 × 248 px; display remains 120 × 99 px.
- 200 encoded frames at 25 fps; decoded total duration: 8,000 ms.
- File size: 820,957 bytes; infinite loop.
- The complete static PNG is unchanged and remains the reduced-motion preview.
- `assets/animation-fade.json` records the settings and SVG checksum.
- Historical `assets/animation-reveal.json` is retained as provenance only.

## Rebuild

ImageMagick 7 is the only external generation dependency:

```sh
node scripts/generate-logo.mjs
```

The script creates temporary RGB frames and removes them afterward. It reads
only the checked-in official SVG, with no network or reference-image access.
Decoded intermediate frames were visually inspected and the GIF delay sum was
verified independently of the generator metadata.

## Publication state

Publication is approved for this revision. Exported and preview image URLs use
`fade-20261030-8s` so email image proxies fetch the new eight-second asset.
Existing installed signatures need to be copied again to receive the new URL.
