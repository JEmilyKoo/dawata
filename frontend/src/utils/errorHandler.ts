import axios from 'axios';

const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || '서버 오류 발생';
    }
    return '네트워크 오류 발생';
  };
  export default handleApiError;