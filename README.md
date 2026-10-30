# VESSYL email signature builder

Live: https://razdorsky.github.io/vessyl-email/

Enter first name, last name, job title and phone number; preview updates immediately.
Optional CTA label/link fields add a button at the lower right, beside the phone
and website. A link alone
uses “Book a Meeting”; without a link no button is included.
**Copy signature** writes rich HTML and plain text to the clipboard. Paste into the
email app’s signature settings. The page includes instructions for Gmail, Apple
Mail on Mac and Outlook. **Download HTML** is an additional manual-install route.

The local iteration adds English and Latin American Spanish (es-419), selected
with the globe menu. Direct Spanish entry: `?lang=es-419`. Ctrl+Shift+Q fills
the fields from the current language's examples. Form entries are preserved
when the interface language changes.

## Brand and exported signature

- Page background: graphite `#343434`, per the latest user direction.
- Signature background: VESSYL dark copper `#311500`; warm light text.
- Official VESSYL-only seal and wordmark. Soft bottom-to-top opacity fade:
  8 seconds (4s appearance / 4s disappearance), 200 frames, 820,957 bytes.
  The complete first frame supports clients with animation off.
- Telugu MN for the name/display text where installed; Georgia is the fallback.
  Self-hosted Roboto for the builder; the email body uses Roboto/Arial/Helvetica.
- Shared address in both locales: Altos de Monterey, La Fortuna – Costa Rica. Website
  text and destination both use https://thevessyl.com/. Phone is a `tel:` link.
- Selectable live text, presentation tables and inline CSS. Exported images
  use the public absolute HTTPS URL under this site, never localhost/data URLs.
- No forms are sent, no accounts are required, no analytics or stored user data.

Fonts are not embedded into the clipboard. Email clients can substitute their
own fonts and can block external images. Apple Mail users should disable
“Always match my default message font” before pasting. The preview respects
reduced-motion preferences with a static PNG; the copied signature contains GIF.

## Local work

Node.js 22+; no dependency installation required.

```sh
npm run dev      # http://127.0.0.1:4178/
npm run check    # serializer/security/URL tests and syntax checks
npm run build    # static deployment artifact in dist/
```

GitHub Actions validates and deploys `main` through GitHub Pages. Direct main
publication is permitted for this standalone repository. The static build
includes only app files and public assets; tests and source documentation are
not served on the public site.

`tests/paste-target.html` is a local-only diagnostic surface, excluded from the
deployment. It never sends email or changes account settings.

See [design notes](docs/design.md), [logo generation](docs/logo-animation.md)
and [compatibility sources](docs/compatibility.md).
