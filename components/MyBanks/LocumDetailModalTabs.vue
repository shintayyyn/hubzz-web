<template>
  <div class="flex flex-no-wrap mt-4 ml-6 justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locum_detail')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_locum === 'locum_detail' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Profile</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locum_jobs')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.my_locum === 'locum_jobs' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Related Jobs</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        my_locum: type
      }
      this.$router.push({ query })
    }
  }
}
</script>
