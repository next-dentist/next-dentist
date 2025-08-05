'use server'

import { db } from '@/db';

// fetch dentist by city limit 10
export async function getDentistByCity(city: string, limit: number = 10) {
  if (!city) {
    console.log('getDentistByCity: No city provided');
    return [];
  }

  console.log(`getDentistByCity: Searching for dentists in city: "${city}"`);
  
  try {
    // Case-insensitive search using contains
    const dentist = await db.dentist.findMany({
      where: {
        city: {
          contains: city,
        },
      },
      take: limit,
    });
    
    console.log(`getDentistByCity: Found ${dentist.length} dentists in "${city}"`);
    
    // If no exact match found, log all unique cities in database for debugging
    if (dentist.length === 0) {
      const allCities = await db.dentist.findMany({
        select: {
          city: true,
        },
        distinct: ['city'],
        where: {
          city: {
            not: null
          }
        }
      });
      console.log('getDentistByCity: Available cities in database:', allCities.map(d => d.city));
    }
    
    return dentist;
  } catch (error) {
    console.error('getDentistByCity: Error fetching dentists:', error);
    return [];
  }
}
