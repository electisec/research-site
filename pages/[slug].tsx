import { GetStaticProps, GetStaticPaths } from "next";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import path from "path";
import fs from "fs";
import { processMarkdown } from "../lib/utils";
import { Search, Menu, X } from "lucide-react";
import categoriesData from "../lib/categories.json";
import Sidebar from "../components/Sidebar";
import { 
  parseContentForSearch, 
  fuzzySearch, 
  copyHeadingLink, 
  handleAnchorNavigation,
  type SearchResult,
  type CategoryContent 
} from "../lib/search";

interface ResearchPageProps {
  title: string;
  content: string;
  author: string;
  category: string;
  slug: string;
  categoryContent?: CategoryContent[];
}


export default function ResearchPage({
  title: _title,
  content,
  author,
  category,
  slug,
  categoryContent = []
}: ResearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    headings: SearchResult[];
    content: SearchResult[];
  }>({ headings: [], content: [] });
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const router = useRouter();

  // Parse content for search across all category pages
  useEffect(() => {
    const results = parseContentForSearch(content, categoryContent, slug, _title);
    setSearchResults({ headings: results.headings, content: results.content });
    
    // Update the DOM with processed content
    setTimeout(() => {
      const articleElement = document.querySelector('.prose');
      if (articleElement) {
        articleElement.innerHTML = results.processedContent;
        
        // Add click listeners to heading link icons
        const linkIcons = articleElement.querySelectorAll('.heading-link');
        linkIcons.forEach((icon) => {
          icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const headingId = (e.currentTarget as HTMLElement).getAttribute('data-heading-id');
            if (headingId) {
              copyHeadingLink(headingId, (id) => {
                setCopiedLinkId(id);
                setTimeout(() => setCopiedLinkId(null), 2000);
              });
            }
          });
        });

        // Handle anchor navigation from URL
        handleAnchorNavigation();
        
        // Initialize mermaid diagrams
        if (typeof window !== 'undefined' && (window as any).initMermaid) {
          (window as any).initMermaid();
        }
      }
    }, 100);
  }, [content, categoryContent, slug, _title]);

  // Handle hash navigation on route changes
  useEffect(() => {
    const handleHashChange = () => handleAnchorNavigation();

    // Handle hash change events
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial load with hash
    if (window.location.hash) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle mermaid initialization on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).initMermaid) {
          (window as any).initMermaid();
        }
      }, 200);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Reset scroll position when navigating to a different article
  useEffect(() => {
    if (articleRef.current) {
      articleRef.current.scrollTop = 0;
    }
    // Close sidebar on mobile when navigating
    setIsSidebarOpen(false);
  }, [slug]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(e.target.value.length > 0);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setIsSearchOpen(true);
    }
  };

  const filteredHeadings = fuzzySearch(searchQuery, searchResults.headings);
  const filteredContent = fuzzySearch(searchQuery, searchResults.content);

  const handleResultClick = (id: string, resultSlug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    
    if (resultSlug === slug) {
      // Same page - scroll to element
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Different page - navigate with anchor
      window.location.href = `/${resultSlug}#${id}`;
    }
  };

  return (
    <div className="max-w-6xl bg-background flex mx-auto relative">
      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        category={category}
        currentSlug={slug}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-hidden relative">
            {/* Search bar container with hamburger menu on mobile */}
            <div className="flex items-center gap-2 my-2 pl-2 md:pl-0">
              {/* Mobile and tablet hamburger menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden flex-shrink-0 p-2 bg-white border border-gray-200 rounded-md shadow-md hover:bg-gray-50"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} />
              </button>

              {/* Search bar */}
              <div className="relative flex-1 max-w-2xl pl-4 md:pl-6" ref={searchRef}>
                <div className="absolute inset-y-0 left-4 md:left-6 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-body" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 border-gray-100 text-gray-500 focus:border-green-600 focus:outline-none"
                  placeholder="Search in content..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={handleSearchFocus}
                />
              
              {/* Search Dropdown */}
              {isSearchOpen && (filteredHeadings.length > 0 || filteredContent.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                  <div className="flex h-80">
                    {/* Headings Section (1/4) */}
                    <div className="w-1/4 border-r border-gray-200 p-3 overflow-y-auto">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Headings</h4>
                      {filteredHeadings.length > 0 ? (
                        filteredHeadings.map((heading) => (
                          <div
                            key={heading.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
                            onClick={() => handleResultClick(heading.id, heading.slug)}
                          >
                            <div className="text-gray-800 truncate font-medium">{heading.text}</div>
                            {heading.slug !== slug && (
                              <div className="text-gray-500 text-xs mt-1">in {heading.pageTitle}</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm">No headings found</div>
                      )}
                    </div>
                    
                    {/* Content Section (3/4) */}
                    <div className="w-3/4 p-3 overflow-y-auto">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Content</h4>
                      {filteredContent.length > 0 ? (
                        filteredContent.map((item) => (
                          <div
                            key={item.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded text-sm mb-2"
                            onClick={() => handleResultClick(item.id, item.slug)}
                          >
                            <div className="text-gray-800 line-clamp-2">{item.text}</div>
                            {item.slug !== slug && (
                              <div className="text-gray-500 text-xs mt-1">in {item.pageTitle}</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm">No content found</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>

            <article ref={articleRef} className="overflow-y-auto p-6" style={{ height: 'calc(100vh - 22px - 120px)' }}>
            <div
              className="prose prose-lg max-w-none prose-table:shadow-lg prose-table:border prose-td:p-2 prose-th:p-2 prose-a:text-title"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            
            {/* Copy success notification */}
            {copiedLinkId && (
              <div className="fixed top-20 right-4 bg-green-600 text-white px-3 py-2 rounded-md shadow-lg z-50 text-sm">
                Link copied to clipboard!
              </div>
            )}
          </article>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { slug: string } }[] = [];
  
  // Add category routes (proxies, mpc)
  Object.keys(categoriesData.categories).forEach(categoryKey => {
    paths.push({ params: { slug: categoryKey } });
  });
  
  // Add individual content files from each category
  Object.values(categoriesData.categories).forEach((categoryData) => {
    const categoryPath = path.join(process.cwd(), categoryData.contentPath);
    
    if (fs.existsSync(categoryPath)) {
      const filenames = fs.readdirSync(categoryPath);
      filenames
        .filter(filename => filename.endsWith('.md') && filename !== 'home.md')
        .forEach(filename => {
          paths.push({ params: { slug: filename.replace('.md', '') } });
        });
    }
  });
  
  // Add files from root content directory
  const contentDirectory = path.join(process.cwd(), "content");
  if (fs.existsSync(contentDirectory)) {
    const rootFiles = fs.readdirSync(contentDirectory);
    rootFiles
      .filter(file => file.endsWith('.md'))
      .forEach(file => {
        paths.push({ params: { slug: file.replace('.md', '') } });
      });
  }

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    
    // Check if this is a category route (proxies, mpc)
    const categoryData = categoriesData.categories[slug as keyof typeof categoriesData.categories];
    
    if (categoryData) {
      // This is a category page, load home.md from the category directory
      const categoryPath = path.join(process.cwd(), categoryData.contentPath);
      const homeFilePath = path.join(categoryPath, 'home.md');
      
      if (fs.existsSync(homeFilePath)) {
        const fileContent = fs.readFileSync(homeFilePath, "utf8");
        const { frontMatter, content } = await processMarkdown(fileContent);

        // Load all other files in the category for search
        const categoryContent: Array<{
          slug: string;
          title: string;
          content: string;
          headings: Array<{id: string; text: string; level: string}>;
          contentElements: Array<{id: string; text: string; type: string}>;
        }> = [];

        if (fs.existsSync(categoryPath)) {
          const filenames = fs.readdirSync(categoryPath);
          for (const filename of filenames) {
            if (filename.endsWith('.md') && filename !== 'home.md') {
              const filePath = path.join(categoryPath, filename);
              const fileContent = fs.readFileSync(filePath, "utf8");
              const { frontMatter, content: pageContent } = await processMarkdown(fileContent);
              
              categoryContent.push({
                slug: filename.replace('.md', ''),
                title: frontMatter.title || filename.replace('.md', ''),
                content: pageContent || "",
                headings: [],
                contentElements: []
              });
            }
          }
        }

        return {
          props: {
            title: frontMatter.title || categoryData.title,
            content: content || "",
            author: frontMatter.author || "Electisec Team",
            category: slug,
            slug: 'home',
            categoryContent,
          },
          revalidate: 3600,
        };
      }
    }
    
    // This is an individual content page, determine which category it belongs to
    let category = '';
    let filePath = '';
    
    // Check in each category's content path
    for (const [categoryKey, categoryInfo] of Object.entries(categoriesData.categories)) {
      const categoryPath = path.join(process.cwd(), categoryInfo.contentPath);
      const potentialFilePath = path.join(categoryPath, `${slug}.md`);
      
      if (fs.existsSync(potentialFilePath)) {
        category = categoryKey;
        filePath = potentialFilePath;
        break;
      }
    }
    
    // If not found in category folders, check root content folder
    if (!filePath) {
      const contentDirectory = path.join(process.cwd(), "content");
      const potentialFilePath = path.join(contentDirectory, `${slug}.md`);
      if (fs.existsSync(potentialFilePath)) {
        filePath = potentialFilePath;
        category = 'general';
      }
    }
    
    if (!filePath) {
      return {
        notFound: true,
      };
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { frontMatter, content } = await processMarkdown(fileContent);

    // Load all other files in the same category for cross-page search
    const categoryContent: Array<{
      slug: string;
      title: string;
      content: string;
      headings: Array<{id: string; text: string; level: string}>;
      contentElements: Array<{id: string; text: string; type: string}>;
    }> = [];

    if (category && categoriesData.categories[category as keyof typeof categoriesData.categories]) {
      const categoryInfo = categoriesData.categories[category as keyof typeof categoriesData.categories];
      const categoryPath = path.join(process.cwd(), categoryInfo.contentPath);
      
      if (fs.existsSync(categoryPath)) {
        const filenames = fs.readdirSync(categoryPath);
        for (const filename of filenames) {
          if (filename.endsWith('.md') && filename.replace('.md', '') !== slug) {
            const otherFilePath = path.join(categoryPath, filename);
            const otherFileContent = fs.readFileSync(otherFilePath, "utf8");
            const { frontMatter: otherFrontMatter, content: otherContent } = await processMarkdown(otherFileContent);
            
            categoryContent.push({
              slug: filename.replace('.md', ''),
              title: otherFrontMatter.title || filename.replace('.md', ''),
              content: otherContent || "",
              headings: [],
              contentElements: []
            });
          }
        }
      }
    }

    return {
      props: {
        title: frontMatter.title || "Research Post",
        content: content || "",
        author: frontMatter.author || "Anonymous",
        category,
        slug,
        categoryContent,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error("Error fetching research post:", error);
    return {
      notFound: true,
    };
  }
};
