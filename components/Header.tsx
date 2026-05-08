"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import Logo from "./Logo";
import MenuDrawer from "./MenuDrawer";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ease-editorial ${
          scrolled
            ? "bg-cream/95 backdrop-blur-md py-4 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Logo variant={scrolled ? "dark" : "light"} />

          <div className="flex items-center gap-3 md:gap-6">
            <button
              aria-label="Search"
              className={`p-2 transition-colors ${
                scrolled ? "text-ink hover:text-oxblood" : "text-white hover:text-white/70"
              }`}
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link
              href="/contact"
              className={`hidden md:inline-flex items-center px-6 py-3 border text-xs tracking-[0.25em] uppercase font-light transition-all duration-400 ease-editorial ${
                scrolled
                  ? "border-ink text-ink hover:bg-oxblood hover:border-oxblood hover:text-white"
                  : "border-white/80 text-white hover:bg-white hover:text-oxblood"
              }`}
            >
              Contact
            </Link>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`p-2 transition-colors ${
                scrolled ? "text-ink hover:text-oxblood" : "text-white hover:text-white/70"
              }`}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MenuDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
