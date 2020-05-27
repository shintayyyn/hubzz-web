<template>
  <div>
    <div class="flex flex-row justify-start overflow-x-auto pb-3 mt-2">
      <nuxt-link
        :to="'/hub-surgery-management/invitations/spoke'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('hub-surgery-management-invitations-spoke') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Spoke / Stand Alone Invitations</nuxt-link>
      <nuxt-link
        :to="'/hub-surgery-management/invitations/hub'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('hub-surgery-management-invitations-hub') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >My Invitations</nuxt-link>
      <transition name="fade" mode="out-in">
        <nuxt-link
          v-if="$route.name.includes('hub-surgery-management-invitations-hub')"
          :to="'/hub-surgery-management/invitations/hub/create'"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer border rounded-lg border-yellow-500 bg-yellow-500 hover:text-white"
        >Invite</nuxt-link>
      </transition>
    </div>
    <nuxt-child />
  </div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  }
};
</script>