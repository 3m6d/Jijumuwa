import axios from 'axios';
import { globalConfig } from '@/global-config';

const apiClient = axios.create({
  baseURL: globalConfig.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient; 