'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { router.replace('/dashboard'); return }
      setChecking(false)
    })
  }, [router])

  if (checking) return <div className="page-center"><div className="spinner" style={{ width: 32, height: 32 }} /></div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18 }}>
          <img src="/logo.png" alt="" style={{ width: 28, height: 28 }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
          Indexly
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/docs" style={{ fontSize: 14, color: 'var(--muted)' }}>Docs</Link>
          <Link href="/auth/login">
            <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 14 }}>Get Started →</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#1a2040', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 20, letterSpacing: 1 }}>
          FREE & OPEN SOURCE
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Index Your Website on<br />
          <span style={{ color: 'var(--accent)' }}>200+ Search Engines</span><br />
          in 2 Steps
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 17, lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Google, Bing, Yandex, Naver, DuckDuckGo and 200+ more — submit once, get indexed everywhere. No accounts needed for each engine.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/login">
            <button className="btn-primary" style={{ width: 'auto', padding: '14px 32px', fontSize: 16, fontWeight: 600 }}>
              Start Indexing Free →
            </button>
          </Link>
          <Link href="/docs">
            <button className="btn-secondary" style={{ padding: '14px 28px', fontSize: 16 }}>
              Read Docs
            </button>
          </Link>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 16 }}>No credit card required · Forever free</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)', marginBottom: 60 }}>
        {[
          { n: '200+', label: 'Search Engines' },
          { n: '2', label: 'Steps Only' },
          { n: '100%', label: 'Free Forever' },
          { n: '<30s', label: 'Token Generation' },
        ].map(s => (
          <div key={s.n} style={{ padding: '24px 40px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>{s.n}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { n: 1, icon: '🔗', title: 'Enter Your URL or Domain', desc: 'Sign up and paste your website URL. Choose between a single page or your entire domain.' },
            { n: 2, icon: '📋', title: 'Add 2 Things to Your Site', desc: 'Copy one meta tag into your <head> and upload one small key file to your root folder. Takes 2 minutes.' },
            { n: 3, icon: '⚡', title: 'We Submit to 200+ Engines', desc: 'We verify your site and instantly submit to Google, Bing, Yandex, Naver and 200+ more via IndexNow protocol.' },
            { n: 4, icon: '📊', title: 'Track with Analytics', desc: 'After 24 hours, see your Search Intent Pulse, traffic by country, state-level data and more.' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 16, padding: 20, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{s.n}</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.icon} {s.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search engines covered */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 24px', marginBottom: 60 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Engines Covered</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Google', 'Bing', 'Yandex', 'DuckDuckGo', 'Yahoo', 'Naver', 'Seznam', 'Yep', 'Ecosia', 'Qwant', 'ChatGPT Search', 'Bing Copilot', '200+ more'].map(e => (
              <span key={e} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 14px', fontSize: 13, color: e === '200+ more' ? 'var(--accent)' : 'var(--text)' }}>{e}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Unique feature */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a2040, #1a1a2e)', border: '1px solid var(--accent)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <h3 style={{ fontWeight: 700, marginBottom: 10 }}>Search Intent Pulse — Our Unique Feature</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
            No other tool shows this. Our algorithm classifies your traffic into Informational, Navigational, Transactional and Commercial intent — and tracks how it shifts over time. Know exactly what your visitors want.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '40px 24px 80px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Ready to get indexed?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>It's free. It takes 5 minutes. No card required.</p>
        <Link href="/auth/login">
          <button className="btn-primary" style={{ width: 'auto', padding: '14px 36px', fontSize: 16 }}>Create Free Account →</button>
        </Link>
      </div>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Indexly</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { href: '/docs', label: 'Docs' },
            { href: '/about', label: 'About' },
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms', label: 'Terms' },
            { href: '/disclaimer', label: 'Disclaimer' },
            { href: 'https://github.com/indexly-project/indexly', label: 'GitHub' },
          ].map(l => (
            <a key={l.href} href={l.href} style={{ fontSize: 13, color: 'var(--muted)' }} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{l.label}</a>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>© 2026 Indexly. MIT License.</div>
      </div>
    </footer>
  )
}
