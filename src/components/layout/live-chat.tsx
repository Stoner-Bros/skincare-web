import React, { useState } from "react";
import { Button } from "../ui/button";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";

interface LiveChatProps {
  onClose: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Xin chào! Chúng tôi có thể giúp gì cho bạn?", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Thêm tin nhắn của người dùng vào danh sách
    setMessages([...messages, { text: newMessage, isUser: true }]);
    setNewMessage("");
    
    // Mô phỏng phản hồi từ nhân viên tư vấn
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Cảm ơn bạn đã liên hệ. Nhân viên tư vấn sẽ trả lời trong thời gian sớm nhất.",
        isUser: false 
      }]);
    }, 1000);
  };

  if (isMinimized) {
    return (
      <div className="bg-pink-500 text-white p-3 rounded-tl-lg rounded-tr-lg shadow-xl flex justify-between items-center w-72">
        <h3 className="font-bold">Tư Vấn Trực Tuyến</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMinimized(false)}
            className="text-white hover:bg-pink-600 h-7 w-7"
          >
            <Maximize2 size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-pink-600 h-7 w-7"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-pink-500 text-white p-3 flex justify-between items-center">
        <h3 className="font-bold">Tư Vấn Trực Tuyến</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-pink-600 h-7 w-7"
          >
            <Minimize2 size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-pink-600 h-7 w-7"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
      
      {/* Khu vực hiển thị tin nhắn */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-2 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-2 rounded-lg max-w-[80%] text-sm ${
                msg.isUser 
                  ? 'bg-pink-500 text-white rounded-tr-none' 
                  : 'bg-gray-200 text-gray-800 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Khu vực nhập tin nhắn */}
      <div className="border-t p-2 flex items-center">
        <input
          type="text"
          className="flex-1 border rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300"
          placeholder="Nhập tin nhắn của bạn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button 
          onClick={handleSendMessage}
          className="ml-2 bg-pink-500 hover:bg-pink-600 rounded-full w-8 h-8 flex items-center justify-center p-0"
        >
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
};

export default LiveChat;