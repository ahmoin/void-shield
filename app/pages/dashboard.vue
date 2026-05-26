<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, clear } = useUserSession()
const config = useRuntimeConfig()

const { data: installations } = await useFetch('/api/dashboard/installations')

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950">
    <header class="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
      <AppLogo class="h-7" />
      <div class="flex items-center gap-3">
        <UButton
          :to="`https://github.com/apps/${config.public.githubAppSlug}/installations/new`"
          external
          size="sm"
          variant="outline"
          color="neutral"
        >
          <UIcon
            name="i-lucide-plus"
            class="size-4"
          />
          Add organization
        </UButton>
        <UDropdownMenu
          :items="[
            [{ label: user?.login ?? '', disabled: true }],
            [{ label: 'Sign out', icon: 'i-lucide-log-out', onSelect: logout }]
          ]"
        >
          <img
            :src="user?.avatarUrl ?? undefined"
            :alt="user?.login"
            class="w-8 h-8 rounded-full cursor-pointer ring-2 ring-neutral-700 hover:ring-neutral-500 transition-all"
          >
        </UDropdownMenu>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-10">
      <h1 class="text-2xl font-semibold text-white mb-2">
        Dashboard
      </h1>
      <p class="text-neutral-400 mb-8">
        Security scan results across your installed organizations.
      </p>

      <div
        v-if="!installations?.length"
        class="text-center py-20"
      >
        <UIcon
          name="i-lucide-shield-off"
          class="size-12 text-neutral-600 mx-auto mb-4"
        />
        <p class="text-neutral-300 font-medium mb-2">
          No installations yet
        </p>
        <p class="text-sm text-neutral-500 mb-6">
          Install Void Shield on an organization to start scanning.
        </p>
        <UButton
          :to="`https://github.com/apps/${config.public.githubAppSlug}/installations/new`"
          external
        >
          Install Void Shield
        </UButton>
      </div>

      <div
        v-else
        class="grid gap-4"
      >
        <div
          v-for="inst in installations"
          :key="inst.installation_id"
          class="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-4"
        >
          <div class="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-simple-icons-github"
              class="size-5 text-white"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-white">
              {{ inst.account_login }}
            </p>
            <p class="text-sm text-neutral-500">
              {{ inst.account_type }}
            </p>
          </div>
          <UBadge
            color="success"
            variant="subtle"
          >
            Active
          </UBadge>
        </div>
      </div>
    </main>
  </div>
</template>
