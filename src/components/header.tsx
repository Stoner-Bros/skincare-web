import { Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import AuthDialog from "@/pages/Auth";
import { useAuth } from "@/hooks/use-auth";
import { UserAvatarMenu } from "./user-avatar-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<"login" | "signup">(
    "login"
  );

  const { user, isLoggedIn } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Thêm state cho Dialog nhập email
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [bookingEmail, setBookingEmail] = useState("");

  // Check for auth parameter in URL on component mount and route changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const authParam = searchParams.get("auth");

    if (authParam === "login") {
      setAuthDialogTab("login");
      setShowAuthDialog(true);
    } else if (authParam === "signup") {
      setAuthDialogTab("signup");
      setShowAuthDialog(true);
    } else {
      setShowAuthDialog(false);
    }
  }, [location]);

  // Handle login button click
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthDialogTab("login");
    setShowAuthDialog(true);

    // Update URL with query parameter
    navigate(`${location.pathname}?auth=login`, { replace: true });
  };

  // Handle signup button click
  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthDialogTab("signup");
    setShowAuthDialog(true);

    // Update URL with query parameter
    navigate(`${location.pathname}?auth=signup`, { replace: true });
  };

  // Handle skin test click
  const handleSkinTestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Kiểm tra trạng thái đăng nhập
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, hiển thị form đăng nhập
      setAuthDialogTab("login");
      setShowAuthDialog(true);
      
      // Hiển thị thông báo yêu cầu đăng nhập
      alert("Vui lòng đăng nhập để thực hiện bài kiểm tra da.");
      
      // Update URL với query parameter
      navigate(`${location.pathname}?auth=login`, { replace: true });
    } else {
      // Nếu đã đăng nhập, chuyển đến trang quiz
      navigate("/quiz");
    }
  };

  // Xử lý khi click vào nút Tra Cứu
  const handleBookingHistoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Kiểm tra trạng thái đăng nhập
    if (isLoggedIn) {
      // Nếu đã đăng nhập, chuyển đến trang lịch sử đặt lịch
      navigate("/booking-history");
    } else {
      // Nếu chưa đăng nhập, hiển thị dialog nhập email
      setShowEmailDialog(true);
    }
  };
  
  // Xử lý khi submit form nhập email
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bookingEmail.trim()) {
      // Đóng dialog
      setShowEmailDialog(false);
      
      // Chuyển đến trang lịch sử đặt lịch với email được truyền qua query params
      navigate(`/booking-history?email=${encodeURIComponent(bookingEmail)}`);
      
      // Reset email
      setBookingEmail("");
    }
  };

  const navigationLinks = [
    {
      path: "/about-us",
      label: "VỀ CHÚNG TÔI",
    },
    {
      path: "/services",
      label: "DỊCH VỤ LÀM ĐẸP",
    },
    {
      path: "/therapist",
      label: "BÁC SĨ",
    },
    {
      path: "#",
      label: "SKIN TEST",
      onClick: handleSkinTestClick,
    },
    {
      path: "/news",
      label: "BLOGS",
    },
    {
      path: "#",
      label: "TRA CỨU",
      onClick: handleBookingHistoryClick,
    },
  ];

  return (
    <>
      <header className="flex flex-col items-center py-5 px-80 sticky top-0 z-[50] bg-white text-nowrap">
        <div className="flex justify-between items-center w-full gap-12">
          <div className="flex items-center">
            <Link to="/" className="text-5xl font-bold text-red-600 playfair">
              <img
                src="/logo.gif"
                alt="Slide 1"
                className="w-full object-cover"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Button
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-6 rounded-full shadow-lg
            duration-300 flex items-center gap-2 group"
            >
              <div className="bg-white/20 p-2 rounded-full">
                <Phone size={20} className="text-white animate-pulse" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-normal opacity-90">
                  Hotline hỗ trợ
                </span>
                <span className="text-lg font-bold">1800 3333</span>
              </div>
            </Button>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm ..."
                className="w-[300px] px-4 py-2.5 pl-12 border-2 border-pink-200 rounded-full
              text-gray-600 placeholder-gray-400 focus:outline-none focus:border-pink-400
              transition-all duration-300 hover:border-pink-300"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            {user ? (
              <UserAvatarMenu />
            ) : (
              <>
                <Button
                  className="bg-white text-black border-2 border-pink-500 px-4 py-3 h-fit rounded-full hover:text-white"
                  onClick={handleLoginClick}
                >
                  Đăng nhập
                </Button>
                <Button
                  className="bg-pink-500 text-white px-4 py-3 h-fit rounded-full "
                  onClick={handleSignupClick}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
        <nav className="flex justify-center space-x-8 gap-6 w-full mt-4">
          {navigationLinks.map((link, index) => (
            <div key={index} className="relative">
              {link.onClick ? (
                <a
                  href={link.path}
                  onClick={link.onClick}
                  className="text-red-600 font-bold group"
                >
                  {link.label}
                  <div className="w-0 h-1 bg-red-600 rounded-full group-hover:w-full transition-all duration-300"></div>
                </a>
              ) : (
                <Link to={link.path} className="text-red-600 font-bold group">
                  {link.label}
                  <div className="w-0 h-1 bg-red-600 rounded-full group-hover:w-full transition-all duration-300"></div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </header>
      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        defaultTab={authDialogTab}
      />
      
      {/* Dialog nhập email */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-pink-800">
              Tra cứu lịch sử đặt lịch
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="booking-email" className="text-sm font-medium text-pink-700">
                Vui lòng nhập email bạn đã dùng để đặt lịch
              </label>
              <Input
                id="booking-email"
                type="email"
                value={bookingEmail}
                onChange={(e) => setBookingEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="border-pink-200 focus:border-pink-500"
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full"
              >
                Tra cứu
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
