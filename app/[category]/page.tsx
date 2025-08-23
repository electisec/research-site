import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryData, generateCategoryMetadata } from '@/lib/category-utils';
import ProxiesSection from '../components/ProxiesSection';
import MPCSection from '../components/MPCSection';
import { ContentData, SearchIndexItem } from '@/lib/content';

interface PageProps {
  params: Promise<{ category: string }>;
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
    const { getCategoryContent, buildCategorySearchIndex } = await import('../../lib/content');
    
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

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryData = await getCategoryData(category);
  
  if (!categoryData) {
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
      
      return (
        <Component 
          initialContent={content}
          initialSearchIndex={searchIndex}
          initialSlug="home"
        />
      );
    } catch (error) {
      console.error(`Error loading ${category} content:`, error);
      return (
        <Component 
          initialContent={[]}
          initialSearchIndex={[]}
          initialSlug="home"
        />
      );
    }
  } else if (category === 'mpc') {
    // MPC component doesn't need content data yet
    return <Component initialSlug="home" />;
  }
  
  notFound();
}

export async function generateStaticParams() {
  // Get all category keys from the JSON config
  const { getAllCategories } = await import('@/lib/category-utils');
  const categories = getAllCategories();
  
  return categories.map((category) => ({
    category: category,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  return generateCategoryMetadata(category);
}