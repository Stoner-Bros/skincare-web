import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";

export default function Header() {
  const navigationLinks = [
    {
      path: "/about",
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
      path: "/doctor",
      label: "BÁC SĨ",
    },
    {
      path: "/tips",
      label: "TIPS LÀM ĐẸP",
    },
    {
      path: "/franchise",
      label: "NHƯỢNG QUYỀN",
    },
  ];

  return (
    <header className="flex justify-between items-center my-5 px-72 sticky top-0 z-[9999] bg-white">
      <div className="flex items-center">
        <Link to="/" className="text-5xl font-bold text-red-600 playfair">
          <span className="text-xl text-red-600">Thẩm Mỹ Viện</span> Luxspa.vn
        </Link>
      </div>
      <div className="flex flex-col items-end space-y-3 ">
        <div className="flex justify-between items-center space-x-6">
          <div className="flex items-center space-x-2">
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
          </div>
          <div className="flex space-x-4">
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
          </div>
        </div>

        <nav className="flex justify-center space-x-8 w-full">
          {navigationLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="text-red-600 font-bold group"
            >
              {link.label}
              <div className="w-0 h-1 bg-red-600 rounded-full group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}
        </nav>
      </div >
    </header >
  );
}
