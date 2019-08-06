<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('allocated')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'allocated' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Allocated</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.locum_new_allocated_jobs_count > 0"
          class="rounded-lg bg-red-dark text-white text-xs font-bold py-1 px-2 absolute pin-r pin-t"
        >{{$store.state.jobs.locum_new_allocated_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('available')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'available' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
      >Available</div>
      <div
        v-if="$store.state.jobs.locum_new_available_jobs_count > 0"
        class="rounded-lg bg-red-dark text-white text-xs font-bold py-1 px-2 absolute pin-r pin-t"
      >{{$store.state.jobs.locum_new_available_jobs_count}}</div>
    </div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('matched')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'matched' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Matched</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('applied')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'applied' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Applied</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('unsuccessful')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'unsuccessful' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Unsuccessful</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('declined')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'declined' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Declined</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('cancelled')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.job_status === 'cancelled' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'"
    >Cancelled</div>
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
  created() {
    this.clearBadge(this.$route.query.job_status)
  },
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        job_status: type
      }
      this.clearBadge(type)
      this.$router.push({ query })
    },
    clearBadge(type) {
      switch (type) {
        case 'allocated':
          setTimeout(() => {
            this.$store.commit('jobs/CLEAR_LOCUM_ALLOCATED_BADGE')
          }, 1000)
          break;
      }
    }
  }
}
</script>

<style scoped>
.badge {
}
</style>

