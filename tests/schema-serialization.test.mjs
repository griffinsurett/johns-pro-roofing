import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeJsonLd } from '../src/utils/schema/serialize.ts';

test('JSON-LD cannot close its script element and preserves original content', () => {
  const value = {
    '@context': 'https://schema.org',
    '@graph': [{ '@type': 'Question', name: '</ScRiPt><script>alert(1)</script><!--' }],
    text: 'café & "quoted"\n\u2028\u2029',
    literalEscape: '\\u2028',
    nested: { empty: null, zero: 0, flag: false },
  };
  const encoded = serializeJsonLd(value);
  assert.equal(encoded.includes('<'), false);
  assert.equal(/[\u2028\u2029]/u.test(encoded), false);
  assert.deepEqual(JSON.parse(encoded), value);
});
