import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/context/RoleContext";

/**
 * Hook để kiểm soát quyền truy cập và hiển thị UI elements dựa trên role
 */
export const useAccessControl = () => {
  const { user, isLoggedIn } = useAuth();
  const { hasPermission } = useRole();

  /**
   * Kiểm tra xem người dùng có quyền truy cập route không
   * @param path Đường dẫn cần kiểm tra
   * @returns Boolean cho biết có quyền truy cập hay không
   */
  const canAccess = (path: string): boolean => {
    if (!isLoggedIn || !user?.role) return false;
    return hasPermission(path, user.role);
  };

  /**
   * Kiểm tra xem người dùng có thuộc một trong các role được chỉ định không
   * @param roles Danh sách các role được phép
   * @returns Boolean cho biết người dùng có trong danh sách role được phép không
   */
  const hasRole = (roles: string | string[]): boolean => {
    if (!isLoggedIn || !user?.role) return false;

    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(user.role);
  };

  return {
    canAccess,
    hasRole,
    userRole: user?.role || null,
    isLoggedIn,
  };
};

export default useAccessControl;
