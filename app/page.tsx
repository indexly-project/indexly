'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const ENGINES = [
  { name: 'Google', domain: 'google.com', flag: '🔵', tag: 'The Big One', time: 'A few hours to 2 days', desc: "The world's largest search engine, handling close to 90% of all global search traffic. It also powers Google Images, Google News, Google Maps, and AI Overviews. Getting indexed here is the single most important step for any website — it drives the overwhelming majority of organic discovery traffic worldwide, on every device and in every country." },
  { name: 'Bing', domain: 'bing.com', flag: '🟠', tag: 'Microsoft Search', time: 'Minutes to a few hours', desc: "Microsoft's flagship search engine, built into Windows, Edge, and the Copilot AI assistant. Bing has grown fast recently thanks to AI integration, especially in markets like Japan, Brazil, and Germany. It is the default for millions of enterprise and Windows users, and its results also power several other search engines you'll see further down this list." },
  { name: 'Yandex', domain: 'yandex.com', flag: '🔴', tag: 'Russia & CIS', time: 'Minutes to a few hours', desc: "The leading search engine across Russia and the wider CIS region, capturing over 70% of search traffic in Russia alone. Yandex also runs maps, ride-hailing, and e-commerce in the region, making it essential for reaching Russian-speaking or Eastern European audiences." },
  { name: 'Naver', domain: 'naver.com', flag: '🟢', tag: 'South Korea', time: 'A few hours to 1 day', desc: "South Korea's most powerful search platform, blending search with blogs, shopping, maps, news, and even webtoons in one ecosystem. In its home market, Naver rivals or even surpasses Google, and Korean users often trust its blog and community content more than standard web results. Indispensable for the Korean market." },
  { name: 'Seznam.cz', domain: 'seznam.cz', flag: '🔵', tag: 'Czech Republic', time: 'A few hours to 1 day', desc: "The Czech Republic's leading homegrown search engine, built specifically to understand Czech language and local content better than global competitors. It's the only search engine in the EU with a genuinely strong native foothold — a must-have for reaching Czech audiences." },
  { name: 'Yep', domain: 'yep.com', flag: '⭐', tag: 'Creator-Friendly', time: 'A few hours to 1 day', desc: "A newer, community-driven search engine built by the SEO company Ahrefs. It stands out by sharing ad revenue with the content creators and website owners whose pages appear in its results — an alternative, creator-friendly approach compared to traditional engines." },
  { name: 'Yahoo!', domain: 'yahoo.com', flag: '🟣', tag: 'News & Finance', time: 'Same day', desc: "One of the internet's oldest and most recognizable search and content portals, still used by hundreds of millions of people worldwide — especially for news, finance, and email-linked search. Yahoo combines search results with a rich content ecosystem, valuable for both search visibility and brand presence." },
  { name: 'AOL Search', domain: 'aol.com', flag: '⚡', tag: 'Legacy Portal', time: '1–3 days', desc: "A long-standing internet portal with a loyal, established user base built up over decades. AOL continues to serve search alongside news and email services, retaining relevance among a legacy but still active audience segment." },
  { name: 'DuckDuckGo', domain: 'duckduckgo.com', flag: '🦆', tag: 'Privacy-First', time: 'Same day to 2 days', desc: "The world's leading privacy-focused search engine, built around zero user tracking and no personalized filter bubbles. It has grown consistently as privacy awareness increases globally, and is especially popular among tech-savvy users, journalists, and privacy-conscious searchers." },
  { name: 'Ecosia', domain: 'ecosia.org', flag: '🌱', tag: 'Plants Trees', time: 'Same day to 2 days', desc: "A mission-driven search engine that uses its advertising profits to plant trees — over 200 million planted to date. It has built a loyal, environmentally conscious user base and is especially strong across Europe, appealing to brands that want visibility among values-driven, eco-aware consumers." },
  { name: 'Swisscows', domain: 'swisscows.com', flag: '🏔️', tag: 'Family-Safe', time: '1–3 days', desc: "A privacy-first, family-safe search engine based in Switzerland, known for strict data protection and content filtering. It appeals to privacy-conscious families and users in Switzerland and across Europe who prioritize safe, clean search results." },
  { name: 'Lycos', domain: 'lycos.com', flag: '🌐', tag: 'Web Pioneer', time: '3–7 days', desc: "One of the internet's pioneering search portals, dating back to the early days of the web. It maintains a nostalgic but still active legacy user base, particularly in the United States." },
  { name: 'Dogpile', domain: 'dogpile.com', flag: '🐾', tag: 'Metasearch', time: 'Reflects almost immediately once indexed elsewhere', desc: "A metasearch engine that combines and displays results from multiple major search providers at once, giving users a broader view in a single search. It appeals to people who want comprehensive coverage without searching multiple engines separately." },
  { name: 'WebCrawler', domain: 'webcrawler.com', flag: '🕷️', tag: 'Metasearch', time: 'Reflects almost immediately once indexed elsewhere', desc: "One of the earliest search engines ever created, now operating as a metasearch platform that aggregates results from several sources. It continues to serve a dedicated base of long-time internet users in the US." },
  { name: 'Excite', domain: 'excite.com', flag: '📰', tag: 'Classic Portal', time: '3–7 days', desc: "A classic internet portal offering search alongside news, weather, and other content services, maintaining a steady base of returning users who have used the platform for years." },
  { name: 'Ekoru', domain: 'ekoru.org', flag: '🌊', tag: 'Ocean Cleanup', time: '3–7 days', desc: "An environmentally focused search engine that donates its ad revenue toward ocean cleanup and marine conservation. It attracts a niche but engaged global audience of environmentally conscious searchers." },
  { name: 'GiveWater', domain: 'givewater.com', flag: '💧', tag: 'Clean Water', time: '3–7 days', desc: "A charity-driven search engine that funds clean water projects around the world using its ad revenue — appealing to socially conscious users who want their everyday searches to contribute to a cause." },
  { name: 'Lilo', domain: 'lilo.org', flag: '🇫🇷', tag: 'France', time: '3–7 days', desc: "A French search engine that lets users direct advertising revenue toward humanitarian and environmental projects of their choice. It has a dedicated following in France and across French-speaking Europe." },
  { name: 'Startpage', domain: 'startpage.com', flag: '🔒', tag: 'Private Results', time: 'Same as Google — near-instant once Google has you', desc: "A privacy-focused search engine that delivers full-quality search results while stripping away all user tracking and data collection. Popular among users worldwide who want top-tier search quality without sacrificing privacy." },
  { name: 'Ask.com', domain: 'ask.com', flag: '❓', tag: 'Q&A Style', time: '3–7 days', desc: "A long-running question-and-answer style search engine designed to deliver direct, simple answers to user queries. Remains popular among US users who prefer a straightforward, conversational search experience." },
  { name: 'Info.com', domain: 'info.com', flag: 'ℹ️', tag: 'Metasearch', time: 'Reflects almost immediately once indexed elsewhere', desc: "A search platform that aggregates and presents results from multiple leading search sources in one place, offering a consolidated view for quick, efficient searching." },
  { name: 'Gibiru', domain: 'gibiru.com', flag: '🚀', tag: 'Uncensored', time: '1–3 days', desc: "A privacy-oriented search engine that markets itself around uncensored, unfiltered search results, appealing to a niche audience seeking an alternative to mainstream search filtering." },
]

export default function Home() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [expandedEngine, setExpandedEngine] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (session) { router.replace('/dashboard'); return }
      setChecking(false)
    })
  }, [router])

  if (checking) return <div className="page-center"><div className="spinner" style={{ width: 32, height: 32 }} /></div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`
        .engine-row:hover { border-color: var(--accent) !important; }
        .engine-btn:hover { background: rgba(99,102,241,0.06) !important; }
        .engine-detail-open { animation: engineOpen 0.18s ease-out; }
        @keyframes engineOpen { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18 }}>
          <img src="/logo.png" alt="Indexly" style={{ width: 28, height: 28 }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
          Indexly
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/docs" style={{ fontSize: 14, color: 'var(--muted)' }}>Docs</Link>
          <Link href="/auth/login"><button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 14 }}>Get Started →</button></Link>
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#1a2040', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>FREE & OPEN SOURCE</div>
        <h1 style={{ fontSize: 'clamp(30px,6vw,50px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Index Your Website on<br /><span style={{ color: 'var(--accent)' }}>22 Search Engines</span><br />in 2 Steps
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Submit once, appear everywhere. Google, Bing, Yandex, Naver, DuckDuckGo, Yahoo and more — no separate accounts needed.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/login"><button className="btn-primary" style={{ width: 'auto', padding: '14px 32px', fontSize: 16, fontWeight: 600 }}>Start Indexing Free →</button></Link>
          <Link href="/docs"><button className="btn-secondary" style={{ padding: '14px 28px', fontSize: 16 }}>Read Docs</button></Link>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 16 }}>No credit card · Forever free · Open source</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)', marginBottom: 60 }}>
        {[{ n: '22', label: 'Search Engines' }, { n: '2', label: 'Steps Only' }, { n: '<3 min', label: 'Total Time' }, { n: '100%', label: 'Free Forever' }].map(s => (
          <div key={s.n} style={{ padding: '24px 36px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)' }}>{s.n}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, marginBottom: 40 }}>How It Works</h2>
        {[
          { n: 1, icon: '🔗', title: 'Enter Your URL or Domain', desc: 'Sign up free and enter your website URL or full domain. Takes 10 seconds.' },
          { n: 2, icon: '📋', title: 'Add 2 Things to Your Site', desc: 'Copy one verification tag into your <head> and upload one small key file to your root. Under 2 minutes.' },
          { n: 3, icon: '⚡', title: 'We Submit to All 22 Engines', desc: 'We verify your ownership and submit your site so it becomes discoverable across Google, Bing, Yandex, Naver and 18 more search engines worldwide.' },
          { n: 4, icon: '📊', title: 'Track Real-Time Analytics', desc: 'See live visitors — countries, cities, browsers, devices and our unique Search Intent Pulse dashboard.' },
        ].map(s => (
          <div key={s.n} style={{ display: 'flex', gap: 16, padding: 20, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.icon} {s.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>⏱️ Indexly vs Manual Submission</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>
          Submitting a site to a search engine manually isn't one click — it usually means creating an account on that engine's own webmaster platform, proving ownership with a separate verification method, and coming back later to confirm it worked. Do that honestly for 22 engines and you're looking at 15–20 minutes each on average — <strong style={{ color: 'var(--accent)' }}>roughly 6–7 hours of repetitive setup work</strong>. Indexly compresses that into one verification, done once, in under 3 minutes.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, background: '#2d1a1a', border: '1px solid #ef4444', borderRadius: 12, padding: 20 }}>
            <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 12 }}>❌ Without Indexly (~6-7 hrs)</div>
            {['Visit each search engine — hours', 'Create accounts everywhere — days', 'Different verifications on each — frustrating', 'Monitor multiple dashboards — ongoing'].map(t => <div key={t} style={{ fontSize: 13, color: 'var(--muted)', padding: '4px 0' }}>• {t}</div>)}
          </div>
          <div style={{ flex: 1, minWidth: 240, background: '#1a2d1a', border: '1px solid #22c55e', borderRadius: 12, padding: 20 }}>
            <div style={{ color: '#22c55e', fontWeight: 700, marginBottom: 12 }}>✅ With Indexly (&lt;3 min)</div>
            {['Enter URL — 10 seconds', 'Add tag + key file — 2 minutes', 'Click Verify — done in under 3 min', 'All 22 engines covered automatically'].map(t => <div key={t} style={{ fontSize: 13, color: 'var(--muted)', padding: '4px 0' }}>• {t}</div>)}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>22 Search Engines Covered</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>Submit once — we handle the entire distribution</p>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginBottom: 28 }}>Tap any search engine to see what it means for your website</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ENGINES.map(e => {
            const open = expandedEngine === e.name
            return (
              <div key={e.name} className="engine-row" style={{ background: 'var(--surface)', border: `1px solid ${open ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.15s, transform 0.1s' }}>
                <button
                  onClick={() => setExpandedEngine(open ? null : e.name)}
                  className="engine-btn"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>
                    <span style={{ position: 'relative', width: 22, height: 22, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, overflow: 'hidden', background: 'white' }}>
                      <span style={{ position: 'absolute', fontSize: 14, lineHeight: 1 }}>{e.flag}</span>
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${e.domain}&sz=64`}
                        alt={`${e.name} logo`}
                        loading="lazy"
                        style={{ position: 'relative', width: 22, height: 22, objectFit: 'contain' }}
                        onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    </span>
                    {e.name}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{e.tag}</span>
                    <span style={{ fontSize: 14, color: 'var(--accent)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
                  </span>
                </button>
                {open && (
                  <div className="engine-detail-open" style={{ padding: '0 14px 16px' }}>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 10 }}>{e.desc}</p>
                    <div style={{ display: 'inline-block', fontSize: 11, color: 'var(--accent)', background: '#1a2040', border: '1px solid var(--accent)', borderRadius: 6, padding: '3px 10px' }}>
                      ⏱️ Typically visible: {e.time}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 11, marginTop: 16, lineHeight: 1.6 }}>
          Timeframes are typical estimates based on how each search engine crawls and refreshes its results — actual timing can vary and isn't guaranteed by us or by any search engine.
        </p>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>📊 See Exactly Who's Visiting — Not Just That They Indexed</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginBottom: 28, maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>
          Getting indexed is only half the story. Indexly ships a full analytics dashboard alongside indexing, so you can see the real effect — updating live, from the first visitor onward.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '🟢', title: 'Live & historical views', desc: 'Live, Today, This Week, This Month, This Year, and All Time — pick any window and the numbers update to match, all the way back to your very first visitor.' },
            { icon: '🌍', title: 'Countries & cities', desc: 'See exactly which countries and cities your traffic is coming from, ranked by volume — resolved from real visits, with no third-party tracking service involved.' },
            { icon: '💻', title: 'Devices, browsers, OS', desc: 'A full breakdown of desktop vs mobile vs tablet, which browsers your visitors use, and which operating systems — useful for knowing exactly who you\'re building for.' },
            { icon: '🔗', title: 'Pages & referrers', desc: 'Your top 20 most-visited pages, plus where visitors came from — a specific search engine, a social link, or a direct visit.' },
            { icon: '⚡', title: 'Search Intent Pulse', desc: 'Our own algorithm, exclusive to Indexly, that classifies visitor search intent into Informational, Navigational, Transactional, and Commercial — and tracks how that mix shifts over time. No other free indexing tool offers this.' },
          ].map(f => (
            <div key={f.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'linear-gradient(135deg,#1a2040,#1a1a2e)', border: '1px solid var(--accent)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7 }}>
            All of this comes from a single one-line tracking script — no cookie banners needed, no third-party ad-tech, and your visitors' raw IP addresses are never stored. Just the insight, without the baggage.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '40px 24px 80px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Ready to get indexed?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Free forever. No card. Under 3 minutes.</p>
        <Link href="/auth/login"><button className="btn-primary" style={{ width: 'auto', padding: '14px 36px', fontSize: 16 }}>Create Free Account →</button></Link>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Indexly</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ href: '/docs', l: 'Docs' }, { href: '/about', l: 'About' }, { href: '/privacy', l: 'Privacy' }, { href: '/terms', l: 'Terms' }, { href: '/disclaimer', l: 'Disclaimer' }, { href: 'https://github.com/indexly-project/indexly', l: 'GitHub', ext: true }].map(l => (
              <a key={l.href} href={l.href} style={{ fontSize: 13, color: 'var(--muted)' }} target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}>{l.l}</a>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>© 2026 Indexly. MIT License.</div>
        </div>
      </footer>
    </div>
  )
}
