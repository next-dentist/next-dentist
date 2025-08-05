'use client';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import DentistSearchCard from '@/components/DentistSearchCard';
import Filters from '@/components/Filters';
import HeaderHOne from '@/components/Headers/HeaderHOne';
import HeaderHTwo from '@/components/Headers/HeaderHTwo';
import LoadingSpinner from '@/components/LoadingSpinner';
import ImageSection from '@/components/Sections/ImageSection';
import { SectionThree } from '@/components/SectionThree';
import { SectionTwo } from '@/components/SectionTwo';
import TopRightBlurButton from '@/components/TopRightBlurButton';
import { WhiteRoundedBox } from '@/components/WhiteRoundedBox';
import { useInfiniteDentistsByCity } from '@/hooks/useInfiniteDentists';
import { Dentist } from '@prisma/client';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const DentistInAhmedabadClient: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px 200px 0px',
  });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteDentistsByCity('Ahmedabad');

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten the pages array to get all dentists
  const dentists = data?.pages.flatMap(page => page.dentists) || [];

  return (
    <>
      <SectionTwo className="py-4">
        <Breadcrumbs />
      </SectionTwo>
      <SectionTwo className="py-4">
        <HeaderHOne title="Find the Best Dentist in Ahmedabad" />
      </SectionTwo>
      <SectionThree className="">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <WhiteRoundedBox className="basis-9/12 p-4 px-4">
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : isError ? (
                <div className="py-8 text-center text-red-500">
                  Error loading dentists. Please try again later.
                </div>
              ) : dentists.length === 0 ? (
                <div className="py-8 text-center">
                  No dentists found in Ahmedabad.
                </div>
              ) : (
                <>
                  {dentists.map((dentist: Dentist) => (
                    <DentistSearchCard
                      key={dentist.id}
                      dentistData={{
                        name: dentist.name || '',
                        speciality: dentist.speciality || '',
                        image: dentist.image || '',
                        priceStart: Number(dentist.priceStart) || 0,
                        phone: dentist.phone || '',
                        city: dentist.city || '',
                        state: dentist.state || '',
                        country: dentist.country || '',
                        slug: dentist.slug || '',
                        id: dentist.id || '',
                      }}
                    />
                  ))}

                  {/* Loading indicator and intersection observer reference */}
                  <div ref={ref} className="flex justify-center py-4">
                    {isFetchingNextPage && <LoadingSpinner />}
                    {!hasNextPage && dentists.length > 0 && (
                      <p className="text-gray-500">No more dentists to load</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </WhiteRoundedBox>
          <WhiteRoundedBox className="basis-3/12 p-4 px-4">
            <Filters />
          </WhiteRoundedBox>
        </div>
      </SectionThree>
      <SectionThree className="gap-4 bg-radial from-[#bed5d8] to-[#bed5d8] py-20">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex basis-1/2 flex-col gap-4">
            <div className="flex flex-col gap-4 md:max-w-3/4">
              <span>Comprehensive Dental Services</span>
              {/* add line height 1.5 */}
              <HeaderHTwo title="Find the Best Dentist in Ahmedabad: Your Ultimate Guide to Quality Dental Care" />
              <p>
                When it comes to oral health, finding a reliable and skilled
                dentist is essential. Whether you're looking for a routine
                checkup, cosmetic dentistry, or more complex procedures, having
                the right dentist can make all the difference. If you're
                searching for a dentist in Ahmedabad, this guide will help you
                navigate the process, ensuring you find the perfect match for
                your needs.
              </p>
            </div>
          </div>
          <div className="flex basis-1/2 flex-col gap-4">
            <ImageSection
              bgImage="/images/dentist-card.jpg"
              className="flex flex-col items-stretch justify-between text-black"
            >
              <div className="flex min-h-20">&nbsp;</div>
              <TopRightBlurButton
                description="Brightening Smile in Hrs"
                href="#"
                position="center"
              />
            </ImageSection>
          </div>
        </div>
      </SectionThree>
      <SectionThree className="gap-4 bg-white/20 py-20">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex basis-2/4 flex-col gap-4">
            <HeaderHTwo title="Why Choose Us?" />
            <p>
              When it comes to oral health, finding a reliable and skilled
              dentist is essential. Whether you're looking for a routine
              checkup, cosmetic dentistry, or more complex procedures, having
              the right dentist can make all the difference. If you&rsquo;re
              searching for a <strong>dentist in Ahmedabad</strong>, this guide
              will help you navigate the process, ensuring you find the perfect
              match for your needs.
            </p>
            <h3>Why Choose a Dentist in Ahmedabad?</h3>
            <p>
              Ahmedabad, known for its rich culture and history, also boasts
              some of the best dental professionals in India. With a growing
              population and increased awareness about oral health, the city
              offers a wide variety of dental services tailored to meet your
              needs. From general dentistry to advanced cosmetic and restorative
              treatments, Ahmedabad has everything to ensure your dental health
              is in expert hands.
            </p>
            <h3>Services Offered by Dentists in Ahmedabad</h3>
            <p>
              Whether you are a new patient or need a second opinion,
              Ahmedabad's dental clinics offer a comprehensive range of
              services. Some of the most sought-after treatments include:
            </p>
            <ul>
              <li>
                <strong>General Dentistry</strong>: Regular checkups, cleanings,
                fillings, and preventive care.
              </li>
              <li>
                <strong>Cosmetic Dentistry</strong>: Teeth whitening, veneers,
                bonding, and smile makeovers.
              </li>
              <li>
                <strong>Orthodontics</strong>: Braces and Invisalign treatments
                for adults and children.
              </li>
              <li>
                <strong>Periodontics</strong>: Treatment of gum diseases and
                other issues affecting the gums.
              </li>
              <li>
                <strong>Pediatric Dentistry</strong>: Specialized care for
                children&rsquo;s dental needs.
              </li>
              <li>
                <strong>Oral Surgery</strong>: Complex treatments such as
                extractions, implants, and jaw surgeries.
              </li>
              <li>
                <strong>Root Canal Treatment (RCT)</strong>: Saving your natural
                teeth from infection and decay.
              </li>
            </ul>
            <p>
              With so many dental services to choose from, it&rsquo;s essential
              to find a clinic that offers exactly what you need. And
              that&rsquo;s where <strong>NextDentist</strong> comes in.
            </p>
            <h3>Why Choose NextDentist to Find a Dentist in Ahmedabad?</h3>
            <p>
              NextDentist is an online platform dedicated to making the process
              of finding a qualified dentist in Ahmedabad easier than ever.
              Here&rsquo;s why it&rsquo;s the best choice:
            </p>
            <ol>
              <li>
                <strong>Verified Dentists</strong>: All dentists listed on
                NextDentist are thoroughly vetted, ensuring you get access to
                only the best professionals in the field.
              </li>
              <li>
                <strong>Comprehensive Listings</strong>: You can search by
                location, treatment type, and even ratings to help you find the
                ideal dentist based on your specific needs.
              </li>
              <li>
                <strong>Patient Reviews</strong>: Read authentic reviews from
                other patients to understand the quality of care and service
                offered by each dentist in Ahmedabad.
              </li>
              <li>
                <strong>Instant Booking</strong>: Skip the hassle of phone calls
                and book your appointments directly through the platform. It's
                quick, easy, and convenient.
              </li>
              <li>
                <strong>Consultation Options</strong>: Some of the dentists
                listed on NextDentist offer online consultations, so you can
                discuss your concerns without leaving home.
              </li>
            </ol>
            <h3>Top Tips for Choosing the Right Dentist in Ahmedabad</h3>
            <p>
              When looking for a dentist in Ahmedabad, you want to ensure
              you&rsquo;re choosing someone who is not only experienced but also
              trustworthy. Here are some tips to help you make the right
              decision:
            </p>
            <ul>
              <li>
                <strong>Check Qualifications and Experience</strong>: Always
                verify the dentist's qualifications and years of experience.
                Dentists in Ahmedabad typically have degrees from reputed
                institutions and undergo continuous education to stay updated on
                the latest techniques.
              </li>
              <li>
                <strong>Specialization</strong>: Depending on your specific
                needs (cosmetic dentistry, orthodontics, etc.), look for a
                dentist who specializes in that area.
              </li>
              <li>
                <strong>Technology and Equipment</strong>: Modern dental
                practices use state-of-the-art equipment. A clinic with advanced
                tools often ensures better treatment outcomes.
              </li>
              <li>
                <strong>Location and Accessibility</strong>: Choose a dentist
                near your home or workplace for convenience. Using
                NextDentist&rsquo;s location filter, you can easily find nearby
                options.
              </li>
              <li>
                <strong>Insurance and Payment Plans</strong>: Many dentists in
                Ahmedabad accept insurance or offer payment plans. This can
                significantly reduce your out-of-pocket expenses for dental
                treatments.
              </li>
            </ul>
            <h3>Benefits of Regular Visits to Your Dentist</h3>
            <p>
              Visiting your dentist regularly, at least once every six months,
              offers several benefits:
            </p>
            <ul>
              <li>
                <strong>Prevention of Dental Issues</strong>: Regular checkups
                can detect early signs of cavities, gum disease, and other
                dental issues before they become serious.
              </li>
              <li>
                <strong>Maintaining Overall Health</strong>: Poor oral health is
                linked to various systemic conditions, such as heart disease and
                diabetes. Regular dental visits help in maintaining overall
                health.
              </li>
              <li>
                <strong>A Better Smile</strong>: Routine cleanings, whitening,
                and other treatments can help you achieve and maintain a bright,
                confident smile.
              </li>
            </ul>
            <h3>Common Dental Issues in Ahmedabad and How to Prevent Them</h3>
            <p>
              While Ahmedabad has seen a significant increase in dental
              awareness, common oral health issues still persist. These include:
            </p>
            <ul>
              <li>
                <strong>Tooth Decay</strong>: Poor diet, especially high in
                sugar, contributes to cavities. Brushing twice a day and
                flossing can help prevent tooth decay.
              </li>
              <li>
                <strong>Gum Disease</strong>: Gum problems are common and can
                lead to tooth loss if not addressed. Regular cleaning and proper
                brushing techniques help maintain gum health.
              </li>
              <li>
                <strong>Misaligned Teeth</strong>: Many people in Ahmedabad
                suffer from crooked teeth, and orthodontic treatments like
                braces can help.
              </li>
            </ul>
            <h3>Finding Emergency Dental Care in Ahmedabad</h3>
            <p>
              Dental emergencies can happen at any time, and it&rsquo;s
              important to know where to turn when you need immediate care.{' '}
              <strong>NextDentist</strong> helps you find emergency dental
              clinics in Ahmedabad, available for urgent issues such as
              toothaches, broken teeth, or accidents that require immediate
              attention.
            </p>
            <h3>Conclusion</h3>
            <p>
              When it comes to finding a <strong>dentist in Ahmedabad</strong>,
              it&rsquo;s essential to choose someone who meets your specific
              dental needs and offers a high standard of care.{' '}
              <strong>NextDentist</strong> makes it easy to find trusted,
              verified professionals who can offer you the best treatment.
              Whether you need a routine checkup or advanced dental procedures,
              our platform connects you with experienced dentists committed to
              improving your oral health.
            </p>
            <p>
              Start your search for the perfect dentist in Ahmedabad today and
              take the first step towards a healthier, brighter smile!
            </p>
          </div>
          <div className="flex basis-2/4 flex-col gap-4">Empty</div>
        </div>
      </SectionThree>
    </>
  );
};

export default DentistInAhmedabadClient;
