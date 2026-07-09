'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
export default function Navbar({ email }: { email?: string }) {
  const router = useRouter()
  const logout = async () => { await createClient().auth.signOut(); router.replace('/auth/login') }
  return (
    <nav className="navbar">
      <Link href="/dashboard" className="nav-logo" style={{ textDecoration: 'none' }}>
        <img src="/logo.png" alt="Indexly" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
        <span>Indexly</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link href="/docs" style={{ fontSize: 13, color: 'var(--muted)' }}>Docs</Link>
        {email && <span style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</span>}
        <button className="btn-secondary" onClick={logout} style={{ padding: '6px 14px', fontSize: 13 }}>Logout</button>
      </div>
    </nav>
  )
}
