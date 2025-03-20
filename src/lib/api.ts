import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken, removeToken, setToken } from "../lib/token";

// Tạo axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor cho request
api.interceptors.request.use(
  (config: any) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response để xử lý refresh token khi token hết hạn
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Kiểm tra nếu là request đăng nhập
    const isLoginRequest = originalRequest.url?.includes("/auth/login");

    // Nếu là lỗi 401 từ request đăng nhập, trả về lỗi luôn không cần refresh token
    if (isLoginRequest && error.response?.status === 401) {
      return Promise.reject(error);
    }

    // Kiểm tra nếu lỗi là 401 (token hết hạn) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getToken()?.refreshToken;

        if (!refreshToken) {
          // Nếu không có refresh token, đăng xuất và chuyển người dùng về trang đăng nhập
          removeToken();
          window.location.href = "/?auth=login";
          return Promise.reject(error);
        }

        // Gọi API để refresh token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        // Lưu token mới
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setToken({ accessToken, refreshToken: newRefreshToken });

        // Cập nhật header cho request gốc và thử lại
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, đăng xuất và chuyển người dùng về trang đăng nhập
        removeToken();
        window.location.href = "/?auth=login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
