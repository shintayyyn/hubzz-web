<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('allocated')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'allocated' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
      >Allocated</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.locum_new_allocated_jobs_count > 0"
          class="rounded-lg bg-red-400 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.locum_new_allocated_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('available')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'available' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
      >Available</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.locum_new_available_jobs_count > 0"
          class="rounded-lg bg-red-400 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.locum_new_available_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('matched')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'matched' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
      >Matched</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.locum_new_matched_jobs_count > 0"
          class="rounded-lg bg-red-400 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.locum_new_matched_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('applied')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'applied' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
      >Applied</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.locum_new_matched_jobs_count > 0"
          class="rounded-lg bg-red-400 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.locum_new_matched_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('unsuccessful')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'unsuccessful' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
      >Unsuccessful</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.locum_new_unsuccessful_jobs_count > 0"
          class="rounded-lg bg-red-400 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.locum_new_unsuccessful_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('declined')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'declined' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
      >Declined</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.locum_new_declined_jobs_count > 0"
          class="rounded-lg bg-red-400 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.locum_new_declined_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('cancelled')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'cancelled' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
      >Cancelled</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.locum_new_cancelled_jobs_count > 0"
          class="rounded-lg bg-red-400 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.locum_new_cancelled_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('completed')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.job_status === 'completed' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-grey-darker'"
      >Completed</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.locum_new_completed_jobs_count > 0"
          class="rounded-lg bg-red-400 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.locum_new_completed_jobs_count}}</div>
      </transition>
    </div>
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

