import { cleanDetails, signatureHtml, signatureText, signatureDocument, signatureImageUrl, signatureCtaHtml, ctaHref, validPhone } from './signature.js';

const form = document.querySelector('#signature-form');
const preview = document.querySelector('#signature-preview');
const status = document.querySelector('#copy-status');
const copyButton = document.querySelector('#copy-signature');
const copyLabel = copyButton.querySelector('span');
const phone = form.elements.phone;
const ctaUrl = form.elements.ctaUrl;
const ctaHint = document.querySelector('#cta-hint');
const ctaDefaultHint = ctaHint.textContent;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const localAssets = new URL('./assets/', window.location.href).href;
let statusTimer;
let isCopying = false;
let formRevision = 0;

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
function setStatus(message, state = '') {
  clearTimeout(statusTimer);
  status.textContent = message;
  status.dataset.state = state;
}
function render() {
  const current = details();
  // Update text in place so typing never restarts the logo animation.
  if (!preview.firstElementChild) {
    preview.innerHTML = signatureHtml(current, { assets: localAssets, animated: !reducedMotion.matches });
  }
  const paragraphs = preview.querySelectorAll('p');
  paragraphs[0].querySelector('font').textContent = `${current.firstName} ${current.lastName}`.trim() || 'Your name';
  paragraphs[1].querySelector('font').textContent = current.jobTitle || 'Your job title';
  const phoneLink = paragraphs[3].querySelector('a');
  phoneLink.querySelector('font').textContent = current.phone || 'Your phone number';
  if (current.phone) {
    phoneLink.href = `tel:${current.phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '')}`;
  } else {
    phoneLink.removeAttribute('href');
  }
  preview.querySelector('[data-signature-cta]')?.remove();
  preview.querySelector('[data-signature-contact]').insertAdjacentHTML('beforeend', signatureCtaHtml(current));
}

form.addEventListener('input', () => {
  formRevision += 1;
  phone.setCustomValidity('');
  const invalidCta = Boolean(details().ctaUrl && !ctaHref(details().ctaUrl));
  ctaUrl.setCustomValidity(invalidCta ? 'Enter a valid link starting with https:// or http://, or leave this field blank.' : '');
  ctaUrl.setAttribute('aria-invalid', String(invalidCta));
  ctaHint.textContent = invalidCta ? 'Enter a valid link starting with https:// or http://, or leave this field blank.' : ctaDefaultHint;
  render();
  copyLabel.textContent = 'Copy signature';
  syncCopyButton();
  setStatus(invalidCta ? 'Please correct the CTA link or leave it blank' : isFormComplete() ? 'Ready to copy your signature' : 'Please complete all fields');
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
  if (!form.reportValidity()) return null;
  const current = details();
  for (const key of ['firstName', 'lastName', 'jobTitle']) {
    if (!current[key]) {
      form.elements[key].setCustomValidity('Please fill out this field.');
      form.elements[key].reportValidity();
      form.elements[key].addEventListener('input', () => form.elements[key].setCustomValidity(''), { once: true });
      return null;
    }
  }
  if (!validPhone(current.phone)) {
    phone.setCustomValidity('Enter a phone number with at least 5 digits. You can include a plus sign, spaces, parentheses and hyphens.');
    phone.reportValidity();
    return null;
  }
  return current;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (isCopying) return;
  const current = validateDetails();
  if (!current) return;
  const html = signatureHtml(current);
  const plain = signatureText(current);
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
    copyLabel.textContent = 'Signature copied';
    setStatus('✅ Copied. Paste it into your email signature settings.', 'success');
    statusTimer = setTimeout(() => { copyLabel.textContent = 'Copy signature'; }, 5000);
  }).catch(() => {
    try {
      legacyCopy(html, plain);
      if (copiedRevision !== formRevision) return;
      copyLabel.textContent = 'Signature copied';
      setStatus('✅ Copied. Paste it into your email signature settings.', 'success');
    } catch {
      setStatus('Clipboard access is unavailable. Download the HTML file, open it, and copy your signature.', 'error');
    }
  }).finally(() => {
    isCopying = false;
    syncCopyButton();
  });
});

document.querySelector('#download-html').addEventListener('click', () => {
  const current = validateDetails();
  if (!current) return;
  const url = URL.createObjectURL(new Blob([signatureDocument(current)], { type: 'text/html;charset=utf-8' }));
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
render();
syncCopyButton();
