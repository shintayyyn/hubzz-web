<template>
  <div class="flex flex-no-wrap mt-4 ml-6 justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locum_available')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.locum_jobs === 'locum_available' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
    >Available</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locum_applied')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.locum_jobs === 'locum_applied' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
    >Applied</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locum_current')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.locum_jobs === 'locum_current' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
    >Current</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locum_completed')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.locum_jobs === 'locum_completed' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
    >Completed</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locum_unsuccessful')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.locum_jobs === 'locum_unsuccessful' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
    >Unsucessful</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locum_cancelled')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.locum_jobs === 'locum_cancelled' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
    >Cancelled</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('locum_declined')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.locum_jobs === 'locum_declined' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
    >Declined</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        locum_jobs: type
      }
      this.$router.push({ query })
    }
  }
}
</script>