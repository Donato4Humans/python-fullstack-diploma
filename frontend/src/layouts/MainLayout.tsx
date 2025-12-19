
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../components/header/HeaderComponent';
import FooterComponent from '../components/footer/FooterComponent';
import ChatComponent from '../components/chat/ChatComponent';

const MainLayout = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatRoom, setChatRoom] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <main className="flex-1">
        <Outlet context={{ setChatRoom }} />  {/* Pass to children for auto-open */}
      </main>
      <FooterComponent onChatToggle={() => setShowChat(!showChat)} />

      {/* Chat — toggle show/hide */}
      {showChat && (
        <div className="fixed bottom-20 right-4 z-50">
          <ChatComponent room={chatRoom} />
        </div>
      )}
    </div>
  );
};

export default MainLayout;