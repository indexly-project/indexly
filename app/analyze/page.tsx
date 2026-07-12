'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CopyBox from '@/components/CopyBox'

type Tab = 'overview' | 'countries' | 'cities' | 'devices' | 'pages' | 'referrers' | 'pulse' | 'setup'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

function AnalyzeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const websiteId = params.get('id')
  const [user, setUser] = useState<any>(null)
  const [website, setWebsite] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [period, setPeriod] = useState<'live' | 'today' | 'week' | 'month' | 'year' | 'all'>('today')
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState<any[]>([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [posted, setPosted] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/auth/login'); return }
      setUser(session.user)
      if (!websiteId) { router.replace('/dashboard'); return }

      const { data: ws } = await supabase.from('websites').select('*').eq('id', websiteId).eq('user_id', session.user.id).single()
      if (!ws) { router.replace('/dashboard'); return }
      setWebsite(ws)

      // Load analytics from our own system
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/get-analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({ website_id: websiteId, period }),
        })
        const data = await res.json()
        setAnalyticsData(data)
      } catch { setAnalyticsData(null) }

      // Load comments
      const { data: cmts } = await supabase.from('comments').select('*').eq('website_id', websiteId).order('created_at', { ascending: false })
      if (cmts) setComments(cmts)

      setLoading(false)
    })
  }, [router, websiteId, posted, period])

  const postComment = async () => {
    if (!commentText.trim()) return
    setCommentLoading(true)
    const supabase = createClient()
    await supabase.from('comments').insert({ user_id: user.id, website_id: websiteId, content: commentText, rating })
    setCommentText('')
    setPosted(p => !p)
    setCommentLoading(false)
  }

  const maxVal = (arr: number[]) => Math.max(...arr, 1)

  const renderBar = (label: string, value: number, max: number, color = 'var(--accent)') => (
    <div key={label} className="bar-item">
      <span className="bar-label" style={{ fontSize: 12 }}>{label}</span>
      <div className="bar-track"><div className="bar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} /></div>
      <span className="bar-value">{value.toLocaleString()}</span>
    </div>
  )

  const getTrackingScript = () => {
    const indexlyId = website?.indexly_id || 'YOUR_INDEXLY_ID'
    const funcUrl = `${SUPABASE_URL}/functions/v1/track-visit`
    return `<!-- Indexly Analytics -->
<script src="${process.env.NEXT_PUBLIC_APP_URL || 'https://indexly-snowy.vercel.app'}/track.js" data-site-id="${indexlyId}" defer></script>`
  }

  if (!user || loading) return <div className="page-center"><div className="spinner" style={{ width: 32, height: 32 }} /></div>

  const live = analyticsData?.live || []
  const liveVisitorCount = analyticsData?.live_visitor_count || 0
  const periodData = analyticsData?.data || { total_visits: 0, unique_sessions: 0, top_countries: [], top_regions: [], top_cities: [], top_pages: [], top_browsers: [], top_os: [], top_devices: [], top_referrers: [], top_search_engines: [] }

  // "Total Visits" — Live tab पर unique visitors दिखाओ, बाक़ी periods पर उस period का पूरा total
  const totalVisits = period === 'live' ? liveVisitorCount : periodData.total_visits
  const hasData = !!analyticsData?.has_data

  const topCountries: [string, number][] = (periodData.top_countries || []).map((c: any): [string, number] => [c.name, c.count])
  const topCities: [string, number][] = (periodData.top_cities || []).map((c: any): [string, number] => [`${c.country_name} / ${c.region || ''} / ${c.city}`, c.count])
  const allBrowsers: Record<string, number> = {}
  ;(periodData.top_browsers || []).forEach((b: any) => { allBrowsers[b.browser] = (allBrowsers[b.browser] || 0) + b.count })
  const allOS: Record<string, number> = {}
  ;(periodData.top_os || []).forEach((o: any) => { allOS[o.os] = (allOS[o.os] || 0) + o.count })
  const allDevices: Record<string, number> = {}
  ;(periodData.top_devices || []).forEach((d2: any) => { allDevices[d2.device_type] = (allDevices[d2.device_type] || 0) + d2.count })
  const topPages: [string, number][] = (periodData.top_pages || []).map((p: any): [string, number] => [p.page, p.count])
  const topReferrers: [string, number][] = (periodData.top_referrers || []).map((r: any): [string, number] => [r.referrer, r.count])

  // Intent pulse from search engines
  const intentMap: Record<string, number> = { informational: 0, navigational: 0, transactional: 0, commercial: 0 }
  ;(periodData.top_search_engines || []).forEach((se: any) => {
    const k = se.search_engine || ''
    if (['google', 'bing', 'yahoo', 'duckduckgo'].includes(k)) intentMap.informational += se.count
    if (k === 'direct') intentMap.navigational += se.count
  })
  const intentTotal = Object.values(intentMap).reduce((a, b) => a + b, 1)

  const INTENT_COLORS: Record<string, string> = {
    informational: '#4f8ef7', navigational: '#22c55e', transactional: '#f59e0b', commercial: '#a855f7'
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'countries', label: '🌍 Countries' },
    { key: 'cities', label: '📍 Cities' },
    { key: 'devices', label: '📱 Devices' },
    { key: 'pages', label: '📄 Pages' },
    { key: 'referrers', label: '🔗 Referrers' },
    { key: 'pulse', label: '⚡ Intent Pulse' },
    { key: 'setup', label: '⚙️ Tracking Setup' },
  ]

  return (
    <>
      <Navbar email={user?.email} />
      <div className="main-wrap">

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <a href="/dashboard" style={{ color: 'var(--muted)', fontSize: 13 }}>← Back to Dashboard</a>
          <h2 style={{ marginBottom: 4, marginTop: 8 }}>{website?.value}</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`badge ${website?.status === 'indexed' ? 'badge-success' : 'badge-pending'}`}>
              {website?.status === 'indexed' ? 'Indexed ✓' : 'Pending'}
            </span>
            {website?.indexly_id && <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>ID: {website.indexly_id}</span>}
            {liveVisitorCount > 0 && <span style={{ fontSize: 12, color: '#22c55e' }}>🟢 {liveVisitorCount} live visitor{liveVisitorCount !== 1 ? 's' : ''}</span>}
          </div>
        </div>

        {/* Setup warning if tracking not active */}
        {!hasData && website?.status === 'indexed' && (
          <div className="card" style={{ marginBottom: 20, border: '1px solid var(--accent)' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>⚙️ Set up real-time analytics tracking</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
              Add the tracking script to your website to start collecting visitor data. Without it, no analytics data will appear.
            </p>
            <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 13 }} onClick={() => setActiveTab('setup')}>
              View Setup Instructions →
            </button>
          </div>
        )}

        {/* Time range selector */}
        <div className="graph-tabs" style={{ overflowX: 'auto', paddingBottom: 4, marginBottom: 4 }}>
          {[
            { key: 'live', label: 'Live' },
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
            { key: 'year', label: 'This Year' },
            { key: 'all', label: 'All Time' },
          ].map(pr => (
            <button key={pr.key} className={`graph-tab ${period === pr.key ? 'active' : ''}`} onClick={() => setPeriod(pr.key as any)} style={{ whiteSpace: 'nowrap' }}>
              {pr.label}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="graph-tabs" style={{ overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.key} className={`graph-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)} style={{ whiteSpace: 'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
              {[
                { label: `Total Visits (${period === 'live' ? 'Live' : period === 'today' ? 'Today' : period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : period === 'year' ? 'This Year' : 'All Time'})`, value: totalVisits },
                { label: 'Live Visitors', value: liveVisitorCount },
                { label: 'Top Country', value: topCountries[0]?.[0] || (hasData ? '—' : 'No data yet') },
                { label: 'Top Page', value: topPages[0]?.[0] || (hasData ? '—' : 'No data yet') },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', wordBreak: 'break-all' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Indexing status */}
            <div className="card">
              <div style={{ fontWeight: 600, marginBottom: 14 }}>Indexing Status</div>
              <div className="status-list">
                {[
                  { label: 'sitemap.xml', ok: website?.sitemap_found },
                  { label: 'robots.txt', ok: website?.robots_found },
                  { label: 'Indexly Tag', ok: website?.our_meta_verified },
                  { label: 'Ownership Verified', ok: website?.crawl_passed },
                  { label: 'Sitemap Submitted', ok: website?.sitemap_submitted },
                ].map(s => (
                  <div key={s.label} className="status-item">
                    <span className="engine-name">{s.label}</span>
                    <span style={{ fontSize: 13 }}>{s.ok ? '✅ Yes' : '❌ No'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COUNTRIES */}
        {activeTab === 'countries' && (
          <div className="card">
            <h3 style={{ marginBottom: 4 }}>Top 20 Countries</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 18 }}>Where your visitors come from</p>
            {topCountries.length === 0
              ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>No data yet. Add the tracking script to your website.</p>
              : topCountries.map(([name, count]) => renderBar(name, count, maxVal(topCountries.map(x => x[1])), '#22c55e'))
            }
          </div>
        )}

        {/* CITIES */}
        {activeTab === 'cities' && (
          <div className="card">
            <h3 style={{ marginBottom: 4 }}>Top 20 Cities</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 18 }}>Country / Region / City</p>
            {topCities.length === 0
              ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>No data yet. Add the tracking script to your website.</p>
              : topCities.map(([label, count]) => renderBar(label, count, maxVal(topCities.map(x => x[1])), '#a855f7'))
            }
          </div>
        )}

        {/* DEVICES */}
        {activeTab === 'devices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h3 style={{ marginBottom: 18 }}>Devices</h3>
              {Object.entries(allDevices).length === 0
                ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>No data yet.</p>
                : Object.entries(allDevices).sort((a, b) => b[1] - a[1]).map(([k, v]) => renderBar(
                    k.charAt(0).toUpperCase() + k.slice(1), v, maxVal(Object.values(allDevices)), '#f59e0b'
                  ))
              }
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 18 }}>Browsers</h3>
              {Object.entries(allBrowsers).length === 0
                ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>No data yet.</p>
                : Object.entries(allBrowsers).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => renderBar(k, v, maxVal(Object.values(allBrowsers))))
              }
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 18 }}>Operating Systems</h3>
              {Object.entries(allOS).length === 0
                ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>No data yet.</p>
                : Object.entries(allOS).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => renderBar(k, v, maxVal(Object.values(allOS)), '#22c55e'))
              }
            </div>
          </div>
        )}

        {/* PAGES */}
        {activeTab === 'pages' && (
          <div className="card">
            <h3 style={{ marginBottom: 4 }}>Top 20 Pages</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 18 }}>Most visited pages on your website</p>
            {topPages.length === 0
              ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>No data yet. Add the tracking script to your website.</p>
              : topPages.map(([page, count]) => renderBar(page, count, maxVal(topPages.map(x => x[1]))))
            }
          </div>
        )}

        {/* REFERRERS */}
        {activeTab === 'referrers' && (
          <div className="card">
            <h3 style={{ marginBottom: 4 }}>Top Referrers</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 18 }}>Where visitors come from</p>
            {topReferrers.length === 0
              ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>No referrer data yet.</p>
              : topReferrers.map(([ref, count]) => renderBar(ref || 'Direct', count, maxVal(topReferrers.map(x => x[1])), '#f59e0b'))
            }
          </div>
        )}

        {/* INTENT PULSE */}
        {activeTab === 'pulse' && (
          <div className="card">
            <h3 style={{ marginBottom: 4 }}>Search Intent Pulse</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>What your visitors are looking for — and how it shifts over time.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
              {Object.entries(INTENT_COLORS).map(([type, color]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                  <span style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{type}</span>
                </div>
              ))}
            </div>
            {Object.entries(intentMap).map(([type, count]) => {
              const pct = Math.round((count / intentTotal) * 100)
              return (
                <div key={type} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ textTransform: 'capitalize', color: INTENT_COLORS[type] }}>{type}</span>
                    <span style={{ color: 'var(--muted)' }}>{pct}% · {count} visits</span>
                  </div>
                  <div className="bar-track" style={{ height: 10 }}>
                    <div className="bar-fill" style={{ width: `${pct}%`, background: INTENT_COLORS[type], height: 10 }} />
                  </div>
                </div>
              )
            })}
            <hr className="divider" />
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--text)' }}>What this means:</strong><br />
              📚 Informational growing → People are learning from your site<br />
              💰 Transactional growing → People are ready to buy<br />
              🚀 Navigational growing → Your brand awareness is increasing
            </div>
          </div>
        )}

        {/* TRACKING SETUP */}
        {activeTab === 'setup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h3 style={{ marginBottom: 8 }}>⚙️ Add Tracking to Your Website</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
                Add this script to your website's <code style={{ background: '#111', padding: '2px 5px', borderRadius: 3, fontSize: 12 }}>&lt;head&gt;</code> tag to enable real-time visitor analytics. Your unique site ID is embedded automatically.
              </p>
              <CopyBox text={getTrackingScript()} />
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                ✅ Lightweight script (&lt;1KB)<br />
                ✅ No cookies — privacy friendly<br />
                ✅ Works with React, Next.js, Vue, plain HTML<br />
                ✅ Auto-detects page changes in SPAs
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 12 }}>Platform-specific instructions</h3>
              {[
                { platform: 'Plain HTML', code: `<head>\n  <!-- your existing tags -->\n  ${getTrackingScript()}\n</head>` },
                { platform: 'Next.js (app/layout.tsx)', code: `// In your <head> section:\n<Script src="${process.env.NEXT_PUBLIC_APP_URL || 'https://indexly-snowy.vercel.app'}/track.js"\n  data-site-id="${website?.indexly_id || 'YOUR_ID'}"\n  strategy="afterInteractive" />` },
                { platform: 'WordPress', code: `// Add to your theme's functions.php:\nfunction add_indexly_tracking() {\n  echo '${getTrackingScript()}';\n}\nadd_action('wp_head', 'add_indexly_tracking');` },
              ].map(p => (
                <div key={p.platform} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>{p.platform}</div>
                  <CopyBox text={p.code} />
                </div>
              ))}
            </div>

            <div className="card" style={{ background: '#111' }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Your Site ID</div>
              <code style={{ color: 'var(--accent)', fontSize: 14 }}>{website?.indexly_id || 'Not assigned yet'}</code>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                This ID links all tracking data to your website. It is safe to include in public HTML.
              </p>
            </div>
          </div>
        )}

        {/* Comments */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 18 }}>💬 Community Feedback</h3>
          <div className="card" style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Your Rating</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setRating(s)} style={{ fontSize: 22, background: 'none', padding: '2px', color: s <= rating ? '#f59e0b' : 'var(--border)' }}>★</button>
              ))}
            </div>
            <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Share your experience with Indexly..." rows={3} style={{ marginBottom: 10, resize: 'none' }} />
            <button className="btn-primary" onClick={postComment} disabled={commentLoading}>
              {commentLoading ? <span className="spinner" /> : 'Post Comment'}
            </button>
          </div>
          {comments.length > 0 && (
            <div className="card">
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-meta">
                    <span className="stars">{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</span>
                    <span>·</span>
                    <span>{new Date(c.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div style={{ fontSize: 14 }}>{c.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="page-center"><div className="spinner" style={{ width: 32, height: 32 }} /></div>}>
      <AnalyzeContent />
    </Suspense>
  )
}
