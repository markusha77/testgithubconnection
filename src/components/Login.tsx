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
      setError('ALL FIELDS REQUIRED')
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setError('PASSWORDS DO NOT MATCH')
      return
    }

    if (password.length < 6) {
      setError('PASSWORD TOO WEAK (MIN 6 CHARS)')
      return
    }

    // Simple localStorage-based auth
    const users = JSON.parse(localStorage.getItem('brutalTodoUsers') || '{}')

    if (isSignUp) {
      if (users[email]) {
        setError('USER ALREADY EXISTS')
        return
      }
      users[email] = {
        password,
        id: Date.now().toString(),
      }
      localStorage.setItem('brutalTodoUsers', JSON.stringify(users))
      onLogin({ email, id: users[email].id })
    } else {
      if (!users[email] || users[email].password !== password) {
        setError('INVALID CREDENTIALS')
        return
      }
      onLogin({ email, id: users[email].id })
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 border-4 border-black bg-[#FF005C] p-6 shadow-[8px_8px_0_black]">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tight">
            BRUTAL TODO
          </h1>
          <p className="text-white text-sm font-semibold uppercase">
            {isSignUp ? 'CREATE YOUR ACCOUNT' : 'SIGN IN TO CONTINUE'}
          </p>
        </div>

        {/* Login Form */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR@EMAIL.COM"
                className="w-full border-4 border-black p-3 text-lg font-semibold uppercase focus:outline-none focus:shadow-[4px_4px_0_black] transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-4 border-black p-3 text-lg font-semibold focus:outline-none focus:shadow-[4px_4px_0_black] transition-shadow"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-bold uppercase mb-2">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-4 border-black p-3 text-lg font-semibold focus:outline-none focus:shadow-[4px_4px_0_black] transition-shadow"
                />
              </div>
            )}

            {error && (
              <div className="border-4 border-black bg-[#FF005C] p-3">
                <p className="text-white font-bold uppercase text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full border-4 border-black bg-[#00F0FF] px-6 py-4 font-bold uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0_black] transition-all flex items-center justify-center gap-2"
            >
              {isSignUp ? (
                <>
                  <UserPlus size={24} strokeWidth={3} />
                  SIGN UP
                </>
              ) : (
                <>
                  <LogIn size={24} strokeWidth={3} />
                  SIGN IN
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-4 border-black">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setConfirmPassword('')
              }}
              className="w-full border-4 border-black bg-white px-6 py-3 font-bold uppercase hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              {isSignUp ? 'ALREADY HAVE ACCOUNT? SIGN IN' : 'NO ACCOUNT? SIGN UP'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-4 border-black bg-black p-4 shadow-[8px_8px_0_#FF005C]">
          <p className="text-white text-center font-bold uppercase text-xs">
            BUILT WITH CHATANDBUILD • NO CODE • PURE CHAOS
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
