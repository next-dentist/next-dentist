'use client';

import Drawer from '@/components/Drawer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';

import { fetchFilteredMeta } from '@/app/actions/fetchFilteredMeta';
import { useAdminTreatmentsManage } from '@/hooks/useAdminTreatmentsManage';
import { useTreatments } from '@/hooks/useMetaFetch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import TreatmentEditFormById from './TreatmentEditFrombyId';

// Define Treatment type based on expected data from API/Query
interface Treatment {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  price?: string | number | null;
  currency?: string | null;
  minPrice?: string | number | null;
  maxPrice?: string | number | null;
  duration?: string | null;
  dentistId?: string | null;
  createdAt?: Date | null;
  slug?: string | null;
}

// --- Function to fetch treatments for a specific dentist ---
const fetchDentistTreatments = async (
  dentistId: string
): Promise<Treatment[]> => {
  try {
    // Use the specific treatments endpoint instead of dentist endpoint
    const response = await axios.get(
      `/api/admin/dentists/${dentistId}/treatments`
    );

    // Return treatments array or empty array if missing
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching treatments:', error);
    throw error;
  }
};

interface AdminTreatmentAddFormProps {
  dentistId: string;
}

const AdminTreatmentAddForm: React.FC<AdminTreatmentAddFormProps> = ({
  dentistId,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(
    null
  );
  const [filteredTemplates, setFilteredTemplates] = useState<Treatment[]>([]);

  const { deleteTreatment, isDeletingTreatment } = useAdminTreatmentsManage();
  // Renamed to avoid variable name conflict
  const { data: treatmentTemplates, isLoading: isLoadingTemplates } =
    useTreatments();

  // --- Use React Query to fetch and manage dentist-specific treatments ---
  const {
    data: dentistTreatments = [],
    isLoading: isLoadingDentistTreatments,
    error: treatmentsError,
    refetch: refetchTreatments,
  } = useQuery<Treatment[]>({
    queryKey: ['dentistTreatments', dentistId],
    queryFn: () => fetchDentistTreatments(dentistId),
    enabled: !!dentistId,
  });

  // Function to fetch filtered templates
  const fetchAndUpdateFilteredTemplates = async () => {
    const filteredTemplates = await fetchFilteredMeta(dentistId);
    setFilteredTemplates(filteredTemplates as Treatment[]);
  };

  // --- Handle Treatment Deletion ---
  const handleDelete = (treatmentId: string) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      deleteTreatment(
        { dentistId, treatmentId },
        {
          onSuccess: () => {
            refetchTreatments();
            fetchAndUpdateFilteredTemplates(); // Refetch filtered templates after deletion
          },
        }
      );
    }
  };

  useEffect(() => {
    fetchAndUpdateFilteredTemplates();
  }, [dentistId, refetchTreatments]);

  // --- Handle Edit Treatment ---
  const handleEdit = (treatmentId: string) => {
    setSelectedTreatmentId(treatmentId);
    setIsEditDialogOpen(true);
  };

  // --- Handle Success ---
  const handleSuccess = () => {
    refetchTreatments();
    fetchAndUpdateFilteredTemplates(); // Refetch filtered templates after edit/add
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedTreatmentId(null);
  };

  // Show loading spinner while templates are loading
  if (isLoadingTemplates) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage Treatments</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
            Add From Template
          </Button>
        </div>
      </div>

      {/* --- Add Treatment Dialog --- */}
      <Drawer
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add Treatment"
        side="right"
        width="w-[700px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Select a treatment template to add to this dentist.
          </p>
          <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
            {filteredTemplates && filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
                  onClick={() => {
                    setSelectedTreatmentId(template.id);
                    setIsAddDialogOpen(false);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="truncate text-sm text-gray-500">
                    {template.description || 'No description available'}
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-500">
                No treatment templates available.
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>

      {/* --- Edit Treatment Drawer --- */}
      <Drawer
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title={
          dentistTreatments.some(t => t.id === selectedTreatmentId)
            ? 'Edit Treatment'
            : 'Add Treatment'
        }
        side="right"
        width="w-[600px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {dentistTreatments.some(t => t.id === selectedTreatmentId)
              ? 'Modify the treatment details and click update.'
              : 'Add this treatment to the dentist.'}
          </p>
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {selectedTreatmentId && (
              <TreatmentEditFormById
                treatmentId={selectedTreatmentId}
                dentistId={dentistId}
                isMetaTemplate={
                  !dentistTreatments.some(t => t.id === selectedTreatmentId)
                }
                onSuccess={handleSuccess}
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>

      {/* --- Display Treatments --- */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-md mb-4 border-b pb-2 font-semibold">
          Current Treatments ({dentistTreatments.length})
        </h2>
        {isLoadingDentistTreatments ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2">Loading treatments...</span>
          </div>
        ) : treatmentsError ? (
          <p className="text-red-600">Failed to load treatments.</p>
        ) : dentistTreatments.length > 0 ? (
          <ul className="space-y-3">
            {dentistTreatments.map(treatment => (
              <li
                key={treatment.id}
                className="flex items-start justify-between gap-4 rounded border p-3"
              >
                <div className="flex-grow">
                  {treatment.image && (
                    <div className="mt-2">
                      <Image
                        src={treatment.image}
                        alt={treatment.name}
                        className="h-16 w-16 rounded-full border object-cover"
                        loading="lazy"
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                  <h3 className="text-base font-semibold">{treatment.name}</h3>

                  <div className="mt-2 space-x-4 text-sm text-gray-800">
                    {treatment.price && (
                      <span>
                        <strong>Price:</strong> {treatment.currency || '₹'}
                        {treatment.price}
                      </span>
                    )}
                    {treatment.duration && (
                      <span>
                        <strong>Duration:</strong> {treatment.duration}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-shrink-0">
                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(treatment.id)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Edit treatment"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(treatment.id)}
                    disabled={isDeletingTreatment}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete treatment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No treatments added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminTreatmentAddForm;
