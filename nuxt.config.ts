export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Mauritius Internet Prices — The Data Report',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Independent analysis and comparative pricing of all major mobile data plans in Mauritius.' },
        // Open Graph
        { property: 'og:title', content: 'Mauritius Internet Prices — The Data Report' },
        { property: 'og:description', content: 'Independent analysis and comparative pricing of all major mobile data plans in Mauritius.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://mobile-data.ramgolam.com/og-image.png' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Mauritius Internet Prices — The Data Report' },
        { name: 'twitter:description', content: 'Independent analysis and comparative pricing of all major mobile data plans in Mauritius.' },
        { name: 'twitter:image', content: 'https://mobile-data.ramgolam.com/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
})
