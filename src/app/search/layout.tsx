import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Search Results | NextDentist',
  description:
    'Browse and book appointments with top-rated dentists and dental clinics. Filter by location, specialty, services, and availability to find your perfect match.',
  keywords: [
    'dentist search results',
    'find dental clinic',
    'book dentist online',
    'dentist near me',
    'dental services search',
    'online dental booking',
    'best dentists',
    'dental appointments',
  ],
};

/**
 * SearchLayout component provides the overall structure for the search results page.
 * It wraps the page content, ensuring consistent padding and a responsive container.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 * @returns {JSX.Element} The layout for the search page.
 */
export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/*
        Consider adding a global header/navbar component here if it's consistent across all pages.
        For now, we'll assume the main content handles its own specific header/filters.
      */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      {/*
        Consider adding a global footer component here if it's consistent across all pages.
      */}
    </div>
  );
}
