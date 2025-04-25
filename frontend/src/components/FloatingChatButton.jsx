import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Model from './Model';
import Chatbot from './Chatbot';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
        title="Chat with AI Assistant"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </button>

      <Model
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="AI Assistant"
        size="max-w-2xl"
      >
        <div className="h-[600px]">
          <Chatbot />
        </div>
      </Model>
    </>
  );
};

export default FloatingChatButton; 