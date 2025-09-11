import { visit } from 'unist-util-visit';

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

export interface TocResult {
  toc: TocItem[];
  processedContent: string;
}

// Generate semantic ID from heading text
function createTocId(text: string, usedIds: Set<string>): string {
  let baseId = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  // Ensure the ID is unique
  let finalId = baseId;
  let counter = 1;
  while (usedIds.has(finalId)) {
    finalId = `${baseId}-${counter}`;
    counter++;
  }
  
  usedIds.add(finalId);
  return finalId;
}

// Build hierarchical TOC structure
function buildTocHierarchy(flatToc: Array<{ id: string; text: string; level: number }>): TocItem[] {
  const toc: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const item of flatToc) {
    const tocItem: TocItem = {
      id: item.id,
      text: item.text,
      level: item.level,
      children: []
    };

    // Find the appropriate parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(tocItem);
    } else {
      stack[stack.length - 1].children.push(tocItem);
    }

    stack.push(tocItem);
  }

  return toc;
}

// Generate TOC HTML with mix of ordered and unordered lists
function generateTocHtml(tocItems: TocItem[]): string {
  if (tocItems.length === 0) return '';

  let html = '<div class="table-of-contents"><h3>Table of Contents</h3><ol class="toc-main-list">';
  
  function renderTocItems(items: TocItem[], depth = 0): string {
    let itemsHtml = '';
    for (const item of items) {
      itemsHtml += `<li class="toc-item toc-level-${item.level}"><a href="#${item.id}">${item.text}</a>`;
      if (item.children.length > 0) {
        // Alternate between ordered and unordered lists based on depth
        const listType = depth % 2 === 0 ? 'ul' : 'ol';
        const listClass = depth % 2 === 0 ? 'toc-sub-unordered' : 'toc-sub-ordered';
        itemsHtml += `<${listType} class="${listClass}">` + renderTocItems(item.children, depth + 1) + `</${listType}>`;
      }
      itemsHtml += '</li>';
    }
    return itemsHtml;
  }

  html += renderTocItems(tocItems);
  html += '</ol></div>';
  
  return html;
}

// Remark plugin to process TOC
export function remarkToc() {
  return (tree: any, file: any) => {
    const usedIds = new Set<string>();
    const flatToc: Array<{ id: string; text: string; level: number }> = [];
    let tocPlaceholders: any[] = [];

    // First pass: collect all headings and find TOC placeholders
    visit(tree, (node) => {
      // Find TOC placeholders
      if (node.type === 'paragraph' && node.children) {
        const textContent = node.children
          .filter((child: any) => child.type === 'text')
          .map((child: any) => child.value)
          .join('');
        
        if (textContent.includes('{:toc}')) {
          tocPlaceholders.push(node);
        }
      }

      // Collect headings
      if (node.type === 'heading' && node.depth >= 1 && node.depth <= 6) {
        const headingText = node.children
          .filter((child: any) => child.type === 'text')
          .map((child: any) => child.value)
          .join('');

        if (headingText.trim()) {
          const id = createTocId(headingText, usedIds);
          
          // Add ID to heading
          node.data = node.data || {};
          node.data.hProperties = node.data.hProperties || {};
          node.data.hProperties.id = id;

          flatToc.push({
            id,
            text: headingText,
            level: node.depth
          });
        }
      }
    });

    // Build hierarchical TOC
    const hierarchicalToc = buildTocHierarchy(flatToc);

    // Store TOC data for later use
    file.data = file.data || {};
    file.data.toc = hierarchicalToc;

    // Replace TOC placeholders with actual TOC
    if (tocPlaceholders.length > 0 && hierarchicalToc.length > 0) {
      const tocHtml = generateTocHtml(hierarchicalToc);
      
      tocPlaceholders.forEach((placeholder) => {
        // Replace the placeholder with raw HTML
        placeholder.type = 'html';
        placeholder.value = tocHtml;
        placeholder.children = undefined;
      });
    }
  };
}

// Process content and extract TOC
export function processToc(content: string): TocResult {
  const usedIds = new Set<string>();
  const flatToc: Array<{ id: string; text: string; level: number }> = [];
  
  // Simple regex-based processing for headings
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let processedContent = content;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = createTocId(text, usedIds);
    
    flatToc.push({ id, text, level });
    
    // Add ID to heading in content
    const newHeading = `${match[1]} ${text} {#${id}}`;
    processedContent = processedContent.replace(match[0], newHeading);
  }

  // Build hierarchical TOC
  const toc = buildTocHierarchy(flatToc);

  // Replace {:toc} with actual TOC HTML
  const tocHtml = generateTocHtml(toc);
  processedContent = processedContent.replace(/\{:toc\}/g, tocHtml);

  return { toc, processedContent };
}