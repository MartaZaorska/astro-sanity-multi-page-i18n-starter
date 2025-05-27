import { HomeIcon } from 'lucide-react';
import { defineSlugForDocument } from '../../utils/define-slug-for-document';
import { localizedPaths } from '../../structure/languages';
import { definePage } from '../../templates/page';

export default definePage({
  name: 'Index_Page',
  title: 'Homepage',
  icon: HomeIcon,
  additionalFields: [
    ...defineSlugForDocument({
      slugs: localizedPaths['Index_Page'],
    }).map(field => ({ ...field, group: 'content' })),
  ],
});
