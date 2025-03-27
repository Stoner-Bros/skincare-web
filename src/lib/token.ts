import Cookies from "js-cookie";

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = "skincare_access_token";
const REFRESH_TOKEN_KEY = "skincare_refresh_token";

// Các options cho cookies
const cookieOptions = {
  expires: 7, // Thời gian sống mặc định của cookie (7 ngày)
  path: "/", // Có thể truy cập từ mọi đường dẫn
  secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS trong môi trường production
  sameSite: "strict" as const, // Ngăn CSRF attacks
  // httpOnly: true không thể đặt từ javascript phía client, chỉ có thể set từ server
};

// Thời gian sống của refresh token (30 ngày)
const refreshTokenOptions = {
  ...cookieOptions,
  expires: 30,
};

// Lưu token vào cookies
export const setToken = (tokenData: TokenData): void => {
  Cookies.set(ACCESS_TOKEN_KEY, tokenData.accessToken, cookieOptions);
  Cookies.set(REFRESH_TOKEN_KEY, tokenData.refreshToken, refreshTokenOptions);
};

// Lấy token từ cookies
export const getToken = (): TokenData | null => {
  const accessToken = Cookies.get(ACCESS_TOKEN_KEY);
  const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

  if (!accessToken && !refreshToken) return null;

  return {
    accessToken: accessToken || "",
    refreshToken: refreshToken || "",
  };
};

// Xóa token khỏi cookies
export const removeToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
};

// Kiểm tra xem người dùng đã đăng nhập chưa
export const isAuthenticated = (): boolean => {
  return !!Cookies.get(ACCESS_TOKEN_KEY);
};

// Chỉ lấy access token
export const getAccessToken = (): string | null => {
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
};

// Chỉ lấy refresh token
export const getRefreshToken = (): string | null => {
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
};

// Kiểm tra token có hợp lệ không dựa trên JWT
export const isTokenValid = (token: string): boolean => {
  if (!token) return false;

  try {
    // Phân tích JWT (không cần thư viện)
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Kiểm tra hạn của token
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// Kiểm tra access token có hợp lệ không
export const isAccessTokenValid = (): boolean => {
  const token = getAccessToken();
  return token ? isTokenValid(token) : false;
};
