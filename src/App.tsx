import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Check, LogOut, User, Edit2, Calendar, Clock, Search, Filter, Star, Archive } from 'lucide-react'
import Login from './components/Login'

interface Todo {
  id: number
  text: string
  completed: boolean
  category: 'work' | 'personal' | 'urgent'
  userId: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  notes?: string
  starred: boolean
  archived: boolean
}

interface UserData {
  email: string
  id: string
}

function App() {
  const [user, setUser] = useState<UserData | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'work' | 'personal' | 'urgent'>('work')
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'starred' | 'archived'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('neumorphicTodoUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      loadUserTodos(userData.id)
    }
  }, [])

  const loadUserTodos = (userId: string) => {
    const savedTodos = localStorage.getItem(`neumorphicTodos_${userId}`)
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    } else {
      const now = new Date().toISOString()
      setTodos([
        { 
          id: 1, 
          text: 'Complete project proposal', 
          completed: false, 
          category: 'work', 
          userId,
          priority: 'high',
          createdAt: now,
          starred: true,
          archived: false,
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        },
        { 
          id: 2, 
          text: 'Morning meditation', 
          completed: true, 
          category: 'personal', 
          userId,
          priority: 'medium',
          createdAt: now,
          starred: false,
          archived: false
        },
        { 
          id: 3, 
          text: 'Review urgent emails', 
          completed: false, 
          category: 'urgent', 
          userId,
          priority: 'high',
          createdAt: now,
          starred: true,
          archived: false,
          notes: 'Check client feedback'
        },
      ])
    }
  }

  const handleLogin = (userData: UserData) => {
    setUser(userData)
    localStorage.setItem('neumorphicTodoUser', JSON.stringify(userData))
    loadUserTodos(userData.id)
  }

  const handleLogout = () => {
    if (user) {
      localStorage.setItem(`neumorphicTodos_${user.id}`, JSON.stringify(todos))
    }
    setUser(null)
    setTodos([])
    localStorage.removeItem('neumorphicTodoUser')
  }

  const saveTodos = (newTodos: Todo[]) => {
    if (user) {
      localStorage.setItem(`neumorphicTodos_${user.id}`, JSON.stringify(newTodos))
    }
  }

  const addTodo = () => {
    if (inputValue.trim() && user) {
      const newTodos = [
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
          category: selectedCategory,
          userId: user.id,
          priority: selectedPriority,
          dueDate: dueDate || undefined,
          createdAt: new Date().toISOString(),
          notes: notes || undefined,
          starred: false,
          archived: false,
        },
      ]
      setTodos(newTodos)
      saveTodos(newTodos)
      setInputValue('')
      setDueDate('')
      setNotes('')
    }
  }

  const toggleTodo = (id: number) => {
    const newTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    setTodos(newTodos)
    saveTodos(newTodos)
  }

  const deleteTodo = (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id)
    setTodos(newTodos)
    saveTodos(newTodos)
  }

  const toggleStar = (id: number) => {
    const newTodos = todos.map(todo => 
      todo.id === id ? { ...todo, starred: !todo.starred } : todo
    )
    setTodos(newTodos)
    saveTodos(newTodos)
  }

  const toggleArchive = (id: number) => {
    const newTodos = todos.map(todo => 
      todo.id === id ? { ...todo, archived: !todo.archived } : todo
    )
    setTodos(newTodos)
    saveTodos(newTodos)
  }

  const startEdit = (id: number, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = (id: number) => {
    if (editText.trim()) {
      const newTodos = todos.map(todo => 
        todo.id === id ? { ...todo, text: editText } : todo
      )
      setTodos(newTodos)
      saveTodos(newTodos)
    }
    setEditingId(null)
    setEditText('')
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'from-blue-400 to-blue-500'
      case 'personal': return 'from-purple-400 to-purple-500'
      case 'urgent': return 'from-red-400 to-red-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed && !todo.archived
    if (filter === 'completed') return todo.completed && !todo.archived
    if (filter === 'starred') return todo.starred && !todo.archived
    if (filter === 'archived') return todo.archived
    if (filter === 'all') return !todo.archived
    return true
  }).filter(todo => 
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: todos.filter(t => !t.archived).length,
    active: todos.filter(t => !t.completed && !t.archived).length,
    completed: todos.filter(t => t.completed && !t.archived).length,
    starred: todos.filter(t => t.starred && !t.archived).length,
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-neumorphic">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 tracking-tight">
                My Tasks
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Organize your day with elegance
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-3 rounded-2xl shadow-neumorphic hover:shadow-neumorphic-inset transition-all flex items-center gap-2 text-gray-700 font-medium"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-3 rounded-2xl shadow-neumorphic-inset inline-flex items-center gap-3">
            <User size={18} className="text-gray-600" />
            <span className="font-medium text-gray-700">{user.email}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-neumorphic">
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600 font-medium">Total Tasks</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-neumorphic">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.active}</div>
            <div className="text-sm text-blue-700 font-medium">Active</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-neumorphic">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.completed}</div>
            <div className="text-sm text-green-700 font-medium">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-neumorphic">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.starred}</div>
            <div className="text-sm text-yellow-700 font-medium">Starred</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 shadow-neumorphic">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl pl-12 pr-4 py-3 shadow-neumorphic-inset focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-3 rounded-2xl shadow-neumorphic hover:shadow-neumorphic-inset transition-all flex items-center gap-2 text-gray-700 font-medium justify-center"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex flex-wrap gap-2">
                {(['all', 'active', 'completed', 'starred', 'archived'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      filter === f
                        ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-neumorphic hover:shadow-neumorphic-inset'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Task */}
        <div className="mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 shadow-neumorphic">
          <div className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl px-6 py-4 shadow-neumorphic-inset focus:outline-none text-gray-700 placeholder-gray-400 text-lg"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl px-6 py-3 shadow-neumorphic-inset focus:outline-none text-gray-700"
              />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes (optional)"
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl px-6 py-3 shadow-neumorphic-inset focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex gap-2">
                {(['work', 'personal', 'urgent'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      selectedCategory === cat
                        ? `bg-gradient-to-br ${getCategoryColor(cat)} text-white shadow-lg`
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-neumorphic hover:shadow-neumorphic-inset'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((pri) => (
                  <button
                    key={pri}
                    onClick={() => setSelectedPriority(pri)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      selectedPriority === pri
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-neumorphic hover:shadow-neumorphic-inset'
                    }`}
                  >
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={addTodo}
                className="ml-auto bg-gradient-to-br from-blue-400 to-blue-500 text-white px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-12 text-center shadow-neumorphic">
              <p className="text-2xl font-semibold text-gray-600 mb-2">No tasks found</p>
              <p className="text-gray-500">Add a new task or adjust your filters</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 shadow-neumorphic transition-all hover:shadow-neumorphic-hover ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      todo.completed 
                        ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-lg' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 shadow-neumorphic hover:shadow-neumorphic-inset'
                    }`}
                  >
                    {todo.completed && <Check size={20} className="text-white" strokeWidth={3} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                        onBlur={() => saveEdit(todo.id)}
                        className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl px-4 py-2 shadow-neumorphic-inset focus:outline-none text-gray-700"
                        autoFocus
                      />
                    ) : (
                      <p
                        className={`text-lg font-medium mb-2 ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {todo.text}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-br ${getCategoryColor(todo.category)} text-white shadow-sm`}>
                        {todo.category}
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(todo.priority)}`}>
                        {todo.priority} priority
                      </span>
                      {todo.dueDate && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 shadow-neumorphic-inset">
                          <Calendar size={12} />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {todo.notes && (
                        <span className="text-xs text-gray-500 italic">"{todo.notes}"</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStar(todo.id)}
                      className={`p-2 rounded-xl transition-all ${
                        todo.starred
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg'
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 shadow-neumorphic hover:shadow-neumorphic-inset'
                      }`}
                    >
                      <Star size={18} className={todo.starred ? 'text-white fill-white' : 'text-gray-600'} />
                    </button>
                    <button
                      onClick={() => startEdit(todo.id, todo.text)}
                      className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-neumorphic hover:shadow-neumorphic-inset transition-all"
                    >
                      <Edit2 size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => toggleArchive(todo.id)}
                      className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-neumorphic hover:shadow-neumorphic-inset transition-all"
                    >
                      <Archive size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 rounded-xl bg-gradient-to-br from-red-400 to-red-500 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Trash2 size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-neumorphic">
          <p className="text-gray-300 text-center font-medium text-sm">
            Built with ChatAndBuild • No Code • Pure Elegance
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
