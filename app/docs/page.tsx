import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Documentation — Indexly',
  description: 'Learn how to index your website on 14 search engines using Indexly.',
}

export default function DocsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>
          <img src="/logo.png" alt="Indexly" style={{ width: 28, height: 28 }} />
          Indexly
        </Link>
        <Link href="/auth/login">
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 14 }}>Get Started →</button>
        </Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: '#1a2040', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 16 }}>DOCUMENTATION</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
            Get Your Website Indexed<br />on 14 Search Engines
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7 }}>
            Indexly is a free, open-source tool that connects your website to the world's search engine network — from major global platforms to regional engines — in just 2 simple steps.
          </p>
        </div>

        <Section title="How It Works">
          <Step n={1} title="Sign up & enter your URL">Create a free account and enter your website URL or domain. Supports both full domains (myblog.com) and specific pages (myblog.com/about).</Step>
          <Step n={2} title="Add verification code to your site">Indexly generates a unique verification tag and a small key file. Add the tag to your homepage's &lt;head&gt; and upload the key file to your root folder.</Step>
          <Step n={3} title="Verify & get indexed everywhere">Click Verify. Indexly scans your website, confirms ownership, and submits it across the search engine network — covering all 14 platforms at once.</Step>
          <Step n={4} title="Track your analytics">After 24-48 hours, view your real-time visitor analytics, Search Intent Pulse, traffic by country and city, device breakdown, and more.</Step>
        </Section>

        <Divider />

        <Section title="Domain vs URL">
          <p style={{ color: 'var(--muted)', marginBottom: 12, lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text)' }}>Domain</strong> — verifies your entire website (e.g. <code style={codeStyle}>myblog.com</code>). Best for full-site coverage.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text)' }}>URL</strong> — verifies a specific page (e.g. <code style={codeStyle}>myblog.com/about</code>). Only requires a tag in that page's &lt;head&gt;.
          </p>
        </Section>

        <Divider />

        <Section title="Why You Need sitemap.xml & robots.txt">
          <p style={{ color: 'var(--muted)', marginBottom: 16, lineHeight: 1.7 }}>Search engine crawlers use these files to discover and understand your website. Without them, your pages may not be fully indexed.</p>
          <CodeBlock title="robots.txt — place at: yourdomain.com/robots.txt" code={`User-agent: *\nAllow: /\nSitemap: https://yourdomain.com/sitemap.xml`} />
          <CodeBlock title="sitemap.xml — place at: yourdomain.com/sitemap.xml" code={`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://yourdomain.com/</loc>\n    <lastmod>2026-07-03</lastmod>\n    <priority>1.0</priority>\n  </url>\n</urlset>`} />
        </Section>

        <Divider />

        <Section title="Analytics Features">
          <AnalyticsItem icon="🔍" title="Search Engine Coverage" desc="See which of the 14 search engines are showing your website and how much traffic each one drives." />
          <AnalyticsItem icon="🌍" title="Countries & Cities" desc="Discover which countries and cities your real visitors come from — updated every 30 minutes." />
          <AnalyticsItem icon="📱" title="Devices & Browsers" desc="See device types (mobile, desktop, tablet) and browser breakdown for your visitors." />
          <AnalyticsItem icon="📈" title="Traffic Timeline" desc="View hourly, daily and weekly traffic trends to spot growth patterns." />
          <AnalyticsItem icon="⚡" title="Search Intent Pulse (Unique)" desc="Our algorithm classifies your traffic into Informational, Navigational, Transactional and Commercial intent. No other tool offers this view." />
        </Section>

        <Divider />

        <Section title="Frequently Asked Questions">
          <FAQ q="Is Indexly free?" a="Yes. Indexly is 100% free and open source. We never charge for indexing or analytics." />
          <FAQ q="How long does indexing take?" a="Submissions are processed instantly. It typically takes 24–72 hours for your pages to appear in search results — this is each search engine's own crawl schedule, not Indexly's limitation." />
          <FAQ q="How many websites can I index per day?" a="Each account can index 1 website every 24 hours, ensuring fair usage for all users." />
          <FAQ q="Do I need separate accounts on each search engine?" a="No. That is the entire point of Indexly — submit once and we distribute across all 14 engines for you." />
          <FAQ q="Which search engines are covered?" a="Google, Microsoft Bing, Yandex, Naver, Seznam, Yep — plus Yahoo, DuckDuckGo, Ecosia, Qwant, You.com, AOL, Swisscows and ChatGPT Search via the Bing network." />
          <FAQ q="Is my data private?" a="Yes. Your data is stored securely and never shared with third parties. Only you can access your analytics." />
        </Section>

        <Divider />

        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
          <h3 style={{ marginBottom: 8 }}>Open Source</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>Indexly is fully open source. Star us on GitHub, report issues, or contribute features.</p>
          <a href="https://github.com/indexly-project/indexly" target="_blank" rel="noopener noreferrer">
            <button className="btn-secondary" style={{ padding: '10px 24px' }}>View on GitHub →</button>
          </a>
        </div>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--muted)' }}>
          Questions? Email us at <a href="mailto:indexlyproject@gmail.com">indexlyproject@gmail.com</a>
        </p>
      </div>
      <Footer />
    </div>
  )
}

const codeStyle: React.CSSProperties = { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 4, padding: '2px 6px', fontFamily: 'monospace', fontSize: 13, color: '#a5f3fc' }
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 40 }}><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>{title}</h2>{children}</div>
}
function Divider() { return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0 40px' }} /> }
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{n}</div>
      <div><div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div><div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{children}</div></div>
    </div>
  )
}
function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{title}</div>
      <pre style={{ background: '#111', border: '1px solid var(--border)', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 12, color: '#a5f3fc', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{code}</pre>
    </div>
  )
}
function AnalyticsItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 16, padding: 14, background: '#111', borderRadius: 8, border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 24, flexShrink: 0 }}>{icon}</div>
      <div><div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div><div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>{desc}</div></div>
    </div>
  )
}
function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Q: {q}</div>
      <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>A: {a}</div>
    </div>
  )
}
