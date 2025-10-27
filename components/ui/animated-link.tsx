"use client";

import Link from "next/link";
import React from "react";

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedLink({
  href,
  children,
  className = "",
}: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      className={`relative inline-block text-[#C69C4D] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C69C4D] after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 ${className}`}
    >
      {children}
    </Link>
  );
}
