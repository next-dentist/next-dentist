import { siteConfig } from '@/config';
import { Dentist } from '@/types';
import { JsonValue } from '@prisma/client/runtime/library';

export const generatedentistSchema = (dentist: Dentist) => {
  // Get languages from dentist.languages
  const languages = Array.isArray(dentist.languages) 
    ? dentist.languages.map(lang => ({
        "@type": "Language",
        "name": lang.name
      }))
    : [];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": dentist.name,
    "alternateName": dentist.lastName ? `${dentist.name} ${dentist.lastName}` : dentist.name,
    "jobTitle": dentist.speciality,
    "image": dentist.image,
    "description": dentist.shortBio,
    "url": `${siteConfig.url}/dentists/${dentist.slug}`,
    "sameAs": socialLinks(dentist.socialLinks),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": dentist.address,
      "addressLocality": dentist.city,
      "addressRegion": dentist.state,
      "postalCode": dentist.zipCode,
      "addressCountry": dentist.country
    },
    "email": dentist.email ? `mailto:${dentist.email}` : undefined,
    "telephone": dentist.phone,
    "birthDate": dentist.dob,
    "gender": dentist.gender,
    "nationality": dentist.nationality ? {
      "@type": "Country",
      "name": dentist.nationality
    } : undefined,
    "alumniOf": parseJsonArray(dentist.alumniOf, (alumni) => ({
      "@type": "CollegeOrUniversity",
      "name": alumni.name,
      "sameAs": alumni.website || alumni.sameAs
    })),
    "worksFor": parseJsonArray(dentist.workingAt, (work) => ({
      "@type": "Organization",
      "name": work.name,
      "url": work.website || work.sameAs,

    })),
    "knowsAbout": parseKnowsAbout(dentist.knowsAbout),
    "award": parseAwards(dentist.awards),
    "knowsLanguage": languages.length > 0 ? languages : undefined
  };
};

const socialLinks = (socialLinks: JsonValue | undefined): string[] => {
  if (!socialLinks || typeof socialLinks !== 'object' || socialLinks === null) return [];
  return Object.values(socialLinks).filter((link): link is string => typeof link === 'string');
};

// Parse knowsAbout to match the format in schema.json
const parseKnowsAbout = (knowsAbout: JsonValue | null | undefined): any[] => {
  if (!knowsAbout) return [];
  
  try {
    // Convert any knowsAbout format to the standard schema.json format
    const knowledgeItems = parseJsonArray(knowsAbout, (item) => {
      // If already in the right format, return as is
      if (typeof item === 'object' && item !== null && 
          '@type' in item && item['@type'] === 'MedicalSpecialty' &&
          'name' in item && 'url' in item) {
        return item;
      }
      
      // If it's a simple knowledge item, convert to proper format
      if (typeof item === 'object' && item !== null) {
        return {
          "@type": "MedicalSpecialty",
          "name": item.name || item.specialty || item.title || "Medical Specialty",
          "url": item.url || item.website || 
                 `https://en.wikipedia.org/wiki/${encodeURIComponent(item.name || 'Medical_specialty')}`
        };
      }
      
      // If it's a string, create a basic entry
      if (typeof item === 'string') {
        return {
          "@type": "MedicalSpecialty",
          "name": item,
          "url": `https://en.wikipedia.org/wiki/${encodeURIComponent(item)}`
        };
      }
      
      return null;
    });
    
    return knowledgeItems.filter(Boolean);
  } catch (error) {
    console.error('Error parsing knowsAbout:', error);
    return [];
  }
};

// Parse awards to match the format in schema.json
const parseAwards = (awards: JsonValue | null | undefined): string[] => {
  if (!awards) return [];
  
  try {
    // If awards is already an array
    if (Array.isArray(awards)) {
      return awards.map(award => {
        if (typeof award === 'string') return award;
        if (typeof award === 'object' && award !== null) {
          // Handle award objects with name property
          if ('name' in award && typeof award.name === 'string') {
            return award.name;
          }
          // Handle award objects with @type property (formatted schema.org objects)
          if ('@type' in award && award['@type'] === 'Award' && 'name' in award) {
            return award.name as string;
          }
        }
        return null;
      }).filter((award): award is string => award !== null);
    }
    
    // If awards is a JSON string
    if (typeof awards === 'string') {
      try {
        const parsed = JSON.parse(awards);
        return Array.isArray(parsed) ? parseAwards(parsed) : [];
      } catch {
        return [];
      }
    }
    
    // If awards is an object (could be a JSON object from Prisma)
    if (typeof awards === 'object' && awards !== null) {
      // Try to extract an array property if it exists
      const values = Object.values(awards);
      if (values.length > 0 && Array.isArray(values[0])) {
        return parseAwards(values[0]);
      }
      
      // If the object itself is meant to be treated as an array
      return Object.entries(awards)
        .filter(([key]) => !isNaN(Number(key)))
        .map(([_, value]) => {
          if (typeof value === 'string') return value;
          if (typeof value === 'object' && value !== null && 'name' in value) {
            return value.name as string;
          }
          return null;
        }).filter((award): award is string => award !== null);
    }
    
    return [];
  } catch (error) {
    console.error('Error parsing awards:', error);
    return [];
  }
};

// Helper to parse JSON arrays with safety checks
const parseJsonArray = (jsonData: JsonValue | null | undefined, mapper: (item: any) => any): any[] => {
  if (!jsonData) return [];
  
  try {
    // If jsonData is already an array
    if (Array.isArray(jsonData)) {
      return jsonData.map(mapper);
    }
    
    // If jsonData is a JSON string
    if (typeof jsonData === 'string') {
      try {
        const parsed = JSON.parse(jsonData);
        return Array.isArray(parsed) ? parsed.map(mapper) : [];
      } catch {
        return [];
      }
    }
    
    // If jsonData is an object (could be a JSON object from Prisma)
    if (typeof jsonData === 'object' && jsonData !== null) {
      // Try to extract an array property if it exists
      const values = Object.values(jsonData);
      if (values.length > 0 && Array.isArray(values[0])) {
        return values[0].map(mapper);
      }
      
      // If the object itself is meant to be treated as an array
      return Object.entries(jsonData)
        .filter(([key]) => !isNaN(Number(key)))
        .map(([_, value]) => mapper(value));
    }
    
    return [];
  } catch (error) {
    console.error('Error parsing JSON array:', error);
    return [];
  }
};
