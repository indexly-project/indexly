import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'
export const metadata: Metadata = { title: 'About — Indexly', description: 'About Indexly — free, open-source website indexing tool.' }
export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>Indexly</Link>
        <Link href="/auth/login"><button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 14 }}>Get Started →</button></Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', flex: 1 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>About Indexly</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>Indexly is a free, open-source tool that solves a real frustration: getting your website discovered requires visiting dozens of platforms, creating multiple accounts, and managing different verification codes. We built a single platform to do it all — in under 3 minutes.</p>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>The Problem We Solve</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>A developer or website owner needs to separately verify on multiple search engines. Each has its own flow, its own verification method, its own dashboard. Indexly unifies all of this into a single 2-step process covering 14 search engines at once.</p>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Our Unique Feature</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>Beyond indexing, Indexly includes a real-time analytics system with Search Intent Pulse — our proprietary algorithm that classifies visitor traffic into Informational, Navigational, Transactional and Commercial intent. No other free tool offers this.</p>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Open Source</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>Indexly is fully open source under the MIT license. Our algorithm is auditable. We believe transparency builds trust.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="https://github.com/indexly-project/indexly" target="_blank" rel="noopener noreferrer"><button className="btn-secondary" style={{ padding: '10px 24px' }}>View on GitHub →</button></a>
          <a href="mailto:indexlyproject@gmail.com"><button className="btn-secondary" style={{ padding: '10px 24px' }}>Contact Us</button></a>
        </div>
      </div>
      <Footer />
    </div>
  )
}
