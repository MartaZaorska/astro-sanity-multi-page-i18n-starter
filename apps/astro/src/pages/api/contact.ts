export const prerender = false;

import { REGEX } from '@/global/constants';
import { type Language, useTranslations } from '@/global/languages';
import { htmlToString } from '@/utils/html-to-string';
import type { APIRoute } from 'astro';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

type Props = {
  email: string;
  message: string;
  legal: boolean;
  lang: Language;
};

class HTTPError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const { email, message, legal, lang } = (await request.json()) as Props;
  const messageTemplate = useTranslations(lang)('messageTemplate');

  try {
    if (!REGEX.email.test(email) || !message || !legal) throw new HTTPError('Missing required fields');

    const HTMLTemplate = `
      <p>${messageTemplate.emailLabel}: <b>${email}</b></p>
      <br />
      <p>${message.trim().replace(/\n/g, '<br />')}</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Acme <onboarding@resend.dev>', //`${messageTemplate.fromLabel} <formularz@sending.nazwa.pl>`
        to: 'marta.zaorska2@gmail.com', //'admin@nazwa.pl'
        reply_to: email,
        subject: messageTemplate.subject,
        html: HTMLTemplate,
        text: htmlToString(HTMLTemplate),
      }),
    });

    if (res.status !== 200) throw new HTTPError('Something went wrong');

    const userConfirmationHTMLTemplate = messageTemplate.userConfirmationHTMLTemplate;

    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Acme <onboarding@resend.dev>', //`${messageTemplate.fromLabel} <formularz@sending.nazwa.pl>`
        to: email,
        subject: messageTemplate.userConfirmationSubject,
        html: userConfirmationHTMLTemplate,
        text: htmlToString(userConfirmationHTMLTemplate),
      }),
    });

    if (userRes.status !== 200) throw new HTTPError('Failed to send confirmation email to user');

    return new Response(
      JSON.stringify({
        message: 'Successfully sent message and confirmation email',
        success: true,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: err instanceof Error ? err.message : 'An error occurred while sending message',
        success: false,
      }),
      { status: err instanceof HTTPError ? err.status : 400 }
    );
  }
};
