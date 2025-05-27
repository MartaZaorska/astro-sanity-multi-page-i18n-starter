import type { SanityDocument, SanityClient } from 'sanity';
import { localizedPaths, type Language, type Page } from '../structure/languages';

type Props = {
  sourceDocument: SanityDocument;
  newDocument: SanityDocument;
  sourceLanguageId: string;
  destinationLanguageId: string;
  metaDocumentId: string;
  client: SanityClient;
};

export const documentInternationalizationCallback = async ({
  newDocument,
  destinationLanguageId,
  client,
}: Props) => {
  if (newDocument.slug) {
    await client.createOrReplace({
      ...newDocument,
      slug: {
        _type: 'slug',
        current: localizedPaths[newDocument._type as Page][destinationLanguageId as Language],
      },
    });
  }
};
