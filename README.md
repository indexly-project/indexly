<div align="center">

<img src="public/logo.png" alt="Indexly Logo" width="100" />

# Indexly

### Index Everywhere. Instantly.

Submit your website to 200+ search engines in just 2 simple steps.
Free forever. Open source. No accounts needed for each search engine.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E)](https://supabase.com)

[Live Demo](https://indexly-snowy.vercel.app) · [Documentation](https://indexly-snowy.vercel.app/docs) · [Report a Bug](https://github.com/indexly-project/indexly/issues)

</div>

---

## What is Indexly?

Getting a website discovered by search engines usually means visiting Google Search Console, Bing Webmaster Tools, Yandex Webmaster, and a dozen other platforms — each with its own verification process and dashboard.

**Indexly fixes that.** Submit your URL once, complete 2 simple steps, and get indexed across Google and 200+ other search engines (Bing, Yahoo, Yandex, DuckDuckGo, Naver, Seznam, Yep, and more) — all through a single, unified flow.

## Features

- 🔗 **Domain or URL indexing** — index your whole site or a single page
- ⚡ **2-step verification** — one meta tag, one key file, that's it
- 🌍 **200+ search engines** — covered via Google API + IndexNow protocol
- 📊 **5 analytics graphs** — search engine visibility, country/state traffic, traffic timeline
- 🧭 **Search Intent Pulse** — our unique algorithm classifying visitor intent (informational, navigational, transactional, commercial) over time
- 🆓 **100% free & open source** — MIT licensed, no hidden costs
- 📱 **Mobile-first** — fully responsive, built for everyone

## How It Works

1. **Sign up** and enter your website URL or domain
2. **Add 2 things** to your site — a meta tag and a small key file
3. **Click Verify** — Indexly checks your site and submits it across the search engine network
4. **View Analytics** after 24 hours — see exactly how your site is performing

Read the full guide in our [Documentation](https://indexly-snowy.vercel.app/docs).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Backend | Supabase Edge Functions (Deno) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Auth | Supabase Auth |
| Hosting | Vercel |
| Search APIs | Google Site Verification API, IndexNow Protocol |

## Project Structure

```
indexly/
├── app/                  # Next.js App Router pages
│   ├── auth/             # Login & signup
│   ├── dashboard/        # Main indexing flow
│   ├── analyze/          # Analytics dashboard
│   ├── docs/             # Documentation page
│   ├── about/            # About page
│   ├── privacy/          # Privacy policy
│   ├── terms/            # Terms of service
│   ├── disclaimer/       # Disclaimer
│   ├── sitemap.xml/      # Dynamic sitemap route
│   └── robots.txt/       # Dynamic robots route
├── components/           # Reusable UI components
├── lib/                  # Supabase client setup
├── public/               # Static assets (logo, OG image)
└── supabase-functions/   # Edge Function source (deploy via Supabase Dashboard)
```

## Local Development

```bash
git clone https://github.com/indexly-project/indexly.git
cd indexly
npm install
npm run dev
```

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

## Support

Questions or issues? Email **support@indexly.app** or open a [GitHub Issue](https://github.com/indexly-project/indexly/issues).

---

<div align="center">
Made with ❤️ as a free, open-source project · ⭐ Star this repo if Indexly helped you!
</div>
