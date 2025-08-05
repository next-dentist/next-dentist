'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface LocationData {
  lat: number;
  lon: number;
  ts: number;
}

export function LocationDebug() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkLocationCookie();
  }, []);

  const checkLocationCookie = () => {
    try {
      const cookies = document.cookie.split(';');
      const geoCookie = cookies.find(cookie =>
        cookie.trim().startsWith('geo=')
      );

      if (geoCookie) {
        const value = geoCookie.split('=')[1];
        const decoded = decodeURIComponent(value);
        const parsed = JSON.parse(decoded);
        setLocationData(parsed);
        setError(null);
      } else {
        setError('No geo cookie found');
      }
    } catch (err) {
      setError(
        'Error parsing cookie: ' +
          (err instanceof Error ? err.message : 'Unknown error')
      );
    }
  };

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const response = await fetch('/api/set-location', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                lat: coords.latitude,
                lon: coords.longitude,
                ts: Date.now(),
              }),
            });

            if (response.ok) {
              // Wait a bit for cookie to be set, then check again
              setTimeout(checkLocationCookie, 500);
            } else {
              setError('Failed to save location');
            }
          } catch (err) {
            setError(
              'Network error: ' +
                (err instanceof Error ? err.message : 'Unknown error')
            );
          }
        },
        err => {
          setError('Geolocation error: ' + err.message);
        }
      );
    } else {
      setError('Geolocation not supported by this browser');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Location Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {locationData ? (
          <div className="space-y-1 text-sm">
            <p>
              <strong>Latitude:</strong> {locationData.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {locationData.lon}
            </p>
            <p>
              <strong>Timestamp:</strong>{' '}
              {new Date(locationData.ts).toLocaleString()}
            </p>
            <p>
              <strong>Age:</strong>{' '}
              {Math.round((Date.now() - locationData.ts) / 1000 / 60)} minutes
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">No location data found</p>
        )}

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex gap-2">
          <Button onClick={requestLocation} size="sm">
            Get Location
          </Button>
          <Button onClick={checkLocationCookie} variant="outline" size="sm">
            Check Cookie
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
