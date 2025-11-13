/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Button component for consistent styling
function Button({ text }: { text: string }) {
  return (
    <button className="px-6 py-3 text-sm text-zinc-400 hover:text-deepblue hover:bg-white hover:bg-white/5">
      {text}
    </button>
  );
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="w-full flex h-22 items-center max-w-6xl justify-between align-center top-0 py-6 m-auto">
        {/* Logo section */}
        <div className="flex flex-row gap-4 text-primary items-center text-xl ml-4">
          <Link href="https://yaudit.dev/" className="flex-shrink-0">
            <img
              alt="Logo"
              src="/logo.svg"
              className="h-10 md:h-12 lg:h-10 w-auto min-w-[120px] md:min-w-[150px] lg:min-w-[180px]"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="px-4 py-2 lg:hidden mr-4 text-zinc-700 hover:text-deepblue"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className="text-2xl">☰</span>
        </button>

        {/* Desktop menu */}
        <div className="hidden lg:flex flex-row items-center gap-1">
          <Link href="https://reports.yaudit.dev/">
            <Button text="Reports" />
          </Link>
          <Link href="https://blog.yaudit.dev/">
            <Button text="Blog" />
          </Link>
          <Link href="https://research.yaudit.dev/">
            <button className="px-6 py-3 text-sm hover:text-deepblue font-medium text-deepblue">
              Research
            </button>
          </Link>
          <Link href="https://yaudit.dev/fellowships">
            <Button text="Fellowships" />
          </Link>
          <Link href="https://yaudit.dev/services">
            <Button text="Services" />
          </Link>
          <Link href="https://yaudit.dev/team">
            <Button text="Team" />
          </Link>
          <Link href="https://yaudit.dev/contact-us">
            <button className="px-8 py-3 text-sm bg-deepblue text-white hover:bg-white hover:text-deepblue hover:border hover:border-deepblue transition-all duration-700">
              Contact
            </button>
          </Link>

        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMenuOpen(false)}>
          {/* Mobile menu panel */}
          <div 
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            {/* Menu items */}
            <div className="flex flex-col p-4">
              <Link href="https://reports.yaudit.dev/" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 text-gray-700 hover:text-deepblue hover:bg-gray-50 transition-colors">
                  Reports
                </button>
              </Link>
              <Link href="https://blog.yaudit.dev/" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 text-gray-700 hover:text-deepblue hover:bg-gray-50 transition-colors">
                  Blog
                </button>
              </Link>
              <Link href="https://research.yaudit.dev/" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 font-medium text-deepblue hover:text-deepblue hover:bg-blue-50 transition-colors">
                  Research
                </button>
              </Link>
              <Link href="https://yaudit.dev/fellowships" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 text-gray-700 hover:text-deepblue hover:bg-gray-50 transition-colors">
                  Fellowships
                </button>
              </Link>
              <Link href="https://yaudit.dev/services" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 text-gray-700 hover:text-deepblue hover:bg-gray-50 transition-colors">
                  Services
                </button>
              </Link>
              <Link href="https://yaudit.dev/team" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 text-gray-700 hover:text-deepblue hover:bg-gray-50 transition-colors">
                  Team
                </button>
              </Link>
              <Link href="https://yaudit.dev/contact-us" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 mt-2 bg-deepblue text-white hover:bg-white hover:text-deepblue hover:border hover:border-deepblue font-medium transition-all duration-700">
                  Contact
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
