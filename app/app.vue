<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
provide<Ref<ContentNavigationItem[]>>('navigation', navigation as Ref<ContentNavigationItem[]>)

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Void Shield'
const description
  = 'A security auditing tool that scans codebases for vulnerabilities and helps visualize risks.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://void-shield.vercel.app/og-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <UNavigationMenu :items="[{ label: 'Docs', to: '/login' }]" />

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/ahmoin/void-shield"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} Void Shield.
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/ahmoin/void-shield"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
