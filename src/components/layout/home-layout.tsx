import React, { useState } from "react";
import Header from "../header";
import Footer from "../footer";
import { Button } from "../ui/button";
import { Phone, Calendar, MessageCircle } from "lucide-react";
import BookService from "./book-service";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="w-full">
      <Header />
      {children}
      <Footer />
      <div className="fixed bottom-1/2 right-0 m-4 flex flex-col gap-3 translate-y-1/2 z-50">
        <Button
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-full 
          flex items-center gap-2 group transform hover:-translate-x-2 transition-all duration-300 
          shadow-lg hover:shadow-xl w-[160px] group"
        >
          <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
            <Phone size={18} className="animate-pulse" />
          </div>
          <span className="font-medium ">Gọi Điện</span>
        </Button>

        <Button
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-full 
          flex items-center gap-2 group transform hover:-translate-x-2 transition-all duration-300 
          shadow-lg hover:shadow-xl w-[160px]"
          onClick={() => setShowBooking(true)}
        >
          <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
            <Calendar size={18} className="animate-bounce" />
          </div>
          <span className="font-medium">Đặt Lịch</span>
        </Button>

        <Button
          className="bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-full 
          flex items-center gap-2 group transform hover:-translate-x-2 transition-all duration-300 
          shadow-lg hover:shadow-xl w-[160px]"
        >
          <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
            <MessageCircle size={18} className="animate-bounce" />
          </div>
          <span className="font-medium">Tư Vấn</span>
        </Button>
      </div>

      {showBooking && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[100000]">
          <BookService onClose={() => setShowBooking(false)} />
        </div>
      )}
    </div>
  );
}
