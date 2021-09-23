import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ApiResponse, ResponseError } from './types';

type TokenStoreType = { token: string | null; checked: boolean };
const TOKEN_HEADER_NAME = 'x-auth-token';
const TOKEN_STORAGE_KEY = 'auth-token';

const tokenStore: TokenStoreType = { token: null, checked: false };
const tokenStorage: { instance: TokenStorage | null } = { instance: null };

export const logoutHandler = {
  handle() {
    if (tokenStorage.instance) {
      tokenStorage.instance.removeToken(TOKEN_STORAGE_KEY);
    }
  },
};

export interface TokenStorage {
  saveToken(key: string, token: string): Promise<void>;
  getToken(key: string): Promise<string | null>;
  removeToken(key: string): Promise<void>;
}

export const tokenStorageRegister = {
  register(storage: TokenStorage) {
    tokenStorage.instance = storage;
  },
};

export async function authenticationResponseFilter(
  response: AxiosResponse<ApiResponse>,
) {
  const token = response.headers[TOKEN_HEADER_NAME];
  if (token) {
    tokenStore.checked = true;
    tokenStore.token = token;
    if (tokenStorage.instance) {
      await tokenStorage.instance.saveToken(TOKEN_STORAGE_KEY, token);
    }
  }
  return response;
}

export async function authenticationRequestFilter(config: AxiosRequestConfig) {
  // race here, but should be fine
  if (!tokenStore.checked && tokenStorage.instance) {
    const token = await tokenStorage.instance.getToken(TOKEN_STORAGE_KEY);
    tokenStore.token = token;
    tokenStore.checked = true;
  }
  if (tokenStore.token) {
    config.headers[TOKEN_HEADER_NAME] = tokenStore.token;
    // axios.defaults.headers.common[TOKEN_HEADER_NAME] = tokeStore.token;
  }
  return config;
}
