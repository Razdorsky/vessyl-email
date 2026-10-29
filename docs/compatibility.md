# Clipboard and email compatibility

One ClipboardItem contains `text/html` first and `text/plain` second. Clipboard
write starts directly inside the user’s submit/click action, before any await,
to preserve WebKit user activation. The deployed site uses HTTPS. A copy-event
fallback supports browsers without Async Clipboard; failures expose the manual
HTML-download route rather than reporting a false success.

The HTML is under 4 KB for the default signature, uses presentation tables,
cell padding, explicit image dimensions and inline styles. It does not rely on
JavaScript, a stylesheet, data/blob URLs, base64 images, flexbox or grid in email.
Both links and user-controlled text are escaped/normalized. The form and HTML
download share validation. International names and ordinary phone formatting
are preserved.

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
