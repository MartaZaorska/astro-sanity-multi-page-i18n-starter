import { useTranslations, getLangPrefix, type Language } from '@/global/languages';

/**
 * Parses a blog-related slug and returns an object containing the normalized slug
 * for use in Sanity queries, and optionally the current page number if present.
 *
 * Returns an empty object if the slug does not match a recognized blog structure.
 *
 * @param slug - The slug path to parse (with leading slash).
 * @param lang - The current language code, used to generate the language prefix.
 * @returns An object with `slug` and optionally `currentPage`, or an empty object if invalid.
 */
export default function parseBlogSlug(slug: string, lang: Language) {
  const langPrefix = getLangPrefix(lang);
  const slugParts = slug.split('/').filter(Boolean);

  const prefix = `${langPrefix}/blog`;

  if (slugParts.length === 0) return {};
  if (slugParts.length === 1) return { slug: `${prefix}/${slugParts[0]}` };

  if (slugParts.length !== 2 && slugParts.length !== 4) return {};

  const urlParts = useTranslations(lang)('urlParts');
  const [first, second, third, fourth] = slugParts;

  const isSimplePage = first === urlParts.page && !isNaN(Number(second));
  const isCategoryOnly = first === urlParts.category;
  const isCategoryWithPage =
    slugParts.length === 4 &&
    first === urlParts.category &&
    third === urlParts.page &&
    !isNaN(Number(fourth));

  if (!isSimplePage && !isCategoryOnly && !isCategoryWithPage) return {};

  const path =
    isCategoryOnly || isCategoryWithPage ? `${prefix}/${urlParts.category}/${second}` : prefix;
  const page = isSimplePage ? Number(second) : isCategoryWithPage ? Number(fourth) : undefined;

  return { slug: path, currentPage: page ?? 1 };
}
