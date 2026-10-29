import test from 'node:test';
import assert from 'node:assert/strict';
import { signatureHtml, signatureText, signatureDocument, cleanDetails, validPhone, ctaHref, DEFAULT_DETAILS, BRAND } from '../signature.js';

test('copied signature is small HTML with public GIF and working business links', () => {
  const html = signatureHtml(DEFAULT_DETAILS);
  assert.ok(html.length < 9000);
  assert.match(html, /<table role="presentation"/);
  assert.match(html, /bgcolor="#311500"/);
  assert.match(html, /src="https:\/\/razdorsky.github.io\/vessyl-email\/assets\/vessyl-signature.gif\?v=reveal-20261030"/);
  assert.match(html, /href="tel:\+50662233344"/);
  assert.match(html, /href="https:\/\/thevessyl.com\/"/);
  assert.match(html, /alt="VESSYL"/);
  assert.doesNotMatch(html, /AKEN|localhost|127\.0\.0\.1|data:|blob:|<script|<style/i);
});
test('user-controlled fields cannot inject markup, remote assets or URI schemes', () => {
  const html = signatureHtml({ firstName: '<img src=x onerror=alert(1)>', lastName: 'A & B', jobTitle: '\"><script>alert(1)</script>', phone: 'javascript:alert(1)' });
  assert.doesNotMatch(html, /<script|onerror="|href="javascript:|<img src=x/);
  assert.match(html, /&lt;img/);
  assert.match(html, /A &amp; B/);
  assert.equal((html.match(/<img /g) || []).length, 1);
});
test('international names and realistic formatted telephone numbers survive', () => {
  const data = { firstName: '  José  ', lastName: 'O’Connor', jobTitle: 'Guest Experience & Wellness', phone: '+1 (786) 785-4002' };
  assert.equal(cleanDetails(data).firstName, 'José');
  assert.ok(validPhone(data.phone));
  assert.match(signatureHtml(data), /href="tel:\+17867854002"/);
  assert.match(signatureHtml(data), /Guest Experience &amp; Wellness/);
  assert.match(signatureText(data), /José O’Connor/);
  for (const invalid of ['abcd', '123', '+1<svg>', 'javascript:123456']) assert.equal(validPhone(invalid), false);
});
test('plain text fallback retains every business detail without HTML', () => {
  const plain = signatureText(DEFAULT_DETAILS);
  for (const part of ['Martijn Glorieux', 'Co-CEO', 'VESSYL', '+506 6223 3344', BRAND.address, BRAND.website]) assert.ok(plain.includes(part));
  assert.doesNotMatch(plain, /<\/?[a-z]/i);
});
test('downloaded HTML keeps absolute public image URLs; preview alone may use a local asset', () => {
  assert.match(signatureDocument(DEFAULT_DETAILS), /^<!doctype html>/);
  assert.match(signatureDocument(DEFAULT_DETAILS), /https:\/\/razdorsky.github.io\/vessyl-email\/assets\/vessyl-signature.gif/);
  assert.match(signatureHtml(DEFAULT_DETAILS, { assets: 'http://127.0.0.1:4178/assets/', animated: false }), /vessyl-signature-static.png/);
});
test('CTA stays optional, uses a fallback label, and is retained in every export', () => {
  assert.doesNotMatch(signatureHtml({ ...DEFAULT_DETAILS, ctaLabel: 'Schedule time with me' }), /data-signature-cta/);
  const details = { ...DEFAULT_DETAILS, ctaUrl: 'https://cal.com/example?event=meet&team=vessyl' };
  for (const html of [signatureHtml(details), signatureDocument(details)]) {
    assert.match(html, /data-signature-cta/);
    assert.match(html, /href="https:\/\/cal.com\/example\?event=meet&amp;team=vessyl"/);
    assert.match(html, /Book a Meeting/);
  }
  assert.match(signatureText(details), /Book a Meeting: https:\/\/cal.com\/example\?event=meet&team=vessyl/);
  const custom = { ...details, ctaLabel: 'Schedule <time> & meet' };
  assert.match(signatureHtml(custom), /Schedule &lt;time&gt; &amp; meet/);
  assert.match(signatureText(custom), /Schedule <time> & meet/);
});
test('CTA cannot turn clipboard HTML into a script, relative link or credential-bearing link', () => {
  for (const ctaUrl of ['javascript:alert(1)', 'data:text/html,test', '/relative', '//example.com', 'not a link', 'https://user:password@example.com']) {
    assert.equal(ctaHref(ctaUrl), '');
    const details = { ...DEFAULT_DETAILS, ctaUrl, ctaLabel: '<img src=x onerror=alert(1)>' };
    assert.doesNotMatch(signatureHtml(details), /data-signature-cta|<img src=x/);
    assert.doesNotMatch(signatureText(details), /alert|password/);
  }
});
