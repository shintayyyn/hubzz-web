<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locums')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.locum_detail_active_tab === 'locums' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Profile</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('practices')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.locum_detail_active_tab === 'practices' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Related Jobs</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        locum_detail_active_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>
