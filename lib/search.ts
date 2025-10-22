export interface SearchResult {
  id: string;
  text: string;
  level?: string;
  type?: string;
  element: string;
  slug: string;
  pageTitle: string;
}

export interface CategoryContent {
  slug: string;
  title: string;
  content: string;
  headings: Array<{id: string; text: string; level: string}>;
  contentElements: Array<{id: string; text: string; type: string}>;
}

// Helper function to create semantic IDs from heading text
export const createSemanticId = (text: string, usedIds: Set<string>): string => {
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
};

// Fuzzy search function
export const fuzzySearch = (query: string, items: SearchResult[]): SearchResult[] => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return items
    .filter(item => item.text.toLowerCase().includes(lowerQuery))
    .sort((a, b) => {
      const aIndex = a.text.toLowerCase().indexOf(lowerQuery);
      const bIndex = b.text.toLowerCase().indexOf(lowerQuery);
      return aIndex - bIndex;
    })
    .slice(0, 10);
};

// Parse content and extract searchable elements
export const parseContentForSearch = (
  content: string,
  categoryContent: CategoryContent[],
  currentSlug: string,
  currentTitle: string
): { headings: SearchResult[]; content: SearchResult[]; processedContent: string } => {
  const allHeadings: SearchResult[] = [];
  const allContent: SearchResult[] = [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const usedIds = new Set<string>();

  // Extract headings from current page and add link icons
  const currentHeadings = Array.from(doc.querySelectorAll('h1, h2, h3, h4')).map((el) => {
    const headingText = el.textContent?.trim() || '';
    const id = createSemanticId(headingText, usedIds);
    el.setAttribute('id', id);
    
    // Add link icon to heading
    const linkIcon = doc.createElement('span');
    linkIcon.className = 'heading-link';
    linkIcon.setAttribute('data-heading-id', id);
    linkIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    el.appendChild(linkIcon);
    
    return {
      id,
      text: headingText,
      level: el.tagName.toLowerCase(),
      element: el.outerHTML,
      slug: currentSlug,
      pageTitle: currentTitle
    };
  });

  // Extract content from current page
  const currentContentElements = Array.from(doc.querySelectorAll('p, li, blockquote, code, pre, td, th, span, div, strong, em, a')).map((el) => {
    const contentText = el.textContent || '';
    const id = createSemanticId(contentText.substring(0, 50), usedIds);
    el.setAttribute('id', id);
    return {
      id,
      text: contentText,
      type: el.tagName.toLowerCase(),
      element: el.outerHTML,
      slug: currentSlug,
      pageTitle: currentTitle
    };
  }).filter(item => item.text.trim().length > 10);

  allHeadings.push(...currentHeadings);
  allContent.push(...currentContentElements);

  // Parse all other pages in the category
  categoryContent.forEach((page) => {
    const pageDoc = parser.parseFromString(page.content, 'text/html');
    
    // Extract headings from other pages
    const pageHeadings = Array.from(pageDoc.querySelectorAll('h1, h2, h3, h4')).map((el) => {
      const headingText = el.textContent?.trim() || '';
      const id = createSemanticId(headingText, usedIds);
      return {
        id,
        text: headingText,
        level: el.tagName.toLowerCase(),
        element: el.outerHTML,
        slug: page.slug,
        pageTitle: page.title
      };
    });

    // Extract content from other pages
    const pageContentElements = Array.from(pageDoc.querySelectorAll('p, li, blockquote, code, pre, td, th, span, div, strong, em, a')).map((el) => {
      const contentText = el.textContent || '';
      const id = createSemanticId(contentText.substring(0, 50), usedIds);
      return {
        id,
        text: contentText,
        type: el.tagName.toLowerCase(),
        element: el.outerHTML,
        slug: page.slug,
        pageTitle: page.title
      };
    }).filter(item => item.text.trim().length > 10);

    allHeadings.push(...pageHeadings);
    allContent.push(...pageContentElements);
  });

  return { 
    headings: allHeadings, 
    content: allContent,
    processedContent: doc.body.innerHTML 
  };
};

// Copy heading link to clipboard
export const copyHeadingLink = async (headingId: string, onSuccess: (id: string) => void): Promise<void> => {
  const url = `${window.location.origin}${window.location.pathname}#${headingId}`;
  try {
    await navigator.clipboard.writeText(url);
    onSuccess(headingId);
  } catch (err) {
    console.error('Failed to copy link: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    onSuccess(headingId);
  }
};

// Handle anchor navigation
export const handleAnchorNavigation = (): void => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    setTimeout(() => {
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
};