import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import categoriesData from './categories.json';

export interface CategoryConfig {
  title: string;
  description: string;
  component?: string;
  contentSource: 'markdown' | 'json';
  contentPath?: string;
  content?: Array<{
    slug: string;
    title: string;
    description: string;
  }>;
  seo: {
    title: string;
    keywords: string[];
    baseUrl: string;
  };
}

export interface CategoryData {
  category: string;
  config: CategoryConfig;
  validSlugs: string[];
}

export function getCategoryConfig(category: string): CategoryConfig | null {
  const config = categoriesData.categories[category as keyof typeof categoriesData.categories];
  return config ? config as CategoryConfig : null;
}

export function getAllCategories(): string[] {
  return Object.keys(categoriesData.categories);
}

export async function getCategoryData(category: string): Promise<CategoryData | null> {
  const config = getCategoryConfig(category);
  if (!config) return null;

  let validSlugs: string[] = [];

  if (config.contentSource === 'markdown' && config.contentPath) {
    try {
      const contentDirectory = path.join(process.cwd(), config.contentPath);
      if (fs.existsSync(contentDirectory)) {
        const fileNames = fs.readdirSync(contentDirectory);
        validSlugs = fileNames
          .filter((name) => name.endsWith('.md'))
          .map((fileName) => {
            return fileName.replace(/\.md$/, '').toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '');
          });
      } else {
        console.warn(`Content directory not found for ${category}: ${contentDirectory}`);
      }
    } catch (error) {
      console.warn(`Error reading content directory for ${category}:`, error);
      validSlugs = [];
    }
  } else if (config.contentSource === 'json' && config.content) {
    validSlugs = config.content.map(item => item.slug);
  }

  return {
    category,
    config,
    validSlugs
  };
}

export function generateCategoryMetadata(
  category: string, 
  slug?: string,
  pageTitle?: string
): Metadata {
  const config = getCategoryConfig(category);
  if (!config) {
    return {
      title: 'Page Not Found',
    };
  }

  const baseTitle = pageTitle ? `${pageTitle} | ${config.title}` : config.title;
  const description = config.description;

  return {
    title: baseTitle,
    description,
    keywords: config.seo.keywords.join(', '),
    authors: [{ name: 'Electisec', url: 'https://electisec.com' }],
    openGraph: {
      title: baseTitle,
      description,
      url: slug ? `${config.seo.baseUrl}/${slug}` : config.seo.baseUrl,
      siteName: config.title,
      type: 'website',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description,
      images: ['/images/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}