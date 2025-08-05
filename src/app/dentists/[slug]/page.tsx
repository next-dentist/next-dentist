import { getDentistBySlug } from '@/app/actions/fetchDentists';
import { generatedentistSchema } from '@/lib/generatePersonSchema';
import { getRandomSeoDescription, getRandomSeoTitle } from '@/lib/random-seo';
import { Dentist } from '@/types';
import type { Metadata } from 'next';
import { SchemaDebug } from './debug';
import { SchemaRenderer } from './SchemaRenderer';
import SingleDentistClient from './SingleDentistClient';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const dentist = await getDentistBySlug(slug);

  let schemaData = null;
  if (dentist) {
    try {
      schemaData = generatedentistSchema(dentist as unknown as Dentist);
    } catch (error) {
      console.error('Error generating schema in metadata:', error);
    }
  }

  return {
    title: getRandomSeoTitle(dentist?.name || 'Dentist'),
    description: getRandomSeoDescription(dentist?.name || 'Dentist'),
    openGraph: {
      title: getRandomSeoTitle(dentist?.name || 'Dentist'),
      description: getRandomSeoDescription(dentist?.name || 'Dentist'),
      images: dentist?.image ? [{ url: dentist.image }] : [],
    },
    // Include schema in metadata for search engines
    other: schemaData
      ? {
          'schema-org-person': JSON.stringify(schemaData),
        }
      : {},
  };
}

export default async function DentistDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const dentist = await getDentistBySlug(slug);

  let schemaData = null;
  if (dentist) {
    try {
      schemaData = generatedentistSchema(dentist as unknown as Dentist);
    } catch (error) {
      console.error('Error generating schema:', error);
    }
  }

  // Serialize schema data for client component
  const serializedSchema = schemaData ? JSON.stringify(schemaData) : null;

  return (
    <>
      {/* Server-side schema rendering */}
      {schemaData && (
        <script
          id="person-schema-ssr"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      )}

      {/* Client-side schema rendering as backup */}
      {serializedSchema && (
        <SchemaRenderer schema={JSON.parse(serializedSchema)} />
      )}

      {/* Debug component to check if schema exists */}
      <SchemaDebug schemaData={schemaData} />

      {/* Main content */}
      <SingleDentistClient />
    </>
  );
}
