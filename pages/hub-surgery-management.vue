<template>
  <section>
    <div class="flex overflow-x-auto">
      <nuxt-link
        :to="`/hub-surgery-management`"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name === 'hub-surgery-management-index' || $route.name.includes('hub-surgery-management-id')
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
      >
        My Spokes
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'hub-surgery-management-invitations-spoke'}"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('hub-surgery-management-invitations')
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
      >
        Invitations
      </nuxt-link>
    </div>

    <transition name="fade" mode="out-in">
      <div
        v-if="['hub-surgery-management-index-invitationId', 'hub-surgery-management-id', 'hub-surgery-management-index-create'].includes($route.name)
          || $route.name.includes('hub-surgery-management-id')"
        class="shield"
        @click="$router.push('/hub-surgery-management')"
      />
    </transition>

    <nuxt-child />
  </section>
</template>
