type Locale = 'en' | 'ja';

// const LOCALURL = 'http://192.168.100.117:80';
const DEV_URL = 'http://192.168.0.199:80';
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
