import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { messages } from '../locales.js';
import { signatureHtml, signatureText, signatureDocument, DEFAULT_DETAILS, BRAND } from '../signature.js';

test('Spanish covers every English UI key and preserves guide markup', () => {
  const source = messages['en-US'];
  const target = messages['es-419'];
  assert.deepEqual(Object.keys(target).sort(), Object.keys(source).sort());
  for (const [key, value] of Object.entries(target)) {
    assert.ok(value.trim(), key);
    assert.equal(value, value.normalize('NFC'), key);
    assert.deepEqual(value.match(/<\/?[^>]+>/g), source[key].match(/<\/?[^>]+>/g), key);
  }
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const [, key] of html.matchAll(/data-i18n(?:-html|-placeholder|-aria-label)?="([^"]+)"/g)) {
    assert.ok(Object.hasOwn(source, key), `Unknown UI key: ${key}`);
  }
});

test('Spanish exports localize the CTA fallback while retaining personal and brand details', () => {
  const data = { ...DEFAULT_DETAILS, ctaUrl: 'https://www.instagram.com/thevessyl' };
  const options = { ctaFallback: messages['es-419']['signature.ctaFallback'], lang: 'es-419', title: messages['es-419']['download.title'] };
  for (const output of [signatureHtml(data, options), signatureText(data, options), signatureDocument(data, options)]) {
    for (const part of [data.firstName, data.lastName, data.jobTitle, BRAND.address, options.ctaFallback]) assert.ok(output.includes(part), part);
    assert.doesNotMatch(output, /Book a Meeting/);
  }
  assert.match(signatureDocument(data, options), /<html lang="es-419">/);
  assert.doesNotMatch(signatureHtml(data, options), /margin(?:-top)?:\s*-/);
});
