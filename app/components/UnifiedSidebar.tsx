'use client';

import React, { useCallback } from 'react';
import { ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';

export interface SidebarItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  children?: { id: string; title: string }[];
}

export interface UnifiedSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  sidebarItems: SidebarItem[];
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
  expandedSections?: Record<string, boolean>;
  toggleSection?: (section: string) => void;
  sectionType: 'proxies' | 'mpc';
}

interface SidebarItemComponentProps {
  item: SidebarItem;
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
  expandedSections?: Record<string, boolean>;
  toggleSection?: (section: string) => void;
  onItemClick?: () => void;
  sectionType: 'proxies' | 'mpc';
}

function SidebarItemComponent({ 
  item, 
  currentPage, 
  setCurrentPage, 
  expandedSections, 
  toggleSection, 
  onItemClick,
  sectionType
}: SidebarItemComponentProps) {
  const handleItemClick = useCallback(() => {
    if (setCurrentPage) {
      setCurrentPage(item.id);
    }
    onItemClick?.();
  }, [item.id, setCurrentPage, onItemClick]);

  const handleToggleSection = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleSection) {
      toggleSection(item.id);
    }
  }, [item.id, toggleSection]);

  const isActive = currentPage === item.id;
  const isExpanded = expandedSections?.[item.id] || false;
  
  // Use consistent green theme for all sections
  const activeColors = 'bg-green-100 text-green-700';

  return (
    <div>
      <div className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        isActive ? activeColors : 'hover:bg-gray-100'
      }`}>
        <button
          onClick={handleItemClick}
          className="flex items-center gap-3 flex-1 text-left"
          aria-current={isActive ? 'page' : undefined}
        >
          <item.icon size={18} />
          <span className="text-sm font-medium">{item.title}</span>
        </button>
        
        {item.children && toggleSection && (
          <button
            onClick={handleToggleSection}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.title} section`}
          >
            {isExpanded ? 
              <ChevronDown size={16} /> : 
              <ChevronRight size={16} />
            }
          </button>
        )}
      </div>
      
      {item.children && isExpanded && setCurrentPage && (
        <div className="ml-6 mt-2 space-y-1">
          {item.children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                setCurrentPage(child.id);
                onItemClick?.();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPage === child.id ? activeColors : 'hover:bg-gray-100'
              }`}
              aria-current={currentPage === child.id ? 'page' : undefined}
            >
              {child.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UnifiedSidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  sidebarItems, 
  currentPage, 
  setCurrentPage, 
  expandedSections, 
  toggleSection,
  sectionType
}: UnifiedSidebarProps) {
  const navigationLabel = sectionType === 'proxies' ? 'Proxies navigation' : 'MPC navigation';

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="fixed inset-0" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:sticky top-16 left-0 md:left-auto z-40 w-64 md:w-72 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto`}>
        <div className="p-6">
          <nav className="space-y-2" role="navigation" aria-label={navigationLabel}>
            {sidebarItems.map((item) => (
              <SidebarItemComponent
                key={item.id}
                item={item}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                onItemClick={() => setIsSidebarOpen(false)}
                sectionType={sectionType}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}