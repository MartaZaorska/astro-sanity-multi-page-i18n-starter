import type { StructureBuilder } from 'sanity/structure';
import { PenIcon, EyeIcon } from 'lucide-react';
import { schemaTypes } from '../structure/schema-types';
import { Preview } from './preview';
import { LANGUAGES } from '../structure/languages';
import { getLanguageIcon } from './get-language-preview';
import { API_VERSION } from '../constants';

export const createCollection = (S: StructureBuilder, name: string) => {
  const {
    title,
    icon,
    options,
    fields = [],
  } = schemaTypes.find(item => item.name === name) as {
    title: string;
    icon: React.ReactNode;
    options: { documentPreview?: boolean };
    fields?: Array<{ name: string; type: string }>;
  };

  const documentPreview = options?.documentPreview ?? false;
  const isInternationalized = fields.some(field => field.name === 'language');

  const views = [
    S.view
      .form()
      .title('Editor')
      .icon(() => <PenIcon size={18} />),
    ...(documentPreview
      ? [
          S.view
            .component(Preview)
            .title('Preview')
            .icon(() => <EyeIcon size={18} />),
        ]
      : []),
  ];

  return S.listItem()
    .id(name)
    .title(title)
    .icon(icon)
    .child(
      isInternationalized
        ? S.list()
            .title(title)
            .items(
              LANGUAGES.map(lang =>
                S.listItem()
                  .title(`${lang.title}`)
                  .icon(() => getLanguageIcon(lang.id))
                  .child(
                    S.documentTypeList(name)
                      .title(`${title} (${lang.title})`)
                      .filter('_type == $type && language == $lang')
                      .params({ type: name, lang: lang.id })
                      .apiVersion(API_VERSION)
                      .child(documentId =>
                        S.document().documentId(documentId).schemaType(name).views(views)
                      )
                      .initialValueTemplates([S.initialValueTemplateItem(`${name}-${lang.id}`)])
                  )
              )
            )
        : S.documentTypeList(name)
            .defaultLayout('detail')
            .title(title)
            .child(documentId => S.document().documentId(documentId).schemaType(name).views(views))
    );
};
