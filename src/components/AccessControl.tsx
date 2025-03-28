import { ReactNode } from "react";
import useAccessControl from "@/hooks/useAccessControl";

interface AccessControlProps {
  children: ReactNode;
  allowedRoles?: string[];
  forbiddenRoles?: string[];
  requireAuth?: boolean;
}

/**
 * Component để kiểm soát hiển thị UI elements dựa trên role
 */
const AccessControl: React.FC<AccessControlProps> = ({
  children,
  allowedRoles,
  forbiddenRoles,
  requireAuth = true,
}) => {
  const { hasRole, isLoggedIn } = useAccessControl();

  // Nếu yêu cầu đăng nhập nhưng người dùng chưa đăng nhập
  if (requireAuth && !isLoggedIn) {
    return null;
  }

  // Nếu có danh sách role được phép và người dùng không thuộc danh sách đó
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasRole(allowedRoles)) {
      return null;
    }
  }

  // Nếu có danh sách role bị cấm và người dùng thuộc danh sách đó
  if (forbiddenRoles && forbiddenRoles.length > 0) {
    if (hasRole(forbiddenRoles)) {
      return null;
    }
  }

  // Nếu đã vượt qua tất cả điều kiện, hiển thị nội dung
  return <>{children}</>;
};

export default AccessControl;
