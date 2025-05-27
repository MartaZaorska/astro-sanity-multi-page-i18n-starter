import { defineField } from 'sanity';
import { isUniqueSlug } from './is-unique-slug';
import { slugify } from './slugify';
import { API_VERSION } from '../constants';
import { LANGUAGES } from '../structure/languages';

const isProduction = process.env.NODE_ENV === 'production';

type LanguageValues = {
  [key in (typeof LANGUAGES)[number]['id']]: string;
};

type Props = {
  source?: string;
  additionalFields?: Record<string, any>;
  checkSlugMatch?: boolean;
} & (
  | {
      slugs: LanguageValues;
      prefixes?: never;
      prefixSource?: never;
      hasPrefixSourceField?: never;
    }
  | {
      slugs?: never;
      prefixes?: LanguageValues;
      prefixSource?: string;
      hasPrefixSourceField?: string;
    }
);

export const defineSlugForDocument = ({
  source,
  slugs,
  prefixes,
  hasPrefixSourceField,
  prefixSource,
  checkSlugMatch = true,
  additionalFields = {},
}: Props) => [
  ...(source
    ? []
    : [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          description: 'The name of the document, used for display in the Breadcrumbs.',
          validation: Rule => Rule.required(),
          ...additionalFields,
        }),
      ]),
  defineField({
    name: 'slug',
    type: 'slug',
    title: `Slug`,
    ...additionalFields,
    description: (
      <>
        Slug is a unique identifier for the document, used for SEO and links.
        {slugs && isProduction && (
          <>
            {' '}
            <strong>
              <em>That slug can&apos;t be changed.</em>
            </strong>
          </>
        )}
      </>
    ),
    readOnly: isProduction && !!slugs,
    options: {
      source: doc => {
        if (source && doc?.[source]) return `${doc[source]}`;
        if (!source && doc?.name) return `${doc.name}`;
        return '';
      },
      slugify: async (slug: string, _, context) => {
        const language =
          (context.parent as { language: (typeof LANGUAGES)[number]['id'] })?.language ?? 'pl';
        if (slugs) return slugs[language];

        const hasPageRef = !hasPrefixSourceField
          ? true
          : (context?.parent as { [key: string]: boolean })?.[hasPrefixSourceField] || false;

        if (!prefixSource || !hasPageRef) {
          return prefixes ? `${prefixes[language]}/${slugify(slug)}` : `/${slugify(slug)}`;
        }

        const pageRef = (context.parent as { [key: string]: { _ref: string } })?.[prefixSource]
          ?._ref;
        if (pageRef) {
          const client = context.getClient({ apiVersion: API_VERSION });
          const pageSlug = await client.fetch(`*[_id == $ref][0].slug.current`, { ref: pageRef });
          if (pageSlug) return `${pageSlug}/${slugify(slug)}`;
        }

        return prefixes ? `${prefixes[language]}/${slugify(slug)}` : `/${slugify(slug)}`;
      },
      isUnique: isUniqueSlug,
    },
    validation: Rule => [
      Rule.custom(async (value, context) => {
        const hasPageRef = !hasPrefixSourceField
          ? true
          : (context?.parent as { [key: string]: boolean })?.[hasPrefixSourceField] || false;

        if (!prefixSource || !hasPageRef) return true;

        const pageRef = (context.parent as { [key: string]: { _ref: string } })?.[prefixSource]
          ?._ref;
        if (!pageRef) return `To set a prefix for the slug, you need to specify the parent page.`;

        const client = context.getClient({ apiVersion: API_VERSION });
        const pageSlug = await client.fetch(`*[_id == $ref][0].slug.current`, { ref: pageRef });
        if (!pageSlug) return 'The parent page must have a slug.';

        if (value?.current && !value?.current?.startsWith(pageSlug))
          return `The slug should start with the parent page's slug (${pageSlug}).`;

        if (
          value?.current &&
          value.current.replace(pageSlug, '') !== `/${slugify(value.current.replace(pageSlug, ''))}`
        )
          return 'Invalid slug. Remember, the slug can only contain lowercase letters, digits, and hyphens, and it should start with the "/" character.';

        return true;
      }),
      Rule.custom((value, context) => {
        const language =
          (context.parent as { language: (typeof LANGUAGES)[number]['id'] })?.language ?? 'pl';

        const hasPageRef = !hasPrefixSourceField
          ? true
          : (context?.parent as { [key: string]: boolean })?.[hasPrefixSourceField] || false;
        if (prefixSource && hasPageRef) return true;

        if (prefixes && value?.current && !value.current.startsWith(prefixes[language]))
          return `The slug should start with ${prefixes[language]}.`;

        if (value?.current && prefixes) {
          const slugValue = value.current.replace(prefixes[language], '');
          return slugValue !== '' && slugValue !== `/${slugify(slugValue)}`
            ? 'Invalid slug. Remember, the slug can only contain lowercase letters, digits, and hyphens, and it should start with the "/" character.'
            : true;
        }

        return true;
      }),
      Rule.required().error('Slug is required.'),
      Rule.custom((value, context) => {
        if (!checkSlugMatch || !value?.current || slugs) return true;

        const sourceField = source || 'name';
        const sourceValue = (context.parent as { [key: string]: string })?.[sourceField];

        if (sourceValue && !value?.current?.includes(slugify(sourceValue)))
          return 'The slug does not match the name. Please check if it is correct.';

        return true;
      }).warning(),
    ],
  }),
];
