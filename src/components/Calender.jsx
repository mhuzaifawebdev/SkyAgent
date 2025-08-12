'use client'
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal, ScanQrCode } from 'lucide-react';

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 4)); // August 2025
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const timeSlots = [
    { time: '12AM', period: 'night' },
    { time: '1AM', period: 'night' },
    { time: '2AM', period: 'night' },
    { time: '3AM', period: 'night' },
    { time: '4AM', period: 'night' },
    { time: '5AM', period: 'early' },
    { time: '6AM', period: 'morning' },
    { time: '7AM', period: 'morning' },
  ];

  return (
    <div className="bg-gray-900/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-4 h-full">
      {/* Reminders Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium">Reminders</h2>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Upcoming</span>
            <span className="text-gray-400 text-xs">Past</span>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="text-white text-sm">No upcoming reminders. Tell Skyline Agent to set a reminder.</p>
              <p className="text-gray-400 text-xs mt-1">He'll send you a text message then.</p>
            </div>
          </div>
        </div>
        <button className="w-full mt-3 py-2 text-center bg-gray-800/50 hover:bg-gray-800/70 border border-gray-600/50 rounded-lg text-white text-sm"> 
          Reminder +
        </button>
      </div>

      {/* Calendar Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-medium">Calendar</h2>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-400 text-xs">1 Account Connected</span>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            <ChevronRight className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            <button className="text-white text-sm">Today</button>
          </div>
          <span className="text-white font-medium">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-gray-400 text-xs font-medium py-2">
              {day}
            </div>
          ))}
          {getDaysInMonth().map((day, index) => (
            <div key={index} className="text-center p-2 hover:bg-gray-800/50 rounded cursor-pointer">
              {day && (
                <span className={`text-sm ${day === 4 ? 'text-white bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center mx-auto' : 'text-gray-300'}`}>
                  {day}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800/50">
              <span className="text-gray-400 text-xs">{slot.time}</span>
              <div className="flex-1 ml-4"></div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 p-3 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-400">
          <Plus className="w-5 h-5 mx-auto" />
        </button>
      </div>

      
    </div>
  );
};

export default CalendarWidget;