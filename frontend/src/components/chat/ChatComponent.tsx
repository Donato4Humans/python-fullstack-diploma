
import { useEffect, useRef, useState } from 'react';
import { useGetSocketTokenQuery } from '../../redux/api/authApi';
import { useAppSelector } from '../../hooks/rtk';

interface ChatMessage {
  userId: string;
  username: string;
  role: string;
  message: string;
}

interface ChatComponentProps {
  room: string | null;
}

const ChatComponent = ({ room }: ChatComponentProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.user.user);
  const { data: socketToken } = useGetSocketTokenQuery(undefined, { skip: !room });

  useEffect(() => {
    if (!room || !socketToken) return;

    const ws = new WebSocket(`ws://localhost:8000/api/chat/${room}/?token=${socketToken.token}`);

    ws.onopen = () => console.log('Chat connected');

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      const [userId, username] = parsedData.user.split('_');
      const role = parsedData.user_role || 'user';

      setMessages(prev => [...prev, {
        userId,
        username,
        role,
        message: parsedData.message,
      }]);
    };

    ws.onclose = () => console.log('Chat disconnected');
    setSocket(ws);

    return () => ws.close();
  }, [room, socketToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !inputValue.trim()) return;

    const action = targetUser ? 'send_private_message' : 'send_message';
    const data = targetUser ? { text: inputValue, userId: targetUser } : { text: inputValue };

    socket.send(JSON.stringify({
      action,
      data,
      request_id: Date.now(),
    }));

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  if (!room) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <p className="text-center text-gray-600">No chat room selected</p>
      </div>
    );
  }

  return (
    <div className="w-80 h-96 bg-white rounded-xl shadow-lg border flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Chat Room: {room}</h3>
        <button onClick={() => {/* close chat */}}>X</button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold text-gray-800">
              {msg.username} ({msg.role})
            </span>
            : {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message..."
          className="w-full p-3 border rounded-lg"
        />
        <button onClick={sendMessage} className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;