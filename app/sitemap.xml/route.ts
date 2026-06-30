export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indexly-snowy.vercel.app'
  const today = new Date().toISOString().split('T')[0]

  const pages = [
    { path: '/', priority: '1.0', freq: 'weekly' },
    { path: '/docs', priority: '0.9', freq: 'monthly' },
    { path: '/about', priority: '0.8', freq: 'monthly' },
    { path: '/auth/login', priority: '0.7', freq: 'monthly' },
    { path: '/privacy', priority: '0.5', freq: 'yearly' },
    { path: '/terms', priority: '0.5', freq: 'yearly' },
    { path: '/disclaimer', priority: '0.5', freq: 'yearly' },
  ]

  const urlEntries = pages
    .map(
      (p) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
