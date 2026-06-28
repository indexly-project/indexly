import Link from 'next/link'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="page-center" style={{ flex: 1, flexDirection: 'column', gap: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: 'var(--accent)', lineHeight: 1, marginBottom: 8 }}>404</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Page Not Found</h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 28, maxWidth: 360 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard"><button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }}>Go to Dashboard</button></Link>
          <Link href="/docs"><button className="btn-secondary" style={{ padding: '10px 24px' }}>Documentation</button></Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
