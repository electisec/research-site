/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from "react";
import Link from "next/link";
import { CloseCircleOutlined, MenuOutlined } from "@ant-design/icons";

// Button component for consistent styling
function Button({ text }: { text: string }) {
  return (
    <button className="px-6 py-3 rounded-xl text-sm text-zinc-400 hover:text-emeraldlight hover:bg-white/5 duration-700 cursor-pointer">
      {text}
    </button>
  );
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="w-full bg-white flex h-18 items-center justify-between top-0 py-12">
        {/* Logo section */}
        <div className="flex flex-row gap-4 text-emeraldlight items-center text-xl lg:ml-[20vw] ml-4">
          <Link href="https://electisec.com/">
            <img alt="Logo" src="/assets/images/logo.png" className="h-10" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="px-8 py-3 rounded-xl lg:hidden cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MenuOutlined />
        </button>

        {/* Desktop menu */}
        <div className="hidden lg:flex flex-row items-center gap-1 lg:mr-[20vw]">
          <Link href="https://reports.electisec.com/">
            <Button text="Reports" />
          </Link>
          <Link href="https://blog.electisec.com/">
            <Button text="Blog" />
          </Link>
          <Link href="https://research.electisec.com/">
            <button className="px-6 py-3 rounded-xl text-sm hover:text-darkgreen text-bold text-emeraldlight duration-700 cursor-pointer">
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
            <button className="px-8 py-3 rounded-xl text-md text-darkgreen bg-emeraldlight/25 hover:bg-emeraldlight/5 hover:text-emeraldlight duration-700 cursor-pointer">
              Contact
            </button>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="w-full bg-white h-full z-40 duration-700 cursor-pointer">
          <div className="pt-8 mx-auto flex flex-col p-8 gap-2">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-green-400 cursor-pointer"
            >
              <CloseCircleOutlined style={{ fontSize: "2rem" }} />
            </button>

            <Link href="https://reports.electisec.com/">
              <button className="p-6 rounded-xl w-full text-xl text-zinc-400 hover:text-emeraldlight hover:bg-darkgreen hover:bg-darkgreen/5 duration-700 cursor-pointer">
                Reports
              </button>
            </Link>
            <Link href="https://blog.electisec.com/">
              <button className="p-6 rounded-xl w-full text-xl text-zinc-400 hover:text-emeraldlight hover:bg-darkgreen hover:bg-darkgreen/5 duration-700 cursor-pointer">
                Blog
              </button>
            </Link>
            <Link href="https://research.electisec.com/">
              <button className="p-6 rounded-xl w-full text-xl text-emeraldlight hover:bg-darkgreen hover:bg-darkgreen/5 duration-700 cursor-pointer">
                Research
              </button>
            </Link>
            <Link href="https://electisec.com/fellowships">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-6 rounded-xl w-full text-xl text-zinc-400 hover:text-emeraldlight hover:bg-darkgreen hover:bg-darkgreen/5 duration-700 cursor-pointer"
              >
                Fellowships
              </button>
            </Link>
            <Link href="https://electisec.com/services">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-6 rounded-xl w-full text-xl text-zinc-400 hover:text-emeraldlight hover:bg-white/5 duration-700 cursor-pointer"
              >
                Services
              </button>
            </Link>
            <Link href="https://electisec.com/team">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-6 rounded-xl w-full text-xl text-zinc-400 hover:text-emeraldlight hover:bg-white/5 duration-700 cursor-pointer"
              >
                Team
              </button>
            </Link>
            <Link href="https://electisec.com/contact-us">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-6 rounded-xl w-full text-xl text-emeraldlight hover:bg-darkgreen/5 duration-700 cursor-pointer"
              >
                Contact
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
