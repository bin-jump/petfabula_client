type Locale = 'en' | 'ja';

class ConnectionConfig {
  locale: Locale = 'ja';
  baseUrl = 'http://192.168.0.199:80';
  // baseUrl = 'http://192.168.100.117:80';
  // baseUrl = 'https://petfabula.com';

  TIME_OUT = 20 * 1000;

  setLocale(locale: Locale) {
    this.locale = locale;
  }
}

const connectionConfig = new ConnectionConfig();
export { connectionConfig };
