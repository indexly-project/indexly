import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Indexly — Index Everywhere. Instantly.',
  description: 'Index your website on 200+ search engines with just 2 simple steps. Free forever.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
