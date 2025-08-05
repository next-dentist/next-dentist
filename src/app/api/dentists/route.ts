import { db } from "@/db";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Centralized API security check
async function checkApiAccess() {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const apiKey = headersList.get("x-api-key");

  const isValidOrigin =
    referer && new URL(referer).origin === process.env.NEXT_PUBLIC_APP_URL;
  const hasValidApiKey = apiKey === process.env.API_SECRET_KEY;

  return isValidOrigin || hasValidApiKey;
}

// Get user location from cookies
async function getUserLocation() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("geo")?.value;
  
  if (!raw) return null;

  try {
    const parsed = z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
      ts: z.number()
    }).safeParse(JSON.parse(raw));

    // Check if location is fresh (within 24 hours)
    if (!parsed.success || (Date.now() - parsed.data.ts) > 86_400_000) {
      return null;
    }
    
    return { lat: parsed.data.lat, lon: parsed.data.lon };
  } catch {
    return null;
  }
}

// Check if search term is likely a treatment
function isTreatmentSearch(searchTerm: string): boolean {
  const treatmentKeywords = [
    'surgery', 'implant', 'crown', 'bridge', 'filling', 'cleaning', 'whitening',
    'orthodontics', 'braces', 'extraction', 'root canal', 'endodontics',
    'periodontics', 'prosthodontics', 'oral surgery', 'cosmetic dentistry',
    'pediatric dentistry', 'dentures', 'veneers', 'scaling', 'polishing',
    'wisdom tooth', 'tooth removal', 'dental implant', 'teeth cleaning',
    'teeth whitening', 'gum treatment', 'cavity filling', 'dental crown'
  ];
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return treatmentKeywords.some(keyword => 
    lowerSearchTerm.includes(keyword) || keyword.includes(lowerSearchTerm)
  );
}

// For GET and other methods that don't need params
export async function GET(request: NextRequest) {
  // Check API access
  if (!(await checkApiAccess())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "12");
  const city = url.searchParams.get("city") || undefined;
  const treatment = url.searchParams.get("treatment") || undefined;
  const specialization = url.searchParams.get("specialization") || undefined;
  const name = url.searchParams.get("name") || undefined;
  const location = url.searchParams.get("location") || undefined;
  const search = url.searchParams.get("search") || undefined; // General search parameter
  const nearby = url.searchParams.get("nearby") === "true";
  
  // Get coordinates from URL params or cookies
  let lat = url.searchParams.get("lat") ? parseFloat(url.searchParams.get("lat")!) : undefined;
  let lon = url.searchParams.get("lon") ? parseFloat(url.searchParams.get("lon")!) : undefined;
  
  // If nearby search is enabled but no coordinates in URL, try to get from cookies
  if (nearby && (lat === undefined || lon === undefined)) {
    const userLocation = await getUserLocation();
    if (userLocation) {
      lat = userLocation.lat;
      lon = userLocation.lon;
    }
  }

  const skip = (page - 1) * limit;

  try {
    // Build where clause based on filters
    const whereClause: any = {
      status: "verified", // Only verified dentists
    };

    // General search filter - searches across multiple fields
    if (search) {
      const searchTerm = search.toLowerCase();
      
      // Check if search term indicates nearby search
      const nearbyTerms = ['near me', 'nearby', 'close to me', 'dentist near me'];
      const isNearbySearch = nearbyTerms.some(term => searchTerm.includes(term));
      
      // Check if search term is likely a treatment
      const isTreatmentRelated = isTreatmentSearch(search);
      
      if (isNearbySearch) {
        // Handle "near me" type searches - ensure coordinates are available for distance sorting
        if (lat !== undefined && lon !== undefined) {
          whereClause.latitude = { not: null };
          whereClause.longitude = { not: null };
        }
      } else {
        // Comprehensive search across multiple fields
        const searchConditions = [
          // Search in dentist name
          { name: { contains: search } },
          // Search in practice location/address
          { address: { contains: search } },
          { city: { contains: search } },
          { practiceLocation: { contains: search } },
          // Search in specializations
          {
            specializations: {
              some: {
                OR: [
                  { name: { contains: search } },
                  { key: { contains: search } },
                ],
              },
            },
          },
          // Search in bio fields
          { shortBio: { contains: search } },
          { longBio: { contains: search } },
          // Search in specialty
          { speciality: { contains: search } },
          // Search in languages
          {
            languages: {
              some: {
                name: { contains: search },
              },
            },
          },
          // Enhanced treatment search - prioritize exact and partial matches
          {
            treatments: {
              some: {
                OR: [
                  { name: { contains: search } },
                  { description: { contains: search } },
                  // Add slug search for better matching
                  { slug: { contains: search.replace(/\s+/g, '-') } },
                ],
              },
            },
          },
        ];

        whereClause.OR = searchConditions;

        // For treatment-related searches, ensure we have dentists with coordinates for nearby sorting
        if (isTreatmentRelated && (nearby || lat !== undefined && lon !== undefined)) {
          whereClause.latitude = { not: null };
          whereClause.longitude = { not: null };
        }
      }
    }

    // Specific filters (only apply if general search is not used or in combination)
    
    // City filter
    if (city && !search) {
      whereClause.city = { 
        contains: city
      };
    }

    // Name search filter
    if (name && !search) {
      whereClause.name = {
        contains: name
      };
    }

    // Location search filter (searches in address, city, area)
    if (location && !search) {
      whereClause.OR = [
        { address: { contains: location } },
        { city: { contains: location } },
        { practiceLocation: { contains: location } },
      ];
    }

    // Treatment search
    if (treatment && !search) {
      whereClause.treatments = {
        some: {
          OR: [
            { name: { contains: treatment } },
            { description: { contains: treatment } },
            { slug: { contains: treatment.replace(/\s+/g, '-') } },
          ],
        },
      };
    }

    // Specialization filter
    if (specialization && !search) {
      whereClause.specializations = {
        some: {
          key: specialization,
        },
      };
    }

    // For nearby search, only include dentists with coordinates when coordinates are available
    if (nearby && lat !== undefined && lon !== undefined && !search?.toLowerCase().includes('near me')) {
      whereClause.latitude = { not: null };
      whereClause.longitude = { not: null };
    }

    // Determine the ordering
    let orderBy: any = [
      { rating: "desc" },
      { totalReviews: "desc" },
      { createdAt: "desc" }
    ];

    // Fetch dentists with all related data
    const dentists = await db.dentist.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      include: {
        images: {
          select: {
            url: true,
            alt: true,
          }
        },
        treatments: {
          select: {
            id: true,
            name: true,
            price: true,
            minPrice: true,
            maxPrice: true,
            currency: true,
            slug: true,
            description: true,
          }
        },
        specializations: {
          select: {
            name: true,
            key: true,
          }
        },
        Reviews: {
          where: { status: 'APPROVED' },
          select: {
            rating: true,
          }
        },
        languages: {
          select: {
            name: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isOnline: true,
            lastSeen: true,
          },
        },
      },
      orderBy: orderBy,
    });

    // Handle distance sorting for nearby search, "near me" searches, or treatment searches with location
    const shouldCalculateDistance = 
      (nearby && lat !== undefined && lon !== undefined) || 
      (search?.toLowerCase().includes('near me') && lat !== undefined && lon !== undefined) ||
      (search && isTreatmentSearch(search) && lat !== undefined && lon !== undefined);

    if (shouldCalculateDistance) {
      // Calculate distance for each dentist and sort manually
      dentists.forEach((dentist: any) => {
        const dentistLat = dentist.latitude;
        const dentistLon = dentist.longitude;

        if (
          typeof dentistLat === "number" &&
          !isNaN(dentistLat) &&
          typeof dentistLon === "number" &&
          !isNaN(dentistLon)
        ) {
          dentist.distance = calculateDistance(
            lat!,
            lon!,
            dentistLat,
            dentistLon
          );
          dentist.distanceText = `${dentist.distance.toFixed(1)} km away`;
        } else {
          dentist.distance = null;
          dentist.distanceText = null;
        }

        // Add treatment relevance score for treatment searches
        if (search && isTreatmentSearch(search)) {
          dentist.treatmentRelevance = calculateTreatmentRelevance(dentist.treatments, search);
        }
      });

      // Sort by distance first, then by treatment relevance for treatment searches
      dentists.sort((a: any, b: any) => {
        const aHasDistance = a.distance !== null;
        const bHasDistance = b.distance !== null;

        // Prioritize dentists with distance information
        if (aHasDistance && !bHasDistance) return -1;
        if (!aHasDistance && bHasDistance) return 1;
        if (!aHasDistance && !bHasDistance) {
          // If no distance info, sort by treatment relevance for treatment searches
          if (search && isTreatmentSearch(search)) {
            return (b.treatmentRelevance || 0) - (a.treatmentRelevance || 0);
          }
          return 0;
        }

        // Both have distance - sort by distance, then by treatment relevance
        const distanceDiff = a.distance - b.distance;
        if (Math.abs(distanceDiff) < 0.5 && search && isTreatmentSearch(search)) {
          // If distances are very close (within 500m), prioritize by treatment relevance
          return (b.treatmentRelevance || 0) - (a.treatmentRelevance || 0);
        }
        
        return distanceDiff;
      });
    } else if (search && isTreatmentSearch(search)) {
      // For treatment searches without location, sort by treatment relevance
      dentists.forEach((dentist: any) => {
        dentist.treatmentRelevance = calculateTreatmentRelevance(dentist.treatments, search);
      });
      
      dentists.sort((a: any, b: any) => {
        return (b.treatmentRelevance || 0) - (a.treatmentRelevance || 0);
      });
    }

    // Ensure each dentist has required fields
    const processedDentists = dentists.map((dentist: any) => {
      // Calculate average rating if reviews exist
      const approvedReviews = dentist.Reviews || [];
      const avgRating = approvedReviews.length > 0 
        ? approvedReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / approvedReviews.length
        : dentist.rating || 0;

      return {
        ...dentist,
        calculatedRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviewCount: approvedReviews.length,
        userId: dentist.userId, // Include userId for messaging functionality
        // Remove the Reviews array from response to reduce payload
        Reviews: undefined,
        // Remove relevance scores from final response (used only for sorting)
        treatmentRelevance: undefined,
      };
    });

    const totalCount = await db.dentist.count({
      where: whereClause,
    });

    return NextResponse.json({
      dentists: processedDentists,
      pagination: {
        total: totalCount,
        page,
        limit,
        hasMore: skip + limit < totalCount,
      },
      filters: {
        city,
        treatment,
        specialization,
        name,
        location,
        search, // Include search parameter in response
        nearby,
        coordinates: lat && lon ? { lat, lon } : null,
      }
    });
  } catch (error) {
    console.error("Error fetching dentists:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dentists",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate treatment relevance score
function calculateTreatmentRelevance(treatments: any[], searchTerm: string): number {
  if (!treatments || treatments.length === 0) return 0;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  let score = 0;
  
  treatments.forEach(treatment => {
    const treatmentName = (treatment.name || '').toLowerCase();
    const treatmentDesc = (treatment.description || '').toLowerCase();
    const treatmentSlug = (treatment.slug || '').toLowerCase();
    
    // Exact name match gets highest score
    if (treatmentName === lowerSearchTerm) {
      score += 100;
    }
    // Partial name match
    else if (treatmentName.includes(lowerSearchTerm)) {
      score += 50;
    }
    // Description match
    else if (treatmentDesc.includes(lowerSearchTerm)) {
      score += 25;
    }
    // Slug match
    else if (treatmentSlug.includes(lowerSearchTerm.replace(/\s+/g, '-'))) {
      score += 30;
    }
  });
  
  return score;
}

// Helper function to calculate distance using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Rest of the file remains unchanged
