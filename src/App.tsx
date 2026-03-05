import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Check, LogOut, User } from 'lucide-react'
import Login from './components/Login'

interface Todo {
  id: number
  text: string
  completed: boolean
  category: 'work' | 'personal' | 'urgent'
  userId: string
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
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('brutalTodoUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      loadUserTodos(userData.id)
    }
  }, [])

  const loadUserTodos = (userId: string) => {
    const savedTodos = localStorage.getItem(`brutalTodos_${userId}`)
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    } else {
      // Default todos for new users
      setTodos([
        { id: 1, text: 'Design the impossible', completed: false, category: 'work', userId },
        { id: 2, text: 'Break all the rules', completed: true, category: 'personal', userId },
        { id: 3, text: 'Ship before perfect', completed: false, category: 'urgent', userId },
      ])
    }
  }

  const handleLogin = (userData: UserData) => {
    setUser(userData)
    localStorage.setItem('brutalTodoUser', JSON.stringify(userData))
    loadUserTodos(userData.id)
  }

  const handleLogout = () => {
    if (user) {
      localStorage.setItem(`brutalTodos_${user.id}`, JSON.stringify(todos))
    }
    setUser(null)
    setTodos([])
    localStorage.removeItem('brutalTodoUser')
  }

  const saveTodos = (newTodos: Todo[]) => {
    if (user) {
      localStorage.setItem(`brutalTodos_${user.id}`, JSON.stringify(newTodos))
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
        },
      ]
      setTodos(newTodos)
      saveTodos(newTodos)
      setInputValue('')
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-[#00F0FF]'
      case 'personal': return 'bg-[#FF005C]'
      case 'urgent': return 'bg-[#FFD600]'
      default: return 'bg-white'
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Header with User Info */}
        <div className="mb-8 border-4 border-black bg-[#FF005C] p-6 shadow-[8px_8px_0_black]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 uppercase tracking-tight">
                BRUTAL TODO
              </h1>
              <p className="text-white text-sm md:text-base font-semibold uppercase">
                NO MERCY. NO EXCUSES. JUST DO IT.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="border-4 border-black bg-white px-4 py-2 font-bold uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0_black] transition-all flex items-center gap-2"
            >
              <LogOut size={20} strokeWidth={3} />
              OUT
            </button>
          </div>
          <div className="border-4 border-black bg-white px-4 py-2 inline-flex items-center gap-2">
            <User size={20} strokeWidth={3} />
            <span className="font-bold uppercase text-sm">{user.email}</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0_black]">
            <div className="text-3xl font-bold text-black">{stats.total}</div>
            <div className="text-xs uppercase font-semibold">TOTAL</div>
          </div>
          <div className="border-4 border-black bg-[#00F0FF] p-4 shadow-[4px_4px_0_black]">
            <div className="text-3xl font-bold text-black">{stats.active}</div>
            <div className="text-xs uppercase font-semibold">ACTIVE</div>
          </div>
          <div className="border-4 border-black bg-[#FFD600] p-4 shadow-[4px_4px_0_black]">
            <div className="text-3xl font-bold text-black">{stats.completed}</div>
            <div className="text-xs uppercase font-semibold">DONE</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 border-4 border-black bg-white p-6 shadow-[8px_8px_0_black]">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="TYPE YOUR TASK..."
              className="flex-1 border-4 border-black p-4 text-lg font-semibold uppercase focus:outline-none focus:shadow-[4px_4px_0_black] transition-shadow"
            />
            <button
              onClick={addTodo}
              className="border-4 border-black bg-[#00F0FF] px-8 py-4 font-bold uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0_black] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={24} strokeWidth={3} />
              ADD
            </button>
          </div>

          {/* Category Selection */}
          <div className="flex gap-2">
            {(['work', 'personal', 'urgent'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`border-4 border-black px-4 py-2 font-bold uppercase text-sm transition-all ${
                  selectedCategory === cat
                    ? `${getCategoryColor(cat)} shadow-[4px_4px_0_black]`
                    : 'bg-white hover:translate-x-1 hover:translate-y-1'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border-4 border-black px-6 py-3 font-bold uppercase text-sm transition-all ${
                filter === f
                  ? 'bg-black text-white shadow-[4px_4px_0_black]'
                  : 'bg-white hover:translate-x-1 hover:translate-y-1'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="border-4 border-black bg-white p-12 text-center shadow-[8px_8px_0_black]">
              <p className="text-2xl font-bold uppercase">NO TASKS FOUND</p>
              <p className="text-sm mt-2 uppercase">ADD SOMETHING OR CHANGE FILTER</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`border-4 border-black p-4 shadow-[6px_6px_0_black] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_black] ${
                  todo.completed ? 'bg-gray-200' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-8 h-8 border-4 border-black flex items-center justify-center transition-all ${
                      todo.completed ? 'bg-black' : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {todo.completed && <Check size={20} color="white" strokeWidth={4} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-lg font-semibold uppercase break-words ${
                        todo.completed ? 'line-through text-gray-500' : 'text-black'
                      }`}
                    >
                      {todo.text}
                    </p>
                    <div className={`inline-block mt-2 border-2 border-black ${getCategoryColor(todo.category)} px-3 py-1`}>
                      <span className="text-xs font-bold uppercase">{todo.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 border-4 border-black bg-[#FF005C] p-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0_black] transition-all"
                  >
                    <Trash2 size={20} color="white" strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 border-4 border-black bg-black p-6 shadow-[8px_8px_0_#FF005C]">
          <p className="text-white text-center font-bold uppercase text-sm">
            BUILT WITH CHATANDBUILD • NO CODE • PURE CHAOS
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
