import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  // Provide a default empty object if searchParams is undefined to prevent TypeError
  const params = searchParams || {};

  // Helper function to safely extract a search parameter, handling string[] and undefined
  const getParam = (key: string): string => {
    const value = params[key];
    if (Array.isArray(value)) {
      return value[0] || ''; // Take the first value if it's an array
    }
    return value || ''; // Return value or empty string if undefined
  };

  // Extract search parameters using the safe helper
  const city = getParam('city');
  const treatment = getParam('treatment');
  const search = getParam('search');
  const name = getParam('name');
  const location = getParam('location');
  const specialization = getParam('specialization');

  // Special handling for 'nearby' boolean flag
  const nearby =
    params.nearby === 'true' ||
    (Array.isArray(params.nearby) && params.nearby[0] === 'true');

  // Build title based on search parameters
  let title = 'Search Dentists & Clinics | NextDentist';
  let description =
    'Find and book appointments with top-rated dentists and dental clinics near you.';

  if (search) {
    if (
      search.toLowerCase().includes('near me') ||
      search.toLowerCase().includes('nearby')
    ) {
      title = 'Find Dentists Near You | NextDentist';
      description =
        'Search and book appointments with top-rated dentists near your location using our advanced search filters.';
    } else {
      title = `Search for "${search}" | NextDentist`;
      description = `Use our advanced search to find "${search}" across treatments, specialties, locations, and dentist names.`;
    }
  } else if (city && treatment) {
    title = `Find ${treatment} in ${city} | NextDentist`;
    description = `Search and book appointments with ${treatment} specialists in ${city} using our advanced filters.`;
  } else if (city) {
    title = `Find Dentists in ${city} | NextDentist`;
    description = `Search and book appointments with top-rated dentists in ${city} using our advanced search filters.`;
  } else if (treatment) {
    title = `Find ${treatment} Specialists | NextDentist`;
    description = `Search and book appointments with ${treatment} specialists using our advanced search filters.`;
  } else if (specialization) {
    title = `Find ${specialization} Specialists | NextDentist`;
    description = `Search and book appointments with ${specialization} specialists using our advanced search filters.`;
  } else if (name) {
    title = `Search for Dr. ${name} | NextDentist`;
    description = `Find and book appointments with dentists named "${name}" using our advanced search.`;
  } else if (location) {
    title = `Find Dentists near ${location} | NextDentist`;
    description = `Search and book appointments with top-rated dentists in or near ${location}.`;
  }

  // Add nearby search info to description
  if (nearby && !city) {
    description += ' Results will be sorted by distance from your location.';
  }

  return {
    title,
    description,
    keywords: [
      'find dentist',
      'search dental clinic',
      'book dentist appointment',
      'dentist near me',
      'dental services search',
      'online dental booking',
      'dental appointments',
      'advanced dentist search',
      'filter dentists',
      city && `dentists in ${city}`,
      treatment && `${treatment} specialists`,
      specialization && `${specialization} specialists`,
    ].filter(Boolean), // filter(Boolean) removes empty strings and false values
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * SearchNavLayout component provides the overall structure for the initial search/filter page.
 * It wraps the page content, ensuring consistent padding and a responsive container.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 * @returns {JSX.Element} The layout for the search navigation page.
 */
export default function SearchNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
