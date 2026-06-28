import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms of Service — Indexly' }

export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using Indexly, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.' },
    { title: '2. Description of Service', content: 'Indexly provides a website indexing submission service. We submit your website to search engines on your behalf using publicly available APIs and protocols. We do not guarantee indexing results, rankings, or search engine behavior.' },
    { title: '3. User Responsibilities', content: 'You are responsible for ensuring you own or have authorization to submit the websites you index through Indexly. You must not use Indexly to submit websites containing illegal content, malware, or spam. You are limited to 1 website submission per 24 hours per account.' },
    { title: '4. Free Service & Limitations', content: 'Indexly is provided free of charge. We reserve the right to modify, suspend, or discontinue the service at any time. We may introduce premium features in the future.' },
    { title: '5. No Warranty', content: 'Indexly is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that your website will be indexed by any specific search engine.' },
    { title: '6. Limitation of Liability', content: 'Indexly and its contributors shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.' },
    { title: '7. Open Source', content: 'Indexly\'s source code is released under the MIT License. Contributions are welcome on GitHub.' },
    { title: '8. Governing Law', content: 'These terms are governed by applicable law. Disputes shall be resolved through good-faith negotiation before any legal action.' },
    { title: '9. Changes to Terms', content: 'We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.' },
    { title: '10. Contact', content: 'Questions about these terms: support@indexly.app' },
  ]
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>Indexly</Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--muted)' }}>Dashboard</Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', flex: 1 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 36 }}>Last updated: June 28, 2026</p>
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
