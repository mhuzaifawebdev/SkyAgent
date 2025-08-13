'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Search, Plus, MoreHorizontal, ArrowUpDown, Calendar, Pin, ChevronDown, Maximize2, Filter, Minimize2, Trash2, RefreshCw} from 'lucide-react';

const TodoWidget = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTasks, setShowAllTasks] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt', 'title', 'date'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', 'pending', 'pinned'
  const [deletingTasks, setDeletingTasks] = useState(new Set());
  const seededRef = useRef(false);

  useEffect(() => {
    fetchTodos();

    // close dropdown when clicking outside
    const onDoc = (e) => {
      const el = e.target;
      if (!el || typeof el.closest !== 'function') return;
      if (!el.closest('.todo-filter-root')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  // --- API helpers ---
  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      
      const data = await res.json();

      if (!Array.isArray(data)) {
        setTodos([]);
        return;
      }

      // Convert createdAt strings to Date objects for client-side sorting
      const transformed = data.map((t) => ({
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
      }));

      // if DB empty, seed with your original hard-coded todos (one-time)
      if (transformed.length === 0 && !seededRef.current) {
        seededRef.current = true;
        await seedInitialTodos();
        return fetchTodos();
      }

      setTodos(transformed);
    } catch (err) {
      console.error('fetchTodos error:', err);
    }
  };

  // Seed the DB with your original example todos (keeps the same content/createdAt values)
  const seedInitialTodos = async () => {
    const initial = [
      {
        id: 1,
        title: 'From Agent: Redesign the Skyline website',
        category: 'P2',
        date: null,
        completed: false,
        pinned: false,
        type: 'email',
        createdAt: new Date('2024-08-01').toISOString(),
      },
      {
        id: 2,
        title: 'problems of software team because of erp',
        category: null,
        date: 'Aug 4',
        completed: false,
        pinned: true,
        type: 'task',
        createdAt: new Date('2024-08-04').toISOString(),
      },
      {
        id: 3,
        title: 'discussion on software about software etc products',
        category: null,
        date: 'Aug 4',
        completed: false,
        pinned: true,
        type: 'task',
        createdAt: new Date('2024-08-04').toISOString(),
      },
      {
        id: 4,
        title: 'discussion on cold emailing',
        category: null,
        date: 'Aug 4',
        completed: false,
        pinned: true,
        type: 'task',
        createdAt: new Date('2024-08-04').toISOString(),
      },
      {
        id: 5,
        title: 'have a meeting with tom and alex regarding team',
        category: null,
        date: 'Aug 4',
        completed: false,
        pinned: false,
        type: 'task',
        createdAt: new Date('2024-08-04').toISOString(),
      },
    ];

    for (const t of initial) {
      try {
        await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
        });
      } catch (err) {
        console.error('seed error:', err);
      }
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      title: newTodo.trim(),
      category: null,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: false,
      pinned: false,
      type: 'task',
      createdAt: new Date(),
    };

    // Optimistic UI update
    setTodos((s) => [...s, todo]);
    setNewTodo('');

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, createdAt: todo.createdAt.toISOString() }),
      });
      
      const result = await res.json();
    } catch (err) {
      console.error('addTodo error:', err);
      // on failure, re-fetch to restore canonical state
      fetchTodos();
    }
  };

  const updateTodoOnServer = async (updatedTodo) => {
    try {
      const bodyToSend = {
        ...updatedTodo,
        createdAt:
          updatedTodo.createdAt instanceof Date
            ? updatedTodo.createdAt.toISOString()
            : updatedTodo.createdAt,
      };

      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend),
      });
      
      const result = await res.json();
    } catch (err) {
      console.error('updateTodoOnServer error:', err);
    }
  };

  const toggleTodo = async (id) => {
    const updated = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    setTodos(updated);
    const updatedTodo = updated.find((t) => t.id === id);
    await updateTodoOnServer(updatedTodo);
  };

  const togglePin = async (id) => {
    const updated = todos.map((todo) => (todo.id === id ? { ...todo, pinned: !todo.pinned } : todo));
    setTodos(updated);
    const updatedTodo = updated.find((t) => t.id === id);
    await updateTodoOnServer(updatedTodo);
  };

  const deleteTodo = (id) => {
    // add to deleting set for animation
    setDeletingTasks((prev) => new Set([...prev, id]));

    // remove from state after animation delay and call API
    setTimeout(async () => {
      const removed = todos.find((t) => t.id === id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setDeletingTasks((prev) => {
        const ns = new Set(prev);
        ns.delete(id);
        return ns;
      });

      try {
        const res = await fetch('/api/todos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        
        const result = await res.json();
      } catch (err) {
        console.error('delete error:', err);
        // revert on failure
        setTodos((prev) => [...prev, removed]);
      }
    }, 200);
  };

  const assignToCalendar = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updated = todos.map((t) => (t.id === id ? { ...t, assignedToCalendar: true } : t));
    setTodos(updated);

    // notify user (keeps original UX)
    alert(`Task "${todo.title}" has been assigned to Google Calendar!`);

    // persist
    await updateTodoOnServer(updated.find((t) => t.id === id));
  };

  const toggleMinimize = () => setIsMinimized((s) => !s);
  const toggleSort = () => setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'));

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setShowFilterDropdown(false);
  };

  // --- Filtering & sorting helpers ---
  const getFilteredTodos = () => {
    let filtered = todos.filter((todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase()));

    switch (activeFilter) {
      case 'completed':
        filtered = filtered.filter((todo) => todo.completed);
        break;
      case 'pending':
        filtered = filtered.filter((todo) => !todo.completed);
        break;
      case 'pinned':
        filtered = filtered.filter((todo) => todo.pinned);
        break;
      default:
        break;
    }

    return filtered;
  };

  const parseDateForSort = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    // Try adding current year for short strings like "Aug 4"
    const tryYear = new Date(`${dateStr} ${new Date().getFullYear()}`);
    if (!isNaN(tryYear.getTime())) return tryYear;
    return null;
  };

  const getSortedTodos = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
      // pinned items come first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date': {
          const da = parseDateForSort(a.date)?.getTime() ?? Infinity;
          const db = parseDateForSort(b.date)?.getTime() ?? Infinity;
          comparison = da - db;
          break;
        }
        case 'createdAt':
        default: {
          const ca = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
          const cb = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
          comparison = ca - cb;
          break;
        }
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredAndSortedTodos = getSortedTodos(getFilteredTodos());

  const getFilterLabel = () => {
    switch (activeFilter) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'pinned':
        return 'Pinned';
      default:
        return 'All';
    }
  };
  const [isRefreshing, setIsRefreshing] = useState(false);

const handleRefresh = async () => {
  setIsRefreshing(true);
  await fetchTodos();
  setTimeout(() => setIsRefreshing(false), 600); // small delay so animation is visible
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
          onClick={handleRefresh}
          className="p-2 bg-gray-800/50 hover:bg-gray-700 rounded-full transition-colors"
          title="Refresh"
        >
          <RefreshCw
            className={`w-4 h-4 text-blue-400 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>


          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-gray-800/30 rounded transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4 text-gray-400" /> : <Minimize2 className="w-4 h-4 text-gray-400" />}
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
            <div className="relative todo-filter-root">
              <button
                onClick={() => setShowFilterDropdown((s) => !s)}
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

              {/* SortBy selector (keeps behavior explicit) */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800/50 border border-gray-600/50 text-sm text-white px-2 py-1 rounded"
              >
                <option value="createdAt">Newest</option>
                <option value="title">Title</option>
                <option value="date">Date</option>
              </select>

              <button
                onClick={() => setShowFilterDropdown((s) => !s)}
                className="p-1 hover:bg-gray-800/30 rounded transition-colors"
              >
                <Filter className={`w-4 h-4 transition-colors ${activeFilter !== 'all' ? 'text-blue-400' : 'text-gray-400'}`} />
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
                    checked={!!todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="mt-1 w-4 h-4 bg-transparent border border-gray-600 rounded accent-blue-500"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {todo.pinned && <Pin className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
                      <span className={`text-sm ${todo.completed ? 'text-gray-500 line-through' : 'text-white'} truncate`}>
                        {todo.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {todo.category && (
                        <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">
                          {todo.category}
                        </span>
                      )}
                      {todo.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{todo.date}</span>
                        </div>
                      )}
                      {todo.type === 'email' && <span className="text-blue-400">📧</span>}
                      {todo.assignedToCalendar && <span className="text-green-400">📅 In Calendar</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(todo.id);
                      }}
                      className={`p-1 hover:bg-gray-700 rounded transition-colors ${
                        todo.pinned ? 'text-yellow-400' : 'text-gray-500'
                      }`}
                      title={todo.pinned ? "Unpin" : "Pin"}
                    >
                      <Pin className={`w-3 h-3 ${todo.pinned ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        assignToCalendar(todo.id);
                      }}
                      className="p-1 hover:bg-gray-700 rounded text-blue-400 transition-colors"
                      title="Assign to Calendar"
                    >
                      <Calendar className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTodo(todo.id);
                      }}
                      className="p-1 hover:bg-red-900/30 rounded text-red-400 hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Todo Input */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
            />
            <button
              onClick={addTodo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors flex items-center gap-1"
              disabled={!newTodo.trim()}
            >
              <Plus className="w-4 h-4" />
              Add
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

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-700/50 text-xs text-gray-400 flex justify-between">
            <span>
              {filteredAndSortedTodos.filter(t => !t.completed).length} pending, {filteredAndSortedTodos.filter(t => t.completed).length} completed
            </span>
            <span>
              {filteredAndSortedTodos.filter(t => t.pinned).length} pinned
            </span>
          </div>
        </>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="flex items-center justify-between text-gray-400 text-sm">
          <span>{todos.filter((t) => !t.completed).length} pending tasks</span>
          <span>{todos.filter((t) => t.completed).length} completed</span>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
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