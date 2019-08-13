<template>
  <div class="flex flex-row flex-wrap justify-center md:justify-start">
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('live')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.session_status === 'live' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Live</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_available_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_available_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('applied')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.session_status === 'applied' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Applied</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_applied_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_applied_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('allocated')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.session_status === 'allocated' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Allocated</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_allocated_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_allocated_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('completed')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.session_status === 'completed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Completed</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_completed_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_completed_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('unfilled')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.session_status === 'unfilled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Unfilled</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_unfilled_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_unfilled_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('cancelled')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.session_status === 'cancelled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Cancelled</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_cancelled_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_cancelled_jobs_count}}</div>
      </transition>
    </div>
    <div class="relative">
      <div
        style="font-family:Nunito"
        @click.prevent="goTo('declined')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.session_status === 'declined' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Declined</div>
      <transition name="fade">
        <div
          v-if="$store.state.jobs.practice_new_declined_jobs_count > 0"
          class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
        >{{$store.state.jobs.practice_new_declined_jobs_count}}</div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        session_status: type
      }
      this.$router.push({ query })
    }
  }
}
</script>
