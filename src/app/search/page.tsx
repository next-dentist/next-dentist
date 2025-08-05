import LoadingSpinner from '@/components/LoadingSpinner';
import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchClient from './searchClient';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  // Debug logging
  const params = await searchParams;

  // Extract search parameters
  const city = params?.city as string;
  const treatment = params?.treatment as string;
  const search = params?.search as string;
  const name = params?.name as string;
  const location = params?.location as string;
  const specialization = params?.specialization as string;
  const nearby = params?.nearby === 'true';

  // Debug individual parameters
  // Build title based on search parameters
  let title = 'Search Results | NextDentist';
  let description =
    'Browse and book appointments with top-rated dentists and dental clinics.';

  if (search) {
    if (
      search.toLowerCase().includes('near me') ||
      search.toLowerCase().includes('nearby')
    ) {
      title = 'Dentists Near You | NextDentist';
      description =
        'Find and book appointments with top-rated dentists near your location.';
    } else {
      title = `Search Results for "${search}" | NextDentist`;
      description = `Showing search results for "${search}" across treatments, specialties, locations, and dentist names.`;
    }
  } else if (city && treatment) {
    title = `${treatment} in ${city} | NextDentist`;
    description = `Find and book appointments with ${treatment} specialists in ${city}.`;
  } else if (city) {
    title = `Dentists in ${city} | NextDentist`;
    description = `Find and book appointments with top-rated dentists in ${city}.`;
  } else if (treatment) {
    title = `${treatment} Specialists | NextDentist`;
    description = `Find and book appointments with ${treatment} specialists.`;
  } else if (specialization) {
    title = `${specialization} Specialists | NextDentist`;
    description = `Find and book appointments with ${specialization} specialists.`;
  } else if (name) {
    title = `Search Results for "${name}" | NextDentist`;
    description = `Showing search results for dentists named "${name}".`;
  } else if (location) {
    title = `Dentists in ${location} | NextDentist`;
    description = `Find and book appointments with top-rated dentists in or near ${location}.`;
  }

  // Add nearby search info to description
  if (nearby && !city) {
    description += ' Results are sorted by distance from your location.';
  }

  // Debug final title

  return {
    title,
    description,
    keywords: [
      'dentist search results',
      'find dental clinic',
      'book dentist online',
      'dentist near me',
      'dental services search',
      'online dental booking',
      'best dentists',
      'dental appointments',
      city && `dentists in ${city}`,
      treatment && `${treatment} specialists`,
      specialization && `${specialization} specialists`,
    ].filter(Boolean),
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

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchClient />
    </Suspense>
  );
}
