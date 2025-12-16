import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
import uz from '../../messages/uz.json';
import ru from '../../messages/ru.json';
import kk from '../../messages/kk.json';
import ky from '../../messages/ky.json';
import kaa from '../../messages/kaa.json';

const messagesMap = {
  uz,
  ru,
  kk,
  ky,
  kaa,
};

export default getRequestConfig(({requestLocale}) => {
  let locale = routing.defaultLocale;
  
  if (requestLocale && hasLocale(routing.locales, requestLocale)) {
    locale = requestLocale;
  }

  return {
    locale,
    messages: messagesMap[locale as keyof typeof messagesMap] || messagesMap[routing.defaultLocale],
  };
});
