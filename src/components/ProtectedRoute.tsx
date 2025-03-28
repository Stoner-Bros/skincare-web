import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";
import { useRole } from "@/context/RoleContext";

interface ProtectedRouteProps {
  children?: ReactNode;
  requiredAuth?: boolean;
}

// Component bảo vệ route dựa trên quyền truy cập
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredAuth = true,
}) => {
  const { isLoggedIn, user, loading } = useAuth();
  const { hasPermission } = useRole();
  const location = useLocation();

  // Đang tải thông tin người dùng
  if (loading) {
    // Có thể thêm một Loading component ở đây
    return <div>Loading...</div>;
  }

  // Nếu route yêu cầu đăng nhập nhưng người dùng chưa đăng nhập
  if (requiredAuth && !isLoggedIn) {
    // Chuyển hướng đến trang đăng nhập, lưu lại path hiện tại để redirect sau khi đăng nhập
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Nếu người dùng đã đăng nhập nhưng không có quyền truy cập
  if (requiredAuth && isLoggedIn && user?.role) {
    const hasAccess = hasPermission(location.pathname, user.role);
    if (!hasAccess) {
      // Chuyển hướng đến trang 403 (Forbidden) hoặc trang home tùy yêu cầu
      return <Navigate to="/403" replace />;
    }
  }

  // Nếu mọi điều kiện đều thỏa mãn, hiển thị route bình thường
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
