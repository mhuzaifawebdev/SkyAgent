'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Menu, Send, Mic, Paperclip } from 'lucide-react';

const ChatAssistance = () => {
  const [messages, setMessages] = useState([
    // {
    //   id: 1,
    //   type: 'user',
    //   content: 'Could you clarify what you\'d like me to do regarding "call"? Are you asking me to make a phone call, schedule one, or assist with something related to calls? Let me know how I can help!',
    //   timestamp: 'Aug 4 at 10:14 PM',
    //   showCallButton: true
    // },
    
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputValue,
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      };

      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      setIsTyping(true);

      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage = {
          id: messages.length + 2,
          type: 'assistant',
          content: 'I understand your request. Let me help you with that...',
          timestamp: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-6 animate-fade-in`}>
        <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl relative ${
          isUser ? 'order-2' : 'order-1'
        }`}>
          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser 
              ? 'bg-blue-600 text-white rounded-br-md' 
              : 'bg-gray-800 text-gray-100 rounded-bl-md'
          }`}>
            {message.content}
          </div>
          
          {/* Action Buttons */}
          {message.showCallButton && (
            <button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
              Call Me
            </button>
          )}
          
          {message.showStartCall && (
            <button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
              Start Phone Call
            </button>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
          {message.timestamp}
        </div>
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex items-start mb-6 animate-fade-in">
      <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#1c1c1c]/50 backdrop-blur-md border border-gray-700/30 rounded-2xl hover:bg-[#1c1c1c]/30 transition-all duration-300 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b rounded-t-2xl border-gray-800 bg-gray-900 ">
        <div className="flex items-center space-x-3">
          <button className="p-1 hover:bg-gray-700 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Assistance with Call Requests</h1>
        </div>
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#1c1c1c]/50">
        <div className="flex items-center space-x-2 bg-[#2a2a2a] rounded-xl px-3 py-2 border border-gray-700/50">
          {/* Model Badge */}
          <div className="text-xs text-gray-400 font-medium">
            GPT-4o
          </div>
          
          {/* Divider */}
          <div className="w-px h-4 bg-gray-600"></div>
          
          {/* Attachment Button */}
          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
            <Paperclip className="w-4 h-4" />
          </button>
          
          {/* Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="What do you want to do?"
            className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none min-w-0"
          />
          
          {/* Mic Button */}
          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
            <Mic className="w-4 h-4" />
          </button>
          
          {/* Send Button */}
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              inputValue.trim() 
                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                : 'bg-gray-700/50 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
        
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ChatAssistance;