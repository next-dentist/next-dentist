import {
    BookOpen,
    Building2,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    Home,
    LayoutDashboard,
    Mail,
    Search,
    Settings,
    Star,
    Stethoscope,
    User,
    Users
} from "lucide-react";

export interface SubMenuItem {
  name: string;
  href: string;
  description?: string;
  icon?: any;
}

export interface MenuItem {
  name: string;
  href: string;
  icon?: any;
  image?: string;
  submenu?: SubMenuItem[];
  description?: string;
}

export const headerConfig = {
  // Main navigation menu items
  navLinks: [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Browse Dentists",
      href: "/search",
      icon: Search,
      image: "/images/browse-dentists.webp",
      description: "Find qualified dentists in your area",
    },
    {
      name: "Treatments",
      href: "/treatments",
      icon: Stethoscope,
      image: "/images/treatments.webp",
      description: "Explore dental treatments and procedures",
      submenu: [
        {
          name: "Root Canal",
          href: "/treatments/root-canal",
          description: "Endodontic treatment for infected teeth",
        },
        {
          name: "Teeth Whitening",
          href: "/treatments/teeth-whitening",
          description: "Professional teeth whitening services",
        },
        {
          name: "Dental Implants",
          href: "/treatments/dental-implants",
          description: "Permanent tooth replacement solutions",
        },
        {
          name: "Orthodontics",
          href: "/treatments/orthodontics",
          description: "Braces and teeth alignment",
        },
        {
          name: "View All Treatments",
          href: "/treatments",
          description: "Browse complete treatment catalog",
        },
      ],
    },
    {
      name: "About",
      href: "/about",
      icon: Users,
      image: "/images/about.webp",
      description: "Learn more about our mission and team",
      submenu: [
        {
          name: "About Us",
          href: "/about",
          description: "Our mission and vision",
          icon: Building2,
        },
        {
          name: "Our Founders",
          href: "/founders",
          description: "Meet the founding team",
          icon: User,
        },
        {
          name: "Our Team",
          href: "/team",
          description: "Meet our dedicated team",
          icon: Users,
        },
        {
          name: "Why Choose Us",
          href: "/why-choose-us",
          description: "Why choose NextDentist",
          icon: Users,
        },
        // {
        //   name: "Advisors",
        //   href: "/about/advisors",
        //   description: "Our advisory board",
        //   icon: UserCheck,
        // },
      ],
    },
    {
      name: "Pricing",
      href: "/pricing",
      icon: DollarSign,
      description: "Transparent pricing for all services",
    },
    {
      name: "Resources",
      href: "#",
      icon: BookOpen,
      image: "/images/browse-dentists.webp",
      description: "Latest dental health articles",
      submenu: [
        {
          name: "Blog",
          href: "/posts",
          description: "Latest dental health articles",
          icon: FileText,
        },
        {
          name: "Patient Guide",
          href: "/how-it-works-for-patients",
          description: "Your guide to dental care",
          icon: BookOpen,
        },
        {
          name: "FAQ",
          href: "/faq",
          description: "Frequently asked questions",
          icon: Settings,
        },
      ],
    },
    {
      name: "Contact",
      href: "/contact",
      icon: Mail,
      description: "Get in touch with our team",
    },
  ] as MenuItem[],

  // Header action buttons
  headerButtons: [
    {
      name: "Manage Practice",
      href: "/manage-dentists",
      icon: LayoutDashboard,
      variant: "outline" as const,
      description: "For dental professionals",
    },
  ],

  // User menu items (when authenticated)
  userMenuItems: [
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      description: "Manage your account",
    },
    {
      name: "My Appointments",
      href: "/appointments",
      icon: Calendar,
      description: "View and manage appointments",
    },
    {
      name: "Medical History",
      href: "/medical-history",
      icon: FileText,
      description: "Your dental records",
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: Star,
      description: "Saved dentists and clinics",
    },
  ],

  // Admin menu items
  adminMenuItems: [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Dentists",
      href: "/admin/dentists",
      icon: Stethoscope,
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
      icon: Star,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ],

  // Professional menu items for dentists
  professionalMenuItems: [
    {
      name: "Practice Dashboard",
      href: "/manage-dentists",
      icon: LayoutDashboard,
      description: "Manage your practice",
    },
    {
      name: "Appointments",
      href: "/manage-dentists/appointments",
      icon: Calendar,
      description: "View and manage appointments",
    },
    {
      name: "Working Hours",
      href: "/manage-dentists/working-hours",
      icon: Clock,
      description: "Set your availability",
    },
    {
      name: "Patient Reviews",
      href: "/manage-dentists/reviews",
      icon: Star,
      description: "Manage patient feedback",
    },
  ],

  // Contact information for mobile menu
  contactInfo: {
    phone: "+919328036817",
    email: "connect@nextdentist.com",
    address: "203, Bricklane 1964, Mangal Pandey Rd, near L&T Circle, Karelibagh, Vadodara, Gujarat 390018",
  },

  // Social links
  socialLinks: [
    {
      name: "Twitter",
      href: "https://twitter.com/next-dentist",
      icon: "twitter",
    },
    {
      name: "GitHub",
      href: "https://github.com/next-dentist",
      icon: "github",
    },
  ],
};

export type HeaderConfig = typeof headerConfig; 