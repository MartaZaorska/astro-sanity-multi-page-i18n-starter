import type { Reference, ValidationContext } from 'sanity';
import { API_VERSION } from '../constants';

export const validateReferenceLanguage = async (
  value: Reference | undefined,
  context: ValidationContext
) => {
  if (!value) return true;

  const language = (context.document as { language?: string })?.language;
  const _ref = (value as { _ref?: string })._ref || '';
  if (!language || !_ref) return true;

  const client = context.getClient({ apiVersion: API_VERSION });
  const itemLanguage = await client.fetch(`*[_id == $ref][0].language`, { ref: _ref });
  if (itemLanguage !== language)
    return 'The selected reference must be in the same language as this page.';
  return true;
};
