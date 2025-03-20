import api from "@/lib/api";
import { getToken, removeToken, setToken } from "@/lib/token";
import {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "@/types/auth.types";
import { User } from "@/types/types";

class AuthService {
  // Đăng nhập
  async login(credentials: LoginRequest): Promise<void> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      setToken({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Đăng ký
  async register(userData: RegisterRequest): Promise<void> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      setToken({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      const token = getToken();
      if (token) {
        // Gọi API để vô hiệu hóa refresh token ở phía server (nếu backend hỗ trợ)
        await api.post("/auth/logout", {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeToken();
    }
  }

  // Refresh token
  async refreshToken(
    refreshRequest: RefreshTokenRequest
  ): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/refresh-token",
        refreshRequest
      );
      setToken({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      });
      return response.data;
    } catch (error) {
      removeToken();
      throw this.handleError(error);
    }
  }

  // Lấy thông tin người dùng hiện tại
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<any>("/auth/profile");
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Xử lý lỗi
  private handleError(error: any): Error {
    if (error.response) {
      // Server đã trả về response với status code không trong dải 2xx
      return new Error(
        error.response.data.message || "An error occurred during authentication"
      );
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được response
      return new Error(
        "No response from server. Please check your internet connection"
      );
    } else {
      // Có lỗi khi thiết lập request
      return new Error("Error setting up request");
    }
  }
}

export default new AuthService();
