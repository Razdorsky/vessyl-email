# Local en-US / es-419 verification

Source: the existing English builder, including the previously added Outlook
instructions. No other target locale was used as a pivot. Scope is this builder;
the separate Blueprint repository was read only as a style/motion reference.

Pass 1 translated all 60 entries directly into neutral Latin American Spanish
with usted. Pass 2 independently reopened both complete catalogs and compared
meaning, register, numbers, brands, phone/URL examples and guide HTML structure.
The independent reviewer inherited the primary agent's model capability and
corrected two Apple Mail UI labels from the official Spanish Apple help page:
https://support.apple.com/es-co/guide/mail/cpmlprefsig/mac.

Key parity, Unicode NFC and guide tag parity pass automatically. Browser checks
cover direct Spanish entry, EN/ES switching with keyboard and pointer, retained
form values, translated custom validation and copy feedback, and placeholder
autofill in both languages. Actual rich/plain clipboard payloads contain the
Spanish CTA fallback and public image URL. The fixed address and personal data
are retained. Full native email-client behavior was not re-tested here.

The incomplete-form message now explicitly refers to required fields in both
locales: "Please complete all required fields" / "Complete todos los campos
obligatorios". Only the four personal fields are required; CTA remains optional.

The user approved publication of this iteration after the required-fields
wording correction. Its direct Spanish second pass passed; no additional
QA cycle was requested before publication.

Final responsive pass: en-US and es-419 checked at 360, 375, 621, 768, 800, 801
and 1440px without horizontal overflow; Live preview stays visible. At rest,
Outlook variants are Mac, New/web, Windows classic, with Mac open by default.
Keyboard language selection, Escape, custom errors, autofill and both clipboard
representations pass. Nine tests and the production build pass. Motion was
observed during opening/closing and language arrival; reduced-motion guards
were inspected without changing the user's operating-system preference.

Latest shared-address instruction replaces the original address in every
signature representation, identically in both locales: Altos de Monterey,
La Fortuna – Costa Rica. Original source material remains unchanged in the
external raw bank.

The independent reviewer also rechecked the subsequent Apple-device wording
and shortened Outlook Mac sentence directly against the revised English.
The final actual clipboard check waited for the success state before reading:
both MIME representations have the new address, no old-address substring, and
the rich HTML has the requested 8px/10px CTA padding.

## Latest local layout and requested code audits

Width is now 520px. In EN/es-419, a wrapped CTA starts at the same left edge as
the contact text with a 12px top gap; a shared desktop row retains right and
bottom alignment. The actual copied HTML was independently rendered at 375px
and 1440px, with matching alignment and no mobile overflow. Clipboard output
retains the hybrid row, public GIF URL and conditional Outlook fallback.

Phase 1 independently reviewed page code, state, translation, motion, controls,
copy/download, build and local server. No critical functional/security defect
was confirmed. The user subsequently confirmed testing the Apple instructions
on Mac, iPad and iPhone; the requested Apple-device wording stays unchanged.
This is user-reported device verification, separate from the local code audit.
The incomplete-form message was clarified to refer only to required fields.

Phase 2 reviewed signature serialization and six EN/ES cases with/without CTA
and escaped characters. Normal and MSO HTML branches are balanced, public-image
URLs and safe link schemes are preserved, and representative payloads remain
below 10,000 characters. The previously discussed small CTA hit-area limitation
remains unchanged. Nine tests and the static build pass. No real mail was sent
and no email-account settings were modified.

Latest preview note: compatibility, font fallback and the built-in12px top gap are one paragraph in both locales. The scoped en-US source and es-419 target passed an independent native Spanish second pass. Current catalogs have59 matching keys.
