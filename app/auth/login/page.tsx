'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    setError(''); setSuccess('')
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Please enter a valid email address.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (mode === 'signup' && !agreed) { setError('Please agree to our Terms of Service and Privacy Policy to continue.'); return }

    setLoading(true)
    const supabase = createClient()

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email: email.trim(), password })
      if (err) { setError(err.message) }
      else { setSuccess('Account created! You can now log in.'); setMode('login'); setPassword(''); setAgreed(false) }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (err) { setError('Invalid email or password. Please try again.') }
      else { router.replace('/dashboard') }
    }
    setLoading(false)
  }

  return (
    <div className="page-center">
      <div className="auth-box">
        <div className="auth-logo">
          <img src="/logo.png" alt="Indexly" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
          <h1>Indexly</h1>
          <p>Index your website on 16 search engines — instantly.</p>
        </div>

        <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 8, padding: 4, marginBottom: 20, border: '1px solid var(--border)' }}>
          <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}
            style={{ flex: 1, padding: '8px', borderRadius: 6, background: mode === 'login' ? 'var(--accent)' : 'transparent', color: mode === 'login' ? 'white' : 'var(--muted)', fontSize: 14 }}>Login</button>
          <button onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
            style={{ flex: 1, padding: '8px', borderRadius: 6, background: mode === 'signup' ? 'var(--accent)' : 'transparent', color: mode === 'signup' ? 'white' : 'var(--muted)', fontSize: 14 }}>Sign Up</button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} autoComplete="email" />
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            {mode === 'signup' && <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Minimum 6 characters</p>}
          </div>

          {mode === 'signup' && (
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, accentColor: 'var(--accent)', cursor: 'pointer' }} />
              <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                I agree to Indexly's{' '}
                <a href="/terms" target="_blank" style={{ color: 'var(--accent)' }}>Terms of Service</a>{', '}
                <a href="/privacy" target="_blank" style={{ color: 'var(--accent)' }}>Privacy Policy</a>{' and '}
                <a href="/disclaimer" target="_blank" style={{ color: 'var(--accent)' }}>Disclaimer</a>.
              </span>
            </label>
          )}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading || (mode === 'signup' && !agreed)}>
            {loading ? <span className="spinner" /> : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <a href="#" onClick={e => { e.preventDefault(); setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </a>
        </p>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
          <a href="/docs">Documentation</a>{' · '}<a href="/about">About</a>{' · '}<a href="mailto:support@indexly.app">Support</a>
        </p>
      </div>
    </div>
  )
}
