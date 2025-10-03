// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css"; // Ensure this is present
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Hybrid Climate Trend Analyzer - NASA",
  description: "Plan smarter with NASA's climate data by analyzing historical patterns, statistical trends, and ML projections.",
};

const NASA_GRADIENT_CLASSES = "bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen antialiased">

        {/* Header/Navigation */}
        <header className={`${NASA_GRADIENT_CLASSES} text-white shadow-lg sticky top-0 z-10`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">🚀</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">NASA Climate Analyzer</h1>
                  <p className="text-blue-100 text-sm">Powered by Earth Science Data</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/insights">Insights</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/help">Help</NavLink>
              </nav>

              {/* Mobile Menu Icon (Placeholder) */}
              <button className="md:hidden text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-0 md:p-0">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-6 text-center">
            <p className="mb-2">Built for NASA Space Apps Challenge 2025</p>
            <p className="text-gray-400 text-sm">Data sources: NASA Earth Science Division, NOAA Climate Data</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link
    href={href}
    className="nav-btn hover:text-blue-200 transition-colors font-medium"
  >
    {children}
  </Link>
);