export const footerLinks = [
  {
    title: 'Categories',
    links: [
      { name: 'General Dentistry', href: '/search?search=general+dentist&nearby=true' },
      { name: 'Cosmetic Dentistry', href: '/search?search=cosmetic+dentist&nearby=true' },
      { name: 'Orthodontics', href: '/search?search=orthodontist&nearby=true' },
      { name: 'Endodontics', href: '/search?search=endodontist&nearby=true' },
      { name: 'Periodontics', href: '/search?search=periodontist&nearby=true' },
      { name: 'Oral Surgery', href: '/search?search=oral+surgery&nearby=true' },
    ],
  },
  {
    title: 'For Dentists',
    links: [
      // join as a dentist http://localhost:3000/dentists/add
      { name: 'Join as a Dentist', href: '/dentists/add' },
      { name: 'How it works?', href: '/how-it-works-for-dentists' },
      { name: 'Verification Process', href: '/verification-process' },
      { name: 'Claim your profile', href: '/register' },
      { name: 'Dentist Login', href: '/login' },
      { name: 'Trust and Safety', href: '/trust-and-safety' },
      { name: 'Dentist Blog', href: '/posts' },
      { name: 'Quality Guidelines', href: '/quality-guidelines' },

    ],
  },
  // for patients
  {
    title: 'For Patients',
    links: [
      { name: 'How it works?', href: '/how-it-works-for-patients' },
      { name: 'Patient Login', href: '/login' },
      { name: 'Trust and Safety', href: '/trust-and-safety' },
      { name: 'Quality Guidelines', href: '/quality-guidelines' },
      { name: 'Canada Dental Care Plan', href: 'https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html', target: '_blank' },
      { name: 'Canada Health Act', href: 'https://www.canada.ca/en/services/health/health-system-services.html', target: '_blank' },
      { name: 'Ontario Government', href: 'https://www.ontario.ca/page/government-ontario', target: '_blank' },
      // https://dhpp.hpfb-dgpsa.ca/
      { name: 'Drug and Health Product Portal', href: 'https://dhpp.hpfb-dgpsa.ca/', target: '_blank' },
      // https://mohfw.gov.in/
      { name: 'National Health Mission', href: 'https://mohfw.gov.in/', target: '_blank' },
      { name: 'India Government Services', href: 'https://services.india.gov.in/?ln=en', target: '_blank' },
    ],
  },
  // Company
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Director Desk', href: '/director-desk' },
      { name: 'Why Choose Us', href: '/why-choose-us' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-services' },
      { name: 'Accessibility Statement', href: '/accessibility' },
      { name: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'GDPR & CCPA Compliance', href: '/gdpr-ccpa' },
      { name: 'Medical Disclaimer', href: '/medical-disclaimer' },
    ],
  },
];