import { PencilRulerIcon } from 'lucide-react';
import { defineField } from 'sanity';
import { defineSlugForDocument } from '../../utils/define-slug-for-document';
import { filterReferences } from '../../utils/filter-references';
import { validateReferenceLanguage } from '../../utils/validate-reference-language';
import { definePage } from '../../templates/page';
import { localizedPaths } from '../../structure/languages';

export default definePage({
  name: 'Service_Collection',
  title: 'Services',
  icon: PencilRulerIcon,
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
    defineField({
      name: 'isSubPage',
      type: 'boolean',
      title: 'Is the service part of another service?',
      description: 'Check this if the service is part of another main service.',
      validation: Rule => Rule.required(),
      initialValue: false,
      group: 'content',
    }),
    defineField({
      name: 'parentPage',
      type: 'reference',
      title: 'Parent page (main service)',
      description:
        'Select the parent page (main service) that this subpage is linked to. Once selected, this page will be considered a subpage.',
      to: [{ type: 'Service_Collection' }],
      options: {
        disableNew: true,
        filter: filterReferences({
          checkSelfReference: true,
          additionalFilter: 'defined(slug.current) && !isSubPage',
          includeLanguage: true,
        }),
      },
      group: 'content',
      hidden: ({ parent }) => !parent?.isSubPage,
      validation: Rule =>
        Rule.custom(async (value, context) => {
          const isSubPage = (context.parent as { isSubPage: boolean })?.isSubPage;
          if (!isSubPage) return true;
          if (isSubPage && !value) return 'The parent page is required.';
          return await validateReferenceLanguage(value, context);
        }),
    }),
    ...defineSlugForDocument({
      source: 'name',
      prefixes: localizedPaths['Service_Collection'],
      hasPrefixSourceField: 'isSubPage',
      prefixSource: 'parentPage',
    }).map(field => ({
      ...field,
      group: 'content',
    })),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
  ],
});
