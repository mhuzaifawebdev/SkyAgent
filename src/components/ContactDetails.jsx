'use client'
import React, { useState, useEffect } from 'react';
import { Copy, Mail, Phone, Check,MessageCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const ContactDetails = ({ userData }) => {
  const [copiedField, setCopiedField] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: 'skylineagent@trymartin.com',
    phone: '+18559108323',
    name: 'SkyAgent'
  });

  // Use provided userData or fallback to default
  useEffect(() => {
    if (userData) {
      setUserInfo({
        email: userData.email || userInfo.email,
        phone: userData.phone || userInfo.phone,
        name: userData.name || userData.firstName || userInfo.name
      });
    }
  }, [userData]);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedField(field);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    }
  };

    const CopyButton = ({ field, text }) => (
        <button
        onClick={() => copyToClipboard(text, field)}
        className="relative group"
        >
       <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1c1c1c] rounded-md text-white text-sm shadow-sm cursor-pointer hover:bg-[#2a2a2a] transition-all duration-200">
        <Copy className="w-4 h-4 text-white" />
        <span>Copy</span>
</div>

      
      {/* Copy animation */}
      {copiedField === field && (
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
      )}
    </button>
  );

  return (
    <div className=" bg-[#1c1c1c]/50 backdrop-blur-md border border-gray-700/30 rounded-2xl p-4 mb-4 hover:bg-[#1c1c1c]/30 transition-all duration-300 ">
      
      
      <div className="space-y-3">
        {/* Email Section */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-1">
              <div className="w-10 h-10 bg-[#1c1c1c] rounded-full flex items-center justify-center hover:bg-[#2a2a2a] transition">
                 <Mail className="w-4 h-4 text-white-400 mr-2" />
              </div>
           
            <span className="text-white text-sm select-all">{userInfo.email}</span>
          </div>
          <CopyButton field="email" text={userInfo.email} />
        </div>

        {/* Phone Section */}
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-1">
            <div className="w-10 h-10 bg-[#1c1c1c] rounded-full flex items-center justify-center hover:bg-[#2a2a2a] transition">
                <Phone className="w-4 h-4 text-white" />
            </div>
            <div className="w-10 h-10 bg-[#1c1c1c] rounded-full flex items-center justify-center hover:bg-[#2a2a2a] transition">
                <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="w-10 h-10 bg-[#1c1c1c] rounded-full flex items-center justify-center hover:bg-[#2a2a2a] transition">
                <FaWhatsapp className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm select-all">{userInfo.phone}</span>
            
            </div>
              <CopyButton field="phone" text={userInfo.phone} />
            </div>
 </div>

      {/* Success notification */}
      {copiedField && (
        <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded-md">
          <div className="flex items-center gap-2">
            <Check className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs">
              {copiedField === 'all' ? 'All contact info copied!' : 
               copiedField === 'email' ? 'Email copied to clipboard!' : 
               'Phone number copied to clipboard!'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDetails;