import { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import axios from "axios";
// import { useAuth } from "@/hooks/use-auth";

export default function Skinsenger() {
  // const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]); // Ensure threads is always an array
  const [selectedThread, setSelectedThread] = useState<number | null>(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    // Fetch threads from the API
    axios.get("/chat/threads").then((response) => {
      const data = response.data.data.items;
      setThreads(Array.isArray(data) ? data : []); // Ensure data is an array
    }).catch((error) => {
      console.error("Failed to fetch threads:", error);
      setThreads([]); // Fallback to an empty array on error
    });
  }, []);

  const joinThread = async (threadId: number) => {
    try {
      // Call API to join the thread
      await axios.post(`https://skincare-api.azurewebsites.net/api/chat/threads/${threadId}/join?staffId=6`);

      setSelectedThread(threadId);

      // Establish SignalR connection
      const conn = new HubConnectionBuilder()
        .withUrl("https://skincare-api.azurewebsites.net/chathub")
        .withAutomaticReconnect()
        .build();

      conn.on("ReceiveMessage", (senderId, senderRole, message) => {
        // @ts-ignore
        setMessages((prev) => [...prev, { senderId, senderRole, message }]);
      });

      await conn.start();
      await conn.invoke("JoinRoom", threadId);
      setConnection(conn);

      // Optionally fetch existing messages for the thread
      const response = await axios.get(`https://skincare-api.azurewebsites.net/api/chat/threads/${threadId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Failed to join thread:", error);
    }
  };

  const sendMessage = async () => {
    if (connection && selectedThread) {
      await connection.invoke(
        "SendMessage",
        selectedThread,
        6, // Replace with actual senderId
        "Staff", // Replace with actual senderRole
        newMessage
      );
      setNewMessage("");
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newMessage.trim() !== '') {
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden bg-white rounded-lg shadow-lg">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-pink-500 mb-4">Live Chat</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="w-full p-2 pl-10 border rounded-lg"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {threads.length > 0 ? (
            threads.map((thread) => (
              <div 
                key={thread.threadId}
                className={`p-3 border-b hover:bg-gray-50 cursor-pointer flex items-center ${
                  selectedThread === thread.threadId ? 'bg-pink-50' : ''
                }`}
                onClick={() => joinThread(thread.threadId)}
              >
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Thread {thread.threadId}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {thread.customer ? thread.customer.fullName : 'Khách hàng'} 
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không có cuộc trò chuyện nào
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold">Thread {selectedThread}</h2>
                <div className="text-xs text-gray-500">
                  {threads.find(t => t.threadId === selectedThread)?.customer?.fullName || 'Khách hàng'}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length > 0 ? (
                messages.map((msg: any, index) => (
                  <div 
                    key={index} 
                    className={`mb-4 flex ${msg.senderRole === "Staff" ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.senderRole !== "Staff" && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div 
                      className={`p-3 rounded-lg max-w-[70%] ${
                        msg.senderRole === "Staff" 
                          ? 'bg-pink-500 text-white rounded-tr-none' 
                          : 'bg-white shadow rounded-tl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                    {msg.senderRole === "Staff" && (
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 h-full flex items-center justify-center">
                  Bắt đầu cuộc trò chuyện
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-300"
                />
                <button 
                  onClick={sendMessage}
                  className="ml-2 p-2 bg-pink-500 text-white rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 flex-col p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-pink-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có cuộc trò chuyện nào được chọn</h3>
            <p className="text-center max-w-md">
              Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu trò chuyện với khách hàng.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
