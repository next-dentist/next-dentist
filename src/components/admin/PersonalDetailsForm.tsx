'use client';

import Drawer from '@/components/Drawer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { siteConfig } from '@/config';
import {
  useAdminDentistFetch,
  useUpdateDentist,
} from '@/hooks/useAdminDentistEdit';
import { useDegrees } from '@/hooks/useDegrees';
import { zodResolver } from '@hookform/resolvers/zod';
import { Degree, Dentist } from '@prisma/client';
import { ChevronDown, ChevronUp, Info, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GooglePlacesAutocomplete from '../GooglePlacesAutoComplete';
import ReUsableComboNew, { Option } from '../ReUsableComboNew';
import { Combobox } from '../ui/combobox';

// Define the structure for a single degree object in the form
const degreeObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  fullName: z.string(),
});

// Define the form schema with Zod
const PersonalDetailsFormSchema = z.object({
  shortBio: z.string().max(400).optional(),
  longBio: z.string().optional(),
  practiceLocation: z.string().optional(),
  speciality: z.string().optional(),
  dentistDegree: z.array(degreeObjectSchema),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Infer the type for the form values
type PersonalDetailsFormValues = z.infer<typeof PersonalDetailsFormSchema>;

// Define the structure expected for the degree objects within the Dentist type
interface DentistWithParsedDegrees extends Omit<Dentist, 'dentistDegree'> {
  dentistDegree: Degree[] | null;
}

interface PersonalDetailsFormProps {
  dentistId?: string;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  dentistId,
}) => {
  const { mutate: updateDentist, isPending: isUpdating } = useUpdateDentist();
  const {
    data: degrees,
    isLoading: isLoadingDegrees,
    isError: isErrorDegrees,
    refetch: refetchDegrees,
  } = useDegrees();

  const {
    data: dentistData,
    isLoading,
    error,
    refetch,
  } = useAdminDentistFetch(dentistId || '');

  const [isOpen, setIsOpen] = useState(false);
  const [specialityOpen, setSpecialityOpen] = useState(false);
  const [isShortBioOpen, setIsShortBioOpen] = useState(false);
  const [isLongBioOpen, setIsLongBioOpen] = useState(false);

  // For Google Places Autocomplete: keep the selected place and input value
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [locationInputValue, setLocationInputValue] = useState<string>('');

  // Initialize the form
  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(PersonalDetailsFormSchema),
    defaultValues: {
      shortBio: '',
      longBio: '',
      practiceLocation: '',
      speciality: '',
      dentistDegree: [],
      latitude: undefined,
      longitude: undefined,
    },
  });

  // Cast dentist data for type safety
  const dentist = dentistData as DentistWithParsedDegrees | undefined | null;

  useEffect(() => {
    if (dentist) {
      let parsedDegrees: Array<{ id: string; name: string; fullName: string }> =
        [];

      if (dentist.dentistDegree) {
        if (typeof dentist.dentistDegree === 'string') {
          try {
            parsedDegrees = JSON.parse(dentist.dentistDegree as string);
          } catch (e) {
            console.error('Failed to parse dentistDegree:', e);
          }
        } else if (Array.isArray(dentist.dentistDegree)) {
          parsedDegrees = dentist.dentistDegree;
        }
      }

      form.reset({
        shortBio: dentist.shortBio || '',
        longBio: dentist.longBio || '',
        practiceLocation: dentist.practiceLocation || '',
        speciality: dentist.speciality || '',
        dentistDegree: parsedDegrees,
        latitude: dentist.latitude ?? undefined,
        longitude: dentist.longitude ?? undefined,
      });

      // Set the location input value based on the dentist's practiceLocation if available
      if (dentist.practiceLocation) {
        setLocationInputValue(dentist.practiceLocation);
      } else {
        setLocationInputValue('');
      }
      setSelectedPlace(null);
    }
  }, [dentist, form]);

  const onSubmit = async (values: PersonalDetailsFormValues) => {
    if (dentistId) {
      // Make sure practiceLocation is synced with locationInputValue
      const dataToSend = {
        ...values,
        practiceLocation: locationInputValue,
      };

      updateDentist(
        {
          id: dentistId,
          data: dataToSend as Partial<Dentist>,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            refetch();
          },
          onError: error => {
            console.error('Error updating dentist:', error);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading dentist: {error.message}</div>
    );
  }

  if (!dentist) {
    return <div>No dentist found</div>;
  }

  // Helper to get selected options for the combo box
  const getSelectedDegreeOptions = (): Option[] => {
    const selectedDegrees = form.getValues('dentistDegree') || [];
    return selectedDegrees.map(degree => ({
      id: degree.id || '',
      name: degree.name || '',
      fullName: degree.fullName || '',
    }));
  };

  const handleLocationSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    // Set the input value to the place's formatted address or name
    const locationValue = place.formatted_address || place.name || '';
    setLocationInputValue(locationValue);
    const location = {
      latitude: place.geometry?.location?.lat() || 0,
      longitude: place.geometry?.location?.lng() || 0,
    };
    form.setValue('latitude', location.latitude, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue('longitude', location.longitude, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // Update practiceLocation value with the selected place address
    form.setValue('practiceLocation', locationValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Optionally, if you want to clear the lat/lng when the input is cleared
  const handleLocationInputChange = (value: string) => {
    setLocationInputValue(value);
    if (!value) {
      setSelectedPlace(null);
      form.setValue('latitude', undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue('longitude', undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue('practiceLocation', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
          <FormField
            control={form.control}
            name="speciality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speciality</FormLabel>
                <FormControl>
                  <Combobox
                    items={siteConfig.specialities.map(speciality => ({
                      key: speciality.value,
                      label: speciality.name,
                    }))}
                    value={field.value || ''}
                    onChange={value => field.onChange(value)}
                    open={specialityOpen}
                    setOpen={setSpecialityOpen}
                    placeholder="Select speciality"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Degrees</FormLabel>
            <FormControl>
              <ReUsableComboNew
                options={
                  degrees?.map(d => ({
                    id: d.id,
                    name: d.name,
                    fullName: d.fullName,
                  })) || []
                }
                isLoading={isLoadingDegrees}
                isError={isErrorDegrees}
                onRetry={refetchDegrees}
                selected={getSelectedDegreeOptions()}
                onSelectionChange={selectedOptions => {
                  form.setValue(
                    'dentistDegree',
                    selectedOptions.map(option => ({
                      id: option.id,
                      name: option.name,
                      fullName: option.fullName || '',
                    })),
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    }
                  );
                }}
                placeholder="Select Degrees"
                className="w-full"
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.dentistDegree?.message}
            </FormMessage>
          </FormItem>
        </div>
        {/* Location fields */}
        <FormField
          control={form.control}
          name="latitude"
          render={() => (
            <FormItem>
              <FormLabel>Practice Location</FormLabel>
              <FormControl>
                <GooglePlacesAutocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  placeholder="Ex : MY DENTAL CLINIC"
                  onPlaceSelect={handleLocationSelect}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {locationInputValue && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <div className="mb-2 flex items-center">
              <Info className="text-primary mr-2 h-5 w-5" />
              <span className="text-primary font-semibold">
                Practice Location
              </span>
            </div>
            <div className="text-primary break-words">{locationInputValue}</div>
            {form.getValues('latitude') && form.getValues('longitude') && (
              <div className="text-primary mt-2 text-sm">
                <span className="font-medium">Coordinates:</span>{' '}
                {form.getValues('latitude')}, {form.getValues('longitude')}
              </div>
            )}
          </div>
        )}
        <FormField
          control={form.control}
          name="practiceLocation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  value={locationInputValue}
                  onChange={e => {
                    field.onChange(e.target.value);
                    handleLocationInputChange(e.target.value);
                  }}
                  disabled
                  className="input input-bordered w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  rows={4}
                  placeholder="Enter short bio"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  rows={8}
                  placeholder="Enter long bio"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? <LoadingSpinner size="sm" /> : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );

  const ContentsShowUp = () => {
    const degreesToDisplay = Array.isArray(dentist?.dentistDegree)
      ? dentist.dentistDegree
      : [];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Info className="mt-1 h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Speciality</p>
                <p className="text-gray-600">
                  {dentist?.speciality || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Info className="mt-1 h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Degrees</p>
                <p className="text-gray-600">
                  {degreesToDisplay.length > 0
                    ? degreesToDisplay.map(degree => degree.name).join(', ')
                    : 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Info className="mt-1 h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Practice Location</p>
                <p className="text-gray-600">
                  {dentist?.practiceLocation || 'Not specified'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Info className="mt-1 h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Location</p>
                <p className="text-gray-600">
                  {typeof dentist?.latitude === 'number' &&
                  typeof dentist?.longitude === 'number'
                    ? `Lat: ${dentist.latitude}, Lng: ${dentist.longitude}`
                    : 'Not specified'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Info className="mt-1 h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Short Bio</p>
                <Collapsible
                  open={isShortBioOpen}
                  onOpenChange={setIsShortBioOpen}
                >
                  <CollapsibleTrigger className="flex items-center space-x-2">
                    <span className="text-gray-600">
                      {isShortBioOpen ? 'Hide' : 'Show'} Short Bio
                    </span>
                    {isShortBioOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="whitespace-pre-wrap text-gray-600">
                      {dentist?.shortBio || 'No short bio available'}
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Info className="mt-1 h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Long Bio</p>
                <Collapsible
                  open={isLongBioOpen}
                  onOpenChange={setIsLongBioOpen}
                >
                  <CollapsibleTrigger className="flex items-center space-x-2">
                    <span className="text-gray-600">
                      {isLongBioOpen ? 'Hide' : 'Show'} Long Bio
                    </span>
                    {isLongBioOpen ? <ChevronUp /> : <ChevronDown />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="whitespace-pre-wrap text-gray-600">
                      {dentist?.longBio || 'No long bio available'}
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-bold">Personal Details</h1>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Personal Details
          </Button>
        </div>

        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Personal Details"
          side="right"
          width="w-[600px]"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Make changes to the personal information here. Click save when
              you're done.
            </p>
            {isOpen && !isLoading && dentist && <FormContent />}
            {isOpen && isLoading && <LoadingSpinner />}
          </div>
        </Drawer>

        {!isLoading && dentist && <ContentsShowUp />}
        {isLoading && <LoadingSpinner />}
        {!isLoading && !dentist && <div>No dentist data found.</div>}
        {error && (
          <div className="text-red-500">
            Error loading details:{' '}
            {typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : 'An unknown error occurred'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
