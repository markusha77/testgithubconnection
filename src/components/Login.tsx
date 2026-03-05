import React, { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'

interface LoginProps {
  onLogin: (user: { email: string; id: string }) => void
}

function Login({ onLogin }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('All fields are required')
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const users = JSON.parse(localStorage.getItem('neumorphicTodoUsers') || '{}')

    if (isSignUp) {
      if (users[email]) {
        setError('User already exists')
        return
      }
      users[email] = {
        password,
        id: Date.now().toString(),
      }
      localStorage.setItem('neumorphicTodoUsers', JSON.stringify(users))
      onLogin({ email, id: users[email].id })
    } else {
      if (!users[email] || users[email].password !== password) {
        setError('Invalid credentials')
        return
      }
      onLogin({ email, id: users[email].id })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-neumorphic text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 tracking-tight">
            My Tasks
          </h1>
          <p className="text-gray-600 font-medium">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-neumorphic">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl px-6 py-4 shadow-neumorphic-inset focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl px-6 py-4 shadow-neumorphic-inset focus:outline-none text-gray-700"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl px-6 py-4 shadow-neumorphic-inset focus:outline-none text-gray-700"
                />
              </div>
            )}

            {error && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 shadow-neumorphic-inset">
                <p className="text-red-600 font-medium text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-blue-400 to-blue-500 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 font-semibold text-lg"
            >
              {isSignUp ? (
                <>
                  <UserPlus size={22} />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn size={22} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-300">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setConfirmPassword('')
              }}
              className="w-full bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-3 rounded-2xl shadow-neumorphic hover:shadow-neumorphic-inset transition-all font-medium text-gray-700"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-5 shadow-neumorphic">
          <p className="text-gray-300 text-center font-medium text-sm">
            Built with ChatAndBuild • No Code • Pure Elegance
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
