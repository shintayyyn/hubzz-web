<template>
  <section>
    <div class="flex flex-no-wrap justify-start">
      <nuxt-link
        :to="'/invite'"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'invite' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invite Locums</nuxt-link>
      <nuxt-link
        :to="'/invite/invite-practices'"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'invite-invite-practices' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invite Practices</nuxt-link>
    </div>
    <!-- <a
      href="//wa.me/?text=arvi%40gmail.com%0AHave%20you%20heard%20the%20buzz%20about%20hubzz%3F%0AJoin%20hubzz%20at%20%20%0Ahubzz.co.uk"
    >whatsapp link to chat</a>-->
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
