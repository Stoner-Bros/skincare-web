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

// Biến để theo dõi refresh token đang xử lý
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Thêm request vào hàng đợi
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Xử lý các request trong hàng đợi
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

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
    // Kiểm tra nếu là request refresh token
    const isRefreshTokenRequest = originalRequest.url?.includes(
      "/auth/refresh-token"
    );

    // Nếu là lỗi 401 từ request đăng nhập hoặc refresh token, trả về lỗi luôn không cần refresh
    if (
      (isLoginRequest || isRefreshTokenRequest) &&
      error.response?.status === 401
    ) {
      removeToken();
      window.location.href = "/?auth=login";
      return Promise.reject(error);
    }

    // Kiểm tra nếu lỗi là 401 (token hết hạn) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Nếu đang refresh token, đợi và thử lại request sau khi có token mới
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

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
        const accessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;
        setToken({ accessToken, refreshToken: newRefreshToken });

        // Thông báo cho các subscriber
        onRefreshed(accessToken);
        isRefreshing = false;

        // Cập nhật header cho request gốc và thử lại
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, đăng xuất và chuyển người dùng về trang đăng nhập
        isRefreshing = false;
        removeToken();
        window.location.href = "/?auth=login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
