import { LanguagesIcon } from 'lucide-react';
import { type Language, useTranslations } from '../structure/languages';

export const getLanguageIcon = (language: Language) => (
  <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', opacity: '0.8' }}>
    {language || ''}
  </span>
);

export const getLanguagePreview = ({
  title,
  subtitle,
  language,
}: {
  title: string;
  subtitle?: string;
  language: Language;
}) => {
  return {
    title,
    subtitle: subtitle ? subtitle : language ? useTranslations(language)('label') : '',
    media: language ? () => getLanguageIcon(language) : <LanguagesIcon size={15} />,
  };
};
