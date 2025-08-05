'use client';

import ReviewsSection from '@/components/dentist/ReviewsSection';
import ImagesGallery from '@/components/ImagesGallery';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SectionThree } from '@/components/SectionThree';
import { Tags } from '@/components/Tags';
import { Button } from '@/components/ui/button';
import { useDentistBySlug } from '@/hooks/useDentists';
import { Treatments } from '@prisma/client';
import {
  Award,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Smile,
  Star,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Import all new components
import {
  AlumniItem,
  AwardItem,
  ContactTab,
  DentistWithRelations,
  ExperienceTab,
  FaqItem,
  FAQSection,
  FloatingCallButton,
  GalleryTab,
  HeroSection,
  KnowsAboutItem,
  MobileProfile,
  NavigationTabs,
  OverviewTab,
  ProfileSidebar,
  ReviewsTab,
  TreatmentModal,
  TreatmentsTab,
  WorkingAtItem,
} from '@/components/dentist/front';

export default function DentistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const slug = params?.slug as string;
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatments | null>(
    null
  );
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const {
    data: dentistData,
    isLoading: isDentistLoading,
    isSuccess: isDentistSuccess,
    isError: isDentistError,
    error: dentistError,
  } = useDentistBySlug(slug);

  const dentist = dentistData as DentistWithRelations;

  // Robust parsing of potentially nested or array data
  const DegreeData = dentist?.dentistDegree || [];
  const treatments = dentist?.treatments || [];
  const images = dentist?.images || [];
  const businessHours = dentist?.businessHours || {};
  const languages = dentist?.languages || [];
  const specializations = dentist?.specializations || [];

  const awards = (
    dentist?.awards && Array.isArray(dentist.awards) ? dentist.awards : []
  ) as AwardItem[];
  const alumniOf = (
    dentist?.alumniOf && Array.isArray(dentist.alumniOf) ? dentist.alumniOf : []
  ) as AlumniItem[];
  const workingAt = (
    dentist?.workingAt && Array.isArray(dentist.workingAt)
      ? dentist.workingAt
      : []
  ) as WorkingAtItem[];
  const knowsAboutData = (
    dentist?.knowsAbout && Array.isArray(dentist.knowsAbout)
      ? dentist.knowsAbout
      : []
  ) as KnowsAboutItem[];
  const socialLinks = (
    dentist?.socialLinks && typeof dentist.socialLinks === 'object'
      ? dentist.socialLinks
      : {}
  ) as Record<string, string>;
  const dentistFaqs = (
    dentist?.faq && Array.isArray(dentist.faq) ? dentist.faq : []
  ) as FaqItem[];

  const calculateAge = (dobString?: string | null): number | null => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const age = calculateAge(dentist?.dob);

  const faqsForAccordion = dentistFaqs.map((faq, index) => ({
    id: index.toString(),
    question: faq.question,
    answer: faq.answer,
  }));

  const tags = dentist?.speciality
    ? [
        dentist.name,
        `dentist near ${dentist.city}`,
        dentist.speciality,
        `dentist in ${dentist.city}`,
        `dentist in ${dentist.state}`,
        `cost starts from ₹${dentist.priceStart}`,
      ]
    : dentist?.name
      ? [dentist.name, `dentist near ${dentist.city}`]
      : [];

  const handleMessageClick = () => {
    if (authStatus !== 'authenticated') {
      toast.error('Please login to send messages');
      router.push('/login');
      return;
    }

    if (!dentist?.userId) {
      toast.error('Unable to message this dentist');
      return;
    }

    // Redirect to chat with dentist's user ID
    router.push(`/chat?user=${dentist.userId}`);
  };

  if (isDentistLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isDentistError) {
    console.error('Error fetching dentist:', dentistError);
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-4xl bg-red-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">
            Error Loading Dentist
          </h2>
          <p className="mb-4 text-gray-700">
            {dentistError?.message ||
              'Could not load dentist details. Please try again later.'}
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (isDentistSuccess && !dentist) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-4xl bg-yellow-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-yellow-600">
            Dentist Not Found
          </h2>
          <p className="mb-4 text-gray-700">
            We couldn't find the dentist you're looking for.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8F8]">
      <div className="flex flex-col gap-6 px-4 py-4 md:hidden">
        <MobileProfile dentist={dentist} />
        {/* Treatments Section */}
        {treatments.length > 0 && (
          <TreatmentsTab
            treatments={treatments}
            onTreatmentSelect={setSelectedTreatment}
            isVisible={isVisible}
          />
        )}
      </div>
      {/* Hero Section */}
      <HeroSection
        dentist={dentist}
        isVisible={isVisible}
        degreeData={DegreeData}
      />
      {/* Navigation Tabs - Desktop Only */}
      <div className="hidden lg:block">
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      {/* Main Content */}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
        {/* Desktop Layout - Sidebar + Tabs */}
        <div className="hidden w-full gap-6 lg:flex">
          {/* Left Sidebar - Profile */}
          <ProfileSidebar dentist={dentist} degreeData={DegreeData} age={age} />

          {/* Right Content */}
          <div className="flex-1">
            <div className="rounded-4xl border border-[#92b5b9]/20 bg-white p-8">
              {activeTab === 'overview' && (
                <OverviewTab
                  dentist={dentist}
                  knowsAboutData={knowsAboutData}
                  socialLinks={socialLinks}
                  isVisible={isVisible}
                />
              )}

              {activeTab === 'treatments' && (
                <TreatmentsTab
                  treatments={treatments}
                  onTreatmentSelect={setSelectedTreatment}
                  isVisible={isVisible}
                />
              )}

              {activeTab === 'gallery' && <GalleryTab images={images} />}

              {activeTab === 'experience' && (
                <ExperienceTab
                  dentist={dentist}
                  awards={awards}
                  alumniOf={alumniOf}
                  workingAt={workingAt}
                  degreeData={DegreeData}
                  languages={languages}
                  specializations={specializations}
                />
              )}

              {activeTab === 'reviews' && (
                <ReviewsTab
                  dentistId={dentist?.id || '1'}
                  faqsForAccordion={faqsForAccordion}
                  expandedFaq={expandedFaq}
                  onFaqToggle={setExpandedFaq}
                />
              )}

              {activeTab === 'contact' && (
                <ContactTab dentist={dentist} businessHours={businessHours} />
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section - Desktop Only */}
        <div className="hidden lg:block">
          <FAQSection dentist={dentist} />
        </div>

        {/* Mobile Layout - Single Column without Tabs */}
        <div className="block lg:hidden">
          <div className="space-y-6">
            {/* Mobile Profile Card */}

            {/* About Section */}
            {(dentist?.longBio || dentist?.shortBio) && (
              <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
                <h2 className="mb-4 flex items-center text-xl font-bold text-[#356574]">
                  <Smile className="mr-2 h-5 w-5 text-[#df9d7c]" />
                  About
                </h2>
                <p className="text-sm whitespace-pre-wrap text-gray-600">
                  {dentist.longBio || dentist.shortBio}
                </p>
              </div>
            )}

            {/* Gallery Section */}
            {images.length > 0 && (
              <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
                <h2 className="mb-4 flex items-center text-xl font-bold text-[#356574]">
                  <Award className="mr-2 h-5 w-5 text-[#df9d7c]" />
                  Gallery
                </h2>
                <ImagesGallery images={images} />
              </div>
            )}

            {/* Experience Section */}
            <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center text-xl font-bold text-[#356574]">
                <GraduationCap className="mr-2 h-5 w-5 text-[#df9d7c]" />
                Experience
              </h2>

              {/* Degrees */}

              <div className="flex flex-col gap-6 px-4 py-4 md:hidden">
                {/* Treatments Section */}

                <ExperienceTab
                  dentist={dentist}
                  awards={awards}
                  alumniOf={alumniOf}
                  workingAt={workingAt}
                  degreeData={DegreeData}
                  languages={languages}
                  specializations={specializations}
                />
              </div>

              {/* Languages */}
              {languages.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 font-semibold text-[#356574]">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#df9d7c]/10 px-3 py-1 text-xs text-[#df9d7c]"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center text-xl font-bold text-[#356574]">
                <Star className="mr-2 h-5 w-5 text-[#df9d7c]" />
                Reviews
              </h2>
              <ReviewsSection dentistId={dentist?.id || '1'} />
            </div>

            {/* Contact Section */}
            <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center text-xl font-bold text-[#356574]">
                <MapPin className="mr-2 h-5 w-5 text-[#df9d7c]" />
                Contact
              </h2>

              {/* Contact Information */}
              <div className="space-y-4">
                {(dentist?.practiceLocation || dentist?.city) && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[#df9d7c]" />
                    <div>
                      <h4 className="font-semibold text-[#356574]">Address</h4>
                      <p className="text-sm text-[#92b5b9]">
                        {dentist?.practiceLocation && (
                          <span>
                            {dentist.practiceLocation}
                            <br />
                          </span>
                        )}
                        {[dentist?.city, dentist?.state, dentist?.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {dentist?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-[#df9d7c]" />
                    <div>
                      <h4 className="font-semibold text-[#356574]">Phone</h4>
                      <p className="text-sm text-[#92b5b9]">{dentist.phone}</p>
                    </div>
                  </div>
                )}

                {dentist?.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[#df9d7c]" />
                    <div>
                      <h4 className="font-semibold text-[#356574]">Email</h4>
                      <p className="text-sm text-[#92b5b9]">{dentist.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Business Hours */}
              {Object.keys(businessHours).length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 flex items-center font-semibold text-[#356574]">
                    <Clock className="mr-2 h-5 w-5 text-[#df9d7c]" />
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(businessHours)
                      .slice(0, 3)
                      .map(([day, schedule]) => {
                        const daySchedule = schedule as {
                          Hours: { from: string; to: string }[];
                          Closed: boolean;
                        };
                        return (
                          <div
                            key={day}
                            className="flex justify-between rounded-lg bg-[#fffbf8] p-2 text-sm"
                          >
                            <span className="font-medium text-[#356574]">
                              {day}
                            </span>
                            <span className="text-[#92b5b9]">
                              {daySchedule?.Closed
                                ? 'Closed'
                                : `${daySchedule?.Hours?.[0]?.from} - ${daySchedule?.Hours?.[0]?.to}`}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button className="w-full bg-[#356574] text-white hover:bg-[#2a4d5a]">
                  Book Appointment
                </Button>
                {dentist?.userId && (
                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                    onClick={handleMessageClick}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                )}
              </div>
            </div>

            {/* FAQ Section for Mobile */}
            <FAQSection dentist={dentist} />
          </div>
        </div>
      </div>
      {/* Treatment Modal */}
      <TreatmentModal
        treatment={selectedTreatment}
        dentistPhone={dentist?.phone || undefined}
        onClose={() => setSelectedTreatment(null)}
      />
      {/* Floating Call Button */}
      <FloatingCallButton phone={dentist?.phone || undefined} />
      {/* Tags Section */}
      <SectionThree className="py-4">
        {tags.length > 0 && <Tags tags={tags as string[]} />}
      </SectionThree>
    </div>
  );
}
