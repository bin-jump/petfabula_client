type Locale = 'en' | 'ja';

const DEV_URL = 'http://192.168.210.47:80';
const PROD_URL = 'https://petfabula.com';

const BASE_URL = process.env.NODE_ENV == 'production' ? PROD_URL : DEV_URL;

class ConnectionConfig {
  locale: Locale = 'ja';
  baseUrl = BASE_URL;

  TIME_OUT = 30 * 1000;

  setLocale(locale: Locale) {
    this.locale = locale;
  }
}

const connectionConfig = new ConnectionConfig();
export { connectionConfig };
