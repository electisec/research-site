import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { getCategoryConfig } from './category-utils';

export interface ContentData {
  slug: string;
  title: string;
  contentHtml: string;
  category?: string;
  parent?: string;
  description?: string;
  nav_order?: number;
  [key: string]: any;
}

export interface SearchIndexItem {
  id: string;
  type: 'page' | 'section';
  title: string;
  slug?: string;
  pageTitle?: string;
  path: string;
  category: string;
  parent?: string;
  content: string;
  description?: string;
  searchText: string;
  level?: number;
  sectionId?: string;
  highlightedContent?: string;
}

export interface TOCItem {
  level: number;
  id: string;
  title: string;
  href: string;
}

export function getCategoryContentSlugs(category: string): string[] {
  try {
    const config = getCategoryConfig(category);
    if (!config || !config.contentPath) {
      return [];
    }

    const contentDirectory = path.join(process.cwd(), config.contentPath);
    if (!fs.existsSync(contentDirectory)) {
      console.warn(`Content directory not found for ${category}: ${contentDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames
      .filter((name) => name.endsWith('.md'))
      .map((fileName) => {
        return fileName.replace(/\.md$/, '').toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      });
  } catch (error) {
    console.warn(`Error reading content directory for ${category}:`, error);
    return [];
  }
}

export async function getCategoryContentData(category: string, slug: string): Promise<ContentData | null> {
  try {
    const config = getCategoryConfig(category);
    if (!config || !config.contentPath) {
      return null;
    }

    const fileName = `${slug}.md`;
    const fullPath = path.join(process.cwd(), config.contentPath, fileName);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Content file not found for ${category}/${slug}`);
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    // Enhanced markdown processing with better options
    const processedContent = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown
      .use(html, { 
        sanitize: false, // Allow HTML in markdown
        allowDangerousHtml: true // Allow dangerous HTML for full compatibility
      })
      .process(matterResult.content);
    
    let contentHtml = processedContent.toString();
    
    // Post-process HTML for better styling and functionality
    contentHtml = enhanceMarkdownHtml(contentHtml);

    return {
      slug,
      contentHtml,
      category,
      title: matterResult.data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      ...matterResult.data,
    };
  } catch (error) {
    console.error(`Error loading content for ${category}/${slug}:`, error);
    return null;
  }
}

// Enhanced HTML post-processing for better styling and Jekyll-style TOC
function enhanceMarkdownHtml(html: string): string {
  // Process Jekyll-style table of contents
  html = processJekyllTOC(html);
  
  // Remove Jekyll directives and liquid tags
  html = html
    // Remove Jekyll attribute directives
    .replace(/\{:\s*\.[\w\s\-\.]*\s*\}/g, '')
    
    // Remove Jekyll liquid tags
    .replace(/\{%[\s\S]*?%\}/g, '')
    
    // Remove Jekyll variable references that didn't get processed
    .replace(/\{\{[\s\S]*?\}\}/g, '')
    
    // Remove common Jekyll front matter that leaked through
    .replace(/^---[\s\S]*?---/m, '')
    
    // Clean up multiple line breaks
    .replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Add classes for better styling
  html = html
    // Style tables
    .replace(/<table>/g, '<table class="markdown-table">')
    
    // Style code blocks with syntax highlighting classes
    .replace(/<pre><code>/g, '<pre class="code-block"><code class="code-content">')
    
    // Style inline code
    .replace(/<code>/g, '<code class="inline-code">')
    
    // Style blockquotes
    .replace(/<blockquote>/g, '<blockquote class="markdown-blockquote">')
    
    // Add proper links styling and external link handling
    .replace(/<a href="([^"]*)"([^>]*)>/g, (match, href, attrs) => {
      const isExternal = href.startsWith('http') || href.startsWith('//');
      const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const className = isExternal ? ' class="external-link"' : ' class="internal-link"';
      return `<a href="${href}"${className}${externalAttrs}${attrs}>`;
    })
    
    // Style headers with anchor links for TOC
    .replace(/<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/g, (match, level, attrs, content) => {
      const id = content.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      return `<h${level} id="${id}" class="markdown-heading markdown-h${level}"${attrs}>
        <a href="#${id}" class="header-anchor" aria-hidden="true">#</a>
        ${content}
      </h${level}>`;
    })
    
    // Style lists
    .replace(/<ul>/g, '<ul class="markdown-list">')
    .replace(/<ol>/g, '<ol class="markdown-list ordered">')
    
    // Add wrapper for paragraphs
    .replace(/<p>/g, '<p class="markdown-paragraph">');

  return html;
}

// Process Jekyll-style {:toc} table of contents
function processJekyllTOC(html: string): string {
  // Look for Jekyll TOC pattern: 1. TOC\n{:toc} or just {:toc}
  const tocPattern = /1\.\s*TOC\s*\{:toc\}|\{:toc\}/gi;
  
  if (!tocPattern.test(html)) {
    return html;
  }
  
  // Extract all headings from the HTML (after the TOC marker)
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h[2-6]>/g;
  const headings: Array<{ level: number; title: string; id: string; href: string }> = [];
  
  // Reset regex
  html.replace(headingRegex, (fullMatch, level, title) => {
    const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
    const id = cleanTitle.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    headings.push({
      level: parseInt(level),
      title: cleanTitle,
      id,
      href: `#${id}`
    });
    return fullMatch;
  });
  
  if (headings.length === 0) {
    return html;
  }
  
  // Generate the TOC HTML
  let tocHtml = '<div class="jekyll-toc">\n<ol class="toc-list">\n';
  
  headings.forEach((heading, index) => {
    const { level, title, href } = heading;
    
    if (level === 2) {
      // Main section
      tocHtml += `  <li class="toc-item"><a href="${href}" class="toc-link">${title}</a>\n`;
      
      // Look for subsections (h3) that follow this h2
      const subsections = headings.slice(index + 1).filter(h => h.level === 3);
      const nextH2Index = headings.slice(index + 1).findIndex(h => h.level === 2);
      const relevantSubsections = nextH2Index === -1 ? subsections : subsections.slice(0, nextH2Index);
      
      if (relevantSubsections.length > 0) {
        tocHtml += '    <ol class="toc-sublist">\n';
        relevantSubsections.forEach(sub => {
          tocHtml += `      <li class="toc-item"><a href="${sub.href}" class="toc-link">${sub.title}</a></li>\n`;
        });
        tocHtml += '    </ol>\n';
      }
      
      tocHtml += '  </li>\n';
    }
  });
  
  tocHtml += '</ol>\n</div>';
  
  // Replace the Jekyll TOC marker with our generated TOC
  html = html.replace(/1\.\s*TOC\s*\{:toc\}|\{:toc\}/gi, tocHtml);
  
  return html;
}

// Generate table of contents from HTML
export function generateTableOfContents(contentHtml: string): TOCItem[] {
  const headingRegex = /<h([2-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-6]>/g;
  const toc: TOCItem[] = [];
  let match;
  
  while ((match = headingRegex.exec(contentHtml)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const title = match[3].replace(/<[^>]*>/g, ''); // Strip any HTML tags
    
    toc.push({
      level,
      id,
      title,
      href: `#${id}`
    });
  }
  
  return toc;
}

export async function getAllCategoryContent(category: string): Promise<ContentData[]> {
  const slugs = getCategoryContentSlugs(category);
  const allContent = await Promise.all(
    slugs.map(async (slug) => {
      return await getCategoryContentData(category, slug);
    })
  );
  
  // Filter out null results and sort by nav_order if available
  return allContent
    .filter((item): item is ContentData => item !== null)
    .sort((a, b) => {
      if (a.nav_order !== undefined && b.nav_order !== undefined) {
        return a.nav_order - b.nav_order;
      }
      return a.title.localeCompare(b.title);
    });
}

// Extract text content from HTML
function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract sections from HTML content
function extractSections(contentHtml: string, pageTitle: string, pageSlug: string, category: string): SearchIndexItem[] {
  const sections: SearchIndexItem[] = [];
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h[2-6]>/gi;
  let match;
  let sectionIndex = 0;
  
  while ((match = headingRegex.exec(contentHtml)) !== null) {
    const level = parseInt(match[1]);
    const headingHtml = match[2];
    const headingText = stripHtml(headingHtml);
    
    if (headingText.trim()) {
      const sectionId = headingText.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      sections.push({
        id: `${category}-${pageSlug}-section-${sectionIndex}`,
        type: 'section',
        title: headingText,
        pageTitle,
        slug: pageSlug,
        sectionId,
        level,
        content: headingText,
        path: `/${category}/${pageSlug}#${sectionId}`,
        category,
        searchText: `${headingText} ${pageTitle}`.toLowerCase()
      });
      sectionIndex++;
    }
  }
  
  return sections;
}

// Build comprehensive search index for a category
export async function buildCategorySearchIndex(category: string): Promise<SearchIndexItem[]> {
  const allContent = await getAllCategoryContent(category);
  const index: SearchIndexItem[] = [];
  
  allContent.forEach(page => {
    if (!page) return;
    
    const textContent = stripHtml(page.contentHtml);
    
    // Index the main page
    index.push({
      id: `${category}-${page.slug}`,
      type: 'page',
      title: page.title,
      slug: page.slug,
      path: `/${category}/${page.slug}`,
      category: page.category || category,
      parent: page.parent,
      content: textContent,
      description: page.description || textContent.substring(0, 200) + '...',
      searchText: `${page.title} ${textContent}`.toLowerCase()
    });
    
    // Extract and index sections
    const sections = extractSections(page.contentHtml, page.title, page.slug, category);
    index.push(...sections);
  });
  
  return index;
}