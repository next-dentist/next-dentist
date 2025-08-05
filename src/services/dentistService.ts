import { Dentist } from "@prisma/client";
import { deleteData, fetchData, postData, updateData } from "./api";

// Fetch all dentists
export const fetchAllDentists = async (): Promise<Dentist[]> => {
  return fetchData<Dentist[]>("/api/dentists");
};

// Fetch a single dentist by ID
export const fetchDentistById = async (id: number): Promise<Dentist> => {
  return fetchData<Dentist>(`/api/dentists/${id}`);
};

// Fetch a single dentist by slug
export const fetchDentistBySlug = async (slug: string): Promise<Dentist> => {
  return fetchData<Dentist>(`/api/dentists/slug/${slug}`);
};

// Create a new dentist
export const createDentist = async (
  dentist: Omit<Dentist, "id">
): Promise<Dentist> => {
  return postData<Omit<Dentist, "id">, Dentist>("/api/dentists", dentist);
};

// Update an existing dentist
export const updateDentist = async (
  id: number,
  dentist: Partial<Dentist>
): Promise<Dentist> => {
  return updateData<Partial<Dentist>, Dentist>(`/api/dentists/${id}`, dentist);
};

// Delete a dentist
export const deleteDentist = async (id: number): Promise<void> => {
  return deleteData(`/api/dentists/${id}`);
};

// Search dentists by location
export const searchDentistsByLocation = async (
  location: string
): Promise<Dentist[]> => {
  return fetchData<Dentist[]>(
    `/api/dentists/search?location=${encodeURIComponent(location)}`
  );
};
