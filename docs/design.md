# Design decisions

User-approved copy: “VESSYL signature”, “Add your details, then copy your
signature”, “Provide your details”, “Once you’ve entered your details”, “Copy your signature, then paste it
into your email settings”. The first two and the installation title/subtitle
have no terminal periods. No page header, footer or section numbering.

Tokens: page #343434, signature/button #311500, form #F5EBE7, preview #FFFAF7,
accent #D3A079, light text #F5EBE7. Page copper experiments were superseded by
the latest graphite request; the exported signature retains dark copper.

Typography follows the brandbook: Telugu MN for display and Roboto for UI/body.
Telugu MN is used when installed, with Georgia as a practical serif fallback.
The licensed macOS font is not redistributed as a web asset. Roboto font files
carry their OFL license in assets/fonts/.

Layout: 1200 px desktop content width, two columns, then a single column on
phones. Mobile content gutters are 16 px; inputs are 49 px and primary button
52 px high. Input font is 16 px to avoid automatic iOS input zoom. Page top/bottom padding is 80/120 px at 1440 px and up, 60/90 px
at 801–1439 px, 50/75 px at 621–800 px and 40/60 px at 620 px and below.
Bottom padding is the complete gap after the last text, with no added section
padding. These spacing updates were approved for publication. Buttons use 12 px corner radius.

Preview uses exactly the same inline-styled table geometry as export. UI CSS
does not override signature text or logo dimensions at narrower breakpoints.
Only the asset origin differs in local development; exported URLs always point
to the public GitHub Pages site. Editing fields updates text nodes rather than
rebuilding the image, so typing does not restart the GIF.

The signature table and outer cell use the same 12 px corner radius as the
Copy signature button, included in both preview and exported inline HTML.

Fields start empty, with gray example placeholders. Copy remains disabled until
all cleaned fields are present and the phone is valid. The initial/partial
prompt is “Please complete all fields”; a complete form says “Ready to copy
your signature”. Editing or clearing a field resets copied feedback and
re-evaluates availability. Preview uses generic labels until values are entered.

Preview window chrome uses decorative macOS-style red, yellow and green
12 px traffic lights, spaced by 8 px. These are not part of the exported signature.

Local signature spacing/type revision: 24 px padding on all four sides, name
24 px, role/address/phone/website 12 px. Signature wording is unchanged.
The surrounding interface has undergone en-US proofreading, including hidden
client guides, example punctuation and validation/clipboard messages.
