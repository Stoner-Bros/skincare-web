import { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import axios from "axios";

export default function Skinsenger() {
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
      await axios.post(`https://skincare-api.azurewebsites.net/api/chat/threads/${threadId}/join?staffId=10`);

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
        10, // Replace with actual senderId
        "Staff", // Replace with actual senderRole
        newMessage
      );
      setNewMessage("");
    }
  };

  return (
    <div>
      <h1>Skinsenger</h1>
      <div>
        <h2>Threads</h2>
        <ul>
          {threads.map((thread: any) => (
            <li key={thread.threadId}>
              <button onClick={() => joinThread(thread.threadId)}>
                Join Thread {thread.threadId}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedThread && (
        <div>
          <h2>Thread {selectedThread}</h2>
          <div>
            {messages.map((msg: any, index) => (
              <div key={index}>
                <strong>{msg.senderRole}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
