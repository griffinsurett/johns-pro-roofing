import test from 'node:test';
import assert from 'node:assert/strict';
import { staticMdx } from '../src/integrations/robots-llms/staticMdx.ts';

test('conditional JSX cannot publish unrendered business claims', () => {
  const result = staticMdx(`import { businessData } from './siteData';

<p>Reliable roofing services for local businesses.</p>

{businessData.warranty && <p>Work is backed by {businessData.warranty}.</p>}

{businessData.insurance && <p>We are {businessData.insurance} in NJ.</p>}`);
  assert.match(result, /Reliable roofing services/);
  assert.doesNotMatch(result, /businessData|Work is backed|We are/);
});

test('omit the whole unresolved sentence, including nested inline JSX', () => {
  const result = staticMdx(`<section>
<p>Insured for <strong>{amount}</strong> with our provider.</p>
<p>This complete static sentence remains intact.</p>
</section>

Our license is **{number}**.

Another complete sentence.`);
  assert.doesNotMatch(result, /Insured|provider|license|number/);
  assert.match(result, /complete static sentence remains/);
  assert.match(result, /Another complete sentence/);
});

test('nested braces, template literals and Unicode preserve source boundaries', () => {
  const result = staticMdx('Café 😀 remains.\r\n\r\n{enabled && <p>{`${value} }`} Hidden claim</p>}\r\n\r\nRésumé remains.');
  assert.equal(result.trim(), 'Café 😀 remains.\r\n\r\n\n\r\n\r\nRésumé remains.');
});

test('literal code examples and escaped braces are not JavaScript expressions', () => {
  const source = 'Example: `{license}`.\n\n```jsx\n{false && <p>Example only</p>}\n```\n\nLiteral \\{braces\\}.';
  assert.equal(staticMdx(source), source);
});

test('module declarations cannot export unused prose and JavaScript is never executed', () => {
  globalThis.__llmsExecuted = false;
  const result = staticMdx('export const unused = "Not page prose";\n\n{(globalThis.__llmsExecuted = true)}\n\nVisible prose.');
  assert.equal(globalThis.__llmsExecuted, false);
  assert.equal(result.trim(), 'Visible prose.');
  delete globalThis.__llmsExecuted;
});
