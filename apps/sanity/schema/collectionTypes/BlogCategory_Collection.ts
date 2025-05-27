import { TagIcon } from 'lucide-react';
import { defineField } from 'sanity';
import { defineSlugForDocument } from '../../utils/define-slug-for-document';
import { definePage } from '../../templates/page';
import { localizedPaths } from '../../structure/languages';

export default definePage({
  name: 'BlogCategory_Collection',
  title: 'Blog Category Collection',
  icon: TagIcon,
  withComponents: false,
  useLanguageIconInPreview: false,
  additionalFields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Category Name',
      description: 'Enter the category name that will represent a group of related blog posts.',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({
      source: 'name',
      prefixes: localizedPaths['BlogCategory_Collection'],
    }).map(field => ({
      ...field,
      group: 'content',
    })),
    defineField({
      name: 'heading',
      type: 'Heading',
      title: 'Heading',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'paragraph',
      type: 'PortableText',
      title: 'Paragraph',
      description: 'Enter text that will serve as a short introduction for this category.',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
  ],
});
