// src/app/layout.tsx

import type { Metadata } from "next";
// Assuming your global Tailwind styles are here
import "./globals.css";

export const metadata: Metadata = {
  title: "NASA Space Apps: Climate Trend Analyzer", // Your project title
  description: "Leveraging NASA Earth observation data for climate-adjusted outdoor planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {/* The 'dark' class can be added here if you want dark mode by default, 
        or you can rely on the system/user preference via Tailwind's config.
        We'll set a default background color for the body.
      */}
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen antialiased">
        {/* Simple Header/Navigation (Optional) */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Climate Trend Analyzer
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              NASA Space Apps 2025 Challenge
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}