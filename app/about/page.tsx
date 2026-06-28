import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = { title: 'About — Indexly', description: 'About Indexly — the free, open-source website indexing tool.' }

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>Indexly</Link>
        <Link href="/auth/login"><button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 14 }}>Get Started →</button></Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', flex: 1 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>About Indexly</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          Indexly is a free, open-source tool that solves a real frustration: getting your website discovered by search engines requires visiting dozens of platforms, creating multiple accounts, and managing different verification codes. We built a single platform to do it all.
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>The Problem We Solve</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
          A typical developer or website owner needs to separately verify their site on Google Search Console, Bing Webmaster Tools, Yandex Webmaster, and more. Each platform has its own verification method, its own analytics dashboard, and its own submission process. Indexly unifies all of this into a single 2-step flow.
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>How We Do It</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
          We use Google's Site Verification API and the IndexNow protocol (supported by Bing, Yandex, Naver, Seznam, Yep, and more). One meta tag + one key file gives us everything we need to verify and submit your site across the entire search engine ecosystem.
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Open Source</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
          Indexly is fully open source under the MIT license. Our algorithm for the Search Intent Pulse is also open and auditable. We believe transparency builds trust.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="https://github.com/indexly-project/indexly" target="_blank" rel="noopener noreferrer">
            <button className="btn-secondary" style={{ padding: '10px 24px' }}>View on GitHub →</button>
          </a>
          <Link href="/docs"><button className="btn-secondary" style={{ padding: '10px 24px' }}>Documentation →</button></Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
