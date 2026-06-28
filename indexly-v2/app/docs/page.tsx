import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation — Indexly',
  description: 'Learn how to index your website on 200+ search engines using Indexly.',
}

export default function DocsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Nav */}
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, color: 'var(--text)', textDecoration: 'none' }}>
          <img src="/logo.png" alt="Indexly" style={{ width: 28, height: 28 }} onError={undefined} />
          Indexly
        </Link>
        <Link href="/dashboard">
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 14 }}>
            Go to App →
          </button>
        </Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: '#1a2040', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
            DOCUMENTATION
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
            Get Your Website Indexed<br />on 200+ Search Engines
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7 }}>
            Indexly is a free, open-source tool that helps you submit your website to Google, Bing, Yandex, Naver, and 200+ other search engines — in just 2 simple steps.
          </p>
        </div>

        {/* How it works */}
        <Section title="How It Works">
          <Step n={1} title="Sign up & enter your URL">
            Create a free account and enter your website URL or domain name. Indexly supports both full domains (myblog.com) and specific pages (myblog.com/about).
          </Step>
          <Step n={2} title="Add verification code to your site">
            Indexly generates a unique verification meta tag and a small key file. Add the meta tag to your homepage's &lt;head&gt; and upload the key file to your website root.
          </Step>
          <Step n={3} title="Verify & get indexed">
            Click Verify. Indexly checks your site, then submits it to Google Search Console and IndexNow — which instantly notifies Bing, Yandex, Naver, Seznam, and more.
          </Step>
          <Step n={4} title="Track your analytics">
            After 24 hours, view your Search Intent Pulse, traffic by country, state-level data, search engine coverage, and more — all in one dashboard.
          </Step>
        </Section>

        <Divider />

        {/* Domain vs URL */}
        <Section title="Domain vs URL — What's the Difference?">
          <p style={{ color: 'var(--muted)', marginBottom: 16, lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text)' }}>Domain</strong> — verifies your entire website (e.g. <code style={code}>myblog.com</code>). Best if you want all pages indexed. Requires a DNS TXT record or homepage meta tag.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text)' }}>URL</strong> — verifies a specific page (e.g. <code style={code}>myblog.com/about</code>). Best for new developers who don't own a domain yet. Only requires a meta tag in that page's &lt;head&gt;.
          </p>
        </Section>

        <Divider />

        {/* sitemap */}
        <Section title="Why You Need sitemap.xml & robots.txt">
          <p style={{ color: 'var(--muted)', marginBottom: 16, lineHeight: 1.7 }}>
            Search engines crawl your site using these files. Without them, your pages may never be discovered.
          </p>
          <CodeBlock title="robots.txt — place at: yourdomain.com/robots.txt" code={`User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml`} />
          <CodeBlock title="sitemap.xml — place at: yourdomain.com/sitemap.xml" code={`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2026-06-28</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/about</loc>
    <priority>0.8</priority>
  </url>
</urlset>`} />
        </Section>

        <Divider />

        {/* Analytics */}
        <Section title="Understanding Your Analytics">
          <AnalyticsItem icon="🔍" title="Search Engines" desc="See which search engines are showing your website and how many clicks each one drives." />
          <AnalyticsItem icon="🌍" title="Countries" desc="Discover which countries your visitors come from. Top 20 countries shown with click percentages." />
          <AnalyticsItem icon="📍" title="States" desc="Drill down into the top 20 states or regions worldwide where your site is being searched." />
          <AnalyticsItem icon="📈" title="Traffic" desc="View your last 30 days of traffic as a daily timeline to spot trends and growth." />
          <AnalyticsItem icon="⚡" title="Intent Pulse (Unique)" desc="Our algorithm classifies your keywords into Informational, Navigational, Transactional, and Commercial intent — and shows how this shifts over time. No other tool offers this." />
        </Section>

        <Divider />

        {/* FAQ */}
        <Section title="Frequently Asked Questions">
          <FAQ q="Is Indexly free?" a="Yes. Indexly is 100% free and open source. We never charge for indexing or analytics." />
          <FAQ q="How long does indexing take?" a="Google and IndexNow receive your submission instantly. It typically takes 24–72 hours for your pages to appear in search results." />
          <FAQ q="How many websites can I index per day?" a="Each account can index 1 website (domain or URL) every 24 hours. This ensures fair usage for all users." />
          <FAQ q="Do I need a Google account?" a="No. Indexly uses its own service account to communicate with Google on your behalf. You never need to log in to Google Search Console." />
          <FAQ q="Which search engines are covered?" a="Google (directly), and via the IndexNow protocol: Bing, Yahoo, DuckDuckGo, Yandex, Naver, Seznam, Yep, Ecosia, and more — 200+ in total." />
          <FAQ q="Is my data private?" a="Yes. Your website data is stored securely in our database and never shared with third parties. Only you can see your analytics." />
        </Section>

        <Divider />

        {/* Open source */}
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
          <h3 style={{ marginBottom: 8 }}>Open Source</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
            Indexly is open source and community-driven. Star us on GitHub, report issues, or contribute features.
          </p>
          <a href="https://github.com/indexly-project/indexly" target="_blank" rel="noopener noreferrer">
            <button className="btn-secondary" style={{ padding: '10px 24px' }}>
              View on GitHub →
            </button>
          </a>
        </div>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--muted)' }}>
          Questions? Email us at <a href="mailto:support@indexly.app">support@indexly.app</a>
        </p>
      </div>
    </div>
  )
}

const code: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: 4,
  padding: '2px 6px',
  fontFamily: 'monospace',
  fontSize: 13,
  color: '#a5f3fc',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>{title}</h2>
      {children}
    </div>
  )
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0 40px' }} />
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{n}</div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  )
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{title}</div>
      <pre style={{ background: '#111', border: '1px solid var(--border)', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 12, color: '#a5f3fc', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {code}
      </pre>
    </div>
  )
}

function AnalyticsItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 16, padding: '14px', background: '#111', borderRadius: 8, border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 24, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
      </div>
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
