// export const OAUTH_REDIRECT_URL = 'http://petfabula.com/api/identity/oauth-redirect';

const DEV_REDIRECT_URL = 'http://127.0.0.1:8080/api/identity/oauth-redirect';
const PROD_REDIRECT_URL = 'http://petfabula.com/api/identity/oauth-redirect';

export const OAUTH_REDIRECT_URL =
  process.env.NODE_ENV == 'production' ? PROD_REDIRECT_URL : DEV_REDIRECT_URL;

export const OAUTH_GOOGLE_CLIENT_ID =
  '963598839406-p32r8sffak1a6dsltsn2dh5ufdc8gfak.apps.googleusercontent.com';
export const OAUTH_GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20email%20profile&client_id=${OAUTH_GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${OAUTH_REDIRECT_URL}`;

export const OAUTH_GOOGLE_ENDPOINT = `https://accounts.google.com/o/oauth2/v2/auth`;
