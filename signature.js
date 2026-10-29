export const BRAND = Object.freeze({
  background: '#311500',
  foreground: '#F5EBE7',
  muted: '#D8C4B7',
  website: 'https://thevessyl.com/',
  assets: 'https://razdorsky.github.io/vessyl-email/assets/',
  logoVersion: 'reveal-20261030',
  address: 'Altos de Monterey, La Fortuna – Costa Rica',
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

export function signatureWidth(details) {
  return ctaHref(cleanDetails(details).ctaUrl) ? 520 : 500;
}

function textColor(color) {
  return `color:${color};-webkit-text-fill-color:${color};`;
}

function textRun(value, color = BRAND.foreground) {
  // Mail can rewrite block-level colors when inserting a saved iPad signature.
  // Keep the actual characters inside their own HTML and WebKit color fallback.
  return `<font color="${color}" style="color:${color} !important;-webkit-text-fill-color:${color} !important;">${escapeHtml(value)}</font>`;
}

export function signatureCtaHtml(details, { ctaFallback = 'Book a Meeting' } = {}) {
  const d = cleanDetails(details);
  const href = ctaHref(d.ctaUrl);
  if (!href) return '';
  // A justified inline row puts this at the right until it wraps to a new line.
  return `<div data-signature-cta style="display:inline-block;max-width:100%;vertical-align:bottom;margin:12px 0 0;text-align:left;font-size:12px;line-height:18px;"><table role="presentation" align="right" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.foreground}" style="max-width:100%;border-collapse:separate;border-spacing:0;border-radius:12px;background-color:${BRAND.foreground};"><tbody><tr><td style="padding:8px 10px;border-radius:12px;${textColor(BRAND.background)}"><a href="${escapeHtml(href)}" style="display:block;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;font-size:12px;line-height:18px;text-decoration:none;overflow-wrap:anywhere;${textColor(BRAND.background)}">${textRun(d.ctaLabel || ctaFallback, BRAND.background)}</a></td></tr></tbody></table></div>\n`;
}

export function signatureHtml(details, { assets = BRAND.assets, animated = true, ctaFallback = 'Book a Meeting' } = {}) {
  const d = cleanDetails(details);
  const name = `${d.firstName} ${d.lastName}`.trim();
  const image = signatureImageUrl(assets, animated);
  const width = signatureWidth(d);
  const body = 'font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;';
  const link = `${body}font-size:12px;line-height:19px;text-decoration:none;${textColor(BRAND.foreground)}`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${width}" bgcolor="${BRAND.background}" style="width:${width}px;max-width:100%;border-collapse:separate;border-spacing:0;border-radius:12px;overflow:hidden;background-color:${BRAND.background};text-align:left;">
<tbody><tr><td style="padding:12px 24px 14px;border-radius:12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;table-layout:fixed;"><tbody><tr>
<td width="120" valign="middle" style="width:120px;vertical-align:middle;"><a href="${BRAND.website}" style="text-decoration:none;${textColor(BRAND.foreground)}"><img src="${escapeHtml(image)}" alt="VESSYL" width="120" height="99" border="0" style="display:block;width:120px;height:99px;border:0;outline:none;text-decoration:none;${textColor(BRAND.foreground)}"></a></td>
<td width="24" style="width:24px;font-size:0;line-height:0;">&nbsp;</td>
<td valign="middle" bgcolor="${BRAND.background}" style="vertical-align:middle;word-wrap:break-word;overflow-wrap:anywhere;background-color:${BRAND.background};${body}">
<p style="margin:0 0 3px;font-family:'Telugu MN',Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;line-height:28px;${textColor(BRAND.foreground)}">${textRun(name)}</p>
<p style="margin:0 0 13px;${body}font-size:12px;line-height:18px;${textColor(BRAND.foreground)}">${textRun(d.jobTitle)}</p>
<p style="margin:0 0 7px;${body}font-size:12px;line-height:16px;${textColor(BRAND.muted)}">${textRun(BRAND.address, BRAND.muted)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;"><tbody><tr><td data-signature-contact style="padding:0;vertical-align:bottom;text-align:justify;font-size:0;line-height:0;">
<!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td valign="bottom"><![endif]-->
<div data-signature-links style="display:inline-block;max-width:100%;vertical-align:bottom;text-align:left;font-size:12px;line-height:19px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:100%;border-collapse:collapse;text-align:left;"><tbody><tr><td style="padding:0;">
<p style="margin:0;${body}font-size:12px;line-height:19px;${textColor(BRAND.foreground)}"><a href="${escapeHtml(phoneHref(d.phone))}" style="${link}">${textRun(d.phone)}</a></p>
<p style="margin:0;${body}font-size:12px;line-height:19px;${textColor(BRAND.foreground)}"><a href="${BRAND.website}" style="${link}text-decoration:underline;text-underline-offset:3px;">${textRun('thevessyl.com')}</a></p>
</td></tr></tbody></table></div>
<!--[if mso]></td><td align="right" valign="bottom"><![endif]-->
${signatureCtaHtml(d, { ctaFallback })}
<!--[if mso]></td></tr></table><![endif]-->
<span data-signature-line-end aria-hidden="true" style="display:inline-block;width:100%;height:0;line-height:0;font-size:0;vertical-align:top;">&nbsp;</span>
</td></tr></tbody></table>
</td></tr></tbody></table>
</td></tr></tbody></table>`;
}

export function signatureText(details, { ctaFallback = 'Book a Meeting' } = {}) {
  const d = cleanDetails(details);
  const lines = [`${d.firstName} ${d.lastName}`.trim(), d.jobTitle, 'VESSYL', BRAND.address, d.phone, BRAND.website];
  const href = ctaHref(d.ctaUrl);
  if (href) lines.push('', `${d.ctaLabel || ctaFallback}: ${href}`);
  return lines.join('\n');
}

export function signatureDocument(details, { lang = 'en-US', title = 'VESSYL email signature', ...options } = {}) {
  return `<!doctype html>\n<html lang="${escapeHtml(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head><body style="margin:0;padding:24px;background:#fff;">${signatureHtml(details, options)}</body></html>\n`;
}
