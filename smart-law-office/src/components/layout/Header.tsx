"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

// Nav Navigation Bar
const navItems = [
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  { name: "Why choose us", href: "/why-choose-us" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact us", href: "/contact" }
];
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <header className="fixed top-0 w-full bg-violet-50 backdrop-blur-sm shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="shrink-0">
            <h1 className="text-2xl font-heading font-bold text-black tracking-widest">
              LOGO
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8 text-black font-medium">
            {navItems.map((nav) => (
              <Link
                key={nav.name}
                href={nav.href}
                className="hover:text-violet-400 transition duration-150"
              >
                {nav.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <nav className="flex flex-col space-y-3 text-black font-medium">
              {navItems.map((nav) => (
                <Link
                  key={nav.name}
                  href={nav.href}
                  className="hover:text-violet-400 transition duration-150"
                >
                  {nav.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
