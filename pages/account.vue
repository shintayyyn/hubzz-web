<template>
  <section class="account-section">
    <div class="flex flex-wrap items-center justify-between w-full border-b border-sunglow">
      <div class="flex overflow-x-auto items-center">
        <template v-if="$auth.user.domain === 'Locum'">
            <nuxt-link
              to="/account"
              class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="['account'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
            >
              Personal Details
            </nuxt-link>

            <nuxt-link
              to="/account/profile"
              class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="$route.name === 'account-profile' ? 'border-b-4 border-sunglow' : 'text-gray-600'"
            >
              Preferences
            </nuxt-link>
        </template>

        <template v-else-if="$auth.user.domain === 'Practice'">
            <nuxt-link
              to="/account"
              class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="['account'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
            >
              User
            </nuxt-link>
        </template>

          <nuxt-link
            to="/account/change-password"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="$route.name === 'account-change-password' ? 'border-b-4 border-sunglow' : 'text-gray-600'"
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
