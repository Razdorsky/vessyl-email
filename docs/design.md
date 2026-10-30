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
all four required fields are present and the phone is valid. The initial/partial
prompt is “Please complete all fields”; a complete form says “Ready to copy
your signature”. Editing or clearing a field resets copied feedback and
re-evaluates availability. Preview uses generic labels until values are entered.

Preview window chrome uses decorative macOS-style red, yellow and green
12 px traffic lights, spaced by 8 px. These are not part of the exported signature.

Signature spacing/type revision: 12 px top, 14 px bottom and 24 px side padding, name
24 px, role/address/phone/website/CTA 14.5 px. Signature wording is unchanged.
The surrounding interface has undergone en-US proofreading, including hidden
client guides, example punctuation and validation/clipboard messages.

The latest vertical signature padding is 12px top / 14px bottom.

Optional CTA fields follow the CLT Labs reference's behavior: a valid
HTTP(S) link adds a button next to the contact links, with “Book a Meeting” as the
fallback label. A label without a link does not add anything. The button uses
the VESSYL cream/copper palette and 12 px corners; its text has the same direct
color safeguards as the existing lines. Invalid URLs disable Copy with an
explanation. HTML, plain-text clipboard and downloaded HTML retain the CTA.

Form-spacing refinement: intervals within Provide your details were reduced
by 2 px on desktop/tablet and by 1 px at 620 px and below. Heading/form: 25/23 px;
field groups: 19/17 px; label/input and input/hint: 6/7 px; paired names: 12/11 px;
last hint/Copy: 22/20 px; Copy/status: 11/12 px. Card/input padding and exported
signature geometry are unaffected. CTA link placeholder is the user-supplied
https://www.instagram.com/thevessyl.

The optional CTA is right-aligned at the bottom of the signature opposite the
phone/website pair. Email-safe aligned tables share the row, wrapping the CTA
below the links when a narrow viewport cannot fit both. Preview, clipboard and
download use the same structure; typing preserves the existing animated image.

Refinements approved for publication: signature width is 540 px with the same
fluid max-width. The status reserves only one line so card edge padding remains
balanced. Ctrl+Shift+Q fills all six fields directly from their placeholders,
omitting the “e.g.,” prefix; it refreshes validation and preview without copying
or restarting the GIF. The form still starts empty on a fresh load.

Local installation-guide addition: Outlook keeps its existing top-level tab and
now offers three compact disclosure sections: Outlook for Mac, New Outlook / web,
and Classic Outlook for Windows. Mac opens by default. Each has its actual settings path, paste and
default-selection steps, and an official Microsoft help link. Only one variant
opens at a time; JavaScript animates both opening and closing heights. The existing
Gmail and Apple Mail instructions remain in place. The reference's obsolete
base64-logo warning is inapplicable to our public HTTPS images and is omitted.

## Local EN/es-419 iteration

The existing en-US interface is the translation source. Both locale catalogs
have 60 matching keys covering UI, guidance, placeholders, metadata, ARIA and
dynamic validation/copy feedback. es-419 uses usted. The selector reuses the
Blueprint globe/capsule/chevron/checkmark pattern, recolored to page #343434;
it is available at every supported width. The chosen language is kept in the
URL query, without storing form data. Entered personal details are preserved.

Language changes reuse Blueprint's copy motion: 120ms departure, then a 400ms
arrival after 240ms from translateY(7px), cubic-bezier(.16,1,.3,1). The GIF node
is never replaced. Outlook disclosures animate height over 360ms and can be
reversed before completion. Both motions honor reduced-motion preferences.
H1 is 2px smaller across the original fluid scale, including the 33px mobile
override. A separate mobile top row keeps the selector clear of the heading.

Constraint audit removed the fixed 110px contact-table width, helper-text caps
of 255/440/490px, the mobile subtitle cap and the hidden Live preview state at
621-800px. Workspace and setup instructions use one column at 800px and below
to prevent the signature text being squeezed into a very narrow side column.
The Live preview dot rule now targets only its decorative span. The CTA has
12px of top spacing in both preview and copied HTML. User-defined 540px signature
width, logo dimensions, email padding and safety input limits remain intact.

Latest explicit refinements: CTA cell padding is 9px vertically and 10px horizontally. The shared address is Altos de Monterey, La Fortuna – Costa Rica.
Apple guidance starts with the user-requested "On your Apple device" / "En su
dispositivo Apple". The Mac default-selection sentence was shortened in both
catalogs without removing account, new-message, reply or forward choices.

Current maximum signature width is 500px without a valid CTA link and 520px
with one. Preview, clipboard HTML and downloaded HTML share this rule; the
preview resizes in place without restarting the logo animation.
The current local Mail trial sets both numeric HTML width and inline CSS width
to 500px/520px, capped by max-width:100%. Percentage-only width failed a real
sent-email test (229/181/37px tables), and a numeric HTML fallback combined with
percentage CSS still serialized to 303px on desktop. Auto table layout, normal
word wrapping and nested max-width:100% remain to let inner content adapt.
The extra outer MSO wrapper was removed because the base width is numeric again.
This candidate is not published and still requires a new received-Mail test.
Signature inner padding is 12px at the top, 14px at the bottom and 24px at
each side.
The contact row now uses justified inline blocks around email-safe tables:
CTA stays right-aligned beside the contacts, then starts at their left edge
when it wraps beneath them. Its top gap remains 12px; cell padding is now
9px vertically and 10px horizontally. Conditional table markup supplies the desktop Outlook fallback.

Latest local typography refinements: name-to-role 4px, role-to-address 12px, address-to-contacts 12px; phone/website line-height 20px. All prior 12px signature text is now 14.5px. Local only; no QA or publication requested for these refinements.

Contact text is top-aligned within its row (including the Outlook fallback), so CTA height or its 12px top margin cannot push the phone away from the address. The address-to-phone paragraph gap remains 12px with or without CTA.

Latest local weight refinement: the former 12px signature text (now 14.5px) is Medium 500 for role, address, phone, website and CTA. The 24px name keeps its prior weight.

The contact row uses a shared 12px top gutter with a -12px row offset: contacts stay top-anchored while CTA aligns to the website bottom on a shared line; a wrapped CTA retains a 12px gap. CTA retains 0px bottom margin.

Job titles use a shared presentation formatter adding the literal bullet and space (• ) in preview, HTML/plain clipboard and HTML download; a leading bullet already typed in the field is not duplicated.

Current CTA inner padding is 9px top/bottom and 10px left/right (local-only refinement).

Current CTA-label example is Our Instagram (en-US) / Nuestro Instagram (es-419). Ctrl+Shift+Q derives autofill directly from the localized placeholders, so it uses the same label.

A transparent outer table supplies 12px of top padding above the copper card, separate from the card’s internal 12px top padding. This supplies the requested external gap through table-cell padding rather than a margin that a mail editor may discard.

## Current contact-row implementation

This supersedes the earlier negative-margin and justified-row experiments.
Contact and CTA columns have explicit numeric widths; browser text measurement
uses the larger Roboto/Arial advance to reserve the CTA's intrinsic width. The
contact column fills the remaining desktop space with at least 12px of padding
before CTA. Each column is capped at the available width and wraps in normal
flow. No negative margins, justified whitespace or zero-height wrap spacer are
used. Both columns reserve a 12px bottom gutter: it becomes the inter-row gap
after wrapping. The outer 2px bottom padding plus the last 12px gutter preserves
the effective 14px lower edge. Phone remains 12px below address; a shared-row CTA
aligns to the website bottom. The preview and both HTML exports share this code.
