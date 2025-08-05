// app/_actions/dentist.ts
"use server";

import { db } from "@/db";
import { getRequesterLocation } from "@/lib/getLocation";

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance (km) */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export async function fetchNearbyDentists(radiusKm = 20) {
  const loc = await getRequesterLocation();
  if (!loc) return [];

  // 1° latitude  ≈ 110.574 km
  const latDelta = radiusKm / 110.574;

  // 1° longitude ≈ 111.320 km · cos(latitude)
  const lonDelta =
    radiusKm / (111.32 * Math.cos((loc.lat * Math.PI) / 180));

  // 1. grab everything in the bounding box
  const candidates = await db.dentist.findMany({
    where: {
      latitude: { 
        gte: loc.lat - latDelta, 
        lte: loc.lat + latDelta,
        not: null
      },
      longitude: { 
        gte: loc.lon - lonDelta, 
        lte: loc.lon + lonDelta,
        not: null
      },
      status: 'verified',
    },
    select: { 
      id: true, 
      name: true, 
      latitude: true, 
      longitude: true,
      rating: true,
      totalReviews: true,
      image: true,
      speciality: true,
      verified: true,
      freeConsultation: true,
      isAvailable: true,
      hasVideoCall: true,
      priceStart: true,
      currency: true,
      slug: true,
    },
  });

  // 2. exact distance + final filter/sort
  return candidates
    .map((d) => ({
      ...d,
      distance: haversine(loc.lat, loc.lon, d.latitude!, d.longitude!),
    }))
    .filter((d) => d.distance < radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 50);
}
