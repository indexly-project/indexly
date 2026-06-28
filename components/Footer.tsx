import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', background: 'var(--surface)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Indexly</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[
            { href: '/docs', label: 'Docs' },
            { href: '/about', label: 'About' },
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms' },
            { href: '/disclaimer', label: 'Disclaimer' },
            { href: 'https://github.com/indexly-project/indexly', label: 'GitHub', ext: true },
          ].map(l => (
            <a key={l.href} href={l.href} style={{ fontSize: 12, color: 'var(--muted)' }} target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}>{l.label}</a>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>© 2026 Indexly. MIT License.</div>
      </div>
    </footer>
  )
}
