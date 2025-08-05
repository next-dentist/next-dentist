import { siteConfig } from '@/config';
import type { SearchSuggestion } from '../types';

export const mockLocations: SearchSuggestion[] = siteConfig.cities.map(
  (city, index) => ({
    id: city.id.toString(),
    type: 'location',
    title: city.name,
    subtitle: 'City',
    description: `${Math.floor(Math.random() * 50) + 10} dentists available`,
    iconType: 'location',
    popularity: Math.floor(Math.random() * 100) + 30,
    searchCount: Math.floor(Math.random() * 500) + 50,
  })
);

export const mockSpecializations: SearchSuggestion[] = [
  {
    id: 'ortho',
    type: 'specialization',
    title: 'Orthodontics',
    subtitle: 'Specialty',
    description: 'Braces, aligners, and teeth straightening',
    iconType: 'specialization',
    popularity: 92,
    searchCount: 3200,
    badge: 'Most Searched',
  },
  {
    id: 'oral-surgery',
    type: 'specialization',
    title: 'Oral Surgery',
    subtitle: 'Specialty',
    description: 'Surgical procedures and extractions',
    iconType: 'specialization',
    popularity: 85,
    searchCount: 2100,
  },
  {
    id: 'cosmetic',
    type: 'specialization',
    title: 'Cosmetic Dentistry',
    subtitle: 'Specialty',
    description: 'Veneers, whitening, and smile makeovers',
    iconType: 'smart',
    popularity: 88,
    searchCount: 2800,
    badge: 'Trending',
  },
  {
    id: 'pediatric',
    type: 'specialization',
    title: 'Pediatric Dentistry',
    subtitle: 'Specialty',
    description: 'Dental care for children and teens',
    iconType: 'specialization',
    popularity: 78,
    searchCount: 1400,
  },
];

export const generateSmartSuggestions = (query: string): SearchSuggestion[] => {
  const smartSuggestions: SearchSuggestion[] = [];
  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes('emergency') ||
    lowerQuery.includes('urgent') ||
    lowerQuery.includes('pain')
  ) {
    smartSuggestions.push({
      id: 'emergency-1',
      type: 'smart',
      title: 'Emergency Dental Care',
      subtitle: 'Urgent Care',
      description: '24/7 emergency dentists near you',
      iconType: 'smart',
      badge: 'Emergency',
      popularity: 100,
    });
  }

  if (
    lowerQuery.includes('near') ||
    lowerQuery.includes('nearby') ||
    lowerQuery.includes('close')
  ) {
    smartSuggestions.push({
      id: 'nearby-1',
      type: 'smart',
      title: 'Dentists Near Me',
      subtitle: 'Location-based',
      description: 'Find the closest dental practices',
      iconType: 'location',
      badge: 'Smart',
      popularity: 95,
    });
  }

  if (
    lowerQuery.includes('insurance') ||
    lowerQuery.includes('affordable') ||
    lowerQuery.includes('cheap')
  ) {
    smartSuggestions.push({
      id: 'insurance-1',
      type: 'smart',
      title: 'Insurance-Friendly Dentists',
      subtitle: 'Budget-friendly',
      description: 'Dentists accepting major insurance plans',
      iconType: 'smart',
      badge: 'Budget',
      popularity: 90,
    });
  }

  return smartSuggestions;
};