import axios from 'axios';
import { connectionConfig } from './config';
import { ApiResponse, ResponseError } from './types';
import {
  authenticationResponseFilter,
  authenticationRequestFilter,
} from './tokenInterceptors';

axios.defaults.baseURL = connectionConfig.baseUrl;
axios.defaults.withCredentials = true;
axios.interceptors.request.use(authenticationRequestFilter);
axios.interceptors.response.use(authenticationResponseFilter);

const axiosRequest = (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  config?: any,
) => {
  //const headers = { Lang: connectionConfig.locale };
  let cfg = {};
  if (config) {
    cfg = { ...cfg, ...config };
  }

  let req = null;
  if (method === 'GET') {
    req = axios.get<ApiResponse>(url, {
      timeout: connectionConfig.TIME_OUT,
      ...cfg,
    });
  } else if (method === 'POST') {
    req = axios.post<ApiResponse>(url, data, {
      timeout: connectionConfig.TIME_OUT,
      ...cfg,
    });
  } else if (method === 'PUT') {
    req = axios.put<ApiResponse>(url, data, {
      timeout: connectionConfig.TIME_OUT,
      ...cfg,
    });
  } else {
    req = axios.delete<ApiResponse>(url, {
      timeout: connectionConfig.TIME_OUT,
      ...cfg,
    });
  }

  return req;
};

const SERVER_ERROR_CODE = {
  INVALID_FIELD: 1001,
  AUTHENTICATION_FAILED: 1002,
  NOT_FOUND: 1004,

  LOGIN_REQUIRED: 2001,
  NO_PERMISSION: 2002,

  INTERNAL_ERROR: 3001,
};

const translateServerError = (response: ApiResponse): ResponseError => {
  let res = { type: 'UNKNOWN' } as ResponseError;
  if (!response.code) {
    console.log('Unexpect incorrect response format');
    return res;
  }
  if (response.code == SERVER_ERROR_CODE.INVALID_FIELD) {
    res.type = 'INVALID_FIELD';
    res.fieldErrors = response.errors as any;
  } else if (response.code == SERVER_ERROR_CODE.LOGIN_REQUIRED) {
    res.type = 'LOGIN_REQUIRED';
  } else if (response.code == SERVER_ERROR_CODE.NOT_FOUND) {
    res.type = 'RESOURCE_NOT_FOUND';
    res.entityId = response.errors?.entityId;
  }

  return res;
};

export const apiRequest = async ({
  url,
  method,
  data,
}: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}): Promise<ApiResponse> => {
  const request = axiosRequest(url, method, data);
  try {
    const response = await request;
    const responseData = response.data;
    // console.log('[response.headers]', response.headers);
    // console.log('responseData', JSON.stringify(responseData));
    return { ...responseData, success: true };
  } catch (error) {
    console.log('[axios error]', JSON.stringify(error));

    if (error.response) {
      // Request made and server responded

      // if service not response correctly
      if (error.response.status >= 500) {
        return {
          success: false,
          code: 500,
          data: null,
          message: null,
          errors: { type: 'SERVICE_ERROR' },
        };
      }
      // for service response correctly
      const responseData = error.response.data as ApiResponse;
      let res: ApiResponse = { ...responseData, success: false };
      res.errors = translateServerError(res);
      return res;
    } else if (error.request) {
      // The request was made but no response was received
      let res: ApiResponse = {
        success: false,
        code: -1,
        data: null,
        message: null,
        errors: { type: 'NO_RESPONSE' },
      };
      return res;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('[WARNING] unexpected axios error', error.message);
      return {
        success: false,
        code: -2,
        data: null,
        message: null,
        errors: { type: 'UNKNOWN' },
      };
    }
  }
};
