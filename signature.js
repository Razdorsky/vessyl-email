export const BRAND = Object.freeze({
  background: '#311500',
  foreground: '#F5EBE7',
  muted: '#D8C4B7',
  website: 'https://thevessyl.com/',
  assets: 'https://razdorsky.github.io/vessyl-email/assets/',
  logoVersion: 'reveal-20261030',
  address: '500 metros al sur del Supermercado Kike, San Carlos, Alajuela, La Fortuna, Costa Rica.',
});

export const DEFAULT_DETAILS = Object.freeze({
  firstName: 'Martijn',
  lastName: 'Glorieux',
  jobTitle: 'Co-CEO',
  phone: '+506 6223 3344',
});

export const LIMITS = Object.freeze({ firstName: 40, lastName: 50, jobTitle: 90, phone: 32, ctaLabel: 80, ctaUrl: 2048 });

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

export function ctaHref(value) {
  try {
    const url = new URL(String(value).trim());
    return ['https:', 'http:'].includes(url.protocol) && url.hostname && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}

export function signatureImageUrl(assets = BRAND.assets, animated = true) {
  const image = new URL(animated ? 'vessyl-signature.gif' : 'vessyl-signature-static.png', assets);
  image.searchParams.set('v', BRAND.logoVersion);
  return image.href;
}

function textColor(color) {
  return `color:${color};-webkit-text-fill-color:${color};`;
}

function textRun(value, color = BRAND.foreground) {
  // Mail can rewrite block-level colors when inserting a saved iPad signature.
  // Keep the actual characters inside their own HTML and WebKit color fallback.
  return `<font color="${color}" style="color:${color} !important;-webkit-text-fill-color:${color} !important;">${escapeHtml(value)}</font>`;
}

export function signatureCtaHtml(details) {
  const d = cleanDetails(details);
  const href = ctaHref(d.ctaUrl);
  if (!href) return '';
  // Aligned email tables share the contact row and wrap when space is limited.
  return `<table data-signature-cta role="presentation" align="right" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.foreground}" style="max-width:100%;margin:2px 0 0;border-collapse:separate;border-spacing:0;border-radius:12px;background-color:${BRAND.foreground};"><tbody><tr><td style="padding:9px 14px;border-radius:12px;${textColor(BRAND.background)}"><a href="${escapeHtml(href)}" style="display:block;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;font-size:12px;line-height:18px;text-decoration:none;overflow-wrap:anywhere;${textColor(BRAND.background)}">${textRun(d.ctaLabel || 'Book a Meeting', BRAND.background)}</a></td></tr></tbody></table>`;
}

export function signatureHtml(details, { assets = BRAND.assets, animated = true } = {}) {
  const d = cleanDetails(details);
  const name = `${d.firstName} ${d.lastName}`.trim();
  const image = signatureImageUrl(assets, animated);
  const body = 'font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;';
  const link = `${body}font-size:12px;line-height:19px;text-decoration:none;${textColor(BRAND.foreground)}`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="500" bgcolor="${BRAND.background}" style="width:500px;max-width:100%;border-collapse:separate;border-spacing:0;border-radius:12px;overflow:hidden;background-color:${BRAND.background};text-align:left;">
<tbody><tr><td style="padding:16px 24px;border-radius:12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;table-layout:fixed;"><tbody><tr>
<td width="120" valign="middle" style="width:120px;vertical-align:middle;"><a href="${BRAND.website}" style="text-decoration:none;${textColor(BRAND.foreground)}"><img src="${escapeHtml(image)}" alt="VESSYL" width="120" height="99" border="0" style="display:block;width:120px;height:99px;border:0;outline:none;text-decoration:none;${textColor(BRAND.foreground)}"></a></td>
<td width="24" style="width:24px;font-size:0;line-height:0;">&nbsp;</td>
<td valign="middle" bgcolor="${BRAND.background}" style="vertical-align:middle;word-wrap:break-word;overflow-wrap:anywhere;background-color:${BRAND.background};${body}">
<p style="margin:0 0 3px;font-family:'Telugu MN',Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;line-height:28px;${textColor(BRAND.foreground)}">${textRun(name)}</p>
<p style="margin:0 0 13px;${body}font-size:12px;line-height:18px;${textColor(BRAND.foreground)}">${textRun(d.jobTitle)}</p>
<p style="margin:0 0 7px;${body}font-size:12px;line-height:16px;${textColor(BRAND.muted)}">${textRun(BRAND.address, BRAND.muted)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;"><tbody><tr><td data-signature-contact style="padding:0;vertical-align:bottom;">
<table role="presentation" align="left" cellpadding="0" cellspacing="0" border="0" width="110" style="width:110px;max-width:100%;border-collapse:collapse;text-align:left;"><tbody><tr><td style="padding:0;">
<p style="margin:0;${body}font-size:12px;line-height:19px;${textColor(BRAND.foreground)}"><a href="${escapeHtml(phoneHref(d.phone))}" style="${link}">${textRun(d.phone)}</a></p>
<p style="margin:0;${body}font-size:12px;line-height:19px;${textColor(BRAND.foreground)}"><a href="${BRAND.website}" style="${link}text-decoration:underline;text-underline-offset:3px;">${textRun('thevessyl.com')}</a></p>
</td></tr></tbody></table>
${signatureCtaHtml(d)}
</td></tr></tbody></table>
</td></tr></tbody></table>
</td></tr></tbody></table>`;
}

export function signatureText(details) {
  const d = cleanDetails(details);
  const lines = [`${d.firstName} ${d.lastName}`.trim(), d.jobTitle, 'VESSYL', BRAND.address, d.phone, BRAND.website];
  const href = ctaHref(d.ctaUrl);
  if (href) lines.push('', `${d.ctaLabel || 'Book a Meeting'}: ${href}`);
  return lines.join('\n');
}

export function signatureDocument(details) {
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>VESSYL email signature</title></head><body style="margin:0;padding:24px;background:#fff;">${signatureHtml(details)}</body></html>\n`;
}
