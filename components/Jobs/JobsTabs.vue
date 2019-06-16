<template>
  <div class="flex flex-row flex-wrap justify-start px-5">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('allocated')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'allocated' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Allocated</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('available')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'available' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Available</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('applied')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'applied' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Applied</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('rejected')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'rejected' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Rejected</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('declined')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'declined' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Declined</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('completed')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'completed' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Completed</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        job_status: type
      }
      this.$router.push({ query })
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>

