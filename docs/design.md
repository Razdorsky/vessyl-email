# Design decisions

User-approved copy: “VESSYL signature”, “Add your details then copy your
signature”, “Provide your details”, “Everything is ready”, “Paste your signature
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
52 px high. Input font is 16 px to avoid automatic iOS input zoom. Main has an
additional 40 px bottom padding. Buttons use 12 px corner radius.

Preview uses exactly the same inline-styled table geometry as export. UI CSS
does not override signature text or logo dimensions at narrower breakpoints.
Only the asset origin differs in local development; exported URLs always point
to the public GitHub Pages site. Editing fields updates text nodes rather than
rebuilding the image, so typing does not restart the GIF.
