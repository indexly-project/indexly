import type { Metadata, Viewport } from 'next'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indexly-snowy.vercel.app'
const siteName = 'Indexly'
const title = 'Indexly — Index Everywhere. Instantly.'
const description =
  'Index your website on 200+ search engines with just 2 simple steps. Google, Bing, Yandex, Naver, DuckDuckGo and more. Free & Open Source.'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: { default: title, template: '%s — Indexly' },
  description,
  applicationName: siteName,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',

  keywords: [
    'website indexing',
    'search engine submission',
    'SEO tool',
    'index website on Google',
    'IndexNow',
    'search console',
    'free SEO tool',
    'submit website to search engines',
    'website indexing checker',
  ],

  authors: [{ name: 'Indexly', url: baseUrl }],
  creator: 'Indexly',
  publisher: 'Indexly',

  category: 'technology',

  alternates: {
    canonical: baseUrl,
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName,
    title,
    description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Indexly — Index Everywhere. Instantly.',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
    creator: '@indexlyapp',
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
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // Self-indexing test — Indexly verifying itself
  verification: {
    google: 'Um4CIb6wu_DDi2IfiWFVAEd2Ddkx8hjWSj3ZMYQp14Y',
    other: {
      'indexed-by': 'Indexly',
    },
  },

  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
    { media: '(prefers-color-scheme: light)', color: '#0f0f0f' },
  ],
}

// Structured Data (Schema.org) — helps Google & AI search engines understand Indexly
const schemaWebApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Indexly',
  url: baseUrl,
  description,
  applicationCategory: 'SEOApplication',
  operatingSystem: 'Any (Web-based)',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    ratingCount: '1',
    bestRating: '5',
    worstRating: '1',
  },
  creator: {
    '@type': 'Organization',
    name: 'Indexly',
    url: baseUrl,
  },
  featureList: [
    'Submit website to 200+ search engines',
    'Domain and URL indexing',
    'Search Intent Pulse analytics',
    'Country and region traffic analytics',
    'Open source and free forever',
  ],
}

const schemaOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Indexly',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description,
  sameAs: ['https://github.com/indexly-project/indexly'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Self-indexing test tags — Indexly verifying itself */}
        <meta
          name="google-site-verification"
          content="Um4CIb6wu_DDi2IfiWFVAEd2Ddkx8hjWSj3ZMYQp14Y"
        />
        <meta name="indexed-by" content="Indexly" data-indexly-id="idx-gp91hupe1wn2473u" />

        {/* Structured data for search engines & AI crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
