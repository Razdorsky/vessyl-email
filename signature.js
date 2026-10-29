export const BRAND = Object.freeze({
  background: '#311500',
  foreground: '#F5EBE7',
  muted: '#D8C4B7',
  website: 'https://thevessyl.com/',
  assets: 'https://razdorsky.github.io/vessyl-email/assets/',
  address: '500 metros al sur del Supermercado Kike, San Carlos, Alajuela, La Fortuna, Costa Rica.',
});

export const DEFAULT_DETAILS = Object.freeze({
  firstName: 'Martijn',
  lastName: 'Glorieux',
  jobTitle: 'Co-CEO',
  phone: '+506 6223 3344',
});

export const LIMITS = Object.freeze({ firstName: 40, lastName: 50, jobTitle: 90, phone: 32 });

export function cleanDetails(details) {
  return Object.fromEntries(Object.entries(LIMITS).map(([key, max]) => [
    key, String(details[key] ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max),
  ]));
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export function phoneHref(value) {
  const number = String(value).trim().replace(/[^\d+]/g, '');
  return `tel:${number.replace(/(?!^)\+/g, '')}`;
}

export function validPhone(value) {
  return /^\+?[\d\s().-]+$/.test(value) && value.replace(/\D/g, '').length >= 5;
}

export function signatureHtml(details, { assets = BRAND.assets, animated = true } = {}) {
  const d = cleanDetails(details);
  const name = escapeHtml(`${d.firstName} ${d.lastName}`.trim());
  const image = new URL(animated ? 'vessyl-signature.gif' : 'vessyl-signature-static.png', assets).href;
  const body = `font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;color:${BRAND.foreground};`;
  const link = `${body}font-size:12px;line-height:19px;text-decoration:none;`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="500" bgcolor="${BRAND.background}" style="width:500px;max-width:100%;border-collapse:collapse;background-color:${BRAND.background};color:${BRAND.foreground};text-align:left;">
<tbody><tr><td style="padding:28px 24px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;table-layout:fixed;"><tbody><tr>
<td width="112" valign="middle" style="width:112px;vertical-align:middle;"><a href="${BRAND.website}" style="text-decoration:none;"><img src="${escapeHtml(image)}" alt="VESSYL" width="112" height="93" border="0" style="display:block;width:112px;height:93px;border:0;outline:none;text-decoration:none;"></a></td>
<td width="24" style="width:24px;font-size:0;line-height:0;">&nbsp;</td>
<td valign="middle" style="vertical-align:middle;word-wrap:break-word;overflow-wrap:anywhere;${body}">
<p style="margin:0 0 3px;font-family:'Telugu MN',Georgia,'Times New Roman',serif;font-size:23px;font-weight:400;line-height:28px;color:${BRAND.foreground};">${name}</p>
<p style="margin:0 0 13px;${body}font-size:12px;line-height:18px;">${escapeHtml(d.jobTitle)}</p>
<p style="margin:0 0 7px;${body}font-size:11px;line-height:16px;color:${BRAND.muted};">${BRAND.address}</p>
<p style="margin:0;${body}font-size:12px;line-height:19px;"><a href="${escapeHtml(phoneHref(d.phone))}" style="${link}">${escapeHtml(d.phone)}</a></p>
<p style="margin:0;${body}font-size:12px;line-height:19px;"><a href="${BRAND.website}" style="${link}text-decoration:underline;text-underline-offset:3px;">thevessyl.com</a></p>
</td></tr></tbody></table>
</td></tr></tbody></table>`;
}

export function signatureText(details) {
  const d = cleanDetails(details);
  return [`${d.firstName} ${d.lastName}`.trim(), d.jobTitle, 'VESSYL', BRAND.address, d.phone, BRAND.website].join('\n');
}

export function signatureDocument(details) {
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>VESSYL email signature</title></head><body style="margin:0;padding:24px;background:#fff;">${signatureHtml(details)}</body></html>\n`;
}
