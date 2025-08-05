'use server';
import { getCostPageBySlug } from '@/app/actions/cost/CostActionFrontEnd';
import CostPageFront from '@/components/CostPagesFrontEnd/CostPageFrontTwo';
import { CostPageData } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCostPageBySlug(slug);

  if (!data) {
    return {
      title: 'Not Found | NextDentist',
      description: 'The requested page could not be found.',
    };
  }

  const title = data.seoTitle || data.title;
  const description = data.seoDescription || data.content?.slice(0, 160) || '';
  const keywords = Array.isArray(data.relatedKeys)
    ? data.relatedKeys.join(', ')
    : '';
  const imageUrl = data.image || '';
  const imageAlt = data.imageAlt || '';

  return {
    title: `${title} - Cost & Treatment Details | NextDentist`,
    description,
    keywords,
    openGraph: {
      title: `${title} - Cost & Treatment Details | NextDentist`,
      description,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Cost & Treatment Details | NextDentist`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CostPages({ params }: CostPageProps) {
  const { slug } = await params;

  try {
    const costPage = (await getCostPageBySlug(slug)) as unknown as CostPageData;

    if (!costPage) {
      notFound();
    }

    return <CostPageFront data={costPage} />;
  } catch (error) {
    notFound();
  }
}
