import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy — Indexly' }

export default function PrivacyPage() {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect your email address when you create an account. We collect the website URLs and domains you submit for indexing. We collect anonymized usage analytics to improve the service. We do not collect payment information.' },
    { title: '2. How We Use Your Information', content: 'We use your email to authenticate your account and send service-related communications. We use submitted URLs to perform the indexing service on your behalf. We do not sell your personal information to any third party.' },
    { title: '3. Data Storage', content: 'Your data is stored securely on Supabase infrastructure (PostgreSQL). Authentication is handled by Supabase Auth with industry-standard JWT tokens. We use Row Level Security (RLS) to ensure each user can only access their own data.' },
    { title: '4. Third-Party Services', content: 'We interact with Google Site Verification API, Bing Webmaster API, and the IndexNow protocol on your behalf. These services receive your website URL as part of the indexing process. Please review Google\'s and Microsoft\'s privacy policies for more details.' },
    { title: '5. Cookies', content: 'We use session cookies for authentication purposes only. We do not use tracking cookies or advertising cookies.' },
    { title: '6. Data Retention', content: 'Your account data is retained as long as your account is active. You may request deletion of your account and data at any time by contacting us.' },
    { title: '7. Your Rights', content: 'You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at support@indexly.app.' },
    { title: '8. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify users of significant changes via email or a notice on the platform.' },
    { title: '9. Contact', content: 'For privacy-related questions, email us at support@indexly.app.' },
  ]
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>Indexly</Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--muted)' }}>Dashboard</Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', flex: 1 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
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
