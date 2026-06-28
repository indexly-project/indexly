export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indexly-snowy.vercel.app'

  const txt = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /analyze
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`

  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
