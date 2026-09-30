import test from 'node:test';
import assert from 'node:assert/strict';
import { collectSection, collectedSections } from '../src/utils/schema/collector.ts';
import { answerHtml } from '../src/utils/schema/answerHtml.ts';
import { parsePrice, ratingValue } from '../src/utils/schema/numbers.ts';

test('section aggregation retains later items, deduplicates and isolates pages', () => {
  const a = {}, b = {};
  const build = (items) => ({ items });
  collectSection(a, 'faq', [{ _identity: 'one', answer: 'one' }], build);
  collectSection(a, 'faq', [{ _identity: 'one', answer: 'one' }, { _identity: 'two', answer: 'two' }], build);
  assert.equal(collectedSections(a)[0].items.length, 2);
  assert.deepEqual(collectedSections(b), []);
  assert.throws(() => collectSection(a, 'faq', [{ _identity: 'one', answer: 'different' }], build), /Conflicting/);
});

test('rendered answers retain prose, formatting and links but exclude component UI', () => {
  const html = '<header>Navigation</header><p>Answer &amp; <strong>details</strong>.</p><script>alert(1)</script><ul><li><a href="/help" onclick="bad()">Help</a></li></ul>';
  assert.equal(answerHtml(html), '<p>Answer &amp; <strong>details</strong>.</p><ul><li><a href="/help">Help</a></li></ul>');
});

test('prices and ratings do not manufacture numeric values from unrelated text', () => {
  for (const value of ['', null, false, '-10', '$10–$20', 'From $99', 'Free', '1,2', Infinity]) assert.equal(parsePrice(value), undefined);
  assert.equal(parsePrice(0), '0.00');
  assert.equal(parsePrice('$1,234.50'), '1234.50');
  assert.equal(parsePrice('19.99'), '19.99');
  assert.equal(parsePrice('£19.99', 'USD'), undefined);
  assert.equal(parsePrice('£19.99', 'GBP'), '19.99');
  for (const value of [null, false, 0, 6, Infinity, 'excellent']) assert.equal(ratingValue(value), undefined);
  assert.equal(ratingValue(4.5), 4.5);
});
