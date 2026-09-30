import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mergeSources, layeredFile } from '../src/utils/loaders/layeredFile.ts';

test('partial site overrides merge objects and replace arrays without changing source', () => {
  const shared = [{ id: 'author', title: 'Author', tags: ['founder'], social: { a: 'a', b: 'b' } }];
  const merged = mergeSources([shared, [{ id: 'author', tags: [], social: { a: 'updated' } }]]);
  assert.deepEqual(merged.get('author'), { id: 'author', title: 'Author', tags: [], social: { a: 'updated', b: 'b' } });
  assert.equal(shared[0].social.a, 'a');
  assert.throws(() => mergeSources([[{ id: 'a' }, { id: 'a' }]]), /Duplicate/);
  assert.throws(() => mergeSources([[{ title: 'missing' }]]), /needs an id/);
});

test('loader validates merged data and watches change, removal, and restoration', async () => {
  const root = await mkdtemp(join(tmpdir(), 'greastro-authors-'));
  try {
    const shared = join(root, 'shared.json'), local = join(root, 'local.json');
    await writeFile(shared, JSON.stringify([{ id: 'a', title: 'Shared' }, { id: 'b', title: 'Other' }]));
    await writeFile(local, JSON.stringify([{ id: 'a', description: 'Local' }]));
    const store = new Map(), listeners = {}, errors = [];
    await layeredFile(['shared.json', 'local.json']).load({
      config: { root: pathToFileURL(root + '/') },
      store: { clear: () => store.clear(), set: (entry) => store.set(entry.id, entry.data) },
      parseData: async ({ data }) => { assert.ok(data.title); return data; },
      watcher: { add: () => {}, on: (event, handler) => { listeners[event] = handler; } },
      logger: { error: (message) => errors.push(message) },
    });
    assert.equal(store.get('a').description, 'Local');
    await writeFile(local, JSON.stringify([{ id: 'a', title: 'Changed' }]));
    await listeners.change(local);
    assert.equal(store.get('a').title, 'Changed');
    await rm(local); await listeners.unlink(local);
    assert.equal(store.get('a').title, 'Shared');
    await writeFile(shared, JSON.stringify([{ id: 'a', title: 'Shared' }]));
    await listeners.change(shared);
    assert.equal(store.has('b'), false);
    await writeFile(local, JSON.stringify([{ id: 'a', description: 'Restored' }]));
    await listeners.add(local);
    assert.equal(store.get('a').description, 'Restored');
    assert.deepEqual(errors, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});
