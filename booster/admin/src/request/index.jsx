import axios from 'axios';
import {envName} from "@app/configs";
import {LocalStore} from "@app/utils/local-storage";
import { sha256 } from 'js-sha256';

export const API = process.env.API;
export const ENV = process.env.ENV_NAME || 'dev';
export const BASE_URL = window.location.origin + "/";

const myHash = () => {
  const time = Date.now();
  return {
    time,
    hash: sha256(`${time}|${process.env.HASH_CODE}`),
    bundleId: process.env.BUNDLE_CODE,
  }
}

const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    
    if (response.data?.error === 1 && response.data?.message !== "success") {
      return Promise.reject(response.data)
    }

    return Promise.resolve(response.data)
  },
  (error) => error,
);

const headers = () => ({});

const getToken = () => {
  let token = ""
  try {
    const tmp = JSON.parse(LocalStore.local.get(`${envName}-uuid`))
    token = tmp?.token
  } catch (e) {
  }
  return token
}

const GET = (url, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.get(url, {
      params: {
        ...params,
      },
      headers: {
        ...headers(),
        authorization: `Bearer ${getToken()}`,
      },
    });
  }

  return axiosInstance.get(
    url,
    {
      params,
    },
  );
};

const DELETE = (url, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.delete(url, {
      params: {
        ...params,
      },
      headers: {
        ...headers(),
        authorization: `Bearer ${getToken()}`,
      },
    });
  }

  return axiosInstance.delete(url, {
    params,
  });
};

const POST = (url, formData, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.post(
      url,
      {
        ...formData,
        ...myHash()
      },
      {
        params: {
          ...params,
        },
        headers: {
          ...headers(),
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
  }

  return axiosInstance.post(
    url,
    {
      ...formData,
      ...myHash()
    },
    {
      params,
    },
  );
};

// tslint:disable-next-line: max-line-length
const FILE = (url, formData, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.post(
      url,
      formData,
      {
        params: {
          ...params,
        },
        headers: {
          ...headers(),
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
  }

  return axiosInstance.post(
    url,
    formData,
    {
      params,
    },
  );
};

const PUT = (url, formData, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.put(
      url,
      {...formData},
      {
        params: {
          ...params,
        },
        headers: {
          ...headers(),
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
  }

  return axiosInstance.put(
    url,
    {...formData},
    {
      params,
    },
  );
};

export {
  GET,
  POST,
  PUT,
  DELETE,
  getToken,
  FILE,
  axiosInstance,
};
