import type { Metadata, Viewport } from 'next'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indexly-snowy.vercel.app'
const title = 'Indexly — Index Everywhere. Instantly.'
const description = 'Index your website on 16 search engines in 2 simple steps. Brave, Bing, Yandex, Naver, DuckDuckGo, Yahoo and more. Free & Open Source.'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: title, template: '%s — Indexly' },
  description,
  applicationName: 'Indexly',
  keywords: ['website indexing', 'search engine submission', 'SEO tool', 'index website', 'search console', 'free SEO tool', 'submit website to search engines'],
  authors: [{ name: 'Indexly', url: baseUrl }],
  creator: 'Indexly',
  publisher: 'Indexly',
  category: 'technology',
  alternates: { canonical: baseUrl },
  openGraph: {
    type: 'website', locale: 'en_US', url: baseUrl, siteName: 'Indexly',
    title, description,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image', title, description,
    images: ['/og-image.png'], creator: '@indexlyapp',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
    { media: '(prefers-color-scheme: light)', color: '#0f0f0f' },
  ],
}

const schemaWebApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Indexly',
  url: baseUrl,
  description,
  applicationCategory: 'SEOApplication',
  operatingSystem: 'Any (Web-based)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
  creator: { '@type': 'Organization', name: 'Indexly', url: baseUrl },
  featureList: [
    'Submit website to 16 search engines',
    'Domain and URL indexing',
    'Real-time visitor analytics',
    'Search Intent Pulse analytics',
    'Sitemap bulk submission',
    'Open source and free forever',
  ],
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Indexly',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  email: 'indexlyproject@gmail.com',
  description,
  sameAs: ['https://github.com/indexly-project/indexly'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="Um4CIb6wu_DDi2IfiWFVAEd2Ddkx8hjWSj3ZMYQp14Y" />
        <meta name="indexed-by" content="Indexly" data-indexly-id="idx-14a7idamptwzxzw7" />
        <script src="https://indexly-snowy.vercel.app/track.js" data-site-id="idx-14a7idamptwzxzw7" defer></script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
