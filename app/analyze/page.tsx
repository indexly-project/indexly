'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { Suspense } from 'react'

type GraphTab = 'engines' | 'countries' | 'states' | 'traffic' | 'pulse'

const INTENT_COLORS: Record<string, string> = {
  informational: '#4f8ef7',
  navigational: '#22c55e',
  transactional: '#f59e0b',
  commercial: '#a855f7',
}

function AnalyzeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const websiteId = params.get('id')

  const [user, setUser] = useState<any>(null)
  const [website, setWebsite] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<GraphTab>('engines')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any[]>([])
  const [keywords, setKeywords] = useState<any[]>([])
  const [notReady, setNotReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/auth/login'); return }
      setUser(session.user)

      if (!websiteId) { router.replace('/dashboard'); return }

      // Website data
      const { data: ws } = await supabase
        .from('websites')
        .select('*')
        .eq('id', websiteId)
        .eq('user_id', session.user.id)
        .single()

      if (!ws) { router.replace('/dashboard'); return }
      setWebsite(ws)

      // 24 hour check
      const indexedAt = new Date(ws.updated_at)
      const now = new Date()
      const hoursDiff = (now.getTime() - indexedAt.getTime()) / (1000 * 60 * 60)
      if (hoursDiff < 24 && ws.status === 'indexed') {
        setNotReady(true)
        setLoading(false)
        return
      }

      // Analytics data
      const { data: analyticsData } = await supabase
        .from('analytics')
        .select('*')
        .eq('website_id', websiteId)
        .order('date', { ascending: false })

      const { data: keywordData } = await supabase
        .from('keywords')
        .select('*')
        .eq('website_id', websiteId)
        .order('date', { ascending: false })

      setAnalytics(analyticsData || [])
      setKeywords(keywordData || [])
      setLoading(false)
    })
  }, [router, websiteId])

  // ── Data processing ──

  // Graph 1: Engine clicks
  const engineData = () => {
    const engines = [
      { name: 'Google', key: 'google' },
      { name: 'Bing', key: 'bing' },
      { name: 'DuckDuckGo', key: 'duckduckgo' },
      { name: 'Yandex', key: 'yandex' },
      { name: 'Naver', key: 'naver' },
      { name: 'Seznam', key: 'seznam' },
      { name: 'Yep', key: 'yep' },
      { name: 'Yahoo', key: 'yahoo' },
      { name: 'Ecosia', key: 'ecosia' },
      { name: 'Qwant', key: 'qwant' },
    ]
    return engines.map(e => ({
      name: e.name,
      clicks: analytics.filter(a => a.engine === e.key).reduce((sum, a) => sum + a.clicks, 0),
      impressions: analytics.filter(a => a.engine === e.key).reduce((sum, a) => sum + a.impressions, 0),
    })).sort((a, b) => b.clicks - a.clicks)
  }

  // Graph 2: Country clicks
  const countryData = () => {
    const map: Record<string, number> = {}
    analytics.forEach(a => {
      if (a.country) map[a.country] = (map[a.country] || 0) + a.clicks
    })
    return Object.entries(map).map(([country, clicks]) => ({ country, clicks }))
      .sort((a, b) => b.clicks - a.clicks).slice(0, 20)
  }

  // Graph 3: State data
  const stateData = () => {
    const map: Record<string, { clicks: number, country: string }> = {}
    analytics.forEach(a => {
      if (a.region) {
        const key = `${a.country}/${a.region}`
        if (!map[key]) map[key] = { clicks: 0, country: a.country }
        map[key].clicks += a.clicks
      }
    })
    return Object.entries(map).map(([key, val]) => ({
      label: key, clicks: val.clicks, country: val.country
    })).sort((a, b) => b.clicks - a.clicks).slice(0, 20)
  }

  // Graph 4: Traffic by date
  const trafficData = () => {
    const map: Record<string, number> = {}
    analytics.forEach(a => {
      map[a.date] = (map[a.date] || 0) + a.clicks
    })
    return Object.entries(map).map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => a.date.localeCompare(b.date)).slice(-30)
  }

  // Graph 5: Intent pulse
  const intentData = () => {
    const types = ['informational', 'navigational', 'transactional', 'commercial']
    const dateMap: Record<string, Record<string, number>> = {}
    keywords.forEach(k => {
      if (!dateMap[k.date]) dateMap[k.date] = {}
      dateMap[k.date][k.intent_type] = (dateMap[k.date][k.intent_type] || 0) + k.clicks
    })
    const dates = Object.keys(dateMap).sort().slice(-6)
    return { dates, types, data: dateMap }
  }

  const maxVal = (arr: number[]) => Math.max(...arr, 1)

  if (!user || loading) return (
    <div className="page-center">
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  )

  return (
    <>
      <Navbar email={user?.email} />
      <div className="main-wrap">

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <a href="/dashboard" style={{ color: 'var(--muted)', fontSize: 13 }}>← Back to Dashboard</a>
          </div>
          <h2 style={{ marginBottom: 4 }}>{website?.value}</h2>
          <span className={`badge ${website?.status === 'indexed' ? 'badge-success' : 'badge-pending'}`}>
            {website?.status === 'indexed' ? 'Indexed ✓' : 'Pending'}
          </span>
        </div>

        {/* 24hr not ready */}
        {notReady && (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            <h3 style={{ marginBottom: 8 }}>Analytics Not Ready Yet</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              Data will start appearing 24 hours after indexing.<br />
              Please check back tomorrow.
            </p>
          </div>
        )}

        {/* No data */}
        {!notReady && analytics.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
            <h3 style={{ marginBottom: 8 }}>No Data Yet</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              It can take 24-48 hours for search engine data to appear.
            </p>
          </div>
        )}

        {/* Analytics tabs */}
        {!notReady && analytics.length > 0 && (
          <>
            <div className="graph-tabs">
              {([
                { key: 'engines', label: '🔍 Search Engines' },
                { key: 'countries', label: '🌍 Countries' },
                { key: 'states', label: '📍 States' },
                { key: 'traffic', label: '📈 Traffic' },
                { key: 'pulse', label: '⚡ Intent Pulse' },
              ] as { key: GraphTab; label: string }[]).map(tab => (
                <button
                  key={tab.key}
                  className={`graph-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Graph 1: Engines */}
            {activeTab === 'engines' && (
              <div className="card">
                <h3 style={{ marginBottom: 18 }}>Search Engine Visibility</h3>
                {engineData().map(e => (
                  <div key={e.name} className="bar-item">
                    <span className="bar-label">{e.name}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(e.clicks / maxVal(engineData().map(x => x.clicks))) * 100}%` }} />
                    </div>
                    <span className="bar-value">{e.clicks.toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ marginTop: 16, fontSize: 12, color: 'var(--muted)' }}>
                  DuckDuckGo, Yahoo, Ecosia → Bing से automatically cover होते हैं
                </div>
              </div>
            )}

            {/* Graph 2: Countries */}
            {activeTab === 'countries' && (
              <div className="card">
                <h3 style={{ marginBottom: 18 }}>Top 20 Countries</h3>
                {countryData().map(c => (
                  <div key={c.country} className="bar-item">
                    <span className="bar-label">{c.country}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(c.clicks / maxVal(countryData().map(x => x.clicks))) * 100}%`, background: '#22c55e' }} />
                    </div>
                    <span className="bar-value">{c.clicks.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Graph 3: States */}
            {activeTab === 'states' && (
              <div className="card">
                <h3 style={{ marginBottom: 4 }}>Top 20 States Worldwide</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 18 }}>Country / State — Clicks</p>
                {stateData().map(s => (
                  <div key={s.label} className="bar-item">
                    <span className="bar-label" style={{ fontSize: 12 }}>{s.label}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(s.clicks / maxVal(stateData().map(x => x.clicks))) * 100}%`, background: '#a855f7' }} />
                    </div>
                    <span className="bar-value">{s.clicks.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Graph 4: Traffic timeline */}
            {activeTab === 'traffic' && (
              <div className="card">
                <h3 style={{ marginBottom: 18 }}>Last 30 Days Traffic</h3>
                {trafficData().map(t => (
                  <div key={t.date} className="bar-item">
                    <span className="bar-label" style={{ fontSize: 12 }}>{t.date.slice(5)}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(t.clicks / maxVal(trafficData().map(x => x.clicks))) * 100}%`, background: '#f59e0b' }} />
                    </div>
                    <span className="bar-value">{t.clicks}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Graph 5: Intent Pulse */}
            {activeTab === 'pulse' && (
              <div className="card">
                <h3 style={{ marginBottom: 4 }}>Search Intent Pulse</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
                  What your visitors are looking for — and how it shifts over time.
                </p>

                {/* Legend */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                  {['informational', 'navigational', 'transactional', 'commercial'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: INTENT_COLORS[t] }} />
                      <span style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{t}</span>
                    </div>
                  ))}
                </div>

                {/* Intent bars per type */}
                {['informational', 'navigational', 'transactional', 'commercial'].map(type => {
                  const total = keywords.filter(k => k.intent_type === type).reduce((s, k) => s + k.clicks, 0)
                  const grandTotal = keywords.reduce((s, k) => s + k.clicks, 0) || 1
                  const pct = Math.round((total / grandTotal) * 100)
                  return (
                    <div key={type} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ textTransform: 'capitalize', color: INTENT_COLORS[type] }}>{type}</span>
                        <span style={{ color: 'var(--muted)' }}>{pct}% · {total} clicks</span>
                      </div>
                      <div className="bar-track" style={{ height: 10 }}>
                        <div className="bar-fill" style={{ width: `${pct}%`, background: INTENT_COLORS[type], height: 10 }} />
                      </div>
                    </div>
                  )
                })}

                <hr className="divider" />
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>यह क्या बताता है?</strong><br />
                  Informational बढ़ रहा है → लोग तुमसे सीख रहे हैं 📚<br />
                  Transactional बढ़ रहा है → लोग खरीदने आ रहे हैं 💰<br />
                  Navigational बढ़ रहा है → Brand awareness बढ़ रही है 🚀
                </div>
              </div>
            )}
          </>
        )}

        {/* Comments section */}
        <div style={{ marginTop: 40 }}>
          <CommentsSection websiteId={websiteId || ''} userId={user?.id} />
        </div>
      </div>
    </>
  )
}

function CommentsSection({ websiteId, userId }: { websiteId: string; userId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [posted, setPosted] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('comments').select('*, auth.users(email)')
      .eq('website_id', websiteId).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setComments(data) })
  }, [websiteId, posted])

  const postComment = async () => {
    if (!text.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('comments').insert({
      user_id: userId,
      website_id: websiteId,
      content: text,
      rating,
    })
    setText('')
    setPosted(p => !p)
    setLoading(false)
  }

  return (
    <div>
      <h3 style={{ marginBottom: 18 }}>💬 Community Feedback</h3>

      {/* Post comment */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Rating</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => setRating(s)} style={{
                fontSize: 20, background: 'none', padding: '4px',
                color: s <= rating ? '#f59e0b' : 'var(--border)'
              }}>★</button>
            ))}
          </div>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="तुम्हारा experience share करो..."
          rows={3}
          style={{ marginBottom: 10, resize: 'none' }}
        />
        <button className="btn-primary" onClick={postComment} disabled={loading}>
          {loading ? <span className="spinner" /> : 'Post Comment'}
        </button>
      </div>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="card">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-meta">
                <span className="stars">{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</span>
                <span>·</span>
                <span>{new Date(c.created_at).toLocaleDateString('hi-IN')}</span>
              </div>
              <div style={{ fontSize: 14 }}>{c.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="page-center">
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  )
}
