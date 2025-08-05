'use client';

import { getDentistByCity } from '@/app/actions/cost/CostPageCityWiseDentist';
import '@/app/css/content.css';
import TitleSection from '@/components/Sections/TitleSection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { siteConfig } from '@/config';
import {
  CostImage,
  CostPageData,
  CostSection,
  CostTableSet,
  CostVideo,
} from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Loader2, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AppointmentBookingCostPage from '../AppointmentBookingCostForm';
import DentistSearchCard from '../DentistSearchCard';
import RegisterDentistCard from '../RegisterDentistCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';
import VideoPlayer from '../videoplayer/VideoPlayer'; // Import VideoPlayer
import './cost.css';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const CostPage: React.FC<{ data: CostPageData }> = ({ data }) => {
  const [selectedCostTableId, setSelectedCostTableId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  // Renaming state to be more general for image dialog
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleBookNowClick = (costTableId: string) => {
    setSelectedCostTableId(costTableId);
    // Removed setShowBookingForm as the Dialog handles visibility
  };

  const handleImageClick = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  // Handle both city name and city ID cases, with fallback to slug extraction
  const currentCity = data.city
    ? // First try to find by ID (if data.city is numeric)
      siteConfig.cities.find(city => city.id.toString() === data.city)?.name ||
      // Then try to find by name (if data.city is the actual city name)
      siteConfig.cities.find(
        city => city.name.toLowerCase() === data.city?.toLowerCase()
      )?.name ||
      // Finally, use data.city as-is if no match found
      data.city
    : // Fallback: extract city from slug (e.g., "dental-bridge-costs-ahmedabad" -> "ahmedabad")
      (() => {
        const slugParts = data.slug.split('-');
        const lastPart = slugParts[slugParts.length - 1];
        // Check if the last part of slug matches any city
        const cityFromSlug = siteConfig.cities.find(
          city =>
            city.name.toLowerCase() === lastPart.toLowerCase() ||
            city.value.toLowerCase() === lastPart.toLowerCase()
        );
        return cityFromSlug?.name;
      })();

  const [dentist, setDentist] = useState<any[]>([]);
  useEffect(() => {
    const fetchDentist = async () => {
      setLoading(true);

      // Only fetch dentists if we have a valid city
      if (currentCity) {
        const dentist = await getDentistByCity(currentCity, 10);
        console.log('CostPageFrontTwo: Received dentists:', dentist.length);
        setDentist(dentist);
      } else {
        console.log(
          'CostPageFrontTwo: No city provided, showing RegisterDentistCard'
        );
        setDentist([]);
      }

      setLoading(false);
    };
    fetchDentist();
  }, [data.city, currentCity]);

  return (
    <div className="body-content reader-content container mx-auto max-w-6xl px-2 py-8">
      <TitleSection image={data.image ?? ''} />

      <section className="relative z-10 mt-[-60px] flex w-full flex-col-reverse gap-4 md:flex-row">
        {/* Left column */}
        <div className="flex basis-1/3 flex-col gap-4 p-4 md:basis-1/3">
          <div className="mt-30 flex flex-col gap-4">
            <h2 className="text-2xl font-bold">
              Dentists in {currentCity || 'This Area'}
            </h2>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : !currentCity ? (
              // Show RegisterDentistCard when no city is selected in cost page form
              <RegisterDentistCard city="this area" />
            ) : dentist.length > 0 ? (
              dentist.map(dentist => (
                <DentistSearchCard key={dentist.id} dentistData={dentist} />
              ))
            ) : (
              // Show RegisterDentistCard when no dentists found for the selected city
              <RegisterDentistCard city={currentCity} />
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex basis-2/3 flex-col gap-8 md:basis-2/3">
          {/* section content start */}
          <div className="flex flex-col gap-8 rounded-4xl bg-white px-4 py-8 md:p-10">
            {/* disctructive html */}
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <div
              className="prose prose-sm"
              dangerouslySetInnerHTML={{
                __html: data.content ?? '',
              }}
            />
          </div>
          {/* section content end */}

          {/* cost section start */}
          {data.tableSets?.length && data.tableSets?.length > 0 && (
            <div className="flex flex-col gap-8 rounded-4xl bg-white px-4 md:p-10">
              <h2 className="border-slate-100-200 border-b border-dashed p-4 text-2xl font-bold">
                Estimated Cost
              </h2>
              {data.tableSets?.map((tableSet: CostTableSet) => (
                <div key={tableSet.id} className="flex flex-col gap-6">
                  <h3 className="text-lg font-bold">{tableSet.name}</h3>
                  {/* Table wrapper */}
                  <div className="max-h-[60vh] w-full overflow-auto rounded-lg border">
                    <Table className="w-full table-auto text-[12px] lg:text-[14px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24 max-w-16 py-3">
                            Image
                          </TableHead>
                          <TableHead className="w-40 px-2 py-3 whitespace-nowrap">
                            Product/Company
                          </TableHead>

                          <TableHead className="px-2 py-3 whitespace-nowrap">
                            {data.costTables[0]?.currencyOne ?? 'Cost 1'}
                          </TableHead>
                          <TableHead className="px-2 py-3 whitespace-nowrap">
                            {data.costTables[0]?.currencyTwo ?? 'Cost 2'}
                          </TableHead>
                          <TableHead className="px-2 py-3 whitespace-nowrap">
                            {data.costTables[0]?.currencyThree ?? 'Cost 3'}
                          </TableHead>
                          {/* Book Now Button */}
                          <TableHead className="px-2 py-3 whitespace-nowrap">
                            Book Now
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.costTables
                          .filter(
                            costTable => costTable.tableSetId === tableSet.id
                          )
                          .map(costTable => (
                            <TableRow
                              key={costTable.id}
                              className="even:bg-muted/50"
                            >
                              <TableCell className="px-2 py-3">
                                {costTable.image ? (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Image
                                        src={costTable.image}
                                        alt={costTable.imageAlt ?? ''}
                                        width={80}
                                        height={80}
                                        className="aspect-square cursor-pointer rounded-full object-cover"
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent className="z-50 p-0">
                                      <Image
                                        src={costTable.image}
                                        alt={costTable.imageAlt ?? ''}
                                        width={400}
                                        height={400}
                                        className="h-auto w-[400px] max-w-full rounded-lg object-contain"
                                      />
                                    </PopoverContent>
                                  </Popover>
                                ) : (
                                  '—'
                                )}
                              </TableCell>
                              <TableCell className="max-w-[150px] px-2 py-3 break-words whitespace-normal">
                                {/* Use HoverCard to show full content on hover */}
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <span className="cursor-pointer">
                                      {costTable.title}
                                    </span>
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-semibold">
                                        <span className="cursor-pointer">
                                          {costTable.titleUrl ? (
                                            <Link
                                              href={`${costTable.titleUrl}`}
                                              target="_blank"
                                            >
                                              {costTable.title}
                                            </Link>
                                          ) : (
                                            costTable.title
                                          )}
                                        </span>
                                      </h4>
                                      <div
                                        className="prose prose-sm text-muted-foreground"
                                        dangerouslySetInnerHTML={{
                                          __html: costTable.content,
                                        }}
                                      />
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              </TableCell>

                              <TableCell className="max-w-[100px] px-2 py-3 break-words whitespace-normal">
                                {costTable.costOne}
                              </TableCell>
                              <TableCell className="max-w-[100px] px-2 py-3 break-words whitespace-normal">
                                {costTable.costTwo}
                              </TableCell>
                              <TableCell className="max-w-[100px] px-2 py-3 break-words whitespace-normal">
                                {costTable.costThree}
                              </TableCell>
                              <TableCell className="max-w-[100px] px-2 py-3 break-words whitespace-normal">
                                {/* Wrap the button and its content in Dialog */}
                                <Dialog
                                  open={selectedCostTableId === costTable.id}
                                  onOpenChange={isOpen =>
                                    !isOpen && setSelectedCostTableId(null)
                                  }
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleBookNowClick(costTable.id)
                                      }
                                    >
                                      Book Now
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Book an Appointment
                                      </DialogTitle>
                                      <DialogDescription>
                                        Fill out the form below to book your
                                        appointment.
                                      </DialogDescription>
                                    </DialogHeader>
                                    {selectedCostTableId === costTable.id && (
                                      <AppointmentBookingCostPage
                                        costTablesID={selectedCostTableId}
                                        pageID={data.id}
                                        tableSetID={tableSet.id} // Use current tableSet.id
                                      />
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Disclaimer: Please note that all costs mentioned are
                    approximate estimates and may vary depending on individual
                    needs, the complexity of the treatment, materials used, and
                    the specific dental clinic. A detailed consultation and
                    personalized treatment plan are required for an accurate
                    quotation.
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* cost section end */}
          {/* section CostSection start */}

          {/* map over CostSection*/}
          {data.CostSection?.map((costSection: CostSection) => (
            <div
              className="flex flex-col gap-4 rounded-4xl bg-white px-4 py-8 md:p-10"
              key={costSection.id}
            >
              <h2 className="text-2xl font-bold">{costSection.title}</h2>
              {costSection.image && (
                // make image cover to 100% and 250px height
                <Image
                  src={costSection.image}
                  alt={costSection.imageAlt ?? ''}
                  width={500}
                  height={500}
                  className="h-[250px] w-full rounded-lg object-cover"
                />
              )}

              <div
                className="prose prose-sm"
                dangerouslySetInnerHTML={{
                  __html: costSection.content ?? '',
                }}
              />
            </div>
          ))}

          {/* section CostSection end */}
          {/* section costImages start */}
          {/* make grid 4 columns in desktop and 2 columns in mobile */}
          {data.costImages && data.costImages.length > 0 && (
            // Wrap the entire image grid section within the Dialog
            <Dialog
              open={data.costImages?.some(img => img.id === selectedImageId)}
              onOpenChange={isOpen => !isOpen && setSelectedImageId(null)}
            >
              <div className="flex flex-col gap-4 rounded-4xl bg-white px-4 py-8 md:p-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {data.costImages.map((costImage: CostImage) => (
                    <div key={costImage.id}>
                      {/* Wrap image in DialogTrigger */}
                      <DialogTrigger asChild>
                        <button
                          onClick={() => handleImageClick(costImage.id)} // Use new handler and state
                          className="h-full w-full" // Make button fill container
                        >
                          <Image
                            src={costImage.image}
                            alt={costImage.imageAlt ?? ''}
                            width={500}
                            height={500}
                            className="h-[300px] w-full cursor-pointer rounded-lg object-cover" // Add cursor pointer
                          />
                        </button>
                      </DialogTrigger>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dialog for displaying the large image */}
              {/* Use selectedImageId state to track which image is open */}
              <DialogContent className="">
                {/* Add DialogHeader and DialogTitle for accessibility */}
                <DialogHeader>
                  <DialogTitle>Image Preview</DialogTitle>
                  {/* Optional: Add DialogDescription if needed */}
                </DialogHeader>
                {/* Find the selected image by id */}
                {data.costImages
                  ?.filter(img => img.id === selectedImageId)
                  .map(selectedImage => (
                    <Image
                      key={selectedImage.id}
                      src={selectedImage.image}
                      alt={selectedImage.imageAlt ?? ''}
                      width={500} // Use larger dimensions for dialog
                      height={500}
                      className="object-contain" // Make image fill dialog width, maintain aspect ratio
                    />
                  ))}
              </DialogContent>
            </Dialog>
          )}
          {/* section costImages end */}
          {/* section costVideos start */}
          {data.CostVideo && data.CostVideo.length > 0 && (
            <div className="flex flex-col gap-4 rounded-4xl bg-white px-4 py-8 md:p-10">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                {data.CostVideo.map((costVideo: CostVideo) => (
                  <VideoPlayer
                    key={costVideo.id}
                    id={costVideo.id.toString()}
                    url={costVideo.video}
                  />
                ))}
              </div>
            </div>
          )}
          {/* section costVideos end */}
          {/* section costFAQ start */}
          {data.faqs && data.faqs.length > 0 && (
            <div className="flex flex-col gap-4 rounded-4xl bg-white px-4 py-8 md:p-10">
              <h2 className="text-2xl font-bold"> FAQ</h2>
              {data.title}
              {/* Need to import Accordion, AccordionItem, AccordionTrigger, AccordionContent from "@/components/ui/accordion" */}
              <Accordion type="single" collapsible className="w-full">
                {data.faqs.map((faq: FAQ) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="prose prose-sm"
                        dangerouslySetInnerHTML={{
                          __html: faq.answer ?? '',
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          {/* section costFAQ end */}
          {/* section related keywords start */}
          {data.relatedKeys && data.relatedKeys.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.relatedKeys.map((relatedKey: string) => (
                <span
                  key={relatedKey}
                  className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm text-slate-600" // Slightly adjusted tag style
                >
                  <Tag className="h-3 w-3 text-gray-600" />
                  {relatedKey}
                </span>
              ))}
            </div>
          )}
          {/* section related keywords end */}
        </div>
      </section>
    </div>
  );
};

export default CostPage;
