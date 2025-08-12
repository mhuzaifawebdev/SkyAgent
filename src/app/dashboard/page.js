import React from 'react';
import ContactDetails from '../../components/ContactDetails';
import TodoList from '../../components/TodoList';
import GmailInbox from '../../components/GmailInbox';
import CalendarWidget from '../../components/Calender';
import AIAssistant from '../../components/AIAssistant';

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-black text-white p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen">
        {/* Left Column - Contact Details, Todo, Gmail */}
        <div className="space-y-6">
          <ContactDetails />
          <TodoList />
          <GmailInbox /> 
        </div>

        {/* Middle Column - Calendar */}
        <div>
           <CalendarWidget />
        </div>

        {/* Right Column - AI Assistant */}
        <div>
          <AIAssistant />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


