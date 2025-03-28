import { createContext, useContext, ReactNode } from "react";

// Định nghĩa các role trong hệ thống
export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  STAFF = "Staff",
  SKIN_THERAPIST = "Skin Therapist",
  CUSTOMER = "Customer",
}

// Định nghĩa quyền truy cập cho các route
export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
}

// Danh sách các route và quyền truy cập tương ứng
export const routePermissions: RoutePermission[] = [
  // Dashboard routes
  {
    path: "/dashboard",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.MANAGER,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
    ],
  },
  {
    path: "/dashboard/services/treatments",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/all-blog",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/waiting-blog",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/skin-test",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.MANAGER,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
    ],
  },
  {
    path: "/dashboard/skin-test/manage",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.MANAGER,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
    ],
  },
  {
    path: "/dashboard/consultation",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/order-checkin",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/order-all",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/feedback",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/comment",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/user-customer",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/user-skintherapist",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  { path: "/dashboard/user-staff", allowedRoles: [UserRole.MANAGER] },
  { path: "/dashboard/user-accounts", allowedRoles: [UserRole.MANAGER] },
  {
    path: "/dashboard/skinsenger",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.MANAGER,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
    ],
  },
  {
    path: "/dashboard/order-waiting",
    allowedRoles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
  },
  {
    path: "/dashboard/schedule",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.MANAGER,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
    ],
  },

  // Public routes - Tất cả các role đều có thể truy cập
  {
    path: "/",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/quiz",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/about-us",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/therapist",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/treatment",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/services",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/content-policy",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/privacy-policy",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/booking-history",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/profile",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
  {
    path: "/news",
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.STAFF,
      UserRole.SKIN_THERAPIST,
      UserRole.CUSTOMER,
    ],
  },
];

// Context để quản lý role
interface RoleContextType {
  hasPermission: (path: string, role?: string) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  // Kiểm tra quyền truy cập dựa vào path và role
  const hasPermission = (path: string, role?: string): boolean => {
    if (!role) return false;

    // Tìm route phù hợp trong danh sách permissions
    const exactPathPermission = routePermissions.find(
      (route) => route.path === path
    );
    if (exactPathPermission) {
      return exactPathPermission.allowedRoles.includes(role as UserRole);
    }

    // Kiểm tra các route con (nested routes)
    for (const route of routePermissions) {
      // Nếu path hiện tại là con của một route cha và có chứa params
      if (path.startsWith(route.path + "/")) {
        return route.allowedRoles.includes(role as UserRole);
      }
    }

    // Mặc định không có quyền
    return false;
  };

  return (
    <RoleContext.Provider value={{ hasPermission }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
