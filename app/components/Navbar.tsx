import React, { useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

interface ButtonProps {
  text: string;
}

function Button({ text }: ButtonProps) {
  return (
    <button className="px-6 py-3 rounded-xl text-sm text-zinc-400 hover-text-emeraldlight hover-bg-white-5 duration-700">
      {text}
    </button>
  );
}

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function Navbar({ menuOpen, setMenuOpen }: NavbarProps) {
  return (
    <div className="w-full flex h-24 items-center justify-between top-0 py-6">
      <div className="flex flex-row gap-4 text-emeraldlight items-center text-xl lg:ml-[20vw] ml-4">
        <div className="flex items-center gap-3">
          <img alt="Electisec Research" src="/assets/images/logo.svg" className="h-10" />
        </div>
      </div>
      <button
        className="px-8 py-3 rounded-xl lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div className="flex flex-row items-center gap-1 hidden lg:flex lg:mr-[20vw]">
        <a href="https://reports.electisec.com/">
          <Button text={"Reports"} />
        </a>
        <a href="https://blog.electisec.com/">
          <Button text={"Blog"} />
        </a>
        <a href="/fellowships">
          <Button text={"Fellowships"} />
        </a>
        <a href="/services">
          <Button text={"Services"} />
        </a>
        <a href="/team">
          <Button text={"Team"} />
        </a>
        <a href="/contact-us">
          <button className="px-8 py-3 rounded-xl text-md text-darkgreen font-bold bg-emeraldlight-25 hover-bg-emeraldlight-5 hover-text-emeraldlight duration-700">
            Contact
          </button>
        </a>
      </div>
    </div>
  );
}

interface MobileNavbarProps {
  setMenuOpen: (open: boolean) => void;
}

export function MobileNavbar({ setMenuOpen }: MobileNavbarProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, setMenuOpen]);

  return (
    <div className="w-full h-full z-40 duration-700" ref={inputRef}>
      <div className="pt-8 mx-auto flex flex-col p-8 gap-2">
        <div className="flex justify-center pt-12 pb-8">
          <button
            onClick={() => setMenuOpen(false)}
            className="w-12 h-12 rounded-full border-2 border-green-400 flex items-center justify-center text-green-400 hover:bg-green-400 hover:text-white transition-colors duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <a href="https://reports.electisec.com/">
          <button className="p-6 rounded-xl w-full text-xl text-zinc-400 hover-text-emeraldlight hover-bg-darkgreen-5 duration-700">
            Reports
          </button>
        </a>
        <a href="https://blog.electisec.com/">
          <button className="p-6 rounded-xl w-full text-xl text-zinc-400 hover-text-emeraldlight hover-bg-darkgreen-5 duration-700">
            Blog
          </button>
        </a>

        <a href="/fellowships">
          <button
            onClick={() => setMenuOpen(false)}
            className="p-6 rounded-xl w-full text-xl text-zinc-400 hover-text-emeraldlight hover-bg-darkgreen-5 duration-700"
          >
            Fellowships
          </button>
        </a>
        <a href="/services">
          <button
            onClick={() => setMenuOpen(false)}
            className="p-6 rounded-xl w-full text-xl text-zinc-400 hover-text-emeraldlight hover-bg-white-5 duration-700"
          >
            Services
          </button>
        </a>
        <a href="/team">
          <button
            onClick={() => setMenuOpen(false)}
            className="p-6 rounded-xl w-full text-xl text-zinc-400 hover-text-emeraldlight hover-bg-white-5 duration-700"
          >
            Team
          </button>
        </a>

        <a href="/contact-us">
          <button
            onClick={() => setMenuOpen(false)}
            className="p-6 rounded-xl w-full text-xl text-emeraldlight font-bold hover-bg-darkgreen-5 duration-700"
          >
            Contact
          </button>
        </a>
      </div>
    </div>
  );
}