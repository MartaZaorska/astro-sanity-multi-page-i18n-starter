### Configuration

Create a `.env` file in the root of the project with your environment variables:

- `SANITY_PROJECT_ID`: Your Sanity project ID.
- `SANITY_API_TOKEN`: Your Sanity API token.
- `RESEND_API_KEY`: Your RESEND API key.

Then, update project-specific values with your project details in the following files:

- `/apps/sanity/constants.ts`
- `/apps/sanity/structure/languages.ts`
- `/apps/astro/src/global/constants.ts`
- `/apps/astro/src/pages/api/contact.ts`

### Language and routing behavior depends on the selected branch:

- **[`main`](https://github.com/MartaZaorska/astro-sanity-multi-page-i18n-starter/tree/main)** — Default language has no prefix (e.g. `/` for Polish, `/en` for English)
- **[`i18n-all-prefixed`](https://github.com/MartaZaorska/astro-sanity-multi-page-i18n-starter/tree/i18n-all-prefixed)** — All languages (including the default) should include a prefix (e.g. `/pl`, `/en`).
