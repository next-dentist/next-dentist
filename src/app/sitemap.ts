// app/sitemap.ts
import { MetadataRoute } from "next";
import { fetchDataForSitemap } from "./actions/fetchDataForSitemap";

export async function generateSitemaps() {
  return [{ id: "dentists" }, { id: "treatments" }, { id: "pages" }, { id: "blogs" }, { id: "costPages" }];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (id === "dentists") {
    try {
      const { dentists } = await fetchDataForSitemap();
      return dentists.map((dentist) => ({
        url: `${baseUrl}/dentists/${dentist.slug}`,
        lastModified: `${new Date(dentist.updatedDateAndTime || new Date().toISOString()).toISOString()}`,
        changeFrequency: "daily",
        priority: 0.8,
      }));
    } catch (error) {
      console.error("Error generating dentist sitemap:", error);
      return [];
    }
  }

  if (id === "treatments") {
    //  do not fetch just create sample data
    const { treatments } = await fetchDataForSitemap();
    return treatments.map((treatment) => ({
      url: `${baseUrl}/treatments/${treatment.slug}`,
      lastModified: `${new Date(treatment.updatedDateAndTime || new Date().toISOString()).toISOString()}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  if (id === "blogs") {
    const { blogs } = await fetchDataForSitemap();
    return blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: `${new Date(blog.updatedAt || new Date().toISOString()).toISOString()}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  if (id === "costpages") {
    const { costPages } = await fetchDataForSitemap();
    return costPages.map((costPage) => ({
      url: `${baseUrl}/cost-pages/${costPage.slug}`,
      lastModified: `${new Date(costPage.updatedDateAndTime || new Date().toISOString()).toISOString()}`,
      changeFrequency: "daily",
      priority: 0.9,
    }));
  }
  if (id === "pages") {
    return [
      {
        url: `${baseUrl}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 1,
      },
      // search
      {
        url: `${baseUrl}/search`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      //  about
      {
        url: `${baseUrl}/about`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      // treatments
      {
        url: `${baseUrl}/treatments`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      // login
      {
        url: `${baseUrl}/login`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      // register
      {
        url: `${baseUrl}/register`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      // forgot password
      {
        url: `${baseUrl}/forgot-password`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      // contact
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      // dentists
      {
        url: `${baseUrl}/dentist`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      // dentist-in-ahmedabad
      {
        url: `${baseUrl}/dentist-in-ahmedabad`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      // search-nav
      {
        url: `${baseUrl}/search-nav`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily",
        priority: 0.8,
      },

      // pricing
      {
        url: `${baseUrl}/pricing`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly", // Pricing pages might not change daily
        priority: 0.7, // Slightly lower priority than core pages
      },
      // How It Works for Dentists
      { url: `${baseUrl}/how-it-works-for-dentists`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Why Choose Us
      { url: `${baseUrl}/why-choose-us`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Quality Guidelines
      { url: `${baseUrl}/quality-guidelines`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Trust and Safety
      { url: `${baseUrl}/trust-and-safety`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Verification Process
      { url: `${baseUrl}/verification-process`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // How It Works for Patients
      { url: `${baseUrl}/how-it-works-for-patients`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Privacy Policy
      { url: `${baseUrl}/privacy-policy`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Director Desk
      { url: `${baseUrl}/director-desk`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Accessibility
      { url: `${baseUrl}/accessibility`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Careers
      { url: `${baseUrl}/careers`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Terms of Services
      { url: `${baseUrl}/terms-of-services`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      // Legal Pages
      { url: `${baseUrl}/gdpr-ccpa`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      { url: `${baseUrl}/medical-disclaimer`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
      { url: `${baseUrl}/cookie-policy`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.7 },
    ];
  }
  return [];
}
