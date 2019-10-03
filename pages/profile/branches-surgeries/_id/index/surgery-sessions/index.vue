<template>
  <div>
    <div class="flex flex-row justify-start overflow-x-auto py-3 my-2">
      <div class="relative">
        <nuxt-link
          :to="`/profile/branches-surgeries/${spokeId}/surgery-sessions/live`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('surgery-sessions-index-live') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Live</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_available_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_available_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/branches-surgeries/${spokeId}/surgery-sessions/applied`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('surgery-sessions-index-applied') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_applied_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_applied_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/branches-surgeries/${spokeId}/surgery-sessions/allocated`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('surgery-sessions-index-allocated') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_allocated_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_allocated_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/branches-surgeries/${spokeId}/surgery-sessions/completed`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('surgery-sessions-index-completed') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_completed_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_completed_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/branches-surgeries/${spokeId}/surgery-sessions/unfilled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('surgery-sessions-index-unfilled') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unfilled</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_unfilled_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_unfilled_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/branches-surgeries/${spokeId}/surgery-sessions/cancelled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('surgery-sessions-index-cancelled') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_cancelled_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_cancelled_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/branches-surgeries/${spokeId}/surgery-sessions/declined`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('surgery-sessions-index-declined') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Declined</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_declined_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_declined_jobs_count}}</div>
        </transition>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>
<script>
export default {
  data(){
    return{
      spokeId: ''
    }
  },
  async asyncData({app, route}){
    console.log('route dsa', route.path)
    const spokeId = route.params.id
    return{
      spokeId
    }
  },
  created() {
    this.$router.push(`/profile/branches-surgeries/${this.spokeId}/surgery-sessions/live`)
  }
}
</script>

