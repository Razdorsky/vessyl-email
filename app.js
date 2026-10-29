import { cleanDetails, signatureHtml, signatureText, signatureDocument, signatureImageUrl, signatureCtaHtml, ctaHref, validPhone } from './signature.js';
import { messages } from './locales.js';
import { setupDisclosureMotion, setupLanguageMenu, setupLanguageTextMotion } from './ui.js';

const form = document.querySelector('#signature-form');
const preview = document.querySelector('#signature-preview');
const status = document.querySelector('#copy-status');
const copyButton = document.querySelector('#copy-signature');
const copyLabel = copyButton.querySelector('span');
const phone = form.elements.phone;
const ctaUrl = form.elements.ctaUrl;
const ctaHint = document.querySelector('#cta-hint');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const localAssets = new URL('./assets/', window.location.href).href;
const normalizeLocale = value => /^es(?:-|$)/i.test(value || '') ? 'es-419' : 'en-US';
let locale = normalizeLocale(new URL(window.location.href).searchParams.get('lang'));
let statusTimer;
let isCopying = false;
let formRevision = 0;
let statusKey = 'status.incomplete';
let copyLabelKey = 'copy.action';
const settleDisclosures = setupDisclosureMotion(reducedMotion);
const animateLanguageText = setupLanguageTextMotion(reducedMotion);

function t(key) { return messages[locale][key] ?? messages['en-US'][key] ?? key; }
function signatureOptions() { return { ctaFallback: t('signature.ctaFallback'), lang: locale, title: t('download.title') }; }
function setCopyLabel(key) { copyLabelKey = key; copyLabel.textContent = t(key); }

function details() { return cleanDetails(Object.fromEntries(new FormData(form))); }
function isFormComplete() {
  const current = details();
  return Boolean(current.firstName && current.lastName && current.jobTitle && validPhone(current.phone)
    && (!current.ctaUrl || ctaHref(current.ctaUrl)));
}
function syncCopyButton() {
  copyButton.disabled = isCopying || !isFormComplete();
  copyButton.setAttribute('aria-busy', String(isCopying));
}
function setStatus(key, state = '') {
  clearTimeout(statusTimer);
  statusKey = key;
  status.textContent = t(key);
  status.dataset.state = state;
}
function render() {
  const current = details();
  // Update text in place so typing never restarts the logo animation.
  if (!preview.firstElementChild) {
    preview.innerHTML = signatureHtml(current, { assets: localAssets, animated: !reducedMotion.matches, ...signatureOptions() });
  }
  const paragraphs = preview.querySelectorAll('p');
  paragraphs[0].querySelector('font').textContent = `${current.firstName} ${current.lastName}`.trim() || t('preview.name');
  paragraphs[1].querySelector('font').textContent = current.jobTitle || t('preview.role');
  const phoneLink = paragraphs[3].querySelector('a');
  phoneLink.querySelector('font').textContent = current.phone || t('preview.phone');
  if (current.phone) {
    phoneLink.href = `tel:${current.phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '')}`;
  } else {
    phoneLink.removeAttribute('href');
  }
  preview.querySelector('[data-signature-cta]')?.remove();
  preview.querySelector('[data-signature-line-end]').insertAdjacentHTML('beforebegin', signatureCtaHtml(current, signatureOptions()));
}

function updateValidation() {
  const current = details();
  for (const key of ['firstName', 'lastName', 'jobTitle']) {
    form.elements[key].setCustomValidity(current[key] ? '' : t('error.required'));
  }
  phone.setCustomValidity(!current.phone ? t('error.required') : validPhone(current.phone) ? '' : t('error.phone'));
  const invalidCta = Boolean(current.ctaUrl && !ctaHref(current.ctaUrl));
  ctaUrl.setCustomValidity(invalidCta ? t('error.cta') : '');
  ctaUrl.setAttribute('aria-invalid', String(invalidCta));
  ctaHint.textContent = t(invalidCta ? 'error.cta' : 'hint.cta');
  return invalidCta;
}

function applyLanguage(next, updateUrl = true) {
  settleDisclosures();
  locale = normalizeLocale(next);
  document.documentElement.lang = locale;
  document.title = t('meta.title');
  document.querySelector('meta[name=description]').content = t('meta.description');
  for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = t(element.dataset.i18n);
  for (const element of document.querySelectorAll('[data-i18n-html]')) element.innerHTML = t(element.dataset.i18nHtml);
  for (const element of document.querySelectorAll('[data-i18n-placeholder]')) element.placeholder = t(element.dataset.i18nPlaceholder);
  for (const element of document.querySelectorAll('[data-i18n-aria-label]')) element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  const languageName = locale === 'es-419' ? 'Español' : 'English';
  document.querySelector('#language-current').textContent = locale === 'es-419' ? 'ES' : 'EN';
  document.querySelector('#language-trigger').setAttribute('aria-label', `${t('language.choose')}: ${languageName}`);
  document.querySelector('#language-menu').setAttribute('aria-label', t('language.label'));
  for (const option of document.querySelectorAll('[data-locale]')) option.setAttribute('aria-checked', String(option.dataset.locale === locale));
  updateValidation();
  render();
  setCopyLabel(copyLabelKey);
  status.textContent = t(statusKey);
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', locale);
    history.replaceState(null, '', url);
  }
}

form.addEventListener('input', () => {
  formRevision += 1;
  const invalidCta = updateValidation();
  render();
  setCopyLabel('copy.action');
  syncCopyButton();
  setStatus(invalidCta ? 'status.ctaInvalid' : isFormComplete() ? 'status.ready' : 'status.incomplete');
});

document.addEventListener('keydown', event => {
  const isQ = event.code === 'KeyQ' || event.key?.toLowerCase() === 'q';
  if (!event.ctrlKey || !event.shiftKey || event.altKey || event.metaKey || !isQ || event.repeat || event.isComposing) return;
  event.preventDefault();
  for (const field of form.querySelectorAll('input[placeholder]')) {
    field.value = field.placeholder.replace(/^(?:e\.g\.,?|p\.\s*ej\.,?)\s*/i, '').trim();
    field.setCustomValidity('');
  }
  form.dispatchEvent(new Event('input', { bubbles: true }));
});

function legacyCopy(html, plain) {
  const listener = event => {
    event.preventDefault();
    event.clipboardData.setData('text/html', html);
    event.clipboardData.setData('text/plain', plain);
  };
  document.addEventListener('copy', listener);
  let copied = false;
  try { copied = document.execCommand('copy'); }
  finally { document.removeEventListener('copy', listener); }
  if (!copied) throw new Error('Clipboard unavailable');
}

function validateDetails() {
  updateValidation();
  if (!form.reportValidity()) return null;
  return details();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (isCopying) return;
  const current = validateDetails();
  if (!current) return;
  const html = signatureHtml(current, signatureOptions());
  const plain = signatureText(current, signatureOptions());
  const copiedRevision = formRevision;
  isCopying = true;
  syncCopyButton();
  // Do not await anything before writing: Safari requires this user activation.
  let operation;
  try {
    if (window.ClipboardItem && navigator.clipboard?.write) {
      operation = navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plain], { type: 'text/plain' }),
      })]);
    } else {
      legacyCopy(html, plain);
      operation = Promise.resolve();
    }
  } catch (error) { operation = Promise.reject(error); }
  operation.then(() => {
    if (copiedRevision !== formRevision) return;
    setCopyLabel('copy.done');
    setStatus('status.success', 'success');
    statusTimer = setTimeout(() => { setCopyLabel('copy.action'); }, 5000);
  }).catch(() => {
    try {
      legacyCopy(html, plain);
      if (copiedRevision !== formRevision) return;
      setCopyLabel('copy.done');
      setStatus('status.success', 'success');
    } catch {
      setStatus('error.clipboard', 'error');
    }
  }).finally(() => {
    isCopying = false;
    syncCopyButton();
  });
});

document.querySelector('#download-html').addEventListener('click', () => {
  const current = validateDetails();
  if (!current) return;
  const url = URL.createObjectURL(new Blob([signatureDocument(current, signatureOptions())], { type: 'text/html;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  const slug = `${current.firstName}-${current.lastName}`.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '').slice(0, 90);
  a.download = `vessyl-signature-${slug || 'team'}.html`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

const tabs = [...document.querySelectorAll('[role=tab]')];
function selectClient(tab, focus = false) {
  for (const candidate of tabs) {
    const selected = candidate === tab;
    candidate.setAttribute('aria-selected', String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    document.getElementById(candidate.getAttribute('aria-controls')).hidden = !selected;
  }
  if (focus) tab.focus();
}
for (const tab of tabs) {
  tab.addEventListener('click', () => selectClient(tab));
  tab.addEventListener('keydown', event => {
    const index = tabs.indexOf(tab);
    const target = event.key === 'ArrowRight' ? tabs[(index + 1) % tabs.length]
      : event.key === 'ArrowLeft' ? tabs[(index + tabs.length - 1) % tabs.length]
      : event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : null;
    if (target) { event.preventDefault(); selectClient(target, true); }
  });
}
reducedMotion.addEventListener('change', () => {
  const image = preview.querySelector('img');
  image.src = signatureImageUrl(localAssets, !reducedMotion.matches);
});
setupLanguageMenu(next => animateLanguageText(() => applyLanguage(next)), reducedMotion);
window.addEventListener('popstate', () => applyLanguage(normalizeLocale(new URL(window.location.href).searchParams.get('lang')), false));
applyLanguage(locale, false);
syncCopyButton();
