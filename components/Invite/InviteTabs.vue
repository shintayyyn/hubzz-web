<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locums')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.invite_domain === 'locums' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Invite Locums</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('practices')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.invite_domain === 'practices' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Invite Practices</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        invite_domain: type
      }
      this.$router.push({ query })
    }
  }
}
</script>
