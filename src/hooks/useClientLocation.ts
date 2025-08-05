// app/_lib/useClientLocation.ts
import { useEffect, useState } from "react";

export function useClientLocation() {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            // Use fetch to call a server action that sets the cookie
            await fetch('/api/set-location', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                lat: coords.latitude,
                lon: coords.longitude,
                ts: Date.now()
              }),
            });
            setIsLocating(false);
          } catch (err) {
            setError('Failed to save location');
            setIsLocating(false);
          }
        },
        (err) => {
          setError('Location permission denied');
          setIsLocating(false);
        },
        { timeout: 10000 }
      );
    } else {
      setError('Geolocation not supported');
    }
  }, []);

  return { isLocating, error };
}
