import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function detectBrowser(ua: string): string {
  if (ua.includes('Edg/')) return 'Edge'
  if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'IE'
  return 'Other'
}

function detectOS(ua: string): string {
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  return 'Other'
}

function detectDevice(ua: string): string {
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) return 'mobile'
  if (ua.includes('iPad') || ua.includes('Tablet')) return 'tablet'
  return 'desktop'
}

function detectSearchEngine(referrer: string): string | null {
  if (!referrer) return null
  if (referrer.includes('google.')) return 'google'
  if (referrer.includes('bing.')) return 'bing'
  if (referrer.includes('yahoo.')) return 'yahoo'
  if (referrer.includes('duckduckgo.')) return 'duckduckgo'
  if (referrer.includes('yandex.')) return 'yandex'
  if (referrer.includes('baidu.')) return 'baidu'
  if (referrer.includes('ecosia.')) return 'ecosia'
  if (referrer.includes('qwant.')) return 'qwant'
  return null
}

export async function OPTIONS() {
  return new Response('ok', { headers: corsHeaders })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { site_id, page, referrer, session_id } = body

    if (!site_id) {
      return new Response(JSON.stringify({ error: 'site_id required' }), { status: 400, headers: corsHeaders })
    }

    const ua = req.headers.get('user-agent') || ''
    const browser = detectBrowser(ua)
    const os = detectOS(ua)
    const device_type = detectDevice(ua)
    const search_engine = detectSearchEngine(referrer || '')

    // ── Location — Vercel के edge network से मुफ़्त में, कोई external API नहीं ──
    const country_code = req.headers.get('x-vercel-ip-country') || 'Unknown'
    const region = req.headers.get('x-vercel-ip-country-region') || ''
    const city = req.headers.get('x-vercel-ip-city') || ''
    const country_name = country_code !== 'Unknown' ? country_code : 'Unknown'
    // NOTE: Vercel सिर्फ़ 2-letter country code देता है (जैसे "IN"), पूरा नाम नहीं।
    // देखने में code ही ठीक रहेगा — चाहो तो एक छोटी country-code→name mapping बाद में जोड़ी जा सकती है।

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

    const { data: website } = await supabase
      .from('websites')
      .select('id, normalized_value')
      .eq('indexly_id', site_id)
      .single()

    if (!website) {
      console.error(`track: no website found for indexly_id="${site_id}"`)
      return new Response(JSON.stringify({ error: 'Site not found' }), { status: 404, headers: corsHeaders })
    }

    // ── Domain-lock — पहले जैसा ही, बिल्कुल नहीं बदला ──
    const origin = req.headers.get('origin') || req.headers.get('referer') || ''
    let originHost = ''
    try {
      originHost = origin ? new URL(origin).hostname.replace(/^www\./, '') : ''
    } catch {
      originHost = ''
    }
    const registeredHost = website.normalized_value.split('/')[0].replace(/^www\./, '')

    if (!originHost || originHost !== registeredHost) {
      console.error(`track: domain mismatch — "${originHost || 'unknown'}" vs registered "${registeredHost}"`)
      return new Response(JSON.stringify({ error: 'Domain mismatch' }), { status: 403, headers: corsHeaders })
    }

    const { error: insertErr } = await supabase.from('visits_raw').insert({
      site_id,
      website_id: website.id,
      page: page || '/',
      referrer: referrer || null,
      browser,
      os,
      device_type,
      country_code,
      country_name,
      region,
      city,
      search_engine,
      session_id: session_id || null,
    })

    if (insertErr) console.error(`track: visits_raw insert failed — ${insertErr.message}`)

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders })
  } catch (err: any) {
    console.error(`track: unhandled error — ${err.message}`)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
}
