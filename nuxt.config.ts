// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/content', 'nuxt-auth-utils'],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-white.png',
          media: '(prefers-color-scheme: dark)'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-black.png',
          media: '(prefers-color-scheme: light)'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: { searchDepth: 1 }
      }
    }
  },

  runtimeConfig: {
    githubClientId: '',
    githubClientSecret: '',
    public: {
      siteUrl: 'https://void-shield.vercel.app',
      githubAppSlug: ''
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/docs/**': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/docs/getting-started', '/docs/getting-started/installation', '/docs/configuration/voidshield-json']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
