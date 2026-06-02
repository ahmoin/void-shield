<script setup lang="ts">
const { loggedIn } = useUserSession()
if (loggedIn.value) {
  await navigateTo('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="flex flex-col items-center gap-8 max-w-sm w-full px-6">
      <AppLogo class="h-10" />

      <div class="text-center">
        <h1 class="text-2xl font-semibold">
          Sign in to Void Shield
        </h1>
        <p class="mt-2 text-sm text-muted">
          Security scanning for your GitHub repositories
        </p>
      </div>

      <UButton
        to="/api/auth/github"
        external
        size="lg"
        class="w-full justify-center"
        color="neutral"
        variant="solid"
      >
        <UIcon
          name="i-simple-icons-github"
          class="size-5"
        />
        Continue with GitHub
      </UButton>

      <p class="text-xs text-muted text-center">
        By signing in, you agree to allow Void Shield to access your GitHub organizations and repositories.
      </p>
    </div>
  </div>
</template>
