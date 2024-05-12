import React from "react";

interface FooterProps {
  children?: React.ReactNode;
  isLinked?: boolean;
}

export default function Footer({ children, isLinked }: FooterProps) {
  return (
    <footer className="border-t bg-white dark:bg-gray-800 dark:text-white dark:border-black text-gray-500 py-5 px-4">
      <nav className="flex items-center justify-between mx-auto space-x-4 text-sm">
        {children}
        {isLinked ? (
          <span className="text-green-600">🟢 Conectado con Fitness Park</span>
        ) : (
          <span className="text-red-600">🔴 Desconectado de Fitness Park</span>
        )}
        <span style={{ marginLeft: "auto" }}>2024</span>
      </nav>
    </footer>
  );
}
