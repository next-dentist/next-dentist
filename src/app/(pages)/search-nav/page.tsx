'use client';

import Filters from '@/components/Filters';
import { LocationPrompt } from '@/components/LocationPrompt';
import { SectionThree } from '@/components/SectionThree';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface GeoData {
  lat: number;
  lon: number;
}

const SearchNav: React.FC = props => {
  const router = useRouter();
  const [hasLocationAccess, setHasLocationAccess] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(true);

  // Check location access
  useEffect(() => {
    const checkLocationAccess = async () => {
      try {
        const cookies = document.cookie;
        const hasGeoCookie = cookies.includes('geo=');

        let geoData: GeoData | null = null;
        if (hasGeoCookie) {
          try {
            const geoCookieMatch = cookies.match(/geo=([^;]+)/);
            if (geoCookieMatch) {
              geoData = JSON.parse(
                decodeURIComponent(geoCookieMatch[1])
              ) as GeoData;
            }
          } catch (parseError) {
            console.error('Error parsing geo cookie:', parseError);
          }
        }

        const hasValidLocation =
          geoData &&
          typeof geoData.lat === 'number' &&
          typeof geoData.lon === 'number' &&
          geoData.lat >= -90 &&
          geoData.lat <= 90 &&
          geoData.lon >= -180 &&
          geoData.lon <= 180;

        setHasLocationAccess(!!hasValidLocation);
        setIsCheckingLocation(false);
      } catch (error) {
        console.error('Error checking location access:', error);
        setHasLocationAccess(false);
        setIsCheckingLocation(false);
      }
    };

    checkLocationAccess();
  }, []);

  // Show loading while checking location access
  if (isCheckingLocation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8f8]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-[#356574]"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show location prompt if needed (for nearby search without location)
  if (!hasLocationAccess) {
    // Check if user is trying to do a nearby search
    const urlParams = new URLSearchParams(window.location.search);
    const nearbyParam = urlParams.get('nearby');
    const hasOtherFilters =
      urlParams.get('city') ||
      urlParams.get('treatment') ||
      urlParams.get('name') ||
      urlParams.get('location') ||
      urlParams.get('search') ||
      urlParams.get('specialization');

    if (nearbyParam === 'true' && !hasOtherFilters) {
      return <LocationPrompt />;
    }
  }

  return (
    <SectionThree className="py-4">
      <div className="flex w-full flex-col gap-4">
        <Filters />
        <div className="mb-4 flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-[#356574]">Back</h1>
        </div>
      </div>
    </SectionThree>
  );
};

export default SearchNav;
