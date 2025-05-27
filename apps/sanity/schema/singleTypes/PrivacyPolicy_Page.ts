import { defineField } from 'sanity';
import { LockKeyholeIcon } from 'lucide-react';
import { PortableText } from '../ui/PortableText';
import { definePage } from '../../templates/page';
import { localizedPaths } from '../../structure/languages';
import { defineSlugForDocument } from '../../utils/define-slug-for-document';

export default definePage({
  name: 'PrivacyPolicy_Page',
  title: 'Privacy Policy',
  icon: LockKeyholeIcon,
  withComponents: false,
  additionalFields: [
    ...defineSlugForDocument({
      slugs: localizedPaths['PrivacyPolicy_Page'],
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
      title: 'Paragraph (optional)',
      group: 'content',
    }),
    PortableText({
      name: 'content',
      title: 'Content',
      allowHeadings: true,
      linkTypes: ['external', 'internal'],
      useCustomInput: false,
      components: [],
      additionalFields: {
        group: 'content',
      },
    }),
  ],
});
