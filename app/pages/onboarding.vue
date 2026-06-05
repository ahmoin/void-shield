<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
useUserSession()

type OrgEntry = { id: number, login: string, avatarUrl: string | null, type: string }

const { data, pending } = await useFetch<{
  personal: OrgEntry
  orgs: OrgEntry[]
}>('/api/auth/orgs')

const selected = ref<OrgEntry | null>(null)

watch(
  () => data.value,
  (val) => {
    if (val && !selected.value) {
      selected.value = val.personal
    }
  },
  { immediate: true }
)

function install() {
  if (!selected.value) return
  const appSlug = config.public.githubAppSlug
  const targetType = selected.value.type === 'Organization' ? 'Organization' : 'User'
  const url = `https://github.com/apps/${appSlug}/installations/new?target_id=${selected.value.id}&target_type=${targetType}`
  window.location.href = url
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-lg">
      <div class="flex items-center gap-3 mb-8">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            1
          </div>
          <span class="text-sm font-medium">Select your organization</span>
        </div>
        <div class="flex-1 h-px" />
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            2
          </div>
          <span class="text-sm">Install Void Shield</span>
        </div>
      </div>

      <div class="border border-neutral-800 rounded-xl p-6">
        <div class="flex items-center justify-center gap-4 mb-6">
          <AppLogo class="h-8" />
          <div class="flex gap-1">
            <div class="w-1.5 h-1.5 rounded-full" />
            <div class="w-1.5 h-1.5 rounded-full" />
            <div class="w-1.5 h-1.5 rounded-full" />
          </div>
          <UIcon
            name="i-simple-icons-github"
            class="size-8"
          />
        </div>

        <h2 class="text-xl font-semibold text-center mb-1">
          Select an organization
        </h2>
        <p class="text-sm text-center mb-6">
          Choose where to install Void Shield
        </p>

        <div
          v-if="pending"
          class="flex justify-center py-8"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="size-6 animate-spin"
          />
        </div>

        <div
          v-else-if="data"
          class="space-y-2 max-h-72 overflow-y-auto"
        >
          <button
            class="w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left"
            :class="
              selected?.login === data.personal.login
                ? 'border-primary bg-primary/10'
                : 'border-neutral-700 hover:border-neutral-500'
            "
            @click="selected = data.personal"
          >
            <img
              :src="data.personal.avatarUrl ?? undefined"
              :alt="data.personal.login"
              class="w-8 h-8 rounded-full"
            >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">
                {{ data.personal.login }}
              </p>
              <p class="text-xs">
                Personal account
              </p>
            </div>
            <div
              class="w-4 h-4 rounded-full border-2 flex-shrink-0"
              :class="
                selected?.login === data.personal.login
                  ? 'border-primary bg-primary'
                  : 'border-neutral-500'
              "
            />
          </button>

          <button
            v-for="org in data.orgs"
            :key="org.id"
            class="w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left"
            :class="
              selected?.login === org.login
                ? 'border-primary bg-primary/10'
                : 'border-neutral-700 hover:border-neutral-500'
            "
            @click="selected = org"
          >
            <img
              :src="org.avatarUrl ?? undefined"
              :alt="org.login"
              class="w-8 h-8 rounded-full"
            >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">
                {{ org.login }}
              </p>
              <p class="text-xs">
                Organization
              </p>
            </div>
            <div
              class="w-4 h-4 rounded-full border-2 flex-shrink-0"
              :class="selected?.login === org.login ? 'border-primary bg-primary' : 'border-neutral-500'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
          <UButton
            to="https://github.com/settings/organizations"
            external
            variant="ghost"
            color="neutral"
            size="sm"
          >
            <UIcon
              name="i-lucide-plus"
              class="size-4"
            />
            Add Organization
          </UButton>

          <UButton
            :disabled="!selected"
            size="sm"
            @click="install"
          >
            Install
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4"
            />
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
