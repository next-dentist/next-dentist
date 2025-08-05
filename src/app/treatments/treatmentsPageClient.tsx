import { Breadcrumbs } from "@/components/Breadcrumbs";
import HeaderHOne from "@/components/Headers/HeaderHOne";
import HeaderHTwo from "@/components/Headers/HeaderHTwo";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SectionThree } from "@/components/SectionThree";
import { SectionTwo } from "@/components/SectionTwo";
import TreatmentCard from "@/components/TreatmentCard";
import { WhiteRoundedBox } from "@/components/WhiteRoundedBox";
import { Button } from "@/components/ui/button";
import { useInfiniteTreatments } from "@/hooks/useInfiniteTreatments";
import { ChevronDown } from "lucide-react";
import React from "react";

const TreatmentsPageClient: React.FC = () => {
  const {
    treatments,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteTreatments();

  // For demo purposes - you can remove this

  if (isLoading)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (isError)
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700 min-h-[200px] flex items-center justify-center">
        <p>
          Sorry, we couldn't load treatments:{" "}
          {error?.message || "Unknown error"}
        </p>
      </div>
    );

  return (
    <>
      <SectionTwo className="py-4">
        <Breadcrumbs />
      </SectionTwo>
      <SectionTwo className="py-4">
        <HeaderHOne title="Our Treatments" />
      </SectionTwo>
      <SectionThree className="mb-12">
        <div className="flex flex-col gap-4 w-full">
          <WhiteRoundedBox className="p-8 w-full">
            <div className="flex flex-col gap-6">
              <HeaderHTwo title="Explore Our Dental Treatments" />
              <p className="text-gray-600 max-w-3xl">
                At NextDentist, we offer a comprehensive range of dental
                treatments to meet all your oral health needs. Our experienced
                team is dedicated to providing the highest quality care in a
                comfortable and welcoming environment.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {treatments.map((treatment) => (
                  <TreatmentCard
                    key={treatment.id}
                    title={treatment.name || ""}
                    description={treatment.description || ""}
                    imageUrl={treatment.image || ""}
                    slug={treatment.slug || ""}
                  />
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Loading more...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Treatments</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {treatments?.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No treatments found</p>
                </div>
              )}
            </div>
          </WhiteRoundedBox>
        </div>
      </SectionThree>
    </>
  );
};

export default TreatmentsPageClient;
