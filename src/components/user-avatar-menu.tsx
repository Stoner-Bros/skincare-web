import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export function UserAvatarMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Không hiển thị nếu không có user
  if (!user) return null;

  // Lấy chữ cái đầu của tên user
  const getInitials = () => {
    if (user?.accountInfo?.fullName) {
      // Lấy chữ cái đầu tiên của tên
      return user.accountInfo.fullName.charAt(0).toUpperCase();
    }
    // Fallback: sử dụng chữ cái đầu tiên của email
    return user.email.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    // navigate("/?auth=login"); // Chuyển hướng đến trang đăng nhập
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Chuyển hướng đến trang profile
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 cursor-pointer border-2 border-pink-200 hover:border-pink-500 transition-colors">
          {user.accountInfo?.avatar ? (
            <img
              src={user.accountInfo.avatar}
              alt={user.accountInfo.fullName || user.email}
            />
          ) : (
            <AvatarFallback className="bg-pink-100 text-pink-500 font-semibold">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2 text-center">
          <p className="font-semibold text-sm">
            {user.accountInfo?.fullName || "Tài khoản"}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleProfileClick}
          className="cursor-pointer font-semibold"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Tài khoản của tôi</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-500 focus:text-red-500 font-semibold"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
