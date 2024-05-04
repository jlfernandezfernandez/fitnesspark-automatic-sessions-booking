import React from "react";

interface FooterProps {
  children: React.ReactNode;
}

export default function Footer({ children }: FooterProps) {
  return (
    <footer className="border-t bg-white text-gray-500 py-3 px-4">
      <nav className="flex items-center justify-between max-w-3xl mx-auto space-x-4 text-sm">
        {children}
        <span>2024</span>
      </nav>
    </footer>
  );
}
