import type { Metadata } from 'next'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indexly-snowy.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: { default: 'Indexly — Index Everywhere. Instantly.', template: '%s — Indexly' },
  description: 'Index your website on 200+ search engines with just 2 simple steps. Google, Bing, Yandex, Naver and more. Free & Open Source.',
  keywords: ['website indexing', 'search engine submission', 'SEO tool', 'Google index', 'Bing index', 'IndexNow', 'free SEO', 'search console'],
  authors: [{ name: 'Indexly', url: baseUrl }],
  creator: 'Indexly',
  openGraph: {
    type: 'website', locale: 'en_US', url: baseUrl, siteName: 'Indexly',
    title: 'Indexly — Index Everywhere. Instantly.',
    description: 'Index your website on 200+ search engines with just 2 simple steps. Free & Open Source.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indexly — Index Everywhere. Instantly.',
    description: 'Index your website on 200+ search engines with just 2 simple steps.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* Indexly self-verification tag */}
        <meta name="indexed-by" content="Indexly" data-indexly-id="SELF" />
      </head>
      <body>{children}</body>
    </html>
  )
}
