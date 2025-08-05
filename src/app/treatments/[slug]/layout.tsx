// create a layout for the treatment page
import { getTreatment } from '@/app/actions/treatment';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const treatment = await getTreatment(params.slug);

  if (!treatment) {
    return {
      title: 'Treatment not found',
      description: 'Treatment not found',
    };
  }

  return {
    title: treatment?.seo_title,
    description: treatment?.seo_description,
  };
}

export default function TreatmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
