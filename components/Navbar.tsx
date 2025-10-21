/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Button component for consistent styling
function Button({ text }: { text: string }) {
  return (
    <button className="px-6 py-3 rounded-xl text-sm text-zinc-400 hover:text-green-600 hover:bg-white hover:bg-opacity-5">
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
          <Link href="https://electisec.com/" className="flex-shrink-0">
            <img
              alt="Logo"
              src="/logo.png"
              className="h-10 md:h-12 lg:h-10 w-auto min-w-[120px] md:min-w-[150px] lg:min-w-[180px]"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="px-4 py-2 rounded-xl lg:hidden mr-4 text-zinc-700 hover:text-green-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className="text-2xl">☰</span>
        </button>

        {/* Desktop menu */}
        <div className="hidden lg:flex flex-row items-center gap-1">
          <Link href="https://reports.electisec.com/">
            <Button text="Reports" />
          </Link>
          <Link href="https://blog.electisec.com/">
            <Button text="Blog" />
          </Link>
          <Link href="https://research.electisec.com/">
            <button className="px-6 py-3 rounded-xl text-sm hover:text-green-800 font-medium text-green-600">
              Research
            </button>
          </Link>
          <Link href="https://electisec.com/fellowships">
            <Button text="Fellowships" />
          </Link>
          <Link href="https://electisec.com/services">
            <Button text="Services" />
          </Link>
          <Link href="https://electisec.com/team">
            <Button text="Team" />
          </Link>
          <Link href="https://electisec.com/contact-us">
            <button className="px-8 py-3 rounded-xl text-sm bg-green-600 bg-opacity-20 text-green-800 hover:bg-opacity-30 hover:font-medium transition-all duration-300">
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
              <Link href="https://reports.electisec.com/" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors">
                  Reports
                </button>
              </Link>
              <Link href="https://blog.electisec.com/" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors">
                  Blog
                </button>
              </Link>
              <Link href="https://research.electisec.com/" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 rounded-lg font-medium text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors">
                  Research
                </button>
              </Link>
              <Link href="https://electisec.com/fellowships" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors">
                  Fellowships
                </button>
              </Link>
              <Link href="https://electisec.com/services" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors">
                  Services
                </button>
              </Link>
              <Link href="https://electisec.com/team" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors">
                  Team
                </button>
              </Link>
              <Link href="https://electisec.com/contact-us" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-4 mt-2 rounded-lg bg-green-600 bg-opacity-10 text-green-700 hover:bg-opacity-20 font-medium transition-colors">
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
