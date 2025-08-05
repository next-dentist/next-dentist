'use client';

import { siteConfig } from '@/config';
import { ArrowRight, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ReusableCombobox } from './ReUsableCombo';
import { Button } from './ui/button';

const SearchForm = () => {
  const [location, setLocation] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize location from URL parameters if available
  useEffect(() => {
    if (searchParams) {
      const cityParam = searchParams.get('city');
      if (cityParam) {
        setLocation(cityParam);
      }
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (location) {
      // Navigate to search with city filter, disable nearby search when city is selected
      router.push(`/search?city=${location}&nearby=false`);
    } else {
      // If no city selected, default to nearby search
      router.push('/search?nearby=true');
    }
  };

  const handleAdvancedSearch = () => {
    // Navigate to search page with current location if selected
    if (location) {
      router.push(`/search?city=${location}&nearby=false`);
    } else {
      router.push('/search?nearby=true');
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-md p-4">
      <ReusableCombobox
        options={siteConfig.cities.map(city => ({
          id: city.id.toString(),
          value: city.value,
          label: city.name,
        }))}
        value={location}
        onChange={value => setLocation(value)}
        placeholder="Select city or leave empty for nearby search"
        className="w-full p-6"
      />
      <Button
        type="submit"
        className="w-full cursor-pointer p-6"
        onClick={handleSearch}
      >
        {location ? `Search in ${location}` : 'Find Nearby Dentists'}
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        className="bg-tertiary text-primary-foreground hover:bg-tertiary/90 w-full cursor-pointer p-6"
        variant="outline"
        onClick={handleAdvancedSearch}
      >
        Try Advanced Search
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchForm;
