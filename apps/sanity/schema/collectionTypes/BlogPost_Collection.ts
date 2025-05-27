import { StickyNoteIcon } from 'lucide-react';
import { defineField } from 'sanity';
import { defineSlugForDocument } from '../../utils/define-slug-for-document';
import { definePage } from '../../templates/page';
import { localizedPaths } from '../../structure/languages';
import { filterReferences } from '../../utils/filter-references';
import { validateReferenceLanguage } from '../../utils/validate-reference-language';
import BlogPostContent from '../components/blogPost';

export default definePage({
  name: 'BlogPost_Collection',
  title: 'Blog Post Collection',
  icon: StickyNoteIcon,
  useLanguageIconInPreview: false,
  additionalFields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'Name will be displayed in breadcrumb and in schemas for Google',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    ...defineSlugForDocument({
      source: 'name',
      prefixes: localizedPaths['BlogPost_Collection'],
    }).map(field => ({ ...field, group: 'content' })),
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
      title: 'Article Introduction (optional)',
      group: 'content',
    }),
    defineField({
      name: 'category',
      type: 'reference',
      title: 'Category',
      group: 'content',
      options: {
        disableNew: true,
        filter: filterReferences({
          includeLanguage: true,
          additionalFilter: 'defined(slug.current)',
        }),
      },
      to: { type: 'BlogCategory_Collection' },
      validation: Rule =>
        Rule.custom(async (value, context) => {
          if (!value) return 'Required';
          return await validateReferenceLanguage(value, context);
        }),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'date',
      title: 'Publication Date (optional)',
      description: 'This field allows you to override the default publication date (_createdAt).',
      group: 'content',
    }),
    BlogPostContent,
  ],
});
