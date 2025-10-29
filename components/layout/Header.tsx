"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface HeaderProps {
  logoUrl?: string;
  logoText?: string;
  navLinks?: NavLink[];
  ctaText?: string;
  ctaLink?: string;
  transparentThreshold?: number;
}

export default function Header({
  logoUrl = "/image/logo/logo-new.svg",
  logoText = "ULAMAN",
  navLinks = [
    { label: "Villas", href: "/rooms" },
    { label: "Spa", href: "https://riversidespabyulaman.com" },
    { label: "Dine", href: "https://earthbyulaman.com" },
    { label: "Retreats", href: "/retreats" },
  ],
  ctaText = "Stay With Us",
  ctaLink = "/reservations",
  transparentThreshold = 100,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // SCROLL-TRIGGERED BACKGROUND CHANGE LOGIC:
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > transparentThreshold);
    };

    // Throttle scroll event for performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", scrollListener);
  }, [transparentThreshold]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-[#EFEBE2] shadow-md py-4" : "bg-transparent py-6"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LOGO - Left Side */}
          <Link href="/" className="flex items-center space-x-2 z-50">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt={logoText}
                width={40}
                height={40}
                className={`transition-all duration-300 ${
                  isScrolled ? "h-16 w-14" : "h-[68px] w-[62px]"
                }`}
              />
            )}
            <span
              className={`text-xl sm:text-2xl font-serif tracking-wider transition-colors duration-300 ${
                isScrolled ? "text-black" : "text-white"
              }`}
            ></span>
          </Link>

          {/* DESKTOP NAVIGATION - Center/Right */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`text-[15px] tracking-widest font-light transition-colors duration-300 hover:opacity-70 ${
                  isScrolled ? "text-[#C69C4D]" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA BUTTON - Right Side */}
          <div className="hidden lg:flex items-center">
            <Link
              href={ctaLink}
              className={`px-6 py-2.5 border rounded-tl-lg rounded-br-lg transition-all duration-300 text-xs tracking-widest uppercase font-medium ${
                isScrolled
                  ? "border-[#C69C4D] text-[#C69C4D]"
                  : "border-white text-white hover:bg-white"
              }`}
            >
              {ctaText}
            </Link>
          </div>

          {/* MOBILE MENU BUTTON - Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden z-50 flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              } ${isScrolled && !isMobileMenuOpen ? "bg-black" : "bg-white"}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              } ${isScrolled && !isMobileMenuOpen ? "bg-black" : "bg-white"}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              } ${isScrolled && !isMobileMenuOpen ? "bg-black" : "bg-white"}`}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU - Full Screen Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={`text-2xl sm:text-3xl text-white tracking-widest uppercase font-light transition-all duration-300 hover:opacity-70 ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href={ctaLink}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`mt-8 px-8 py-3 border border-white text-white text-sm tracking-widest uppercase font-medium hover:bg-white hover:text-black transition-all duration-300 ${
              isMobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{
              transitionDelay: isMobileMenuOpen
                ? `${navLinks.length * 50}ms`
                : "0ms",
            }}
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </header>
  );
}
