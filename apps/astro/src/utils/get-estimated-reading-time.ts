import type { PortableTextProps } from 'astro-portabletext/types';
import type { PortableTextBlock } from '@portabletext/types';
import { toPlainText } from 'astro-portabletext';
import { type Language, getReadingTimeText } from '@/global/languages';

export function getEstimatedReadingTime(content: PortableTextProps['value'], lang: Language) {
  function getTextFromCustomBlock(block: any) {
    if (block?._type === 'Quote') {
      const text = toPlainText(block.text as PortableTextBlock).trim();
      return `${text} ${block.author || ''}`;
    }

    // As more custom blocks are added, their text content should be handled here as well
    return '';
  }

  const contentArray = Array.isArray(content) ? content : [content];
  if (contentArray.length === 0) return getReadingTimeText(0, lang);

  const plainText = contentArray
    .map(block => {
      if (block?._type === 'block') return toPlainText(block as PortableTextBlock).trim();
      return getTextFromCustomBlock(block);
    })
    .join(' ');

  if (plainText === '') return getReadingTimeText(0, lang);

  const readingTime = (text: string) => {
    const countWords = (text: string) => {
      const trimmedText = text.trim();
      if (trimmedText === '') return 0;
      const words = trimmedText.split(/\s+/);
      return words.length;
    };
    const words = countWords(text);
    const averageReadingSpeedWordsPerMinute = 200;
    const readingTime = Math.ceil(words / averageReadingSpeedWordsPerMinute);
    return readingTime;
  };

  const estimatedReadingTime = readingTime(plainText);
  return getReadingTimeText(estimatedReadingTime, lang);
}
