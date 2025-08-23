'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Cpu, Clock, ArrowLeft, ExternalLink, List, Shield, Code, FileText } from 'lucide-react';
import UnifiedSidebar, { SidebarItem } from './UnifiedSidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

interface MPCSectionProps {
  initialSlug?: string;
}

// Skeleton components for loading states
function SearchSkeleton() {
  return (
    <div className="relative max-w-lg">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <div className="w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 border-gray-300 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="hidden md:block sticky top-16 w-72 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-3 py-2 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// MPC Sidebar Items
const getMPCSidebarItems = (): SidebarItem[] => [
  { id: 'home', title: 'MPC Research', icon: Cpu },
  { id: 'protocol-basics', title: 'Protocol Basics', icon: Code },
  { 
    id: 'security-analysis', 
    title: 'Security Analysis', 
    icon: Shield,
    children: [
      { id: 'vulnerability-guide', title: 'Vulnerability Guide' },
      { id: 'implementation-guide', title: 'Implementation Guide' }
    ]
  }
];

// MPC Search Component
function MPCSearchComponent() {
  return (
    <div className="relative max-w-lg">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search MPC research... (Coming soon)"
        disabled
        className="w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed"
      />
    </div>
  );
}


// Dynamic imports for client-only components
const ClientOnlyMPCSearch = dynamic(() => Promise.resolve(MPCSearchComponent), {
  ssr: false,
  loading: () => <SearchSkeleton />
});


const ClientOnlyMPCSidebar = dynamic(() => Promise.resolve(UnifiedSidebar), {
  ssr: false,
  loading: () => <SidebarSkeleton />
});

export default function MPCSection({ initialSlug }: MPCSectionProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialSlug || 'home');
  
  const sidebarItems = getMPCSidebarItems();

  // Navigate to different pages using Next.js router
  const navigateToPage = useCallback((newPage: string) => {
    if (newPage === 'home') {
      router.push('/mpc');
    } else {
      router.push(`/mpc/${newPage}`);
    }
    setCurrentPage(newPage);
  }, [router]);

  // Render content based on current page
  const renderMPCContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <Cpu className="h-16 w-16 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              MPC Security Research
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Advanced research on multi-party computation protocols, privacy-preserving 
              technologies, and cryptographic security analysis.
            </p>

            <div className="inline-flex items-center px-6 py-3 rounded-full text-lg font-medium bg-green-100 text-green-800 mb-8">
              <Clock className="h-5 w-5 mr-2" />
              Coming Soon
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-left max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What to Expect
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Comprehensive analysis of MPC protocol security</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Privacy-preserving computation vulnerabilities</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Cryptographic implementation best practices</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Security audit guidelines for MPC systems</span>
                </li>
              </ul>
            </div>
          </div>
        );
      
      case 'protocol-basics':
        return (
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Protocol Basics</h1>
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Understanding the fundamental concepts of multi-party computation protocols.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-green-800 font-semibold mb-2">Coming Soon</h3>
                <p className="text-green-700">
                  Detailed content about MPC protocol basics will be available here.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'security-analysis':
        return (
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Security Analysis</h1>
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Comprehensive security analysis framework for MPC implementations.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-green-800 font-semibold mb-2">Coming Soon</h3>
                <p className="text-green-700">
                  Security analysis methodologies and frameworks will be documented here.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'vulnerability-guide':
        return (
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Vulnerability Guide</h1>
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Common vulnerabilities in MPC implementations and how to prevent them.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-green-800 font-semibold mb-2">Coming Soon</h3>
                <p className="text-green-700">
                  Vulnerability patterns and mitigation strategies will be covered here.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'implementation-guide':
        return (
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Implementation Guide</h1>
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Best practices for implementing secure MPC protocols.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-green-800 font-semibold mb-2">Coming Soon</h3>
                <p className="text-green-700">
                  Implementation guidelines and security recommendations will be available here.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <Cpu className="h-16 w-16 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              MPC Security Research
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Advanced research on multi-party computation protocols, privacy-preserving 
              technologies, and cryptographic security analysis.
            </p>

            <div className="inline-flex items-center px-6 py-3 rounded-full text-lg font-medium bg-green-100 text-green-800 mb-8">
              <Clock className="h-5 w-5 mr-2" />
              Coming Soon
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Update current page when initialSlug changes
  useEffect(() => {
    if (initialSlug) {
      setCurrentPage(initialSlug);
    }
  }, [initialSlug]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isClient) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isClient]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto flex relative">
        
        {/* Sidebar */}
        {isClient ? (
          <ClientOnlyMPCSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            sidebarItems={sidebarItems}
            currentPage={currentPage}
            setCurrentPage={navigateToPage}
            sectionType="mpc"
          />
        ) : (
          <SidebarSkeleton />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 md:ml-0">
          {/* Search Section */}
          <div className="px-8 py-6 md:px-12 lg:px-16 border-b border-gray-200">
            <div className="max-w-4xl"> 
              <div className="flex items-center mb-4">
                {/* Back Button */}
                <Link
                  href="/"
                  className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  title="Back to Landing"
                  aria-label="Back to landing page"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Back</span>
                </Link>

                {/* Mobile sidebar toggle button */}
                {isClient && (
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                    title="Toggle Sidebar"
                    aria-label="Toggle sidebar"
                  >
                    <List size={20} />
                  </button>
                )}
              </div>
              
              {/* Search Bar */}
              {isClient ? (
                <ClientOnlyMPCSearch />
              ) : (
                <SearchSkeleton />
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="px-8 py-8 md:px-12 lg:px-16">
            <div className="content-container">
              <article>
                {/* Main Content */}
                <div className="max-w-4xl">
                  {renderMPCContent()}
                </div>
                
              </article>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}