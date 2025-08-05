import { Loader2, Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface GooglePlacesAutocompleteProps {
  apiKey?: string; // Optional if you're loading the API script elsewhere
  defaultValue?: string;
  placeholder?: string;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  className?: string;
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

// Helper to ensure the Google Maps script is only loaded once
const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-places-script';

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID
    ) as HTMLScriptElement | null;
    if (existingScript) {
      // If script is already loading, wait for it to finish
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Google Maps script'))
      );
      return;
    }

    // Otherwise, create and append the script
    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load Google Maps script'));
    document.body.appendChild(script);
  });
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  apiKey,
  defaultValue = '',
  placeholder = 'Search for a location',
  onPlaceSelect,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        err => {
          // If user denies or error, just don't set location
          setCurrentLocation(null);
        }
      );
    }
  }, []);

  // Load Google Maps API script only once
  useEffect(() => {
    let isMounted = true;

    if (window.google?.maps?.places) {
      setScriptLoaded(true);
      return;
    }

    if (!apiKey) {
      console.error(
        'Google API key is required unless Google Maps API is loaded elsewhere'
      );
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (isMounted) setScriptLoaded(true);
      })
      .catch(err => {
        console.error(err);
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  // Initialize Google Places services
  useEffect(() => {
    if (!scriptLoaded) return;

    autocompleteService.current = new google.maps.places.AutocompleteService();

    // Create a hidden map div for PlacesService (required by Google's API)
    let mapDiv = mapDivRef.current;
    if (!mapDiv) {
      mapDiv = document.createElement('div');
      mapDiv.style.display = 'none';
      document.body.appendChild(mapDiv);
      mapDivRef.current = mapDiv;
    }
    placesService.current = new google.maps.places.PlacesService(mapDiv);
    sessionToken.current = new google.maps.places.AutocompleteSessionToken();

    return () => {
      if (mapDivRef.current) {
        document.body.removeChild(mapDivRef.current);
        mapDivRef.current = null;
      }
    };
  }, [scriptLoaded]);

  const fetchPredictions = (input: string) => {
    if (!input || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);

    // If we have current location, use it for location biasing
    const options: google.maps.places.AutocompletionRequest = {
      input,
      sessionToken: sessionToken.current ?? undefined,
    };

    if (currentLocation) {
      options.location = new google.maps.LatLng(
        currentLocation.lat,
        currentLocation.lng
      );
      options.radius = 50000; // 50 km in meters
    }

    autocompleteService.current.getPlacePredictions(
      options,
      (predictions, status) => {
        setIsLoading(false);

        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          setPredictions([]);
          return;
        }

        setPredictions(predictions);
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      setIsOpen(true);
      fetchPredictions(value);
    } else {
      setPredictions([]);
      setIsOpen(false);
    }
  };

  const handlePlaceSelect = (placeId: string, description: string) => {
    setInputValue(description);
    setIsOpen(false);

    if (placesService.current && onPlaceSelect) {
      placesService.current.getDetails(
        {
          placeId,
          fields: [
            'address_components',
            'geometry',
            'name',
            'formatted_address',
          ],
          sessionToken: sessionToken.current ?? undefined,
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            onPlaceSelect(place);

            // Get a new session token after a selection
            sessionToken.current =
              new google.maps.places.AutocompleteSessionToken();
          }
        }
      );
    }
  };

  // Handle clicking outside to close the dropdown
  const handleClickOutside = () => {
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={!scriptLoaded}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {isLoading ? (
            <Loader2 className="text-primary h-5 w-5 animate-spin" />
          ) : (
            <Search className="text-primary h-5 w-5" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-hidden overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {predictions.length > 0 ? (
            <div className="py-1">
              {predictions.map(prediction => (
                <div
                  key={prediction.place_id}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() =>
                    handlePlaceSelect(
                      prediction.place_id,
                      prediction.description
                    )
                  }
                >
                  {prediction.description}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              {inputValue ? 'No results found' : 'Type to search for places'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;
