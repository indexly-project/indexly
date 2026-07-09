import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Terms of Service — Indexly' }
const sections = [
  { title: '1. Acceptance', content: 'By using Indexly, you agree to these Terms. If you do not agree, please do not use the service.' },
  { title: '2. Description of Service', content: 'Indexly submits your website to search engines on your behalf using public APIs. We do not guarantee indexing results or search rankings.' },
  { title: '3. User Responsibilities', content: 'You must own or have authorization to submit the websites you index. You must not submit websites containing illegal content, malware, or spam. You are limited to 1 submission per 24 hours per account.' },
  { title: '4. Free Service', content: 'Indexly is provided free of charge. We may modify or discontinue the service at any time.' },
  { title: '5. No Warranty', content: 'Indexly is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.' },
  { title: '6. Limitation of Liability', content: 'Indexly and its contributors shall not be liable for any indirect, incidental, or consequential damages arising from use of the service.' },
  { title: '7. Open Source', content: 'Indexly source code is released under the MIT License. Contributions are welcome on GitHub.' },
  { title: '8. Contact', content: 'Questions: indexlyproject@gmail.com' },
]
export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>Indexly</Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--muted)' }}>Dashboard</Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', flex: 1 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Terms of Service</h1>
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
