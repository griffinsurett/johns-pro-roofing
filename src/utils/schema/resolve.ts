// src/utils/schema/resolve.ts
/**
 * The resolver — turns a kind + content into a JSON-LD node, applying the
 * override layers in order (later wins):
 *
 *   1. the kind's field map          src/utils/schema/kinds/
 *   2. the site's map                src/content/schemaMap.ts
 *   3. the component's `map`/`extra` <Schema kind="…" map={…} extra={…} />
 *   4. the entry's own `schema:`     frontmatter of one content entry
 *
 * and enforcing the rules no override can bend: required fields (incomplete
 * nodes are dropped with a build warning), honest ratings (`protectedFields`
 * can't be given fixed values), one FAQPage / one review set per target per
 * page, and linking by @id.
 */
import { siteData } from "@/content/siteData";
import { schemaMap } from "@/content/schemaMap";
import { kinds, type KindName } from "./kinds";
import { transforms } from "./transforms";
import type { FieldMap, FieldSpec, SchemaContext } from "./types";

export interface ResolveOptions {
  kind: KindName;
  /** Item kinds: the entry the node is about. */
  entry?: { id?: string; data?: Record<string, any>; body?: string } | Record<string, any>;
  /** List kinds: the items the section shows (prepared items or entries). */
  items?: Array<Record<string, any>>;
  /** Layer 3: property overrides for this use. */
  map?: FieldMap;
  /** Layer 3: extra properties merged into the finished node. */
  extra?: Record<string, any>;
  /** Page pathname (Astro.url.pathname). */
  pathname: string;
  /** Astro.locals. */
  locals: Record<string, any>;
}

const present = (v: unknown) =>
  v !== undefined && v !== null && !(typeof v === "string" && v.trim() === "") &&
  !(Array.isArray(v) && v.length === 0);

/** Entry → plain data: collection entries keep fields under `data`, body aside. */
function dataOf(entry: any): Record<string, any> {
  if (!entry) return {};
  if (entry.data && typeof entry.data === "object") {
    return {
      ...(entry.id && { id: entry.id }),
      ...entry.data,
      ...(entry.body && !entry.data.content && { content: entry.body }),
    };
  }
  return entry;
}

const read = (data: Record<string, any>, path: string) =>
  path.split(".").reduce<any>((o, k) => (o == null ? undefined : o[k]), data);

async function resolveField(spec: FieldSpec, ctx: SchemaContext): Promise<unknown> {
  if (spec === false) return undefined;
  const s = typeof spec === "string" || Array.isArray(spec) ? { from: spec } : spec;
  if ("value" in s) return s.value;
  if (s.resolve) return s.resolve(ctx);
  const from = s.from === undefined ? [] : Array.isArray(s.from) ? s.from : [s.from];
  let values = from.map((f) => read(ctx.data, f));
  if (!values.some(present) && s.default !== undefined) values = [s.default];
  if (s.as) {
    const transform = transforms[s.as];
    if (!transform) {
      console.warn(`[schema] Unknown transform "${s.as}"`);
      return undefined;
    }
    return transform(values, ctx);
  }
  return values.find(present);
}

async function mapFields(fields: FieldMap, ctx: SchemaContext) {
  const out: Record<string, any> = {};
  for (const [prop, spec] of Object.entries(fields)) {
    const value = await resolveField(spec, ctx);
    if (present(value)) out[prop] = value;
  }
  return out;
}

/** Layers 1–3 merged; protected fields keep content-only sources. */
function mergeMaps(kindName: KindName, componentMap?: FieldMap): FieldMap {
  const kind = kinds[kindName];
  const merged: FieldMap = { ...kind.fields, ...(schemaMap[kindName] ?? {}), ...(componentMap ?? {}) };
  for (const field of (kind as any).protectedFields ?? []) {
    const spec = merged[field];
    if (spec && typeof spec === "object" && !Array.isArray(spec) &&
        ("value" in spec || "default" in spec || spec.resolve)) {
      console.warn(`[schema] "${kindName}.${field}" can only be read from content; override ignored.`);
      merged[field] = kind.fields[field];
    }
  }
  return merged;
}

/** Layer 4: an entry's own `schema:` frontmatter, protected fields excepted. */
function entryOverrides(kindName: KindName, data: Record<string, any>) {
  const overrides = { ...(data.schema ?? {}) };
  for (const field of (kinds[kindName] as any).protectedFields ?? []) delete overrides[field];
  return overrides;
}

export async function resolveSchema(options: ResolveOptions): Promise<Record<string, any> | null> {
  const { kind: kindName, entry, items, map, extra, pathname, locals } = options;
  const kind = kinds[kindName];
  if (!kind) {
    console.warn(`[schema] Unknown kind "${kindName}"`);
    return null;
  }
  const url = `${siteData.url}${pathname.replace(/\/$/, "")}`;
  const fields = mergeMaps(kindName, map);

  if (kind.mode === "list") {
    const baseCtx = { url, locals };
    // Claim the dedupe key synchronously, before any await, so two sections
    // rendering in parallel can't both emit.
    const key = kind.dedupeKey ? `schema:${kind.dedupeKey(baseCtx)}` : undefined;
    if (key && locals[key]) return null;
    if (key) locals[key] = true;

    const mapped = await Promise.all(
      (items ?? []).map(async (item) => {
        const data = dataOf(item);
        return { ...(await mapFields(fields, { data, url, locals })), ...entryOverrides(kindName, data) };
      }),
    );
    const node = kind.build(mapped, baseCtx);
    if (!node) {
      if (key) locals[key] = false;
      return null;
    }
    return { "@context": "https://schema.org", ...node, ...(extra ?? {}) };
  }

  const data = dataOf(entry);
  const ctx: SchemaContext = { data, url, locals };
  let node: Record<string, any> = {
    "@type": kind.type,
    "@id": `${url}#${kindName}`,
    ...(await mapFields(fields, ctx)),
  };
  if (kind.finalize) node = kind.finalize(node, ctx);
  node = { ...node, ...(extra ?? {}), ...entryOverrides(kindName, data) };

  const missing = (kind.required ?? []).filter((p) => !present(node[p]));
  if (missing.length > 0) {
    console.warn(`[schema] ${kind.type} on ${pathname} is missing ${missing.join(", ")} — not emitted.`);
    return null;
  }
  return { "@context": "https://schema.org", ...node };
}

/**
 * Apply the site map's entry for a node that isn't built from a kind — the
 * business (`schemaMap.business`). Same field specs as kinds; e.g. a multi-site
 * brand adding `brand` / `alternateName` to the shared business entity.
 */
export async function applySiteMap(
  key: string,
  node: Record<string, any>,
  context: { pathname: string; locals: Record<string, any> },
): Promise<Record<string, any>> {
  const fields = schemaMap[key];
  if (!fields) return node;
  const url = `${siteData.url}${context.pathname.replace(/\/$/, "")}`;
  const additions: Record<string, any> = {};
  const removals: string[] = [];
  for (const [prop, spec] of Object.entries(fields)) {
    if (spec === false) {
      removals.push(prop);
      continue;
    }
    const value = await resolveField(spec, { data: node, url, locals: context.locals });
    if (present(value)) additions[prop] = value;
  }
  const out = { ...node, ...additions };
  for (const prop of removals) delete out[prop];
  return out;
}

/**
 * Resolve an item kind as the page's SUBJECT — call from a layout's
 * frontmatter (it runs before the page's sections render). Review sections on
 * the page then attach to it instead of the business.
 */
export async function resolveSubject(
  astro: { url: URL; locals: Record<string, any> },
  options: Omit<ResolveOptions, "pathname" | "locals">,
): Promise<Record<string, any> | null> {
  const node = await resolveSchema({
    ...options,
    pathname: astro.url.pathname,
    locals: astro.locals,
  });
  if (node) {
    astro.locals.schemaSubject = {
      "@id": node["@id"],
      "@type": node["@type"],
      ...(node.name && { name: node.name }),
      ...(node.url && { url: node.url }),
    };
  }
  return node;
}
