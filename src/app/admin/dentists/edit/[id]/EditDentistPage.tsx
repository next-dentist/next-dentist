'use client';
import { getDentistById } from '@/app/actions/fetchDentists';
import { AdminAlumniOfForm } from '@/components/admin/AdminAlumniOfForm';
import { AdminAwardForm } from '@/components/admin/AdminAwardForm';
import AdminBusinessHoursForm from '@/components/admin/AdminBusinessHoursForm';
import AdminGalleryForm from '@/components/admin/AdminGalleryForm';
import { AdminKnowsAboutForm } from '@/components/admin/AdminKnowsAboutForm';
import { AdminSocialMediaLinkForm } from '@/components/admin/AdminSocialMediaLinkForm';
import AdminTreatmentAddForm from '@/components/admin/AdminTreatmentAddForm';
import { AdminWorkingAtForm } from '@/components/admin/AdminWorkingAtForm';
import BusinessDetailsForm from '@/components/admin/BusinessDetailsForm';
import DentistBasicDetailsForm from '@/components/admin/DentistBasicDetailsForm';
import PersonalDetailsForm from '@/components/admin/PersonalDetailsForm';
import SpecialInfoForm from '@/components/admin/SpecialInfoForm';
import DentistFaqManager from '@/components/dentist/DentistFaqManager';
import DentistFeaturePicker from '@/components/dentist/DentistFeaturePicker';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { Suspense } from 'react';
const EditDentistPage: React.FC = () => {
  const { id } = useParams();
  // use tanstack query to fetch the dentist
  const { data: dentist } = useQuery({
    queryKey: ['dentist', id],
    queryFn: () => getDentistById(id as string),
  });
  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      {/* add button to view front end profile */}
      <div className="flex justify-end">
        <Button>
          <Link href={`/dentists/${dentist?.slug}`}>
            View Front End Profile
          </Link>
        </Button>
      </div>

      <div className="columns-1 gap-6 space-y-6 md:columns-3">
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <DentistBasicDetailsForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <PersonalDetailsForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <SpecialInfoForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <BusinessDetailsForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <DentistFeaturePicker dentistId={id as string} />
          </Suspense>
        </div>

        {/* FAQ */}
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <DentistFaqManager dentistId={id as string} />
          </Suspense>
        </div>

        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <AdminBusinessHoursForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <AdminGalleryForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <AdminTreatmentAddForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <AdminSocialMediaLinkForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <AdminAwardForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <AdminAlumniOfForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <AdminWorkingAtForm dentistId={id as string} />
          </Suspense>
        </div>
        <div className="break-inside-avoid">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <AdminKnowsAboutForm dentistId={id as string} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default EditDentistPage;
