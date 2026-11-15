# VESSYL email signature builder

Standalone static builder used in the Vessyl team preview. GitHub Pages for
`Razdorsky/vessyl-email` publishes only the legacy `assets/vessyl-signature.gif`
so previously installed email signatures can still load it. Direct main
publication is permitted for this standalone project.
Never modify Blueprint or the other marketing website repositories.

Use the official VESSYL-only logo, dark copper #311500, Telugu MN for display
and Roboto for body/UI. Do not redistribute the macOS Telugu MN font; use the
installed typeface with Georgia as a fallback. Roboto is self-hosted under OFL.

The signature remains selectable text in email-safe tables with inline styles.
Clipboard must contain HTML first and plain text second. Exported image URLs
must be public absolute HTTPS URLs, never localhost, data URLs or blob URLs.
First GIF frame must be a complete visible logo. Do not send mail or change
real email-account settings as a test. No analytics or form-data transmission.

Before publishing: `npm run check`, `npm run build`, responsive browser QA and
actual rich-clipboard paste in a local test surface. Monitor Pages deployment.
