'use client';

import { SectionOne } from '@/components/SectionOne';
import GradientSection from '@/components/Sections/GradientSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { siteConfig } from '@/config';
import { TreatmentMeta } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import BeforeAfterImages from './BeforeAfterImages';
import CostEstimation from './CostEstimation';
import FAQ from './FAQ';
import ImageTextSection from './ImageTextSection';
import InstructionIcon from './InstructionIcon';
import './style.css';

interface SingleTreatmentProps {
  treatment?: TreatmentMeta | null;
}

// generate meta for seo generateMetadata

export default function SingleTreatment({ treatment }: SingleTreatmentProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <>
      <SectionOne className="bg-white/60">
        <div className="flex h-full w-full flex-col gap-4 text-slate-500 md:flex-row">
          <Card className="flex w-full flex-col gap-4 text-black backdrop-blur-sm">
            <Image
              src={treatment?.image || ''}
              alt={treatment?.name || ''}
              width={200}
              height={200}
              className="rounded-full"
            />
            <h1 className="text-6xl">{treatment?.name}</h1>
            <p className="text-lg">{treatment?.description}</p>
          </Card>

          {treatment?.costs && treatment.costs.length > 0 && (
            <GradientSection className="flex w-full flex-col gap-4 rounded-4xl text-black">
              <h2 className="p-4">Cost Estimation of {treatment?.name}</h2>

              <Table>
                <TableCaption className="text-left text-sm">
                  Estimation of {treatment?.name} by {siteConfig.name}. In
                  conclusion, the cost of {treatment?.name} is subject to
                  significant variability, influenced by a multitude of factors.
                  The brand of selected Materials, the complexity and duration
                  of the treatment, the expertise of the dentist, and the
                  geographical location all play crucial roles in determining
                  the final expense.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Title</TableHead>
                    <TableHead className="text-right">Min</TableHead>
                    <TableHead className="text-right">Max</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treatment?.costs.map(cost => (
                    <CostEstimation key={cost.id} cost={cost} />
                  ))}
                </TableBody>
              </Table>
            </GradientSection>
          )}
        </div>
      </SectionOne>
      <div className="reader-content mx-auto flex flex-col px-4 py-10">
        <div className="container mx-auto flex flex-col gap-4 rounded-4xl md:flex-row">
          <div className="custom-rounded-4xl flex basis-2/3 flex-col gap-10">
            {treatment?.sections && treatment.sections.length > 0 && (
              <div className="border-b border-gray-200 pb-4">
                <div className="no-scrollbar flex w-[100%] gap-4 overflow-x-auto pb-2">
                  {treatment.sections.map(section => (
                    <Button
                      key={section.id}
                      className={`flex-none rounded-full px-6 py-2 text-lg whitespace-nowrap text-black transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-secondary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }}
                    >
                      {section.menuText}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {treatment?.instructions && treatment.instructions.length > 0 && (
              <InstructionIcon instruction={treatment.instructions} />
            )}
            {treatment?.sections &&
              treatment.sections.length > 0 &&
              treatment.sections.map(section => (
                <ImageTextSection key={section.id} section={section} />
              ))}

            {/* only show if treatment.videos.length > 0 */}
            {treatment?.videos && treatment.videos.length > 0 && (
              <div className="flex h-[300px] flex-col gap-4">
                {' '}
                <video width="100%" height="100%" controls preload="none">
                  <source src="/path/to/video.mp4" type="video/mp4" />
                  <track
                    src="/path/to/captions.vtt"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {/* image gallery */}
            {treatment?.images && treatment.images.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl">Gallery of {treatment?.name}</h2>
                <BeforeAfterImages images={treatment.images} />
              </div>
            )}

            {treatment?.faq && treatment.faq.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl">
                  Frequently Asked Questions of {treatment?.name}
                </h2>
                {treatment.faq.map(faq => (
                  <FAQ key={faq.id} faq={faq} />
                ))}
              </div>
            )}
          </div>
          <div className="custom-rounded-4xl flex basis-1/3 flex-col gap-10">
            Section Comming Soon
          </div>
        </div>
      </div>
    </>
  );
}
