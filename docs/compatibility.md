# Clipboard and email compatibility

One ClipboardItem contains `text/html` first and `text/plain` second. Clipboard
write starts directly inside the user’s submit/click action, before any await,
to preserve WebKit user activation. The deployed site uses HTTPS. A copy-event
fallback supports browsers without Async Clipboard; failures expose the manual
HTML-download route rather than reporting a false success.

Typical output is about 4,200 HTML characters without CTA and 5,100 with CTA.
It uses presentation tables,
cell padding, explicit image dimensions and inline styles. It does not rely on
JavaScript, a stylesheet, data/blob URLs, base64 images, flexbox or grid in email.
Both links and user-controlled text are escaped/normalized. The form and HTML
download share validation. International names and ordinary phone formatting
are preserved.

Optional CTA URLs allow HTTP(S), reject embedded credentials and unsafe schemes,
and are escaped before insertion. Missing/invalid links produce no CTA in the
serializer. A valid link is retained in rich HTML, plain text and the download;
the button uses table/cell styling and explicit text-run colors.

The contact row uses justified inline blocks so the CTA is right-aligned on
the shared row and left-aligned after wrapping. A zero-height line-ending
spacer supplies justification without a stylesheet or client-side script.
MSO conditional tables provide the classic Outlook desktop fallback; these
comments survived the actual HTML clipboard round trip. Both normal and MSO
HTML branches were structurally checked. This does not replace native-client
rendering tests.

## Primary sources consulted

- WebKit [Async Clipboard API](https://webkit.org/blog/10855/async-clipboard-api/):
  multiple MIME representations, fidelity ordering, secure context/user action.
- Google [Create a Gmail signature](https://support.google.com/mail/answer/8395?hl=en):
  formatted signatures, images and the 10,000-character limit.
- Google [Signature images by URL](https://knowledge.workspace.google.com/admin/gmail/set-up-google-workspace-user-signatures-in-gmail).
- Apple [Signature settings](https://support.apple.com/en-gb/guide/mail/-cpmlprefsig/mac):
  the default-message-font setting can override signature typography.
- Microsoft [Outlook signature instructions](https://support.microsoft.com/en-us/outlook/mail/how-to-add-and-change-an-email-signature-in-outlook):
  new Outlook/web Accounts → Signatures; classic Outlook has its own editor.
- Microsoft [Outlook for Mac instructions](https://support.microsoft.com/en-us/outlook/create-insert-or-change-a-signature-in-outlook-for-mac):
  Outlook Settings → Signatures, with defaults selected separately per account.
- Microsoft [Animated GIF support](https://support.microsoft.com/en-au/outlook/the-animated-graphic-in-my-e-mail-message-doesn-t-work):
  first frame when animation is disabled.
- Google [Gmail CSS support](https://developers.google.com/workspace/gmail/design/css)
  and Microsoft [Rendering troubleshooting](https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/email-troubleshoot-rendering):
  email rendering and custom-font fallbacks vary between clients.

## Limits of verification

Source and browser QA verify the HTML payload, both clipboard MIME types,
responsive rendering, image loading, validation and installation controls.
No email is sent and no user’s actual signature settings are changed. This is
not a claim of a full native-client send/receive matrix. Fonts may fall back;
recipients may disable remote images or animation.

GIF URLs carry a revision query, preventing the previous breathing animation
from persisting in image-proxy caches when a new signature is copied.

## iPad saved-signature color rewrite — published safeguard

The user's settings screenshot preserves white name/title text, but the new
message screenshot turns them black. Read-only inspection of the received
Test message confirms its name/title paragraphs have lost their own color;
the outer table retains a foreground color, while address/link colors survive.
This establishes the changed HTML state, not a precise diagnosis of UIKit's
internal algorithm.

Each of the five text lines now has direct CSS color/text-fill and a separate
legacy font-color attribute on the actual text run. The text cell repeats its
copper bgcolor/background. Table/cell foreground inheritance was removed so
line colors stand alone. Logo alt text also has explicit light color.
Preview edits update the text runs without deleting their formatting.

The captured clipboard HTML was rendered and all ancestor block colors forced
to black in a bounded browser fixture: all five actual text runs retained the
correct light/muted colors. This is not an iPad Mail emulator. Reinstall the
candidate signature and open a new message on the affected iPad to confirm.
No real account signature settings were changed and no messages were sent.

Primary implementation context: WebKit documents
[clipboard reserialization](https://webkit.org/blog/8170/clipboard-api-improvements/)
and [text-fill behavior](https://webkit.org/blog/85/introducing-text-stroke/).
Its [Mail color adaptation change](https://github.com/WebKit/WebKit/commit/e1bc930edef95d5fe08fe76b2a195b82c9123790)
is related context, not proof that the same underlying bug is involved.
