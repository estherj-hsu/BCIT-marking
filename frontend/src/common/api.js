import axios from 'axios';
import { API_URL } from './config';

const headers = Object.assign({ 'Content-Type': 'application/json' });

let markingApi = axios.create({
  baseURL: `${API_URL}`,
  timeout: 10000,
  headers: headers,
});

const authInterceptors = config => {
  config.headers = Object.assign(
    config.headers,
    localStorage.getItem('jwtToken')
      ? {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        }
      : {}
  );
  return config;
};

markingApi.interceptors.response.use(
  r => r,
  error => {
    if (error.request.readyState === 4 && error.request.status === 0) {
      console.log('ApiTimeout', 'api 10s');
    }

    console.log(error.response);

    if (error.response.status === 401) {
      localStorage.removeItem('jwtToken');
      window.location.assign('/');
    }
    console.log('ApiError', error.response.status, error.response.data);
    throw error;
  }
);

markingApi.interceptors.request.use(authInterceptors, error => {
  console.log(error);
  return error;
});


export { markingApi };
