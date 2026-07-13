import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Disclaimer — Indexly' }
const sections = [
  { title: 'No Guarantee of Indexing', content: 'Indexly submits your website to search engines using official protocols. However, the decision to index rests entirely with each search engine. Indexly does not guarantee your website will appear in search results.' },
  { title: 'Search Engine Independence', content: 'Google, Bing, Yandex, Naver, and the other 18 search engines listed on our homepage are independent services. Indexly has no control over their algorithms, indexing policies, or ranking systems.' },
  { title: 'Third-Party Services', content: 'Indexly relies on third-party APIs. Availability of these services is outside our control. Service interruptions at these providers may affect Indexly.' },
  { title: 'Analytics Accuracy', content: 'Analytics data is sourced from our own tracking system and is provided for informational purposes. The Search Intent Pulse uses an algorithmic classification that may not perfectly reflect actual user intent.' },
  { title: 'Open Source Disclaimer', content: 'Indexly is provided under the MIT license "as is". Contributors make no warranties about its suitability for any purpose.' },
  { title: 'Contact', content: 'Questions: indexlyproject@gmail.com' },
]
export default function DisclaimerPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>Indexly</Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--muted)' }}>Dashboard</Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', flex: 1 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Disclaimer</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 36 }}>Last updated: July 3, 2026</p>
        {sections.map(s => (
          <div key={s.title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{s.title}</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: 14 }}>{s.content}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}
