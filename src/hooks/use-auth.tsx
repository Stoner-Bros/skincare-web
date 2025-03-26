import { isAuthenticated } from "@/lib/token";
import authServices from "@/services/auth.services";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await authServices.getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      await authServices.login(credentials);
      const userData = await authServices.getCurrentUser();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API đăng ký
      await authServices.register(userData);

      // Nếu đăng ký thành công, tự động đăng nhập
      try {
        // Sử dụng thông tin đăng ký để đăng nhập
        const loginData: any = {
          email: userData.email,
          password: userData.password,
        };

        // Gọi API đăng nhập
        await authServices.login(loginData);

        // Lấy thông tin người dùng hiện tại
        const user = await authServices.getCurrentUser();
        setUser(user);
        setIsLoggedIn(true);
      } catch (loginErr: any) {
        // Nếu đăng nhập thất bại, ghi log lỗi nhưng không hiển thị cho người dùng
        // vì đăng ký vẫn thành công
        console.error("Auto login after registration failed:", loginErr);

        // Có thể thêm xử lý chuyển hướng đến trang đăng nhập ở đây nếu cần
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authServices.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reloadUser = async () => {
    try {
      const userData = await authServices.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Failed to reload user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isLoggedIn,
        login,
        register,
        logout,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
