'use client'
import React, { useState } from 'react';
import { ChevronDown, Maximize2, Minus, Settings, Plus } from 'lucide-react';

const GmailWidget = () => {
  const [activeTab, setActiveTab] = useState('Important');
  const [selectedEmail, setSelectedEmail] = useState('skylineagent@trymartin.com');

  const emails = [
    {
      id: 1,
      sender: 'Marketing',
      subject: 'Update on sales made on winter season',
      preview: 'Dear Adam, Assalam-o-Alaikum In this regard, it is to infor...',
      time: '11:31 AM',
      category: 'Sales Notifications',
      categoryColor: 'bg-green-500',
      hasAttachment: false,
      isUnread: true
    },
    {
      id: 2,
      sender: 'Skyline Sprint',
      subject: 'Your AI Powered Assistant',
      preview: "Welcome to the world of tech",
      time: '10:56 AM',
      category: null,
      categoryColor: null,
      hasAttachment: false,
      isUnread: true
    },
    {
      id: 3,
      sender: 'Meeting Schedule',
      subject: ' UI/UX Design Fixes',
      preview: "Whats the update on   company website design  Yo...",
      time: 'Aug 4',
      category: 'Security Alerts',
      categoryColor: 'bg-blue-500',
      hasAttachment: false,
      isUnread: true
    },
    {
      id: 4,
      sender: 'skyagent@try.com',
      subject: 'Hi from SkyAgent!',
      preview: 'Hey Boss! SkyAgent here. Your email is now synced with me. Feel fr...',
      time: 'Aug 4',
      category: null,
      categoryColor: null,
      hasAttachment: false,
      isUnread: true,
      
    }
  ];

  return (
    <div className="bg-[#1c1c1c]/50 backdrop-blur-md border border-gray-700/30 rounded-2xl hover:bg-[#1c1c1c]/30 transition-all duration-300 p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-medium">Inbox</h2>
        
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-800/30 rounded">
            <Maximize2 className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-800/30 rounded">
            <Minus className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-800/30 rounded">
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Email Selector */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-gray-800/30 rounded-md px-3 py-2 cursor-pointer">
          <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="text-gray-300 text-sm">{selectedEmail}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-6 mb-4 border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab('Important')}
          className={`pb-2 text-sm relative ${
            activeTab === 'Important'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Important
        </button>
        <button
          onClick={() => setActiveTab('Other')}
          className={`pb-2 text-sm ${
            activeTab === 'Other'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Other
        </button>
      </div>

      {/* Email List - Scrollable */}
      <div className="space-y-0 max-h-[280px] overflow-y-auto custom-scrollbar">
        {emails.map((email) => (
          <div key={email.id} className="flex items-start gap-3 p-3 hover:bg-gray-800/30 rounded-md cursor-pointer border-b border-gray-800/30 last:border-b-0">
            {/* Unread Indicator */}
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            
            <div className="flex-1 min-w-0">
              {/* Sender and Category */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-sm font-medium">{email.sender}</span>
                {email.category && (
                  <span className={`text-xs text-white px-2 py-0.5 rounded-md ${email.categoryColor}`}>
                    {email.category}
                  </span>
                )}
              </div>
              
              {/* Subject */}
              <p className="text-white text-sm font-normal mb-1">
                {email.subject}
              </p>
              
              {/* Preview */}
              <p className="text-gray-400 text-sm line-clamp-1">
                {email.preview}
              </p>
            </div>
            
     
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GmailWidget;