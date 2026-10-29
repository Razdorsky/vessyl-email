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
