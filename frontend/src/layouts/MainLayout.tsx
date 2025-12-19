
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../components/header/HeaderComponent';
import FooterComponent from '../components/footer/FooterComponent';
import ChatComponent from '../components/chat/ChatComponent';
import { useState } from "react";

const MainLayout = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatRoom, setChatRoom] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <HeaderComponent />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet context={{ setChatRoom }} />
      </main>

      {/* Footer */}
      <FooterComponent onChatToggle={() => setShowChat(!showChat)} />

      {/* Floating Chat */}
      {showChat && (
        <div className="fixed bottom-20 right-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-96 flex flex-col overflow-hidden">
            <ChatComponent room={chatRoom} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;