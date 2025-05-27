import { CircleXIcon } from 'lucide-react';
import { definePage } from '../../templates/page';
import { defineSlugForDocument } from '../../utils/define-slug-for-document';
import { localizedPaths } from '../../structure/languages';

export default definePage({
  name: 'NotFound_Page',
  title: 'Not Found Page (404)',
  icon: CircleXIcon,
  additionalFields: [
    ...defineSlugForDocument({
      slugs: localizedPaths['NotFound_Page'],
    }).map(field => ({ ...field, group: 'content' })),
  ],
});
