export const BRAND = Object.freeze({
  background: '#311500',
  foreground: '#F5EBE7',
  muted: '#D8C4B7',
  website: 'https://thevessyl.com/',
  assets: 'https://razdorsky.github.io/vessyl-email/assets/',
  logoVersion: 'fade-20261030-8s',
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

export function jobTitleText(value) {
  const title = String(value ?? '').trim().replace(/^•\s*/, '');
  return title ? `• ${title}` : '';
}

function textColor(color) {
  return `color:${color};-webkit-text-fill-color:${color};`;
}

function textRun(value, color = BRAND.foreground) {
  // Mail can rewrite block-level colors when inserting a saved iPad signature.
  // Keep the actual characters inside their own HTML and WebKit color fallback.
  return `<font color="${color}" style="color:${color} !important;-webkit-text-fill-color:${color} !important;">${escapeHtml(value)}</font>`;
}

let textMeasureContext;
function measuredTextWidth(text) {
  if (typeof document !== 'undefined') {
    textMeasureContext ??= document.createElement('canvas').getContext('2d');
    if (textMeasureContext) {
      return Math.ceil(Math.max(...['Roboto', 'Arial'].map(font => {
        textMeasureContext.font = `500 14.5px ${font}`;
        return textMeasureContext.measureText(text).width;
      })));
    }
  }
  // Offline serializers can conservatively size a column without a DOM font engine.
  return Array.from(text).length * 8;
}

export function signatureCtaHtml(details, { ctaFallback = 'Book a Meeting', columnWidth } = {}) {
  const d = cleanDetails(details);
  const href = ctaHref(d.ctaUrl);
  if (!href) return '';
  const label = d.ctaLabel || ctaFallback;
  const width = columnWidth ?? Math.min(signatureWidth(d) - 192, measuredTextWidth(label) + 22);
  return `<div data-signature-cta style="display:inline-block;width:${width}px;max-width:100%;vertical-align:bottom;margin:0;text-align:left;font-size:14.5px;line-height:18px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:100%;border-collapse:collapse;"><tbody><tr><td align="left" style="padding:0 0 12px;vertical-align:bottom;"><table data-signature-button role="presentation" width="${width}" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.foreground}" style="width:${width}px;max-width:100%;border-collapse:separate;border-spacing:0;border-radius:12px;background-color:${BRAND.foreground};"><tbody><tr><td style="padding:9px 10px;border-radius:12px;${textColor(BRAND.background)}"><a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" style="display:block;text-align:center;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:500;font-size:14.5px;line-height:18px;text-decoration:none;overflow-wrap:anywhere;${textColor(BRAND.background)}">${textRun(label, BRAND.background)}</a></td></tr></tbody></table></td></tr></tbody></table></div>`;
}

export function signatureContactHtml(details, { ctaFallback = 'Book a Meeting', phoneFallback = '' } = {}) {
  const d = cleanDetails(details);
  const available = signatureWidth(d) - 192;
  const hasCta = Boolean(ctaHref(d.ctaUrl));
  const buttonWidth = hasCta ? Math.min(available, measuredTextWidth(d.ctaLabel || ctaFallback) + 22) : 0;
  const contactMinimum = Math.max(measuredTextWidth(d.phone || phoneFallback), measuredTextWidth('thevessyl.com')) + 14;
  const sharedRow = hasCta && contactMinimum + buttonWidth <= available;
  const contactWidth = sharedRow ? available - buttonWidth : available;
  const body = 'font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:500;font-size:14.5px;line-height:20px;';
  const link = `${body}text-decoration:none;${textColor(BRAND.foreground)}`;
  const href = d.phone ? ` href="${escapeHtml(phoneHref(d.phone))}"` : '';
  const contacts = `<div data-signature-links style="display:inline-block;width:${contactWidth}px;max-width:100%;vertical-align:top;margin:0;text-align:left;font-size:14.5px;line-height:20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:100%;border-collapse:collapse;"><tbody><tr><td style="padding:0 ${sharedRow ? 12 : 0}px 12px 0;vertical-align:top;">
<p style="margin:0;${body}${textColor(BRAND.foreground)}"><a${href} style="${link}">${textRun(d.phone || phoneFallback)}</a></p>
<p style="margin:0;${body}${textColor(BRAND.foreground)}"><a href="${BRAND.website}" target="_blank" rel="noopener noreferrer" style="${link}text-decoration:underline;text-underline-offset:3px;">${textRun('thevessyl.com')}</a></p>
</td></tr></tbody></table></div>`;
  const msoMiddle = sharedRow ? `</td><td width="${buttonWidth}" valign="bottom">` : `</td></tr><tr><td width="${buttonWidth}" valign="bottom">`;
  return `<!--[if mso]><table role="presentation" width="${available}" cellpadding="0" cellspacing="0" border="0"><tr><td width="${contactWidth}" valign="top"><![endif]-->
${contacts}${hasCta ? `<!--[if mso]>${msoMiddle}<![endif]-->${signatureCtaHtml(d, { ctaFallback, columnWidth: buttonWidth })}` : ''}
<!--[if mso]></td></tr></table><![endif]-->`;
}

export function signatureHtml(details, { assets = BRAND.assets, animated = true, ctaFallback = 'Book a Meeting', phoneFallback = '' } = {}) {
  const d = cleanDetails(details);
  const name = `${d.firstName} ${d.lastName}`.trim();
  const image = signatureImageUrl(assets, animated);
  const width = signatureWidth(d);
  const body = 'font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:500;';
  // The 12px bottom gutter in each contact column plus this 2px equals 14px.
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${width}" style="width:${width}px;max-width:100%;border-collapse:collapse;"><tbody><tr><td style="padding:12px 0 0;">
<table data-signature-card role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${BRAND.background}" style="width:100%;max-width:100%;border-collapse:separate;border-spacing:0;border-radius:12px;overflow:hidden;background-color:${BRAND.background};text-align:left;">
<tbody><tr><td style="padding:12px 24px 2px;border-radius:12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:100%;border-collapse:collapse;table-layout:auto;"><tbody><tr>
<td width="120" valign="middle" style="width:120px;vertical-align:middle;"><a href="${BRAND.website}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;${textColor(BRAND.foreground)}"><img src="${escapeHtml(image)}" alt="VESSYL" width="120" height="99" border="0" style="display:block;width:120px;height:99px;border:0;outline:none;text-decoration:none;${textColor(BRAND.foreground)}"></a></td>
<td width="24" style="width:24px;font-size:0;line-height:0;">&nbsp;</td>
<td valign="middle" bgcolor="${BRAND.background}" style="vertical-align:middle;word-wrap:break-word;overflow-wrap:break-word;background-color:${BRAND.background};${body}">
<p style="margin:0 0 4px;font-family:'Telugu MN',Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;line-height:28px;${textColor(BRAND.foreground)}">${textRun(name)}</p>
<p style="margin:0 0 12px;${body}font-size:14.5px;line-height:18px;${textColor(BRAND.foreground)}">${textRun(jobTitleText(d.jobTitle))}</p>
<p style="margin:0 0 12px;${body}font-size:14.5px;line-height:16px;${textColor(BRAND.muted)}">${textRun(BRAND.address, BRAND.muted)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:100%;border-collapse:collapse;"><tbody><tr><td data-signature-contact style="padding:0;vertical-align:top;text-align:left;font-size:0;line-height:0;">
${signatureContactHtml(d, { ctaFallback, phoneFallback })}
</td></tr></tbody></table>
</td></tr></tbody></table>
</td></tr></tbody></table>
</td></tr></tbody></table>`;
}

export function signatureText(details, { ctaFallback = 'Book a Meeting' } = {}) {
  const d = cleanDetails(details);
  const lines = [`${d.firstName} ${d.lastName}`.trim(), jobTitleText(d.jobTitle), 'VESSYL', BRAND.address, d.phone, BRAND.website];
  const href = ctaHref(d.ctaUrl);
  if (href) lines.push('', `${d.ctaLabel || ctaFallback}: ${href}`);
  return lines.join('\n');
}

export function signatureDocument(details, { lang = 'en-US', title = 'VESSYL email signature', ...options } = {}) {
  return `<!doctype html>\n<html lang="${escapeHtml(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head><body style="margin:0;padding:24px;background:#fff;">${signatureHtml(details, options)}</body></html>\n`;
}
