import { styleRule, walkDepth } from './ast';
import { applyVariant } from './compile';
import type { DesignSystem } from './design-system';

interface SelectorOptions {
  modifier?: string | null;
  value?: string | null;
}

export interface VariantEntry {
  name: string;
  isArbitrary: boolean;
  values: string[];
  hasDash: boolean;
  selectors: (options: SelectorOptions) => string[];
}

interface Node {
  kind: 'rule' | 'at-rule' | 'declaration' | 'other-kinds';
  selector?: string | null;
  name?: string;
  params?: string;
  nodes?: Node[] | null;
}

interface Variant {
  kind: 'static' | 'functional' | 'compound' | 'arbitrary';
}

function generateVariantName(root: string, value?: string, modifier?: string): string {
  let name = root;
  if (value) name += `-${value}`;
  if (modifier) name += `/${modifier}`;
  return name;
}

function parseAndApplyVariant(name: string, design: DesignSystem): ReturnType<typeof styleRule> | null {
  const variant = design.parseVariant(name);
  if (!variant) return null;

  const node = styleRule('.__placeholder__', []);
  if (applyVariant(node, variant, design.variants) === null) {
    return null;
  }

  return node;
}

function processNodePath(path: Node[]): string[] {
  return path.flatMap((node) => {
    if (node.kind === 'rule') {
      return node.selector && node.selector !== '&' ? [node.selector] : [];
    }
    if (node.kind === 'at-rule') {
      return node.name && node.params ? [`${node.name} ${node.params}`] : [];
    }
    return [];
  });
}

function buildSelector(group: string[]): string {
  return group.reduceRight((selector, current) => {
    return selector === '' ? current : `${current} { ${selector} }`;
  }, '');
}

export function getVariants(design: DesignSystem): VariantEntry[] {
  const list: VariantEntry[] = [];

  for (let [root, variant] of (design.variants.entries() as [string, Variant][] || [])) {
    if (!variant || variant.kind === 'arbitrary') continue;

    const values = design.variants.getCompletions(root) || [];
    if (!values.length) continue;

    function selectors({ value, modifier }: SelectorOptions = {}): string[] {
      const name = generateVariantName(root, value, modifier);
      const node = parseAndApplyVariant(name, design);
      if (!node) return [];

      const selectors: string[] = [];
      walkDepth(node.nodes as Node[], (node, { path }) => {
        if (node.kind !== 'rule' && node.kind !== 'at-rule') return;
        if (node.nodes && node.nodes.length > 0) return;

        const group = processNodePath(path as Node[]);
        selectors.push(buildSelector(group));
      });

      return selectors;
    }

    switch (variant.kind) {
      case 'static':
      case 'functional':
      case 'compound':
        list.push({
          name: root,
          values,
          isArbitrary: variant.kind !== 'static',
          hasDash: true,
          selectors,
        });
        break;
      default:
        console.warn(`Unknown variant kind: ${variant.kind}`);
        continue;
    }
  }

  return list;
}
