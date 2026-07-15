import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Privacy Policy — Indexly' }
const sections = [
  { title: '1. Information We Collect', content: 'We collect your email address when you create an account. We collect website URLs you submit for indexing. We collect anonymized visitor analytics when you add our tracking script to your site. We do not collect payment information.' },
  { title: '2. How We Use Your Information', content: 'We use your email to authenticate your account. We use submitted URLs to perform the indexing service on your behalf. We never sell your personal information to any third party.' },
  { title: '3. Data Storage', content: 'Your data is stored securely on Supabase infrastructure with Row Level Security (RLS). Each user can only access their own data.' },
  { title: '4. Third-Party Services', content: 'To index your site, we submit your website URL to the Google Site Verification API and to the IndexNow protocol (used by Bing, Yandex, Naver, Seznam.cz, and Yep). Only your public website URL is shared — no personal account information is sent to these services. For analytics, we determine a visitor\'s approximate country, region, and city using our hosting provider\'s built-in edge network geolocation — this happens on our own infrastructure, not through any third-party data broker. The visitor\'s raw IP address itself is never stored in our database.' },
  { title: '5. Cookies', content: 'We use session cookies for authentication only. We do not use tracking or advertising cookies.' },
  { title: '6. Data Retention', content: 'Raw, per-visit analytics data is kept for a short window (up to 9 days) before being compressed into daily, weekly, monthly, yearly, and eventually lifetime summaries — each summary keeps only aggregated counts (like total visits and top countries), never individual visit records. You may request deletion of your account and all associated data at any time.' },
  { title: '7. Your Rights', content: 'You have the right to access, correct, or delete your personal data. Contact us at indexlyproject@gmail.com.' },
  { title: '8. Contact', content: 'For privacy questions, email indexlyproject@gmail.com.' },
]
export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>Indexly</Link>
        <Link href="/dashboard" style={{ fontSize: 14, color: 'var(--muted)' }}>Dashboard</Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', flex: 1 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 36 }}>Last updated: July 15, 2026</p>
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
