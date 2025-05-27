export type Language = 'pl' | 'en';
export type Page =
  | 'Index_Page'
  | 'Blog_Page'
  | 'PrivacyPolicy_Page'
  | 'NotFound_Page'
  | 'BlogCategory_Collection'
  | 'BlogPost_Collection'
  | 'Service_Collection';

export const LANGUAGES: Array<{ id: Language; title: string }> = [
  { id: 'pl', title: 'Polish' },
  { id: 'en', title: 'English' },
];

export const localizedPaths: Record<Page, Record<Language, string>> = {
  Index_Page: {
    pl: '/pl',
    en: '/en',
  },
  Blog_Page: {
    pl: '/pl/blog',
    en: '/en/blog',
  },
  PrivacyPolicy_Page: {
    pl: '/pl/polityka-prywatnosci',
    en: '/en/privacy-policy',
  },
  NotFound_Page: {
    pl: '/pl/404',
    en: '/en/404',
  },
  BlogCategory_Collection: {
    pl: '/pl/blog/kategoria',
    en: '/en/blog/category',
  },
  BlogPost_Collection: {
    pl: '/pl/blog',
    en: '/en/blog',
  },
  Service_Collection: {
    pl: '/pl',
    en: '/en',
  },
};

const translations = {
  pl: {
    label: 'Polish',
    settings: 'Ustawienia strony',
    navigation: 'Nawigacja',
    socialMedia: 'Media społecznościowe',
  },
  en: {
    label: 'English',
    settings: 'Site settings',
    navigation: 'Navigation',
    socialMedia: 'Social media',
  },
};

export function useTranslations<T extends keyof typeof translations>(lang: T) {
  return function t<K extends keyof (typeof translations)[T]>(key: K) {
    return translations[lang][key];
  };
}
