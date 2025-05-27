import { defineType } from 'sanity';
import HeroSection from './components/HeroSection';
import Faq from './components/Faq';
import ContactForm from './components/ContactForm';
import LatestBlogPosts from './components/LatestBlogPosts';

export default defineType({
  name: 'components',
  type: 'array',
  title: 'Components',
  of: [HeroSection, Faq, ContactForm, LatestBlogPosts],
  options: {
    insertMenu: {
      filter: true,
      showIcons: true,
      views: [
        {
          name: 'grid',
          previewImageUrl: schemaTypeName => `/static/components/${schemaTypeName}.webp`,
        },
        { name: 'list' },
      ],
    },
  },
});
