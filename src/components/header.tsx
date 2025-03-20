import { Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ServiceDetail from "../pages/Services/serviceDetail";
import ServiceDetail1 from "../pages/Services/serviceDetail1";
import { Button } from "./ui/button";
import AuthDialog from "@/pages/Auth";
import { useAuth } from "@/hooks/use-auth";
import { UserAvatarMenu } from "./user-avatar-menu";

export default function Header() {
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [showServiceDetail1, setShowServiceDetail1] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<"login" | "signup">(
    "login"
  );

  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

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
      path: "/phun-xam",
      label: "PHUN XĂM THẨM MỸ",
    },
    {
      path: "/therapist",
      label: "BÁC SĨ",
    },
    {
      path: "/tips",
      label: "TIPS LÀM ĐẸP",
    },
    {
      path: "/dao-tao",
      label: "ĐÀO TẠO",
    },
    {
      path: "/dao-tao",
      label: "LÀM ĐẸP",
    },
    {
      path: "/blogs",
      label: "BLOGS",
    },
  ];

  return (
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
          <div
            key={index}
            onMouseEnter={() => {
              if (link.path === "/services") setShowServiceDetail(true);
              if (link.path === "/phun-xam") setShowServiceDetail1(true);
            }}
            onMouseLeave={() => {
              if (link.path === "/services") setShowServiceDetail(false);
              if (link.path === "/phun-xam") setShowServiceDetail1(false);
            }}
          >
            {link.path === "/services" || link.path === "/phun-xam" ? (
              <span className="text-red-600 font-bold group cursor-pointer">
                {link.label}
                <div className="w-0 h-1 bg-red-600 rounded-full group-hover:w-full transition-all duration-300"></div>
              </span>
            ) : (
              <Link to={link.path} className="text-red-600 font-bold group">
                {link.label}
                <div className="w-0 h-1 bg-red-600 rounded-full group-hover:w-full transition-all duration-300"></div>
              </Link>
            )}
            {link.path === "/services" && showServiceDetail && (
              <ServiceDetail />
            )}
            {link.path === "/phun-xam" && showServiceDetail1 && (
              <ServiceDetail1 />
            )}
          </div>
        ))}
      </nav>

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        defaultTab={authDialogTab}
      />
    </header>
  );
}
