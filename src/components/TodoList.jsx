'use client'
import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, ArrowUpDown, Calendar, Pin, ChevronDown, Maximize2, Filter, Minimize2, ChevronUp, Trash2, X } from 'lucide-react';

const TodoWidget = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: 'From Agent: Redesign the Skyline website',
      category: 'P2',
      date: null,
      completed: false,
      pinned: false,
      type: 'email',
      createdAt: new Date('2024-08-01')
    },
    {
      id: 2,
      title: 'problems of software team because of erp',
      category: null,
      date: 'Aug 4',
      completed: false,
      pinned: true,
      type: 'task',
      createdAt: new Date('2024-08-04')
    },
    {
      id: 3,
      title: 'discussion on software about software etc products',
      category: null,
      date: 'Aug 4',
      completed: false,
      pinned: true,
      type: 'task',
      createdAt: new Date('2024-08-04')
    },
    {
      id: 4,
      title: 'discussion on cold emailing',
      category: null,
      date: 'Aug 4',
      completed: false,
      pinned: true,
      type: 'task',
      createdAt: new Date('2024-08-04')
    },
    {
      id: 5,
      title: 'have a meeting with tom and alex regarding team',
      category: null,
      date: 'Aug 4',
      completed: false,
      pinned: false,
      type: 'task',
      createdAt: new Date('2024-08-04')
    }
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTasks, setShowAllTasks] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt', 'title', 'date'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', 'pending', 'pinned'
  const [deletingTasks, setDeletingTasks] = useState(new Set()); // Track tasks being deleted for animation

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        title: newTodo.trim(),
        category: null,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: false,
        pinned: false,
        type: 'task',
        createdAt: new Date()
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const togglePin = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, pinned: !todo.pinned } : todo
    ));
  };

  const deleteTodo = (id) => {
    // Add task to deleting set for animation
    setDeletingTasks(prev => new Set([...prev, id]));
    
    // Remove task after animation delay
    setTimeout(() => {
      setTodos(todos.filter(todo => todo.id !== id));
      setDeletingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 200);
  };

  const assignToCalendar = (id) => {
    const todo = todos.find(t => t.id === id);
    console.log('Assigning to Google Calendar:', todo);
    
    setTodos(todos.map(t => 
      t.id === id ? { ...t, assignedToCalendar: true } : t
    ));
    
    alert(`Task "${todo.title}" has been assigned to Google Calendar!`);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setShowFilterDropdown(false);
  };

  // Filter todos based on active filter
  const getFilteredTodos = () => {
    let filtered = todos.filter(todo => 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply active filter
    switch (activeFilter) {
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      case 'pending':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'pinned':
        filtered = filtered.filter(todo => todo.pinned);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    return filtered;
  };

  // Sort todos
  const getSortedTodos = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
      let comparison = 0;
      
      // First sort by pinned status (pinned items always come first)
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then sort by the selected criteria
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          if (!a.date && !b.date) comparison = 0;
          else if (!a.date) comparison = 1;
          else if (!b.date) comparison = -1;
          else comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'createdAt':
        default:
          comparison = a.createdAt - b.createdAt;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredAndSortedTodos = getSortedTodos(getFilteredTodos());

  const getFilterLabel = () => {
    switch (activeFilter) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'pinned': return 'Pinned';
      default: return 'All';
    }
  };

  return (
    <div className="bg-[#1c1c1c]/50 backdrop-blur-md border border-gray-700/30 rounded-2xl hover:bg-[#1c1c1c]/30 transition-all duration-300 p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-medium">To-dos</h2>
        
        {/* Search Bar - Only show when not minimized */}
        {!isMinimized && (
          <div className="relative flex-1 mx-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search to-dos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMinimize}
            className="p-1 hover:bg-gray-800/30 rounded transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-gray-400" />
            ) : (
              <Minimize2 className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button className="p-1 hover:bg-gray-800/30 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Main Content - Hide when minimized */}
      {!isMinimized && (
        <>
          {/* Controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 text-white text-sm bg-gray-800/50 px-3 py-1 rounded hover:bg-gray-800/70 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{getFilterLabel()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Filter Dropdown */}
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10 min-w-[120px]">
                  {['all', 'pending', 'completed', 'pinned'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors ${
                        activeFilter === filter ? 'bg-gray-700 text-white' : 'text-gray-300'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleSort}
                className="p-1 hover:bg-gray-800/30 rounded transition-colors"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  sortOrder === 'asc' ? 'rotate-180' : ''
                }`} />
              </button>
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="p-1 hover:bg-gray-800/30 rounded transition-colors"
              >
                <Filter className={`w-4 h-4 transition-colors ${
                  activeFilter !== 'all' ? 'text-blue-400' : 'text-gray-400'
                }`} />
              </button>
            </div>
          </div>

          {/* User Email */}
          <div className="text-gray-400 text-xs mb-4">skylineagent@trymartin.com</div>

          {/* Todo List - Scrollable with fixed height for ~3 items */}
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredAndSortedTodos.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">
                {searchQuery || activeFilter !== 'all' ? 'No matching tasks found' : 'No tasks yet'}
              </div>
            ) : (
              filteredAndSortedTodos.map((todo) => (
                <div 
                  key={todo.id} 
                  className={`flex items-start gap-3 p-2 hover:bg-gray-800/30 rounded-md cursor-pointer transition-all duration-200 ${
                    deletingTasks.has(todo.id) ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="mt-1 w-4 h-4 bg-transparent border border-gray-600 rounded accent-blue-500"
                  />
                  
                  <div className="flex-1">
                    <p className={`text-white text-sm transition-colors ${
                      todo.completed ? 'line-through text-gray-500' : ''
                    }`}>
                      {todo.title}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {todo.category && (
                        <span className="text-yellow-500 text-xs bg-yellow-500/20 px-2 py-0.5 rounded">
                          {todo.category}
                        </span>
                      )}
                      {todo.date && (
                        <span className="text-gray-400 text-xs">{todo.date}</span>
                      )}
                      {todo.assignedToCalendar && (
                        <span className="text-xs text-green-400">📅 In Calendar</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePin(todo.id)}
                      className={`p-1 rounded hover:bg-gray-800/30 transition-colors ${
                        todo.pinned ? 'text-yellow-400' : 'text-gray-500'
                      }`}
                      title={todo.pinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={() => assignToCalendar(todo.id)}
                      className="p-1 rounded hover:bg-gray-800/30 text-blue-400 transition-colors"
                      title="Assign to Google Calendar"
                    >
                      <Calendar className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 rounded hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    
                    <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add New Todo */}
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-md text-sm focus:outline-none focus:border-gray-500 placeholder-gray-400 text-white transition-colors"
            />
            <button
              onClick={addTodo}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              disabled={!newTodo.trim()}
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Filter Status Indicator */}
          {(activeFilter !== 'all' || searchQuery) && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              Showing {filteredAndSortedTodos.length} of {todos.length} tasks
              {activeFilter !== 'all' && ` (${getFilterLabel()})`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}
        </>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="flex items-center justify-between text-gray-400 text-sm">
          <span>{todos.filter(t => !t.completed).length} pending tasks</span>
          <span>{todos.filter(t => t.completed).length} completed</span>
        </div>
      )}

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
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: rgba(156, 163, 175, 0.9);
        }
      `}</style>
    </div>
  );
};

export default TodoWidget;