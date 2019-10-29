<template>
  <section>
    <div class="flex flex-no-wrap justify-start">
      <nuxt-link
        :to="'/invite/invite-locums'"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'invite-invite-locums' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invite Locums</nuxt-link>
      <nuxt-link
        :to="'/invite/invite-practices'"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'invite-invite-practices' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invite Practices</nuxt-link>
    </div>
    <div class="mt-3">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
export default {
  middleware: "isVerified"
};
</script>
