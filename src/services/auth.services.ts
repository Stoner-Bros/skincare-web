import api from "@/lib/api";
import { getToken, removeToken, setToken } from "@/lib/token";

class AuthService {
  async login(credentials: any): Promise<void> {
    try {
      const response = await api.post<any>("/auth/login", credentials);
      setToken({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(anyData: any): Promise<void> {
    try {
      const response = await api.post<any>("/auth/register", anyData);
      setToken({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const token = getToken();
      if (token) {
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

  async refreshToken(refreshRequest: any): Promise<any> {
    try {
      const response = await api.post<any>(
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

  async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get<any>("/auth/profile");
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(
        error.response.data.message || "An error occurred during authentication"
      );
    } else if (error.request) {
      return new Error(
        "No response from server. Please check your internet connection"
      );
    } else {
      return new Error("Error setting up request");
    }
  }
}

export default new AuthService();
