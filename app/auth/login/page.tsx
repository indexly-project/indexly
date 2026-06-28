'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    if (!email || !password) {
      setError('Email और password दोनों डालो।')
      return
    }
    if (password.length < 6) {
      setError('Password कम से कम 6 characters का होना चाहिए।')
      return
    }

    setLoading(true)
    const supabase = createClient()

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) {
        setError(err.message)
      } else {
        setSuccess('Account बन गया! अब login करो।')
        setMode('login')
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError('Email या password गलत है।')
      } else {
        router.replace('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <div className="page-center">
      <div className="auth-box">

        {/* Logo */}
        <div className="auth-logo">
          <img src="/logo.png" alt="Indexly" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }} />
          <h1>Indexly</h1>
          <p>200+ search engines पर index करो — एक click में</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 8, padding: 4, marginBottom: 20, border: '1px solid var(--border)' }}>
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
            style={{
              flex: 1, padding: '8px', borderRadius: 6, background: mode === 'login' ? 'var(--accent)' : 'transparent',
              color: mode === 'login' ? 'white' : 'var(--muted)', fontSize: 14
            }}
          >Login</button>
          <button
            onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
            style={{
              flex: 1, padding: '8px', borderRadius: 6, background: mode === 'signup' ? 'var(--accent)' : 'transparent',
              color: mode === 'signup' ? 'white' : 'var(--muted)', fontSize: 14
            }}
          >Sign Up</button>
        </div>

        {/* Form */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : mode === 'login' ? 'Login करो' : 'Account बनाओ'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>
          {mode === 'login' ? 'नया account चाहिए?' : 'पहले से account है?'}{' '}
          <a href="#" onClick={e => { e.preventDefault(); setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}>
            {mode === 'login' ? 'Sign Up करो' : 'Login करो'}
          </a>
        </p>
      </div>
    </div>
  )
}
