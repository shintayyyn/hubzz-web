<template>
  <div>
    <div class="flex flex-row justify-start overflow-x-auto pb-3 mt-2">
      <nuxt-link
        :to="'/spoke-surgery-management/invitations/hub'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('spoke-surgery-management-invitations-hub') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Hub Invitations</nuxt-link>
      <nuxt-link
        :to="'/spoke-surgery-management/invitations/spoke'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('spoke-surgery-management-invitations-spoke') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >My Invitation</nuxt-link>
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