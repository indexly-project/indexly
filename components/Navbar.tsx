'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Navbar({ email }: { email?: string }) {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src="/logo.png" alt="Indexly" onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
        }} />
        <span>Indexly</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {email && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{email}</span>}
        <button className="btn-secondary" onClick={logout} style={{ padding: '6px 14px', fontSize: 13 }}>
          Logout
        </button>
      </div>
    </nav>
  )
}
