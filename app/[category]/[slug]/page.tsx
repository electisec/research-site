import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryData, generateCategoryMetadata } from '@/lib/category-utils';
import ProxiesSection from '../../components/ProxiesSection';
import MPCSection from '../../components/MPCSection';
import { ContentData, SearchIndexItem } from '@/lib/content';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

const componentMap = {
  proxies: ProxiesSection,
  mpc: MPCSection,
};

// Cache for proxies content data
let cachedProxiesContent: ContentData[] | null = null;
let cachedProxiesSearchIndex: SearchIndexItem[] | null = null;

async function getProxiesData(): Promise<{ content: ContentData[]; searchIndex: SearchIndexItem[] }> {
  if (cachedProxiesContent && cachedProxiesSearchIndex) {
    return {
      content: cachedProxiesContent,
      searchIndex: cachedProxiesSearchIndex
    };
  }

  try {
    const { getCategoryContent, buildCategorySearchIndex } = await import('../../../lib/content');
    
    const content = await getCategoryContent('proxies');
    
    if (content.length === 0) {
      return { content: [], searchIndex: [] };
    }
    
    const searchIndex = await buildCategorySearchIndex('proxies');
    
    cachedProxiesContent = content;
    cachedProxiesSearchIndex = searchIndex;
    
    return { content, searchIndex };
  } catch (error) {
    console.error('Error loading proxies content:', error);
    return { content: [], searchIndex: [] };
  }
}

export default async function CategorySlugPage({ params }: PageProps) {
  const { category, slug } = await params;
  const categoryData = await getCategoryData(category);
  
  if (!categoryData) {
    notFound();
  }

  // Check if the slug exists in this category
  if (!categoryData.validSlugs.includes(slug)) {
    notFound();
  }

  const Component = componentMap[category as keyof typeof componentMap];
  
  if (!Component) {
    notFound();
  }
  
  if (category === 'proxies') {
    // Use existing proxies-specific data loading
    try {
      const { content, searchIndex } = await getProxiesData();
      
      // Check if the slug exists in our content
      const pageExists = content.some(page => page.slug === slug);
      
      if (!pageExists) {
        notFound();
      }
      
      return (
        <Component 
          initialContent={content}
          initialSearchIndex={searchIndex}
          initialSlug={slug}
        />
      );
    } catch (error) {
      console.error(`Error loading ${category} content:`, error);
      notFound();
    }
  } else if (category === 'mpc') {
    // MPC component doesn't need content validation yet - just use the slug
    return <Component initialSlug={slug} />;
  }
  
  notFound();
}

export async function generateStaticParams() {
  const { getAllCategories, getCategoryData } = await import('@/lib/category-utils');
  const categories = getAllCategories();
  const params: Array<{ category: string; slug: string }> = [];
  
  for (const category of categories) {
    const categoryData = await getCategoryData(category);
    if (categoryData) {
      for (const slug of categoryData.validSlugs) {
        params.push({ category, slug });
      }
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { category, slug } = await params;
    const categoryData = await getCategoryData(category);
    
    if (!categoryData) {
      return { title: 'Page Not Found' };
    }

    let pageTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Get more specific title for content
    try {
      const { getAllCategoryContent } = await import('../../../lib/category-content');
      const content = await getAllCategoryContent(category);
      const page = content.find(p => p.slug === slug);
      if (page) {
        pageTitle = page.title;
      }
    } catch (error) {
      console.error('Error loading content for metadata:', error);
    }

    return generateCategoryMetadata(category, slug, pageTitle);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Page Not Found' };
  }
}