/**
 * tests/e2e/helpers/dom-parser.ts
 * Lightweight, zero-dependency HTML/DOM query utility for Bun E2E tests.
 */

export class ParsedNode {
  tag: string;
  attributes: Record<string, string> = {};
  children: ParsedNode[] = [];
  text: string = "";
  parent: ParsedNode | null = null;

  constructor(tag: string, attributes: Record<string, string> = {}, parent: ParsedNode | null = null) {
    this.tag = tag;
    this.attributes = attributes;
    this.parent = parent;
  }

  get textContent(): string {
    return (this.text + " " + this.children.map(c => c.textContent).join(" "))
      .trim()
      .replace(/\s+/g, " ");
  }

  getAttribute(name: string): string | null {
    return this.attributes[name.toLowerCase()] ?? null;
  }

  hasClass(cls: string): boolean {
    const classAttr = this.getAttribute("class");
    if (!classAttr) return false;
    return classAttr.split(/\s+/).includes(cls);
  }

  hasAttribute(name: string): boolean {
    return this.getAttribute(name) !== null;
  }

  findByTestId(testId: string): ParsedNode | null {
    if (this.getAttribute("data-testid") === testId) return this;
    for (const child of this.children) {
      const found = child.findByTestId(testId);
      if (found) return found;
    }
    return null;
  }

  findAllByTestId(testId: string): ParsedNode[] {
    const results: ParsedNode[] = [];
    if (this.getAttribute("data-testid") === testId) results.push(this);
    for (const child of this.children) {
      results.push(...child.findAllByTestId(testId));
    }
    return results;
  }

  findByText(query: string | RegExp): ParsedNode | null {
    const match = typeof query === "string" 
      ? this.textContent.includes(query) 
      : query.test(this.textContent);
    if (match) return this;
    for (const child of this.children) {
      const found = child.findByText(query);
      if (found) return found;
    }
    return null;
  }

  findAllByText(query: string | RegExp): ParsedNode[] {
    const results: ParsedNode[] = [];
    const match = typeof query === "string" 
      ? this.textContent.includes(query) 
      : query.test(this.textContent);
    if (match) results.push(this);
    for (const child of this.children) {
      results.push(...child.findAllByText(query));
    }
    return results;
  }

  findAllByTag(tag: string): ParsedNode[] {
    const results: ParsedNode[] = [];
    if (this.tag.toLowerCase() === tag.toLowerCase()) results.push(this);
    for (const child of this.children) {
      results.push(...child.findAllByTag(tag));
    }
    return results;
  }

  findAllByClass(className: string): ParsedNode[] {
    const results: ParsedNode[] = [];
    if (this.hasClass(className)) results.push(this);
    for (const child of this.children) {
      results.push(...child.findAllByClass(className));
    }
    return results;
  }

  findByRole(role: string): ParsedNode | null {
    if (this.getAttribute("role") === role) return this;
    for (const child of this.children) {
      const found = child.findByRole(role);
      if (found) return found;
    }
    return null;
  }
}

/**
 * Parses raw HTML string into a traversable ParsedNode tree.
 */
export function parseHtml(html: string): ParsedNode {
  const root = new ParsedNode("root");
  let current = root;
  const tagRegex = /<(\/)?([a-zA-Z0-9\-]+)([^>]*)>|([^<]+)/g;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    const [, isClosing, tagName, rawAttrs, textContent] = match;

    if (textContent) {
      const cleanText = textContent.trim();
      if (cleanText) {
        const textNode = new ParsedNode("#text", {}, current);
        textNode.text = cleanText;
        current.children.push(textNode);
      }
    } else if (isClosing) {
      if (current.parent) {
        current = current.parent;
      }
    } else if (tagName) {
      const attrs: Record<string, string> = {};
      const attrRegex = /([a-zA-Z0-9\-:@]+)(?:=(?:["']([^"']*)["']|([^\s>]+)))?/g;
      let attrMatch: RegExpExecArray | null;

      while ((attrMatch = attrRegex.exec(rawAttrs || "")) !== null) {
        const key = attrMatch[1].toLowerCase();
        const val = attrMatch[2] !== undefined 
          ? attrMatch[2] 
          : (attrMatch[3] !== undefined ? attrMatch[3] : "true");
        attrs[key] = val;
      }

      const isSelfClosing = (rawAttrs && rawAttrs.endsWith("/")) || 
        ["img", "input", "br", "hr", "meta", "link"].includes(tagName.toLowerCase());

      const newNode = new ParsedNode(tagName, attrs, current);
      current.children.push(newNode);

      if (!isSelfClosing) {
        current = newNode;
      }
    }
  }

  return root;
}
