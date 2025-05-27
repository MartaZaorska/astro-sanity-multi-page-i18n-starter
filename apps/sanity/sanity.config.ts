import { media } from 'sanity-plugin-media-i18n';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { assist } from '@sanity/assist';
import { documentInternationalization } from '@sanity/document-internationalization';
import { structure } from './structure';
import { i18nTypes, schemaTypes, singletonActions, singletonTypes } from './structure/schema-types';
import { LANGUAGES } from './structure/languages';
import { TITLE, PROJECT_ID, DATASET, API_VERSION } from './constants';
import { documentInternationalizationCallback } from './utils/document-internationalization-callback';

export default defineConfig({
  name: 'default',
  title: TITLE,
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  plugins: [
    structureTool({ structure }),
    media({
      locales: LANGUAGES.map(({ id, title }) => ({ id: id, name: title })),
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: LANGUAGES,
      schemaTypes: i18nTypes,
      callback: documentInternationalizationCallback,
    }),
    assist({
      translate: {
        document: {
          languageField: 'language',
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: templates => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
