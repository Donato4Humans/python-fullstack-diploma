
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface FooterProps {
  onChatToggle: () => void;
}

const FooterComponent = ({ onChatToggle }: FooterProps) => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2025 Piyachok. All rights reserved.</p>
        {/* Chat toggle button — right down corner */}
        <button
          onClick={onChatToggle}
          className="fixed bottom-6 right-6 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          <ChatBubbleLeftIcon className="w-6 h-6" />
        </button>
      </div>
    </footer>
  );
};

export default FooterComponent;