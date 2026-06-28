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
    crawl: {
      our_meta: boolean
      google_meta: boolean
      indexnow_file: boolean
      sitemap: boolean
      robots: boolean
    }
    verification: {
      google: boolean
      indexnow: boolean
    }
    errors: string[]
  }
}

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
  const timerRef = useRef<NodeJS.Timeout>()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

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
    const { data } = await supabase
      .from('websites')
      .select('*, indexing_status(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (data) setWebsites(data)
  }

  // Timer countdown
  const startTimer = () => {
    setTimer(30)
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleNext = async () => {
    setError('')
    if (!urlValue.trim()) {
      setError('URL या Domain डालो।')
      return
    }

    setLoading(true)
    setStep('timer')
    startTimer()

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch(`${supabaseUrl}/functions/v1/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ url: urlValue.trim(), input_type: inputType }),
      })

      const data = await res.json()

      if (data.error === 'already_indexed') {
        setError('यह website पहले से indexed है!')
        setStep('input')
        setLoading(false)
        return
      }

      if (data.error === 'daily_limit') {
        setError('आज की limit पूरी हो गई। कल आना।')
        setStep('input')
        setLoading(false)
        return
      }

      if (data.error) {
        setError(data.error)
        setStep('input')
        setLoading(false)
        return
      }

      clearInterval(timerRef.current)

      // Website ID लाओ
      const { data: ws } = await supabase
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .eq('normalized_value', urlValue.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, ''))
        .single()

      if (ws) setWebsiteId(ws.id)
      setTokenData(data)
      setStep('codes')
    } catch {
      setError('कुछ गड़बड़ हो गई। दोबारा try करो।')
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

      const res = await fetch(`${supabaseUrl}/functions/v1/verify-and-index`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ website_id: websiteId }),
      })

      const data: VerifyResult = await res.json()
      setVerifyResult(data)
      setStep('result')
      loadWebsites(user.id)
    } catch {
      setError('Verification में problem आई।')
      setStep('codes')
    }
    setLoading(false)
  }

  const reset = () => {
    setStep('input')
    setUrlValue('')
    setError('')
    setTokenData(null)
    setVerifyResult(null)
    setWebsiteId('')
    setTimer(30)
  }

  if (!user) return (
    <div className="page-center">
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  )

  return (
    <>
      <Navbar email={user.email} />

      <div className="main-wrap">

        {/* Step indicators */}
        <div className="steps">
          {(['input', 'timer', 'codes', 'verify', 'result'] as Step[]).map((s, i) => (
            <div key={s} className={`step ${step === s ? 'active' : ['result', 'verify', 'codes', 'timer'].indexOf(step) > ['result', 'verify', 'codes', 'timer'].indexOf(s) || step === 'result' ? 'done' : ''}`} />
          ))}
        </div>

        {/* ─── STEP 1: Input ─── */}
        {step === 'input' && (
          <div>
            <h2 style={{ marginBottom: 6 }}>Website Index करो</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
              200+ search engines पर automatically index हो जाएगी।
            </p>

            {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Type select */}
              <div>
                <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 10 }}>
                  क्या index करना है?
                </label>
                <div className="radio-group">
                  <label className={`radio-option ${inputType === 'url' ? 'selected' : ''}`} onClick={() => setInputType('url')}>
                    <input type="radio" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>🔗 URL</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>एक specific page</div>
                    </div>
                  </label>
                  <label className={`radio-option ${inputType === 'domain' ? 'selected' : ''}`} onClick={() => setInputType('domain')}>
                    <input type="radio" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>🌐 Domain</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>पूरी website</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                  {inputType === 'url' ? 'Page URL' : 'Domain Name'}
                </label>
                <input
                  type="text"
                  placeholder={inputType === 'url' ? 'https://myblog.com/about' : 'myblog.com'}
                  value={urlValue}
                  onChange={e => setUrlValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNext()}
                />
              </div>

              {/* Checklist */}
              <div style={{ background: '#111', borderRadius: 8, padding: 14, fontSize: 13 }}>
                <div style={{ color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>पहले confirm करो:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>✅ तुम्हारी website live है</div>
                  <div>✅ sitemap.xml है (myblog.com/sitemap.xml)</div>
                  <div>✅ robots.txt है (myblog.com/robots.txt)</div>
                  <div>✅ HTML files edit कर सकते हो</div>
                </div>
              </div>

              <button className="btn-primary" onClick={handleNext} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Next →'}
              </button>
            </div>

            {/* Previous websites */}
            {websites.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ marginBottom: 14, fontSize: 16 }}>तुम्हारी Websites</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {websites.map(w => (
                    <div key={w.id} className="card" style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>{w.value}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                            {new Date(w.created_at).toLocaleDateString('hi-IN')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className={`badge ${w.status === 'indexed' ? 'badge-success' : w.status === 'failed' ? 'badge-error' : 'badge-pending'}`}>
                            {w.status === 'indexed' ? 'Indexed ✓' : w.status === 'failed' ? 'Failed' : 'Pending'}
                          </span>
                          {w.status === 'indexed' && (
                            <a href={`/analyze?id=${w.id}`} style={{ fontSize: 13 }}>Analytics →</a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 2: Timer ─── */}
        {step === 'timer' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div className="timer-circle">{timer}</div>
            <h2 style={{ marginBottom: 10 }}>Codes Generate हो रहे हैं...</h2>
            <p style={{ color: 'var(--muted)' }}>
              Google और IndexNow से verification codes आ रहे हैं।
            </p>
            <div style={{ marginTop: 20 }}>
              <div className="spinner" style={{ width: 24, height: 24, margin: '0 auto' }} />
            </div>
          </div>
        )}

        {/* ─── STEP 3: Codes ─── */}
        {step === 'codes' && tokenData && (
          <div>
            <h2 style={{ marginBottom: 6 }}>यह codes अपनी website में लगाओ</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
              2 steps हैं — दोनों करो फिर Verify click करो।
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Step A - Meta tags */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ background: 'var(--accent)', color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>1</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>यह code copy करो</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>अपने index.html के &lt;head&gt; में paste करो</div>
                  </div>
                </div>
                <CopyBox text={`${tokenData.meta_tag}\n${tokenData.our_meta_tag}`} />
              </div>

              {/* Step B - File */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ background: 'var(--accent)', color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>2</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>यह file बनाओ</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>अपनी website के root folder में upload करो</div>
                  </div>
                </div>
                <div style={{ marginBottom: 10, fontSize: 13, color: 'var(--muted)' }}>
                  File का नाम: <code style={{ color: 'var(--accent)' }}>{tokenData.indexnow_file_name}</code>
                </div>
                <div style={{ marginBottom: 10, fontSize: 13, color: 'var(--muted)' }}>File का content:</div>
                <CopyBox text={tokenData.indexnow_file_content} />
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
                  यह file यहाँ accessible होनी चाहिए:<br />
                  <code style={{ color: 'var(--accent)', fontSize: 11 }}>
                    {urlValue.startsWith('http') ? urlValue.split('/').slice(0, 3).join('/') : `https://${urlValue.split('/')[0]}`}/{tokenData.indexnow_file_name}
                  </code>
                </div>
              </div>

              {/* Warning */}
              <div style={{ background: '#2d2a1a', border: '1px solid var(--warning)', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--warning)' }}>
                ⚠️ दोनों steps complete करने के बाद ही Verify click करो।
              </div>

              {error && <div className="error-msg">{error}</div>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" onClick={reset} style={{ flex: 1 }}>← वापस</button>
                <button className="btn-primary" onClick={handleVerify} style={{ flex: 2 }} disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Verify करो →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 4: Verifying ─── */}
        {step === 'verify' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 20px' }} />
            <h2 style={{ marginBottom: 10 }}>Verify हो रहा है...</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              तुम्हारी website crawl हो रही है।<br />
              Google और IndexNow को request जा रही है।
            </p>
          </div>
        )}

        {/* ─── STEP 5: Result ─── */}
        {step === 'result' && verifyResult && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {verifyResult.success ? '🎉' : '⚠️'}
              </div>
              <h2 style={{ marginBottom: 8 }}>
                {verifyResult.success ? 'Index हो गया!' : 'कुछ problem है'}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>{verifyResult.message}</p>
            </div>

            {/* Crawl results */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 14 }}>Website Crawl Results</div>
              <div className="status-list">
                {[
                  { label: 'हमारा Meta Tag', key: 'our_meta' },
                  { label: 'Google Meta Tag', key: 'google_meta' },
                  { label: 'IndexNow Key File', key: 'indexnow_file' },
                  { label: 'sitemap.xml', key: 'sitemap' },
                  { label: 'robots.txt', key: 'robots' },
                ].map(item => (
                  <div key={item.key} className="status-item">
                    <span className="engine-name">{item.label}</span>
                    <span>{verifyResult.results.crawl[item.key as keyof typeof verifyResult.results.crawl] ? '✅ मिला' : '❌ नहीं मिला'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification results */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 14 }}>Search Engine Verification</div>
              <div className="status-list">
                <div className="status-item">
                  <span className="engine-name">🔍 Google</span>
                  <span>{verifyResult.results.verification.google ? '✅ Verified' : '❌ Failed'}</span>
                </div>
                <div className="status-item">
                  <span className="engine-name">⚡ IndexNow (Bing+Yandex+Naver+...)</span>
                  <span>{verifyResult.results.verification.indexnow ? '✅ Submitted' : '❌ Failed'}</span>
                </div>
              </div>
            </div>

            {/* Errors */}
            {verifyResult.results.errors.length > 0 && (
              <div className="card" style={{ marginBottom: 16, border: '1px solid var(--warning)' }}>
                <div style={{ fontWeight: 600, marginBottom: 10, color: 'var(--warning)' }}>Issues:</div>
                {verifyResult.results.errors.map((e, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--muted)', padding: '4px 0' }}>• {e}</div>
                ))}
              </div>
            )}

            {verifyResult.success ? (
              <div>
                <div className="success-msg" style={{ marginBottom: 16, textAlign: 'center' }}>
                  🕐 24 घंटे बाद analytics देखो
                </div>
                <a href={`/analyze?id=${websiteId}`}>
                  <button className="btn-primary">Analytics देखो →</button>
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" onClick={reset} style={{ flex: 1 }}>नई website</button>
                <button className="btn-primary" onClick={() => setStep('codes')} style={{ flex: 2 }}>फिर से try करो →</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
