# Verification — 2026-10-30

- Five serializer tests pass: safe HTML escaping, international names, telephone
  formatting, plain-text parity, public image URL and download document.
- JavaScript syntax checks pass; static build produces only app/public files.
- Chrome layouts inspected at 360, 375, 768 and 1440 px: page scroll width equals
  viewport width; signature table stays within its preview container.
- Live name/title editing verified with José O’Connor and an ampersand in title.
- Copy reports success and clipboard inspection confirms text/html first plus
  text/plain, with the public GIF URL and correct website/tel destinations.
- Native-keyboard paste could not be certified through this browser automation
  transport: its paste helpers inserted plain text/source. That limitation is
  not counted as an email-client compatibility pass. Actual native Mail/Gmail/
  Outlook account settings were not modified and no emails were sent.
- Spaces-only names are rejected by both export actions. Invalid phone numbers
  are rejected. Client instruction tabs work by click and Left/Right keyboard.
- Download button generated the HTML file in Downloads. Its content was checked
  for the correct name, public GIF and working business-link markup. The browser
  download-event adapter timed out, so the actual saved file was inspected.
- GIF verified independently: 300 × 248, 26 frames, 6.000 s, 150,808 bytes;
  decoded first/midpoint frame hashes differ. Official lockup visible in frame 1.
- Additional main bottom padding: 40 px. No header, footer or section numbering.

## Local-only animation revision

The user requires the reference’s bottom-up reveal on our own unchanged SVG.
Independent decoding confirms113frames/3.390s,60distinct states and opaque
#311500. Full first frame, wordmark-then-seal reveal and original frame delays
are preserved. No reference raster is rendered or modified. Current local GIF
is32,031bytes; displayed at120×99px. The signature has12px rounded corners.
The user subsequently approved these revisions for publication.

Local empty-form state verified in Chrome: empty and partial forms keep Copy
disabled; a complete valid form enables it and copies successfully; replacing
a required name with spaces disables it again and restores the prompt.

Local en-US review covers headings, labels, placeholders, all three client
guides, metadata, accessibility labels and validation/clipboard messages.
Signature wording was excluded. Separately authorized signature layout was
verified in Chrome: padding24px; name24px; role/address/phone/site12px.

## Release verification after approval

- Local Clipboard API round trip passed: the actual Copy button wrote HTML and
  plain text; the local rich-text editor read the HTML representation and
  retained both presentation tables, the image, website/tel links, 24px padding
  and 12px corners. Native keyboard-paste transport limitations above remain
  separate; no actual email account settings were changed.
- Final 360/375/768/1440px browser checks show no horizontal overflow and correct
  responsive top/bottom spacing. The empty form keeps Copy disabled.
- Exported and preview image URLs use the same reveal-20261030 revision query.
- Five tests, JavaScript syntax checks and static build pass.

## Local iPad-color hardening

Received Test HTML and the two additional device screenshots locate the issue
between saved settings and new-message insertion. Name/title paragraph colors
are absent in the received source. All five copied text runs now carry direct
color safeguards. Actual Copy payload had both MIME types and five text runs;
forcing all ancestor blocks to black retained RGB245/235/231 on name, role,
phone and website and RGB216/196/183 on the address. Native iPad confirmation
is still pending. This fix and the 16px vertical padding were approved for publication.

## Local optional CTA

Reference inspected at https://signatures.cltlabs.com/: an optional link adds a
button, and its label defaults to Book a Meeting. VESSYL now has the same
optional behavior in its own palette. Browser checks verify required-fields
copying without CTA, URL-only fallback, custom label, invalid-link feedback,
and removal when the link is cleared. The real Copy button produced both HTML
and plain-text representations containing the custom label and destination.
Desktop and 360px mobile show no horizontal overflow; logo loads. Seven tests,
syntax checks and static build pass. The user supplied Instagram as the link
placeholder. These changes were approved for publication; no native Mail test is claimed.

## Publication checkpoint, 2026-10-30

CTA sits at the lower right opposite the contact links in both preview and the
actual HTML clipboard payload. At 375px it wraps beneath them without overflow;
desktop bottom edges align. Seven tests, syntax checks and production build pass.
The prior clipboard-API rich insertion check remains documented above. The
latest native automated paste transferred the plain-text representation, while
Clipboard API inspection confirms both MIME types; this automation limitation
is not a native email-client compatibility result. No extended QA was repeated.

## Latest local soft-fade animation

Decoded GIF checks: 300x248 canvas, 200 frames, 8,000ms total, 820,957 bytes. Independent FFmpeg samples show bottom-to-top fade-out and fade-in with a broad soft opacity edge. Official SVG and static PNG are unchanged. Nine existing checks pass. New GIF is local only; its public image revision must be bumped at the next authorized publication.

## Signature-only prepublication audit

Per user scope, the page code was excluded from the manual audit. Six EN/ES signature cases (no CTA, fallback CTA, long label) were parsed in both HTML exports and with/without Outlook conditional tables: tags balance, tables retain presentation roles, user text is escaped, links use safe schemes, web links target a new tab, and GIF URLs are public HTTPS. No negative margins, justified alignment, NaN or Infinity in output. Representative HTML ranges4479–5818 characters. External top spacing now uses a transparent table cell with12px padding. GIF revision changed to fade-20261030-8s. Nine checks and build pass; no native email was sent and no account settings changed. No broad page QA repeated.
