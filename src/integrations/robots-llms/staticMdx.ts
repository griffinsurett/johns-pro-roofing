import { mdxToMdast, type MdastNode } from 'satteri';

/**
 * Source extraction cannot know the result of MDX JavaScript. Remove expression
 * blocks and whole sentences containing interpolation before extracting prose.
 * Reuse Astro's MDX parser: nested JSX, strings and code fences are not safely
 * distinguishable with a brace regex. Nothing here evaluates author code.
 *
 * This is a conservative source export, not a renderer: dynamically generated
 * prose is omitted even when its runtime condition would be true.
 */
export function staticMdx(source: string): string {
  const tree = mdxToMdast(source);
  const ranges: Array<[number, number]> = [];
  const children = (node: MdastNode): MdastNode[] =>
    'children' in node ? node.children as MdastNode[] : [];
  const isExpression = (node: MdastNode) =>
    node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression';
  const containsExpression = (node: MdastNode): boolean =>
    isExpression(node) || children(node).some(containsExpression);

  function walk(node: MdastNode) {
    const isSentence = ['paragraph', 'heading', 'tableCell'].includes(node.type)
      || ('name' in node && ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(String(node.name)));
    if (isExpression(node) || node.type === 'mdxjsEsm'
      || (isSentence && containsExpression(node))) {
      const start = node.position?.start.offset;
      const end = node.position?.end.offset;
      if (start === undefined || end === undefined) {
        throw new Error('MDX parser did not provide source positions for LLMs extraction');
      }
      ranges.push([start, end]);
      return;
    }
    children(node).forEach(walk);
  }
  walk(tree);
  // Satteri positions are UTF-16 offsets, matching JavaScript string slicing.
  for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) {
    source = source.slice(0, start) + '\n' + source.slice(end);
  }
  return source;
}
