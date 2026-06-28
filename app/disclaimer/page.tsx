import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Disclaimer — Indexly' }

export default function DisclaimerPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>Indexly</Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--muted)' }}>Dashboard</Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', flex: 1 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Disclaimer</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 36 }}>Last updated: June 28, 2026</p>
        {[
          { title: 'No Guarantee of Indexing', content: 'Indexly submits your website to search engines using official APIs and protocols. However, the decision to index your website rests entirely with each search engine. Indexly does not guarantee that your website will be indexed, ranked, or appear in search results.' },
          { title: 'Search Engine Independence', content: 'Google, Bing, Yandex, Naver and other search engines are independent services. Indexly has no control over their algorithms, indexing policies, or ranking systems. Search engine behavior can change at any time.' },
          { title: 'Third-Party Services', content: 'Indexly relies on third-party APIs (Google Site Verification API, IndexNow protocol). Availability and functionality of these services are outside our control. Service interruptions at these providers may affect Indexly\'s ability to process your requests.' },
          { title: 'Analytics Accuracy', content: 'Analytics data displayed in Indexly is sourced from Google Search Console API and is provided for informational purposes. The Search Intent Pulse feature uses an algorithmic classification that may not perfectly reflect actual user intent in all cases.' },
          { title: 'Open Source Disclaimer', content: 'Indexly is open-source software provided under the MIT license "as is". Contributors make no warranties about the software\'s suitability for any purpose.' },
          { title: 'External Links', content: 'Indexly may contain links to external websites. We are not responsible for the content or privacy practices of those sites.' },
        ].map(s => (
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
