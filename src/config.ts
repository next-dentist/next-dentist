//site config
import {
  Building2,
  Calendar,
  Image as ImageIcon,
  Pencil,
  Star,
  UserPen
} from "lucide-react";
export const siteConfig = {
  name: "Next Dentist",
  description: "All in One SEO solution for Dentists",
  url: "https://nextdentist.com",
  logoLight: "/logo.png",
  logoDark: "/logo-dark.png",
  logoAlt: "Next Dentist Logo",
  favicon: "/favicon.ico",
  links: {
    twitter: "https://twitter.com/next-dentist",
    github: "https://github.com/next-dentist",
  },
  address: "203, Bricklane 1964, Mangal Pandey Rd, near L&T Circle, Karelibagh, Vadodara, Gujarat 390018",
  phone: "+919328036817",
  email: "connect@nextdentist.com",
  // Navigation moved to config-header.ts for better organization
  // Legacy header buttons - use config-header.ts for new header system
  // footer links
  footerLinks: [
    {
      name: "Home",
      href: "/",
    },
    // Browse Dentists
    {
      name: "Browse Dentists",
      href: "/search",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
    {
      name: "Treatments",
      href: "/treatments",
    },
  ],
 
  // treatments
  treatments: [
    {
      id: 1,
      name: "Root Canal",
      href: "/treatments/root-canal",
      value: "Root Canal",
    },
    {
      id: 2,
      name: "Teeth Whitening",
      href: "/treatments/teeth-whitening",
      value: "Teeth Whitening",
    },
    {
      id: 3,
      name: "Teeth Cleaning",
      href: "/treatments/teeth-cleaning",
      value: "Teeth Cleaning",
    },
    {
      id: 4,
      name: "Dental Implants",
      href: "/treatments/dental-implants",
      value: "Dental Implants",
    },
    {
      id: 5,
      name: "Clear Aligner",
      href: "/treatments/clear-aligner",
      value: "Clear Aligner",
    },
    {
      id: 6,
      name: "Veneers",
      href: "/treatments/veneers",
      value: "Veneers",
    },
    {
      id: 7,
      name: "Crowns",
      href: "/treatments/crowns",
      value: "Crowns",
    },
    {
      id: 8,
      name: "Bridges",
      href: "/treatments/bridges",
      value: "Bridges",
    },
    {
      id: 9,
      name: "Fillings",
      href: "/treatments/fillings",
      value: "Fillings",
    },
    {
      id: 10,
      name: "Wisdom Teeth",
      href: "/treatments/wisdom-teeth",
      value: "Wisdom Teeth",
    },
    {
      id: 11,
      name: "Tooth Extraction",
      href: "/treatments/tooth-extraction",
      value: "Tooth Extraction",
    },
    {
      id: 12,
      name: "Tooth Cleaning",
      href: "/treatments/tooth-cleaning",
      value: "Tooth Cleaning",
    },
    {
      id: 13,
      name: "X-Rays",
      href: "/treatments/x-rays",
      value: "X-Rays",
    },
    {
      id: 14,
      name: "Tooth Pain",
      href: "/treatments/tooth-pain",
      value: "Tooth Pain",
    },
    {
      id: 15,
      name: "Toothache",
      href: "/treatments/toothache",
      value: "Toothache",
    },
    {
      id: 16,
      name: "Inlay",
      href: "/treatments/inlay",
      value: "Inlay",
    },
    {
      id: 17,
      name: "Onlay",
      href: "/treatments/onlay",
      value: "Onlay",
    },
    {
      id: 18,
      name: "Oral Surgery",
      href: "/treatments/oral-surgery",
      value: "Oral Surgery",
    },
    {
      id: 19,
      name: "Implants",
      href: "/treatments/implants",
      value: "Implants",
    },
  ],
  cities: [
    {
      id: 1,
      name: "Ahmedabad",
      value: "ahmedabad",
    },
    {
      id: 2,
      name: "Bangalore",
      value: "bangalore",
    },
    {
      id: 5,
      name: "Hyderabad",
      value: "hyderabad",
    },
    {
      id: 6,
      name: "Kolkata",
      value: "kolkata",
    },
    {
      id: 7,
      name: "Surat",
      value: "surat",
    },
    {
      id: 8,
      name: "Pune",
      value: "pune",
    },
    {
      id: 9,
      name: "Vadodara",
      value: "vadodara",
    },
    {
      id: 10,
      name: "Mumbai",
      value: "mumbai",
    },
    {
      id: 11,
      name: "Delhi",
      value: "delhi",
    },
    {
      id: 12,
      name: "Chennai",
      value: "chennai",
    },

    { 
      id: 14,
      name: "Jaipur",
      value: "jaipur",
    },
    {
      id: 15,
      name: "Lucknow",  
      value: "lucknow",
    },
    {
      id: 16,
      name: "Indore",
      value: "indore",
    },
    {
      id: 17,
      name: "Bhopal",
      value: "bhopal",
    },
    // rajkot
    {
      id: 18,
      name: "Rajkot",
      value: "rajkot",
    },
    

  ],

  reviews: [
    {
      id: 1,
      name: "Sneha P.",
      image: "/images/reviewer-1.jpg",
      profession: "Patient",
      review:
        "I was so impressed with how easy it was to find a dentist through NextDentist! The platform let me compare verified reviews from real patients, which helped me choose Dr. Patel in my area. She was professional, gentle, and explained everything clearly during my cleaning. Booking the appointment online took less than two minutes—highly recommend this service!",
    },
    {
      id: 2,
      name: "Rajesh K.",
      image: "/images/reviewer-2.jpg",
      profession: "Patient",
      review:
        "NextDentist made finding an emergency dentist stress-free when I chipped my tooth over the weekend. I used their filters to narrow down dentists who offered same-day appointments, and within an hour, I had booked a visit. My only suggestion would be to add more details about insurance compatibility upfront, but overall, I'm very satisfied!",
    },
    {
      id: 3,
      name: "Kamil G.",
      image: "/images/reviewer-3.jpg",
      profession: "Patient",
      review:
        "This platform is a game-changer for someone like me who hates calling around to schedule appointments. I found Dr. Kim using NextDentist, and she was fantastic! Her office staff followed up promptly after my appointment to check on my recovery. Plus, reading other patient reviews beforehand gave me peace of mind knowing what to expect. Thank you, NextDentist!",
    },
    {
      id: 4,
      name: "Bhavik H.",
      image: "/images/reviewer-4.jpg",
      profession: "Patient",
      review:
        "The reviews on NextDentist were super helpful, especially since I'm new to the city and didn't know where to start looking for a dentist. I ended up booking with Dr. Adams, and while the appointment itself went well, the waiting room was a bit crowded. That said, NextDentist made the process seamless, and I'll definitely use it again next time I need care.",
    },
    {
      id: 5,
      name: "Kavya M.",
      image: "/images/reviewer-5.jpg",
      profession: "Patient",
      review:
        "As someone who dreads going to the dentist, I can't thank NextDentist enough for helping me find such a compassionate professional. Dr. Nguyen put me at ease immediately, and her modern office felt welcoming and clean. The online booking feature saved me so much time—I won't ever go back to searching manually. Highly recommend this service!",
    },
  ],
  degrees: [
    {
      id: 1,
      name: "BDS",
      value: "BDS",
      fullName: "Bachelor of Dental Surgery",
    },
    {
      id: 2,
      name: "MDS",
      value: "MDS",
      fullName: "Master of Dental Surgery",
    },
    {
      id: 3,
      name: "PG",
      value: "PG",
      fullName: "Post Graduate",
    },
    {
      id: 4,
      name: "M.Ch",
      value: "M.Ch",
      fullName: "Master of Chirurgery",
    },
    // masters in dentistry
  ],

  specialities: [
    {
      id: 1,
      name: "General Dentistry",
      value: "General Dentistry",
    },
    {
      id: 2,
      name: "Cosmetic Dentistry",
      value: "Cosmetic Dentistry",
    },
    {
      id: 3,
      name: "Orthodontics",
      value: "Orthodontics",
    },
    {
      id: 4,
      name: "Endodontics",
      value: "Endodontics",
    },
    {
      id: 5,
      name: "Pediatric Dentistry",
      value: "Pediatric Dentistry",
    },
    {
      id: 6,
      name: "Periodontics",
      value: "Periodontics",
    },
    {
      id: 7,
      name: "Prosthodontics",
      value: "Prosthodontics",
    },
    {
      id: 8,
      name: "Oral Surgery",
      value: "Oral Surgery",
    },
    {
      id: 9,
      name: "Dental Implants",
      value: "Dental Implants",
    },
  ],
  TimeSlotArray: [
    { key: "08:00 AM", label: "08:00 AM" },
    { key: "08:15 AM", label: "08:15 AM" },
    { key: "08:30 AM", label: "08:30 AM" },
    { key: "08:45 AM", label: "08:45 AM" },
    { key: "09:00 AM", label: "09:00 AM" },
    { key: "09:15 AM", label: "09:15 AM" },
    { key: "09:30 AM", label: "09:30 AM" },
    { key: "09:45 AM", label: "09:45 AM" },
    { key: "10:00 AM", label: "10:00 AM" },
    { key: "10:15 AM", label: "10:15 AM" },
    { key: "10:30 AM", label: "10:30 AM" },
    { key: "10:45 AM", label: "10:45 AM" },
    { key: "11:00 AM", label: "11:00 AM" },
    { key: "11:15 AM", label: "11:15 AM" },
    { key: "11:30 AM", label: "11:30 AM" },
    { key: "11:45 AM", label: "11:45 AM" },
    { key: "12:00 PM", label: "12:00 PM" },
    { key: "12:15 PM", label: "12:15 PM" },
    { key: "12:30 PM", label: "12:30 PM" },
    { key: "12:45 PM", label: "12:45 PM" },
    { key: "01:00 PM", label: "01:00 PM" },
    { key: "01:15 PM", label: "01:15 PM" },
    { key: "01:30 PM", label: "01:30 PM" },
    { key: "01:45 PM", label: "01:45 PM" },
    { key: "02:00 PM", label: "02:00 PM" },
    { key: "02:15 PM", label: "02:15 PM" },
    { key: "02:30 PM", label: "02:30 PM" },
    { key: "02:45 PM", label: "02:45 PM" },
    { key: "03:00 PM", label: "03:00 PM" },
    { key: "03:15 PM", label: "03:15 PM" },
    { key: "03:30 PM", label: "03:30 PM" },
    { key: "03:45 PM", label: "03:45 PM" },
    { key: "04:00 PM", label: "04:00 PM" },
    { key: "04:15 PM", label: "04:15 PM" },
    { key: "04:30 PM", label: "04:30 PM" },
    { key: "04:45 PM", label: "04:45 PM" },
    { key: "05:00 PM", label: "05:00 PM" },
    { key: "05:15 PM", label: "05:15 PM" },
    { key: "05:30 PM", label: "05:30 PM" },
    { key: "05:45 PM", label: "05:45 PM" },
    { key: "06:00 PM", label: "06:00 PM" },
    { key: "06:15 PM", label: "06:15 PM" },
    { key: "06:30 PM", label: "06:30 PM" },
    { key: "06:45 PM", label: "06:45 PM" },
    { key: "07:00 PM", label: "07:00 PM" },
    { key: "07:15 PM", label: "07:15 PM" },
    { key: "07:30 PM", label: "07:30 PM" },
    { key: "07:45 PM", label: "07:45 PM" },
    { key: "08:00 PM", label: "08:00 PM" },
    { key: "08:15 PM", label: "08:15 PM" },
    { key: "08:30 PM", label: "08:30 PM" },
    { key: "08:45 PM", label: "08:45 PM" },
    { key: "09:00 PM", label: "09:00 PM" },
    { key: "09:15 PM", label: "09:15 PM" },
    { key: "09:30 PM", label: "09:30 PM" },
    { key: "09:45 PM", label: "09:45 PM" },
    { key: "10:00 PM", label: "10:00 PM" },
    { key: "10:15 PM", label: "10:15 PM" },
    { key: "10:30 PM", label: "10:30 PM" },
    { key: "10:45 PM", label: "10:45 PM" },
    { key: "11:00 PM", label: "11:00 PM" },
    { key: "11:15 PM", label: "11:15 PM" },
    { key: "11:30 PM", label: "11:30 PM" },
    { key: "11:45 PM", label: "11:45 PM" },
    { key: "00:00 AM", label: "00:00 AM" },
    { key: "00:15 AM", label: "00:15 AM" },
    { key: "00:30 AM", label: "00:30 AM" },
    { key: "00:45 AM", label: "00:45 AM" },
    { key: "01:00 AM", label: "01:00 AM" },
    { key: "01:15 AM", label: "01:15 AM" },
    { key: "01:30 AM", label: "01:30 AM" },
    { key: "01:45 AM", label: "01:45 AM" },
    { key: "02:00 AM", label: "02:00 AM" },
    { key: "02:15 AM", label: "02:15 AM" },
    { key: "02:30 AM", label: "02:30 AM" },
    { key: "02:45 AM", label: "02:45 AM" },
    { key: "03:00 AM", label: "03:00 AM" },
    { key: "03:15 AM", label: "03:15 AM" },
    { key: "03:30 AM", label: "03:30 AM" },
    { key: "03:45 AM", label: "03:45 AM" },
    { key: "04:00 AM", label: "04:00 AM" },
    { key: "04:15 AM", label: "04:15 AM" },
    { key: "04:30 AM", label: "04:30 AM" },
    { key: "04:45 AM", label: "04:45 AM" },
    { key: "05:00 AM", label: "05:00 AM" },
    { key: "05:15 AM", label: "05:15 AM" },
    { key: "05:30 AM", label: "05:30 AM" },
    { key: "05:45 AM", label: "05:45 AM" },
    { key: "06:00 AM", label: "06:00 AM" },
    { key: "06:15 AM", label: "06:15 AM" },
    { key: "06:30 AM", label: "06:30 AM" },
    { key: "06:45 AM", label: "06:45 AM" },
    { key: "07:00 AM", label: "07:00 AM" },
    { key: "07:15 AM", label: "07:15 AM" },
    { key: "07:30 AM", label: "07:30 AM" },
    { key: "07:45 AM", label: "07:45 AM" },
  ],
  adminLinks: [
    {
      name: "Admin",
      href: "/admin",
    },
    {
      name:"Users",
      href:"/admin/users",
    },
    {
      name: "Treatments",
      href: "/admin/treatments",
    },
    {
      name: "Dentists",
      href: "/admin/dentists",
    },
    {
      name: "Blogs",
      href: "/admin/blogs",
    },
    {
      name: "Cost Pages",
      href: "/admin/cost-pages",
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
    },
    {
      name: "Admin Tools",
      href: "/admin/tools",
    },
  ],
  GALLERY_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  GALLERY_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  GALLERY_MAX_IMAGES: 10,
  GALLERY_IMAGE_UPLOAD_PATH: "uploads", // Fixed: was "/" causing path issues
};




export const getSidebarData = (id: string | number) => ({
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    // Manage Appointments
    {
      title: 'Manage Appointments',
      url: `/manage-dentists/${id}/dashboard/manage-appointments`,
      items: [
        {
          title: 'Today Appointments',
          url: `/manage-dentists/${id}/dashboard/today-appointments`,
          icon: Calendar,
        },
        {
          title: 'All Appointments',
          url: `/manage-dentists/${id}/dashboard/all-appointments`,
          icon: Calendar,
        },
        
      ],
    },

    {
      title: "Manage Your Practice",
      url: "#", // Group URL might not need ID, or adjust as needed
      items: [
        {
          title: "Basic Details",
          url: `/manage-dentists/${id}/dashboard/basic-details`,
          icon: UserPen,
        },
        // Personal Details
        {
          title: "Personal Details",
          url: `/manage-dentists/${id}/dashboard/personal-details`,
          icon: UserPen,
        },
        // Image Gallery
      ],
    },
    // manage clinic details
    {
      title: "Manage Clinic Details",
      url: `/manage-dentists/${id}/dashboard/manage-clinic-details`,
      icon: Building2,
      items: [
        {
          title: "Clinic Details",
          url: `/manage-dentists/${id}/dashboard/clinic-details`,
          icon: Building2,
        },
        {
          title: "Working Hours",
          url: `/manage-dentists/${id}/dashboard/working-hours`,
          icon: Calendar,
        },
      ],
    },
    {
      title: "Manage Treatments",
      url: `/manage-dentists/${id}/dashboard/manage-treatments`, // Group URL might need ID
      items: [
        {
          title: "Treatments",
          url: `/manage-dentists/${id}/dashboard/treatments`,
          icon: Pencil,
        },
        {
          title: "Featured Options",
          url: `/manage-dentists/${id}/dashboard/featured-options`,
          icon: Star,
        },
      ],
    },
    {
      title: "Manage Photos",
      url: `/manage-dentists/${id}/dashboard/manage-photos`, // Group URL might need ID
      items: [
        {
          title: "Image Gallery",
          url: `/manage-dentists/${id}/dashboard/image-gallery`,
          icon: ImageIcon,
        },
      ],
    },

  ],
});

export const AI_INSTRUCTIONS = [
  // create global instructions for AI to follow, Like business details, clinic details, treatments, etc.
  {
    id: 1,
    value: "MainSite",
    name: "Main Site Instructions",
    description:
      "Pretend to be a Dental Expert and write content for the NextDentist which is online Dentist listing platform. Write content in english always and regarding to this website. Use the following format for the content in bullet points: <ul> <li> <ol> <p> <b> ",
  },
];

// config.ts
export const currencyConfig = {
  /** what the user sees in the menus */
  list: [
    { id: 'INR', name: 'INR', symbol: '₹' },
    { id: 'USD', name: 'USD', symbol: '$' },
    { id: 'GBP', name: 'GBP', symbol: '£' },
    { id: 'EUR', name: 'EUR', symbol: '€' },
    { id: 'AUD', name: 'AUD', symbol: '$' },
    { id: 'CAD', name: 'CAD', symbol: '$' },
    { id: 'SGD', name: 'SGD', symbol: '$' },
    { id: 'HKD', name: 'HKD', symbol: '$' },
    { id: 'NZD', name: 'NZD', symbol: '$' },
    // …
  ],

  /** server-side refreshable mid-market rates (base = INR) */
  rates: {
    INR: 1,
    USD: 0.012,
    GBP: 0.0096,
    EUR: 0.011,
    AUD: 0.016,
    CAD: 0.015,
    SGD: 0.015,
    HKD: 0.085,
    NZD: 0.015,
    // …
  },
} as const;
