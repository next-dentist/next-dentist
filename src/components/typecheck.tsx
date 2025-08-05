import { Treatments } from '@prisma/client';

export const typecheck = (data: Treatments) => {
  const createData: Treatments = {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.image,
    price: data.price ?? null,
    currency: data.currency,
    minPrice: data.minPrice ?? null,
    maxPrice: data.maxPrice ?? null,
    duration: data.duration ?? null,
    dentistId: data.dentistId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    TreatmentMetaId: data.TreatmentMetaId,
  };

  return createData;
};
