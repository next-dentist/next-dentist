// Utility to generate random SEO title and description for a dentist using their name
// Trusted Dentist in [City] | Expert Dental Care by Dr. [Dentist's Name]

const seoTitleTemplates = [
  (name: string) => `${name} | Trusted Dentist Near You`,
  (name: string) => `Book an Appointment with ${name} - Top Rated Dentist`,
  (name: string) => `${name} - Your Local Dental Expert`,
  (name: string) => `Meet ${name}: Compassionate Dental Care`,
  (name: string) => `${name} | Family & Cosmetic Dentistry`,
  (name: string) => `Smile Brighter with ${name} - Dentist`,
  (name: string) => `${name} | Gentle & Professional Dentist`,
];

const seoDescriptionTemplates = [
  (name: string) =>
    `Looking for a reliable dentist? ${name} offers comprehensive dental care, from routine checkups to advanced treatments. Book your visit today!`,
  (name: string) =>
    `Trust your smile to ${name}, providing quality dental services for all ages. Schedule an appointment and experience expert care.`,
  (name: string) =>
    `Discover why patients choose ${name} for their dental needs. Friendly, experienced, and dedicated to your oral health.`,
  (name: string) =>
    `Get personalized dental care with ${name}. Modern technology, gentle approach, and a commitment to your comfort.`,
  (name: string) =>
    `From cleanings to cosmetic dentistry, ${name} delivers outstanding results. New patients welcome!`,
  (name: string) =>
    `Experience stress-free dental visits with ${name}. Your healthy, beautiful smile starts here.`,
];

export function getRandomSeoTitle(name: string): string {
  const idx = Math.floor(Math.random() * seoTitleTemplates.length);
  return seoTitleTemplates[idx](name);
}

export function getRandomSeoDescription(name: string): string {
  const idx = Math.floor(Math.random() * seoDescriptionTemplates.length);
  return seoDescriptionTemplates[idx](name);
}
