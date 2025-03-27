import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import Footer from "../footer";
import Header from "../header";
import { Button } from "../ui/button";
import AdviceService from "./advice-service";
import BookService from "./book-service";
import LiveChat from "./live-chat";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showBooking, setShowBooking] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);

  return (
    <div className="w-full">
      <Header />
      {children}
      <Footer />
      <div className="fixed bottom-4 left-4 z-50">
        {!showLiveChat ? (
          <Button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full
            flex items-center gap-2 group transition-all duration-300
            shadow-lg hover:shadow-xl"
            onClick={() => setShowLiveChat(true)}
          >
            <MessageCircle size={18} className="animate-pulse" />
            <span className="font-medium">Tư Vấn Trực Tuyến</span>
          </Button>
        ) : (
          <div className="mb-2">
            <LiveChat onClose={() => setShowLiveChat(false)} customerId={7}/>
          </div>
        )}
      </div>

      {showBooking && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[100000]">
          <BookService onClose={() => setShowBooking(false)} />
        </div>
      )}
      {showAdvice && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[100000]">
          <AdviceService onClose={() => setShowAdvice(false)} />
        </div>
      )}
    </div>
  );
}
