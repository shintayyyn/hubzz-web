<template>
  <section class="account-section">
    <div class="flex justify-start overflow-x-auto py-3">
      <template v-if="$auth.user.domain === 'Locum'">
        <div class="relative">
          <nuxt-link
            to="/account"
            class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="['account'].includes($route.name) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >
            Personal Details
          </nuxt-link>
        </div>

        <div class="relative">
          <nuxt-link
            to="/account/profile"
            class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="$route.name === 'account-profile' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >
            Preferences
          </nuxt-link>
        </div>
      </template>

      <template v-else-if="$auth.user.domain === 'Practice'">
        <div class="relative">
          <nuxt-link
            to="/account"
            class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="['account'].includes($route.name) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >
            User
          </nuxt-link>
        </div>
      </template>

      <div class="relative">
        <nuxt-link
          to="/account/change-password"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'account-change-password' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          Change Password
        </nuxt-link>
      </div>
    </div>

    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
