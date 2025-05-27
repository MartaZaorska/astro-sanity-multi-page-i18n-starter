import { UsersRoundIcon } from 'lucide-react';
import { defineType, defineField } from 'sanity';
import { getLanguagePreview } from '../../../utils/get-language-preview';
import { useTranslations } from '../../../structure/languages';

export default defineType({
  name: 'socials',
  type: 'document',
  title: 'Social media',
  icon: UsersRoundIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'instagram',
      type: 'url',
      title: 'Instagram',
      validation: Rule =>
        Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
    }),
    defineField({
      name: 'facebook',
      type: 'url',
      title: 'Facebook',
      validation: Rule =>
        Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
    }),
    defineField({
      name: 'tiktok',
      type: 'url',
      title: 'TikTok',
      validation: Rule =>
        Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
    }),
    defineField({
      name: 'linkedin',
      type: 'url',
      title: 'LinkedIn',
      validation: Rule =>
        Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
    }),
  ],
  //validation: Rule => Rule.required(),
  preview: {
    select: {
      language: 'language',
    },
    prepare: ({ language }) => {
      const title = language ? useTranslations(language)('socialMedia') : 'Social media';
      return getLanguagePreview({ title, language });
    },
  },
});
