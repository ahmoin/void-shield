<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

const route = useRoute()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('docs').path(route.path).first()
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('docs', route.path, { fields: ['description'] })
)

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))
</script>

<template>
  <UContainer>
    <UPage v-if="page">
      <template #left>
        <UPageAside>
          <UContentNavigation
            highlight
            :navigation="navigation"
          />
        </UPageAside>
      </template>
      <UPageHeader
        :title="page.title"
        :description="page.description"
        :headline="headline"
      />
      <UPageBody>
        <ContentRenderer :value="page" />
        <USeparator v-if="surround?.length" />
        <UContentSurround :surround="surround" />
      </UPageBody>
      <template
        v-if="page?.body?.toc?.links?.length"
        #right
      >
        <UContentToc :links="page.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
