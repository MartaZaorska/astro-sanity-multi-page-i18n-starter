import { useState, useEffect } from 'preact/hooks';
import { useForm, type FieldValues } from 'react-hook-form';
import { type Language, useTranslations } from '@/global/languages';
import { REGEX } from '@/global/constants';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';

export default function Form({
  children,
  lang,
  privacyPolicySlug,
  ...props
}: {
  children: React.ReactNode;
  lang: Language;
  privacyPolicySlug: string;
} & React.FormHTMLAttributes<HTMLFormElement>) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const formData = useTranslations(lang)('form');

  useEffect(() => {
    const tryAgain = () => setStatus('idle');
    document.addEventListener('Contact-TryAgain', tryAgain);
    return () => document.removeEventListener('Contact-TryAgain', tryAgain);
  }, []);

  const onSubmit = async (data: FieldValues) => {
    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      });
      const responseData = await response.json();
      if (!response.ok || !responseData.success) throw new Error();
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <form
      {...props}
      onSubmit={handleSubmit(onSubmit)}
      data-status={status}
    >
      <Input
        label={formData.email.label}
        register={register('email', {
          required: { value: true, message: formData.email.required },
          pattern: { value: REGEX.email, message: formData.email.pattern },
        })}
        errors={errors}
        type='email'
      />
      <Input
        label={formData.message.label}
        register={register('message', {
          required: { value: true, message: formData.message.required },
        })}
        isTextarea={true}
        errors={errors}
        placeholder={formData.message.placeholder}
      />
      <Checkbox
        register={register('legal', {
          required: { value: true, message: formData.legal.required },
        })}
        errors={errors}
      >
        {formData.legal.labelFirst}{' '}
        <a
          href={privacyPolicySlug}
          target='_blank'
          rel='noopener noreferrer'
          className='link'
        >
          {formData.legal.labelSecond}
        </a>
      </Checkbox>
      {children}
    </form>
  );
}
