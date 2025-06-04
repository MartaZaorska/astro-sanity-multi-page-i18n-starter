# 🌍 Astro + Sanity Multi-Page i18n Starter

This starter combines [**Astro**](https://astro.build/), [**Sanity**](https://www.sanity.io/), and [**Turborepo**](https://turborepo.com/) to build a multi-language, SEO-friendly website with modern features and structured content management.

## Configuration

Create a `.env` file in the root of the project with your environment variables:

- `SANITY_PROJECT_ID`: Your Sanity project ID.
- `SANITY_API_TOKEN`: Your Sanity API token.
- `RESEND_API_KEY`: Your RESEND API key.

Then, update project-specific values with your project details in the following files:

- `/apps/sanity/constants.ts`
- `/apps/sanity/structure/languages.ts`
- `/apps/astro/src/global/constants.ts`
- `/apps/astro/src/global/languages.ts`

Also, make sure to modify `/apps/astro/src/pages/api/contact.ts` with the correct email addresses or endpoints used for handling contact form submissions.

## i18n

### Sanity

- Define supported languages, URL slugs/prefixes, and UI translations in `/apps/sanity/structure/language.ts`
- Slugs and prefixes are automatically updated when adding a translated page, using the `/apps/sanity/utils/document-internationalization-callback.ts` function

### Astro

Language and routing behavior depends on the selected branch:

- **[`main`](https://github.com/MartaZaorska/astro-sanity-multi-page-i18n-starter/tree/main)** — Default language has no prefix (e.g. `/` for Polish, `/en` for English)
- **[`i18n-all-prefixed`](https://github.com/MartaZaorska/astro-sanity-multi-page-i18n-starter/tree/i18n-all-prefixed)** — All languages (including the default) should include a prefix (e.g. `/pl`, `/en`).

Choose the branch that matches your preferred URL strategy for internationalization.

## Preview

You can view a demo version of the project (with placeholder content) at:

👉 https://astro-sanity-multi-page-i18n-starter-astro.vercel.app/
