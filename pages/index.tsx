import { GetStaticProps } from "next";
import ResearchCard from "../components/ResearchCard";
import categoriesData from "../lib/categories.json";

interface Author {
  name: string;
  avatar: string;
  twitter?: string;
  url?: string;
  promotedToResident?: boolean;
}

interface ResearchCategory {
  title: string;
  description: string;
  contentPath: string;
  authors: Author[];
  seo: {
    title: string;
    keywords: string[];
    baseUrl: string;
  };
}

interface HomeProps {
  categories: Record<string, ResearchCategory>;
}

export default function Home({ categories }: HomeProps) {

  return (
    <div className="bg-background">
      <main className="max-w-6xl mx-auto py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="px-4 sm:px-0 mb-20 text-center">
          <h1 className="text-6xl font-bold text-title mb-4">Explore <span className="text-green-600">Research</span></h1>
          <p className="text-xl text-body">Advanced security research for Web3 and cryptographic systems</p>
        </div>

        {/* Research Categories Section */}
        <div className="px-4 sm:px-0 mb-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {Object.entries(categories)?.map(([key, category]) => (
              <ResearchCard
                key={key}
                category={key as "proxies" | "mpc"}
                title={category.title}
                description={category.description}
                authors={category.authors}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      categories: categoriesData.categories,
    },
    revalidate: 3600,
  };
};
