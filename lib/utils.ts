import matter from 'gray-matter';
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { remarkToc } from './toc';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Updated function to clean LaTeX comments while preserving both types of code blocks
function cleanLatexComments(content: string): string {
  // First, let's create unique markers for code blocks
  const markers = {
    fenced: '___FENCED_CODE_BLOCK___',
    inline: '___INLINE_CODE___'
  };
  
  // Store code blocks
  const codeBlocks: string[] = [];
  const inlineBlocks: string[] = [];
  
  // Replace fenced code blocks with markers
  content = content.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return markers.fenced + (codeBlocks.length - 1);
  });
  
  // Replace inline code blocks with markers
  content = content.replace(/`[^`\n]+`/g, (match) => {
    inlineBlocks.push(match);
    return markers.inline + (inlineBlocks.length - 1);
  });
  
  // Restore inline code blocks
  content = content.replace(new RegExp(markers.inline + '(\\d+)', 'g'), (_, index) => {
    return inlineBlocks[parseInt(index)];
  });
  
  // Restore fenced code blocks
  content = content.replace(new RegExp(markers.fenced + '(\\d+)', 'g'), (_, index) => {
    return codeBlocks[parseInt(index)];
  });
  
  return content;
}

function remarkCodeBlocks() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      // Set up data structure if it doesn't exist
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      
      // Special handling for mermaid code blocks
      if (node.lang === 'mermaid') {
        // For mermaid, we need to transform this differently
        // Mark this node as a mermaid diagram for special handling in rehype
        node.data.mermaidDiagram = true;
        // Set the class to mermaid without the language- prefix
        node.data.hProperties.className = 'mermaid no-highlight';
      } else {
        // Standard handling for other code blocks
        node.data.hProperties.className = `language-${node.lang || 'text'}`;
      }
    });
  };
}

function remarkTrimBackticks() {
  return (tree: any) => {
    visit(tree, 'inlineCode', (node: any) => {
      // Convert the node to plain text if it starts and ends with backticks
      const value = node.value;
      if (value.startsWith('`') && value.endsWith('`') && value.startsWith('```') === false) {
        node.value = value.slice(1, -1);
      }

      // Add classes for styling
      node.data = node.data || {};
      node.data.hProperties = {
        className: 'inline-code-block'
      };
    });
  };
}

// Helper function to recursively extract all text content from AST nodes
function extractTextContent(node: any): string {
  if (!node) return '';

  if (node.type === 'text') {
    return node.value || '';
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map((child: any) => extractTextContent(child)).join('');
  }

  return '';
}

// Custom rehype plugin to convert mermaid code blocks to div elements
function rehypeMermaid() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      // Look for pre > code.mermaid structure
      if (
        node.tagName === 'pre' &&
        node.children &&
        node.children.length > 0 &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = node.children[0];
        const classes = codeNode.properties?.className || [];

        // Check if this is a mermaid code block
        if (classes.includes('mermaid') || classes.includes('language-mermaid')) {
          // Get the text content from the code block recursively
          const content = extractTextContent(codeNode);

          // Replace the pre element with a div.mermaid containing the raw text
          const mermaidDiv = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['mermaid', 'no-highlight']
            },
            children: [
              {
                type: 'text',
                value: content
              }
            ]
          };

          // Replace in parent
          if (parent && typeof index === 'number') {
            parent.children[index] = mermaidDiv;
          }
        }
      }
    });
  };
}

export async function processMarkdown(content: string) {
  const { data, content: markdownContent } = matter(content);
  
  // Clean up LaTeX comments while preserving code blocks
  const cleanedContent = cleanLatexComments(markdownContent);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkReplaceImageUrls)
    .use(remarkMath)
    .use(remarkToc)
    .use(remarkTrimBackticks)
    .use(remarkCodeBlocks)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeKatex, {
      strict: false,
      trust: true,
      macros: {
        "\\eqref": "\\href{#1}{}",
      },
      errorColor: ' #cc0000',
      throwOnError: false,
      displayMode: false,
    })
    .use(rehypeMermaid) // Convert mermaid code blocks to div elements
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(cleanedContent);

  return {
    frontMatter: data,
    content: processedContent.toString()
  };
}

// Interface for image nodes in the AST
interface ImageNode {
  type: 'image';
  url: string;
  title: string | null;
  alt: string | null;
}

// Plugin to replace image URLs
function remarkReplaceImageUrls() {
  return (tree: any) => {
    visit(tree, 'image', (node: ImageNode) => {
      const url = node.url;
      
      // Handle paths that start with ../public/assets/
      if (url.startsWith('../public/')) {
        // Remove ../public/assets/ prefix and convert to /assets/
        node.url = url.replace('../public/', '/');
      }
      
      // Handle paths that might already start with /assets/
      else if (url.startsWith('/')) {
        // Keep as is
        node.url = url;
      }
    });
  };
}