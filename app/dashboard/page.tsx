'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import CopyBox from '@/components/CopyBox'

type Step = 'input' | 'timer' | 'codes' | 'verify' | 'result'

interface TokenData {
  google_token: string
  indexnow_key: string
  meta_tag: string
  our_meta_tag: string
  indexnow_file_name: string
  indexnow_file_content: string
}

interface VerifyResult {
  success: boolean
  message: string
  results: {
    crawl: { our_meta: boolean; google_meta: boolean; indexnow_file: boolean; sitemap: boolean; robots: boolean }
    verification: { google: boolean; indexnow: boolean; brave: boolean; mojeek: boolean }
    errors: string[]
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<Step>('input')
  const [inputType, setInputType] = useState<'domain' | 'url'>('url')
  const [urlValue, setUrlValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(30)
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [websiteId, setWebsiteId] = useState('')
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null)
  const [websites, setWebsites] = useState<any[]>([])
  const [sitemapUrl, setSitemapUrl] = useState('')
  const [sitemapLoading, setSitemapLoading] = useState(false)
  const [sitemapResult, setSitemapResult] = useState<any>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/auth/login'); return }
      setUser(session.user)
      loadWebsites(session.user.id)
    })
  }, [router])

  const loadWebsites = async (userId: string) => {
    const supabase = createClient()
    const { data } = await supabase.from('websites').select('*, indexing_status(*)').eq('user_id', userId).order('created_at', { ascending: false })
    if (data) setWebsites(data)
  }

  const startTimer = () => {
    setTimer(30)
    timerRef.current = setInterval(() => {
      setTimer(prev => { if (prev <= 1) { clearInterval(timerRef.current); return 0 } return prev - 1 })
    }, 1000)
  }

  const handleNext = async () => {
    setError('')
    if (!urlValue.trim()) { setError('Please enter a URL or domain name.'); return }

    setLoading(true)
    setStep('timer')
    startTimer()

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ url: urlValue.trim(), input_type: inputType }),
      })

      const data = await res.json()
      clearInterval(timerRef.current)

      if (data.error === 'already_indexed') { setError('This website is already indexed!'); setStep('input'); setLoading(false); return }
      if (data.error === 'daily_limit') { setError('Daily limit reached. Please come back in 24 hours.'); setStep('input'); setLoading(false); return }
      if (data.error) { setError(data.error); setStep('input'); setLoading(false); return }

      const normalized = urlValue.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
      const { data: ws } = await supabase.from('websites').select('id').eq('user_id', user.id).eq('normalized_value', normalized).single()
      if (ws) setWebsiteId(ws.id)
      setTokenData(data)
      setStep('codes')
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('input')
    }
    setLoading(false)
  }

  const handleVerify = async () => {
    setError('')
    setLoading(true)
    setStep('verify')

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-and-index`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ website_id: websiteId }),
      })

      const data: VerifyResult = await res.json()
      setVerifyResult(data)
      setStep('result')
      loadWebsites(user.id)
    } catch {
      setError('Verification failed. Please try again.')
      setStep('codes')
    }
    setLoading(false)
  }

  const handleSitemapSubmit = async () => {
    if (!sitemapUrl.trim() || !websiteId) return
    setSitemapLoading(true)
    setSitemapResult(null)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-sitemap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ website_id: websiteId, sitemap_url: sitemapUrl.trim() }),
      })
      const data = await res.json()
      setSitemapResult(data)
    } catch {
      setSitemapResult({ success: false, message: 'Sitemap submission failed.' })
    }
    setSitemapLoading(false)
  }

  const reset = () => {
    setStep('input'); setUrlValue(''); setError('')
    setTokenData(null); setVerifyResult(null); setWebsiteId('')
    setTimer(30); setSitemapUrl(''); setSitemapResult(null)
  }

  if (!user) return <div className="page-center"><div className="spinner" style={{ width: 32, height: 32 }} /></div>

  const baseUrl = urlValue.startsWith('http') ? urlValue.split('/').slice(0, 3).join('/') : `https://${urlValue.split('/')[0]}`
  const order: Step[] = ['input', 'timer', 'codes', 'verify', 'result']

  return (
    <>
      <Navbar email={user.email} />
      <div className="main-wrap">

        {/* Step bar */}
        <div className="steps">
          {order.map(s => {
            const ci = order.indexOf(step), si = order.indexOf(s)
            return <div key={s} className={`step ${step === s ? 'active' : si < ci ? 'done' : ''}`} />
          })}
        </div>

        {/* STEP 1: Input */}
        {step === 'input' && (
          <div>
            <h2 style={{ marginBottom: 6 }}>Index Your Website</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
              Your website will appear on all 16 search engines — Google, Bing, Yandex, Brave, Naver and more.
            </p>

            {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 10 }}>What would you like to index?</label>
                <div className="radio-group">
                  <label className={`radio-option ${inputType === 'url' ? 'selected' : ''}`} onClick={() => setInputType('url')}>
                    <input type="radio" readOnly checked={inputType === 'url'} />
                    <div><div style={{ fontWeight: 600, fontSize: 14 }}>🔗 URL</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>A specific page</div></div>
                  </label>
                  <label className={`radio-option ${inputType === 'domain' ? 'selected' : ''}`} onClick={() => setInputType('domain')}>
                    <input type="radio" readOnly checked={inputType === 'domain'} />
                    <div><div style={{ fontWeight: 600, fontSize: 14 }}>🌐 Domain</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Entire website</div></div>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                  {inputType === 'url' ? 'Page URL' : 'Domain Name'}
                </label>
                <input type="text" placeholder={inputType === 'url' ? 'https://myblog.com/about' : 'myblog.com'} value={urlValue} onChange={e => setUrlValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleNext()} />
              </div>

              <div style={{ background: '#111', borderRadius: 8, padding: 14, fontSize: 13 }}>
                <div style={{ color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>Before you continue, make sure:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div>✅ Your website is live and accessible</div>
                  <div>✅ You have a sitemap.xml at yourdomain.com/sitemap.xml</div>
                  <div>✅ You have a robots.txt at yourdomain.com/robots.txt</div>
                  <div>✅ You can edit your HTML files</div>
                </div>
                <a href="/docs" style={{ fontSize: 12, display: 'block', marginTop: 10 }}>Need help setting these up? Read the docs →</a>
              </div>

              <button className="btn-primary" onClick={handleNext} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Next →'}
              </button>
            </div>

            {/* Previous websites */}
            {websites.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ marginBottom: 14, fontSize: 16 }}>Your Websites</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {websites.map(w => (
                    <div key={w.id} className="card" style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>{w.value}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                            {new Date(w.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className={`badge ${w.status === 'indexed' ? 'badge-success' : w.status === 'failed' ? 'badge-error' : 'badge-pending'}`}>
                            {w.status === 'indexed' ? 'Indexed ✓' : w.status === 'failed' ? 'Failed' : 'Pending'}
                          </span>
                          {w.status === 'indexed' && <a href={`/analyze?id=${w.id}`} style={{ fontSize: 13 }}>Analytics →</a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Timer */}
        {step === 'timer' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div className="timer-circle">{timer}</div>
            <h2 style={{ marginBottom: 10 }}>Generating your verification codes...</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Preparing unique codes for all 16 search engines. Please wait.</p>
          </div>
        )}

        {/* STEP 3: Codes */}
        {step === 'codes' && tokenData && (
          <div>
            <h2 style={{ marginBottom: 6 }}>Add these to your website</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Complete both steps, then click Verify & Index.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ background: 'var(--accent)', color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>1</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Copy this code block</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Paste it inside the &lt;head&gt; tag of your index.html</div>
                  </div>
                </div>
                <CopyBox text={`${tokenData.meta_tag}\n${tokenData.our_meta_tag}`} />
              </div>

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ background: 'var(--accent)', color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>2</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Create this key file</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>Upload it to the root folder of your website</div>
                  </div>
                </div>
                <div style={{ marginBottom: 8, fontSize: 13 }}>
                  File name: <code style={{ color: 'var(--accent)', background: '#111', padding: '2px 6px', borderRadius: 4 }}>{tokenData.indexnow_file_name}</code>
                </div>
                <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--muted)' }}>File content:</div>
                <CopyBox text={tokenData.indexnow_file_content} />
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
                  Must be accessible at: <code style={{ color: 'var(--accent)', fontSize: 11 }}>{baseUrl}/{tokenData.indexnow_file_name}</code>
                </div>
              </div>

              <div style={{ background: '#2d2a1a', border: '1px solid var(--warning)', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--warning)' }}>
                ⚠️ Make sure both steps are done before clicking Verify.
              </div>

              {error && <div className="error-msg">{error}</div>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" onClick={reset} style={{ flex: 1 }}>← Back</button>
                <button className="btn-primary" onClick={handleVerify} style={{ flex: 2 }} disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Verify & Index →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Verifying */}
        {step === 'verify' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 20px' }} />
            <h2 style={{ marginBottom: 10 }}>Hang tight, we're on it! 🚀</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
              Scanning your website for verification codes...<br />
              Submitting to all 16 search engines...
            </p>
          </div>
        )}

        {/* STEP 5: Result */}
        {step === 'result' && verifyResult && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{verifyResult.success ? '🎉' : '⚠️'}</div>
              <h2 style={{ marginBottom: 8 }}>{verifyResult.success ? 'Successfully Submitted!' : 'Some issues found'}</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>{verifyResult.message}</p>
            </div>

            {/* Crawl results */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 14 }}>Website Scan Results</div>
              <div className="status-list">
                {[
                  { label: 'Indexly Verification Tag', key: 'our_meta' },
                  { label: 'Ownership Verification Tag', key: 'google_meta' },
                  { label: 'Search Engine Key File', key: 'indexnow_file' },
                  { label: 'sitemap.xml', key: 'sitemap' },
                  { label: 'robots.txt', key: 'robots' },
                ].map(item => (
                  <div key={item.key} className="status-item">
                    <span className="engine-name">{item.label}</span>
                    <span style={{ fontSize: 13 }}>
                      {verifyResult.results.crawl[item.key as keyof typeof verifyResult.results.crawl] ? '✅ Found' : '❌ Not found'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engine results */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 14 }}>Search Engine Submission</div>
              <div className="status-list">
                <div className="status-item">
                  <span className="engine-name">🔵 Primary Search Engine</span>
                  <span style={{ fontSize: 13 }}>{verifyResult.results.verification.google ? '✅ Verified' : '❌ Failed'}</span>
                </div>
                <div className="status-item">
                  <span className="engine-name">⚡ Global Network (Bing · Yandex · Naver · +8)</span>
                  <span style={{ fontSize: 13 }}>{verifyResult.results.verification.indexnow ? '✅ Submitted' : '❌ Failed'}</span>
                </div>
                <div className="status-item">
                  <span className="engine-name">🦁 Brave Search</span>
                  <span style={{ fontSize: 13 }}>{verifyResult.results.verification.brave ? '✅ Submitted' : '⚠️ Skipped'}</span>
                </div>
                <div className="status-item">
                  <span className="engine-name">🔍 Mojeek</span>
                  <span style={{ fontSize: 13 }}>{verifyResult.results.verification.mojeek ? '✅ Submitted' : '⚠️ Skipped'}</span>
                </div>
              </div>
            </div>

            {verifyResult.results.errors.length > 0 && (
              <div className="card" style={{ marginBottom: 16, border: '1px solid var(--warning)' }}>
                <div style={{ fontWeight: 600, marginBottom: 10, color: 'var(--warning)' }}>Issues to fix:</div>
                {verifyResult.results.errors.map((e, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--muted)', padding: '4px 0' }}>• {e}</div>
                ))}
              </div>
            )}

            {verifyResult.success ? (
              <div>
                <div className="success-msg" style={{ marginBottom: 16 }}>
                  ⏰ Search engines take 24–36 hours to crawl and list your website — this is completely normal.<br />
                  📊 Analytics data will appear in your dashboard within 48 hours.
                </div>

                {/* Sitemap submit bonus */}
                <div className="card" style={{ marginBottom: 16, border: '1px solid var(--accent)' }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>🗺️ Boost Indexing — Submit Your Sitemap</div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
                    Submit your sitemap.xml to index all pages at once — not just your homepage.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input type="text" placeholder="https://yoursite.com/sitemap.xml" value={sitemapUrl} onChange={e => setSitemapUrl(e.target.value)} style={{ flex: 1 }} />
                    <button className="btn-primary" onClick={handleSitemapSubmit} disabled={sitemapLoading} style={{ width: 'auto', padding: '10px 16px', flexShrink: 0 }}>
                      {sitemapLoading ? <span className="spinner" /> : 'Submit'}
                    </button>
                  </div>
                  {sitemapResult && (
                    <div className={sitemapResult.success ? 'success-msg' : 'error-msg'} style={{ marginTop: 10, fontSize: 13 }}>
                      {sitemapResult.success
                        ? `✅ Sitemap submitted! ${sitemapResult.results?.urls_found || 0} pages found and sent to all engines.`
                        : `❌ ${sitemapResult.message || 'Submission failed.'}`}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-secondary" onClick={reset} style={{ flex: 1 }}>Index Another</button>
                  <a href={`/analyze?id=${websiteId}`} style={{ flex: 2 }}>
                    <button className="btn-primary" style={{ width: '100%' }}>View Analytics →</button>
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" onClick={reset} style={{ flex: 1 }}>New Website</button>
                <button className="btn-primary" onClick={() => setStep('codes')} style={{ flex: 2 }}>Try Again →</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
