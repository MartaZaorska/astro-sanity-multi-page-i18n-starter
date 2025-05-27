import { type Language, useTranslations } from '@/global/languages';
import { ComponentsQuery, type ComponentsProps } from '@/components/Components.astro';
import sanityFetch from '@/utils/sanity.fetch';
import metadataFetch from '@/utils/metadata.fetch';

export type QueryProps = {
  name: string;
  slug: string;
  _type: string;
  language: Language;
  components?: ComponentsProps;
};

export default async function pageFetch<AdditionalQueryProps>({
  slug,
  lang,
  additionalQuery = '',
  currentPage,
}: {
  slug: string;
  lang: Language;
  additionalQuery?: string;
  currentPage?: number;
}) {
  const page = await sanityFetch<AdditionalQueryProps & QueryProps>({
    query: `
      *[slug.current == $slug && language == $lang][0]{
        name,
        "slug": slug.current,
        _type,
        language,
        ${ComponentsQuery}
        ${additionalQuery}
      }
    `,
    params: { slug, lang },
  });

  if (!page) return null;

  const metadata = await metadataFetch(page.slug);

  if (metadata.alternates && currentPage && currentPage > 1) {
    metadata.alternates = metadata.alternates.map(({ lang, url }) => ({
      lang,
      url: `${url}/${useTranslations(lang)('urlParts').page}/${currentPage}`,
    }));
  }

  return {
    page,
    metadata,
  };
}
