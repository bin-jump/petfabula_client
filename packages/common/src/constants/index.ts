export const OAUTH_REDIRECT_URL =
  'http://127.0.0.1:8080/api/auth/oauth-redirect';

export const OAUTH_GITHUB_CLIENT_ID = '217c05bced4e671839c4';
export const OAUTH_GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${OAUTH_GITHUB_CLIENT_ID}&scope=user&redirect_uri=${OAUTH_REDIRECT_URL}`;

export const OAUTH_GOOGLE_CLIENT_ID =
  '378655562878-3gi3i9nd69u38757ia8g50qq7lssmgcg.apps.googleusercontent.com';
export const OAUTH_GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=openid%20email%20profile&client_id=${OAUTH_GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${OAUTH_REDIRECT_URL}`;

export const OAUTH_GOOGLE_ENDPOINT = `https://accounts.google.com/o/oauth2/v2/auth`;
