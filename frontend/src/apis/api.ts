import axios from 'axios';
import { BASE_URL } from '@env';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,

  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
      console.log('📤 요청 보냄:', config.url);
      return config;
    },
    (error) => {
      console.error('🚨 요청 오류:', error);
      return Promise.reject(error);
    }
  );
  
  api.interceptors.response.use(
    (response) => {
      console.log('✅ 응답 성공:', response.data);
      return response;
    },
    (error) => {
      console.error('❌ 응답 실패:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
console.log("api", api)
export default api;