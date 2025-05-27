import { type FieldDefinition, defineType, defineField, type FieldGroupDefinition } from 'sanity';
import { FileTextIcon, SearchIcon, type LucideIcon } from 'lucide-react';
import { getLanguageIcon } from '../utils/get-language-preview';
import type { Page } from '../structure/languages';

type Props = {
  name: Page;
  title: string;
  icon: LucideIcon | React.FC | string;
  withComponents?: boolean;
  useLanguageIconInPreview?: boolean;
  additionalGroups?: Array<FieldGroupDefinition>;
  additionalFields?: FieldDefinition<
    | 'string'
    | 'number'
    | 'boolean'
    | 'object'
    | 'array'
    | 'block'
    | 'date'
    | 'datetime'
    | 'document'
    | 'file'
    | 'geopoint'
    | 'image'
    | 'reference'
    | 'crossDatasetReference'
    | 'globalDocumentReference'
    | 'slug'
    | 'text'
    | 'url'
    | 'email',
    undefined
  >[];
};

export const definePage = ({
  name,
  title,
  icon,
  withComponents = true,
  useLanguageIconInPreview = true,
  additionalGroups = [],
  additionalFields = [],
}: Props) =>
  defineType({
    type: 'document',
    name,
    title,
    icon,
    options: { documentPreview: true },
    fields: [
      defineField({
        name: 'language',
        type: 'string',
        readOnly: true,
        hidden: true,
      }),
      ...additionalFields,
      ...(withComponents
        ? [
            defineField({
              name: 'components',
              type: 'components',
              title: 'Page Components',
              group: 'content',
            }),
          ]
        : []),
      defineField({
        name: 'seo',
        type: 'seo',
        title: 'SEO',
        group: 'seo',
      }),
    ],
    groups: [
      {
        name: 'content',
        title: 'Content',
        icon: () => <FileTextIcon size={18} />,
      },
      {
        name: 'seo',
        title: 'SEO',
        icon: () => <SearchIcon size={18} />,
      },
      ...additionalGroups,
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'slug.current',
        icon: 'icon',
        media: 'image',
        language: 'language',
      },
      prepare: ({ title, subtitle, icon, media, language }) => ({
        title,
        subtitle,
        icon,
        media: useLanguageIconInPreview && language ? () => getLanguageIcon(language) : media,
      }),
    },
  });
