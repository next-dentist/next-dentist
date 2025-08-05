'use client';
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Shield,
  Smile,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Treatment {
  name: string;
  price: string;
  maxPrice?: string;
  minPrice?: string;
  duration: string;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color?: string;
}

interface TreatmentCardProps {
  treatment: Treatment;
  index: number;
}

const DentistProfile = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const dentistData = {
    name: 'Dr. Dhaval Trivedi',
    email: 'info@estheticaindia.com',
    phone: '+917874700596',
    shortBio:
      'Dr. Dhaval Trivedi is a gold medal-winning oral and maxillofacial surgeon, facial cosmetic surgeon, and implantologist based in Vadodara. He is a graduate of DY Patil School of Dentistry in Mumbai.',
    longBio:
      'I have more than a decade of experience in private practice. I combine the proven methods of conventional dentistry with the cutting edge, state of the art techniques of modern adhesive dentistry. I love to work at Esthetica, which was built with the mandate of creating the absolute best environment for dentistry. I take pride in learning, amalgamating, promoting and providing the best dentistry has to offer to my patients.\n\nI believe that the process of dentistry should be a positive one, which includes a knowledgeable dentist and patient. So discussion of treatment plans and patient understanding is at the forefront of my goals.',
    experience: '15',
    rating: 5,
    totalReviews: 1,
    treatmentCompleted: 6000,
    patientsServed: 4500,
    speciality: 'Dental Implants',
    address:
      '201-203, Bricklane 1964, Opp Ratri Bazar, Mangal Pandey Road, Near L & T Circle, Karelibagh',
    city: 'Vadodara',
    state: 'Gujarat',
    country: 'India',
    website: 'https://estheticaindia.com/',
    businessHours: {
      Monday: { Hours: [{ from: '10:00 AM', to: '07:30 PM' }], Closed: false },
      Tuesday: { Hours: [{ from: '10:00 AM', to: '07:30 PM' }], Closed: false },
      Wednesday: {
        Hours: [{ from: '10:00 AM', to: '07:30 PM' }],
        Closed: false,
      },
      Thursday: {
        Hours: [{ from: '10:00 AM', to: '07:30 PM' }],
        Closed: false,
      },
      Friday: { Hours: [{ from: '10:00 AM', to: '07:30 PM' }], Closed: false },
      Saturday: {
        Hours: [{ from: '10:00 AM', to: '07:30 PM' }],
        Closed: false,
      },
      Sunday: { Hours: [], Closed: true },
    },
    degrees: [
      { name: 'MDS', fullName: 'Master of Dental Surgery' },
      { name: 'BDS', fullName: 'Bachelor of Dental Surgery' },
    ],
    treatments: [
      {
        name: 'Tooth Extraction',
        price: '500',
        maxPrice: '2000',
        duration: '15 mins',
      },
      { name: 'Dental X-rays', price: '150', duration: '15 mins' },
      {
        name: 'Dental scaling',
        price: '500',
        maxPrice: '2000',
        duration: '2 visits',
      },
      {
        name: 'Dental Implants',
        price: '10000',
        maxPrice: '50000',
        duration: 'more than 1 month',
      },
      {
        name: 'Clear Aligner',
        price: '100000',
        maxPrice: '300000',
        duration: 'more than 1 month',
      },
      {
        name: 'Smile Design',
        price: '5000',
        minPrice: '50000',
        duration: 'More then 1 hour',
      },
      {
        name: 'Teeth Polishing',
        price: '500',
        maxPrice: '2000',
        duration: '15 mins',
      },
      {
        name: 'All on Four Dental Implants',
        price: '20000',
        duration: '1 Month',
      },
      { name: 'Dental Check-Up', price: '500', duration: '15 Minutes' },
      { name: 'Dental Cleanings', price: '500', duration: '30 Minutes' },
      { name: 'Fluoride Treatments', price: '500', duration: '15 Minutes' },
      {
        name: 'Dentures',
        price: '15000',
        minPrice: '10000',
        maxPrice: '20000',
        duration: '3 visits',
      },
    ] as Treatment[],
    faq: [
      {
        question: "What makes Dr. Dhaval Trivedi's practice unique?",
        answer:
          'Over a decade of experience with a focus on combining proven and modern techniques. Emphasis on patient communication and understanding. Comfortable, anxiety-free environment for treatments. Personalized care and involvement in treatment planning',
      },
      {
        question: 'Does Dr. Dhaval Trivedi treat anxious patients?',
        answer:
          'Yes, the clinic is known for its welcoming and comfortable atmosphere, helping patients relax and overcome dental anxiety',
      },
      {
        question: 'Are flexible payment options available?',
        answer:
          'Yes, Esthetica offers flexible payment options and occasional discounts for various procedures',
      },
      {
        question: 'Is the clinic easily accessible?',
        answer:
          'Yes, it is near the airport, express highway, and major areas in Vadodara',
      },
    ],
    socialLinks: {
      facebook: 'https://www.facebook.com/Estheticavadodara',
      instagram: 'https://www.instagram.com/esthetica.hospital.vadodara/',
    },
  };

  const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    value,
    label,
    color = 'text-[#356574]',
  }) => (
    <div
      className={`transform rounded-xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${isVisible ? 'animate-in slide-in-from-bottom-4' : ''}`}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`rounded-full bg-gradient-to-br from-[#df9d7c]/20 to-[#92b5b9]/20 p-3`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <div className="text-2xl font-bold text-[#356574]">{value}</div>
          <div className="text-sm text-[#92b5b9]">{label}</div>
        </div>
      </div>
    </div>
  );

  const TreatmentCard: React.FC<TreatmentCardProps> = ({
    treatment,
    index,
  }) => (
    <div
      className={`transform cursor-pointer rounded-xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${isVisible ? 'animate-in slide-in-from-bottom-4' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => setSelectedTreatment(treatment)}
    >
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-[#356574]">
          {treatment.name}
        </h3>
        <ChevronRight className="h-5 w-5 text-[#df9d7c]" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#92b5b9]">Starting from</span>
          <span className="font-bold text-[#df9d7c]">₹{treatment.price}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#92b5b9]">Duration</span>
          <span className="text-sm text-[#356574]">{treatment.duration}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffbf8] via-white to-[#92b5b9]/10">
      {/* SEO-optimized head content would go here in Next.js */}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#356574] via-[#356574] to-[#92b5b9]">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div
            className={`grid items-center gap-12 lg:grid-cols-2 ${isVisible ? 'animate-in fade-in duration-1000' : ''}`}
          >
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center space-x-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <Award className="h-4 w-4" />
                <span className="text-sm">Gold Medal Winner</span>
              </div>

              <h1 className="text-4xl leading-tight font-bold lg:text-6xl">
                {dentistData.name}
                <span className="mt-2 block text-2xl text-[#df9d7c] lg:text-3xl">
                  Oral & Maxillofacial Surgeon
                </span>
              </h1>

              <p className="text-xl leading-relaxed text-white/90">
                {dentistData.shortBio}
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="transform rounded-full bg-[#df9d7c] px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#df9d7c]/90">
                  Book Appointment
                </button>
                <button className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#356574]">
                  <Phone className="mr-2 inline h-4 w-4" />
                  Call Now
                </button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#df9d7c] text-[#df9d7c]"
                    />
                  ))}
                  <span className="ml-2 text-white/90">
                    5.0 ({dentistData.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                  <StatCard
                    icon={Users}
                    value={`${dentistData.patientsServed}+`}
                    label="Patients Served"
                    color="text-white"
                  />
                  <StatCard
                    icon={CheckCircle}
                    value={`${dentistData.treatmentCompleted}+`}
                    label="Treatments Done"
                    color="text-white"
                  />
                  <StatCard
                    icon={Award}
                    value={`${dentistData.experience}+`}
                    label="Years Experience"
                    color="text-white"
                  />
                  <StatCard
                    icon={Smile}
                    value="100%"
                    label="Success Rate"
                    color="text-white"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#df9d7c]/30 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 border-b border-[#92b5b9]/20 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            {[
              { id: 'about', label: 'About', icon: Users },
              { id: 'treatments', label: 'Treatments', icon: Heart },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'contact', label: 'Contact', icon: MapPin },
              { id: 'faq', label: 'FAQ', icon: CheckCircle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 rounded-full px-6 py-3 font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === id
                    ? 'bg-[#356574] text-white shadow-lg'
                    : 'text-[#356574] hover:bg-[#92b5b9]/20'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {activeTab === 'about' && (
          <div className="space-y-12">
            {/* About Section */}
            <div
              className={`grid gap-8 lg:grid-cols-3 ${isVisible ? 'animate-in slide-in-from-bottom-4' : ''}`}
            >
              <div className="space-y-8 lg:col-span-2">
                <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-8 shadow-lg">
                  <h2 className="mb-6 flex items-center text-3xl font-bold text-[#356574]">
                    <Smile className="mr-3 h-8 w-8 text-[#df9d7c]" />
                    About Dr. Dhaval Trivedi
                  </h2>
                  <div className="prose prose-lg leading-relaxed text-[#356574]">
                    {dentistData.longBio
                      .split('\n\n')
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>

                {/* Qualifications */}
                <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-8 shadow-lg">
                  <h3 className="mb-6 flex items-center text-2xl font-bold text-[#356574]">
                    <Award className="mr-3 h-6 w-6 text-[#df9d7c]" />
                    Qualifications
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {dentistData.degrees.map((degree, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-[#df9d7c]/10 to-[#92b5b9]/10 p-4"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#356574]">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#356574]">
                            {degree.name}
                          </div>
                          <div className="text-sm text-[#92b5b9]">
                            {degree.fullName}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold text-[#356574]">
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#92b5b9]">Experience</span>
                      <span className="font-semibold text-[#356574]">
                        {dentistData.experience} years
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#92b5b9]">Specialty</span>
                      <span className="font-semibold text-[#356574]">
                        {dentistData.speciality}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#92b5b9]">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-[#df9d7c] text-[#df9d7c]" />
                        <span className="font-semibold text-[#356574]">
                          {dentistData.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold text-[#356574]">
                    Why Choose Us
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: Shield, text: 'Advanced Technology' },
                      { icon: Heart, text: 'Patient-Centered Care' },
                      { icon: Zap, text: 'Quick & Efficient' },
                      { icon: Award, text: 'Gold Medal Winner' },
                    ].map(({ icon: Icon, text }, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-[#df9d7c]" />
                        <span className="text-[#356574]">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-xl font-bold text-[#356574]">
                    Connect With Us
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href={dentistData.socialLinks.facebook}
                      className="rounded-full bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href={dentistData.socialLinks.instagram}
                      className="rounded-full bg-pink-500 p-3 text-white transition-colors hover:bg-pink-600"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href={dentistData.website}
                      className="rounded-full bg-[#356574] p-3 text-white transition-colors hover:bg-[#356574]/90"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'treatments' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-4 text-4xl font-bold text-[#356574]">
                Our Treatments
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-[#92b5b9]">
                Comprehensive dental care with state-of-the-art technology and
                personalized treatment plans
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dentistData.treatments.map((treatment, index) => (
                <TreatmentCard
                  key={index}
                  treatment={treatment}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-8 shadow-lg">
              <h2 className="mb-6 flex items-center text-3xl font-bold text-[#356574]">
                <Clock className="mr-3 h-8 w-8 text-[#df9d7c]" />
                Business Hours
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(dentistData.businessHours).map(
                  ([day, schedule]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#fffbf8] to-[#92b5b9]/10 p-4"
                    >
                      <span className="font-semibold text-[#356574]">
                        {day}
                      </span>
                      <span className="text-[#92b5b9]">
                        {schedule.Closed
                          ? 'Closed'
                          : `${schedule.Hours[0]?.from} - ${schedule.Hours[0]?.to}`}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="mt-8 rounded-xl bg-gradient-to-r from-[#df9d7c]/10 to-[#356574]/10 p-6">
                <h3 className="mb-3 text-xl font-semibold text-[#356574]">
                  Ready to Schedule?
                </h3>
                <p className="mb-4 text-[#92b5b9]">
                  Book your appointment today and take the first step towards
                  better oral health.
                </p>
                <button className="transform rounded-full bg-[#356574] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#356574]/90">
                  <Calendar className="mr-2 inline h-4 w-4" />
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-[#356574]">
                Get In Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="mt-1 h-6 w-6 text-[#df9d7c]" />
                  <div>
                    <h3 className="mb-1 font-semibold text-[#356574]">
                      Address
                    </h3>
                    <p className="text-[#92b5b9]">
                      {dentistData.address}, {dentistData.city},{' '}
                      {dentistData.state}, {dentistData.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-[#df9d7c]" />
                  <div>
                    <h3 className="mb-1 font-semibold text-[#356574]">Phone</h3>
                    <p className="text-[#92b5b9]">{dentistData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-[#df9d7c]" />
                  <div>
                    <h3 className="mb-1 font-semibold text-[#356574]">Email</h3>
                    <p className="text-[#92b5b9]">{dentistData.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#92b5b9]/20 bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-2xl font-bold text-[#356574]">
                Send Message
              </h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-[#92b5b9]/30 p-3 focus:border-transparent focus:ring-2 focus:ring-[#df9d7c] focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full rounded-lg border border-[#92b5b9]/30 p-3 focus:border-transparent focus:ring-2 focus:ring-[#df9d7c] focus:outline-none"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full rounded-lg border border-[#92b5b9]/30 p-3 focus:border-transparent focus:ring-2 focus:ring-[#df9d7c] focus:outline-none"
                  ></textarea>
                </div>
                <button className="w-full rounded-lg bg-[#356574] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#356574]/90">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-[#356574]">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-[#92b5b9]">
                Find answers to common questions about our services
              </p>
            </div>

            <div className="space-y-4">
              {dentistData.faq.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-[#92b5b9]/20 bg-white shadow-lg"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[#fffbf8]"
                  >
                    <h3 className="pr-4 font-semibold text-[#356574]">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-[#df9d7c] transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="leading-relaxed text-[#92b5b9]">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Treatment Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8">
            <div className="mb-6 flex items-start justify-between">
              <h2 className="text-2xl font-bold text-[#356574]">
                {selectedTreatment.name}
              </h2>
              <button
                onClick={() => setSelectedTreatment(null)}
                className="text-2xl text-[#92b5b9] transition-colors hover:text-[#356574]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-[#fffbf8] p-4">
                <span className="font-medium text-[#356574]">
                  Starting Price
                </span>
                <span className="text-2xl font-bold text-[#df9d7c]">
                  ₹{selectedTreatment.price}
                </span>
              </div>

              {selectedTreatment.maxPrice && (
                <div className="flex items-center justify-between rounded-lg bg-[#fffbf8] p-4">
                  <span className="font-medium text-[#356574]">
                    Price Range
                  </span>
                  <span className="text-lg font-semibold text-[#356574]">
                    ₹{selectedTreatment.price} - ₹{selectedTreatment.maxPrice}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg bg-[#fffbf8] p-4">
                <span className="font-medium text-[#356574]">Duration</span>
                <span className="text-lg font-semibold text-[#356574]">
                  {selectedTreatment.duration}
                </span>
              </div>

              <div className="space-y-3 pt-4">
                <button className="w-full rounded-lg bg-[#356574] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#356574]/90">
                  <Calendar className="mr-2 inline h-4 w-4" />
                  Book This Treatment
                </button>
                <button className="w-full rounded-lg border-2 border-[#356574] py-3 font-semibold text-[#356574] transition-all duration-300 hover:bg-[#356574] hover:text-white">
                  <Phone className="mr-2 inline h-4 w-4" />
                  Call for Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Call Button */}
      <div className="fixed right-6 bottom-6 z-40">
        <button className="transform rounded-full bg-[#df9d7c] p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#df9d7c]/90">
          <Phone className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default DentistProfile;
