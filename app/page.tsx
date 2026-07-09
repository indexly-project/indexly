'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const ENGINES = [
  { name: 'Google', flag: '🔵', desc: 'Primary Search Engine' },
  { name: 'Microsoft Bing', flag: '🟠', desc: 'Global Network' },
  { name: 'Yandex', flag: '🔴', desc: 'Eastern Europe' },
  { name: 'Naver', flag: '🟢', desc: 'South Korea' },
  { name: 'Seznam', flag: '🔵', desc: 'Czech Republic' },
  { name: 'Yep', flag: '⭐', desc: 'Independent' },
  { name: 'Brave Search', flag: '🦁', desc: 'Privacy-First' },
  { name: 'Mojeek', flag: '🔍', desc: 'UK Crawler' },
  { name: 'Yahoo', flag: '🟣', desc: 'via Bing' },
  { name: 'DuckDuckGo', flag: '🦆', desc: 'via Bing' },
  { name: 'Ecosia', flag: '🌱', desc: 'via Bing' },
  { name: 'Qwant', flag: '🔷', desc: 'via Bing' },
  { name: 'You.com', flag: '🤖', desc: 'via Bing' },
  { name: 'AOL Search', flag: '⚡', desc: 'via Bing' },
  { name: 'Swisscows', flag: '🏔️', desc: 'via Bing' },
  { name: 'ChatGPT Search', flag: '🧠', desc: 'via Bing' },
]

export default function Home() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (session) { router.replace('/dashboard'); return }
      setChecking(false)
    })
  }, [router])

  if (checking) return <div className="page-center"><div className="spinner" style={{ width: 32, height: 32 }} /></div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18 }}>
          <img src="/logo.png" alt="Indexly" style={{ width: 28, height: 28 }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
          Indexly
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/docs" style={{ fontSize: 14, color: 'var(--muted)' }}>Docs</Link>
          <Link href="/auth/login"><button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 14 }}>Get Started →</button></Link>
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#1a2040', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>FREE & OPEN SOURCE</div>
        <h1 style={{ fontSize: 'clamp(30px,6vw,50px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Index Your Website on<br /><span style={{ color: 'var(--accent)' }}>16 Search Engines</span><br />in 2 Steps
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Submit once, appear everywhere. Google, Bing, Yandex, Brave, Naver, DuckDuckGo, Yahoo and more — no separate accounts needed.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/login"><button className="btn-primary" style={{ width: 'auto', padding: '14px 32px', fontSize: 16, fontWeight: 600 }}>Start Indexing Free →</button></Link>
          <Link href="/docs"><button className="btn-secondary" style={{ padding: '14px 28px', fontSize: 16 }}>Read Docs</button></Link>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 16 }}>No credit card · Forever free · Open source</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)', marginBottom: 60 }}>
        {[{ n: '16', label: 'Search Engines' }, { n: '2', label: 'Steps Only' }, { n: '<3 min', label: 'Total Time' }, { n: '100%', label: 'Free Forever' }].map(s => (
          <div key={s.n} style={{ padding: '24px 36px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)' }}>{s.n}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, marginBottom: 40 }}>How It Works</h2>
        {[
          { n: 1, icon: '🔗', title: 'Enter Your URL or Domain', desc: 'Sign up free and enter your website URL or full domain. Takes 10 seconds.' },
          { n: 2, icon: '📋', title: 'Add 2 Things to Your Site', desc: 'Copy one verification tag into your <head> and upload one small key file to your root. Under 2 minutes.' },
          { n: 3, icon: '⚡', title: 'We Submit to All 16 Engines', desc: 'We verify your ownership and submit to Google, Bing, Yandex, Naver, Brave, Mojeek and the entire Bing network.' },
          { n: 4, icon: '📊', title: 'Track Real-Time Analytics', desc: 'See live visitors — countries, cities, browsers, devices and our unique Search Intent Pulse dashboard.' },
        ].map(s => (
          <div key={s.n} style={{ display: 'flex', gap: 16, padding: 20, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.icon} {s.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 24px', marginBottom: 60 }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 28 }}>⏱️ Indexly vs Manual Submission</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240, background: '#2d1a1a', border: '1px solid #ef4444', borderRadius: 12, padding: 20 }}>
              <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 12 }}>❌ Without Indexly</div>
              {['Visit each search engine — hours', 'Create accounts everywhere — days', 'Different verifications on each — frustrating', 'Monitor multiple dashboards — ongoing'].map(t => <div key={t} style={{ fontSize: 13, color: 'var(--muted)', padding: '4px 0' }}>• {t}</div>)}
            </div>
            <div style={{ flex: 1, minWidth: 240, background: '#1a2d1a', border: '1px solid #22c55e', borderRadius: 12, padding: 20 }}>
              <div style={{ color: '#22c55e', fontWeight: 700, marginBottom: 12 }}>✅ With Indexly</div>
              {['Enter URL — 10 seconds', 'Add tag + key file — 2 minutes', 'Click Verify — done in under 3 min', 'All 16 engines covered automatically'].map(t => <div key={t} style={{ fontSize: 13, color: 'var(--muted)', padding: '4px 0' }}>• {t}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>16 Search Engines Covered</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Submit once — we handle the entire distribution</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 10 }}>
          {ENGINES.map(e => (
            <div key={e.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{e.flag} {e.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ background: 'linear-gradient(135deg,#1a2040,#1a1a2e)', border: '1px solid var(--accent)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <h3 style={{ fontWeight: 700, marginBottom: 10 }}>Search Intent Pulse — Our Unique Feature</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>Our algorithm classifies real visitor traffic into Informational, Navigational, Transactional and Commercial intent — showing how this shifts over time. No other free tool offers this view.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '40px 24px 80px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Ready to get indexed?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Free forever. No card. Under 3 minutes.</p>
        <Link href="/auth/login"><button className="btn-primary" style={{ width: 'auto', padding: '14px 36px', fontSize: 16 }}>Create Free Account →</button></Link>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Indexly</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ href: '/docs', l: 'Docs' }, { href: '/about', l: 'About' }, { href: '/privacy', l: 'Privacy' }, { href: '/terms', l: 'Terms' }, { href: '/disclaimer', l: 'Disclaimer' }, { href: 'https://github.com/indexly-project/indexly', l: 'GitHub', ext: true }].map(l => (
              <a key={l.href} href={l.href} style={{ fontSize: 13, color: 'var(--muted)' }} target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}>{l.l}</a>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>© 2026 Indexly. MIT License.</div>
        </div>
      </footer>
    </div>
  )
}
