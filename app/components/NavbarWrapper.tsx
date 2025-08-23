'use client';

import React, { useState } from 'react';
import { Navbar, MobileNavbar } from './Navbar';

export default function NavbarWrapper() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Global Navbar */}
      <header className="z-50 bg-white">
        <Navbar 
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-full h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <MobileNavbar 
              setMenuOpen={setMenuOpen}
            />
          </div>
        </div>
      )}
    </>
  );
}