import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";

axios.defaults.baseURL = "https://skincare-api.azurewebsites.net/api";

interface LiveChatProps {
  onClose: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [threadId, setThreadId] = useState<number | null>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  
  // Lấy customerId từ accountInfo
  const customerId = user?.accountInfo?.accountId;

  useEffect(() => {
    // Log để kiểm tra customerId
    console.log("User object:", user);
    console.log("CustomerID từ accountInfo:", customerId);
  }, [user, customerId]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!customerId) {
        console.log("Không có customerId, không khởi tạo chat");
        return;
      }
      
      try {
        // Create or fetch thread for the customer
        console.log("Đang khởi tạo chat với CustomerID:", customerId);
        const response = await axios.get(`/chat/threads/customer?customerId=${customerId}`);
        console.log("Thread response:", response.data);
        setThreadId(response.data.data.threadId);

        // Fetch existing messages
        const messagesResponse = await axios.get(`/chat/threads/${response.data.data.threadId}`);
        setMessages(
          messagesResponse.data.data.messages?.map((msg: any) => ({
            text: msg.content,
            isUser: msg.senderRole === "Customer",
          }))
        );

        // Initialize SignalR connection
        const hubConnection = new signalR.HubConnectionBuilder()
          .withUrl("https://skincare-api.azurewebsites.net/chathub")
          .withAutomaticReconnect()
          .build();

        //@ts-ignore
        hubConnection.on("ReceiveMessage", (senderId, senderRole, message) => {
          setMessages((prev) => [
            ...prev,
            { text: message, isUser: senderRole === "Customer" },
          ]);
        });

        await hubConnection.start();
        await hubConnection.invoke("JoinRoom", response.data.data.threadId);

        setConnection(hubConnection);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initializeChat();

    return () => {
      connection?.stop();
    };
  }, [customerId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !threadId || !connection || !customerId) return;

    try {
      // Send message via SignalR
      await connection.invoke("SendMessage", threadId, customerId, "Customer", newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
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

      {/* Message display area */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages && messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 rounded-lg max-w-[80%] text-sm ${msg.isUser
                  ? "bg-pink-500 text-white rounded-tr-none"
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message input area */}
      <div className="border-t p-2 flex items-center">
        <input
          type="text"
          className="flex-1 border rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-300"
          placeholder="Nhập tin nhắn của bạn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
