// scripts/exportDentists.ts
import { PrismaClient } from '@prisma/client';

import { writeFileSync } from 'fs';
import { join } from 'path';

const db = new PrismaClient();

(async () => {
  const dentists = await db.dentist.findMany({
    select: {
      id: true,
      slug: true,
      image: true,
      name: true,
      city: true,
      rating: true,
      speciality: true,
      totalReviews: true,
      status: true,
      practiceLocation: true,
      freeConsultation: true,
      experience: true,
      shortBio: true,
      longBio: true,
      phone: true,
      address: true,
      latitude: true,
      longitude: true,
    },
  });

  const treatments = await db.treatmentMeta.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      relatedKeys: true,
    },
  });

  const outPath = join(process.cwd(), 'public', 'searchData.json');
  writeFileSync(outPath, JSON.stringify({ dentists, treatments }));
  console.log(
    `✅  Wrote ${dentists.length} dentists and ${treatments.length} treatments to /public/searchData.json`
  );
  await db.$disconnect();
})();
