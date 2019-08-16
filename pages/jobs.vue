<template>
  <section class="jobs-section">
    <div class="modal-shield" v-if="shield"></div>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="relative">
        <nuxt-link
          to="/jobs/allocated"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-allocated'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_allocated_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_allocated_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/available"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-available'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Available</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_available_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_available_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/matched"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-matched'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Matched</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_matched_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_matched_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/applied"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-applied'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_applied_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_applied_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/unsuccessful"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-unsuccessful'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unsuccessful</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_unsuccessful_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_unsuccessful_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/declined"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-declined'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Declined</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_declined_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_declined_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/cancelled"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-cancelled'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_cancelled_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_cancelled_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/completed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-completed'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_completed_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_completed_jobs_count}}</div>
        </transition>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
export default {
  middleware: 'isVerified',
  computed: {
    shield() {
      return this.$store.state.jobs.modal_shield
    },
    socketId() {
      return this.$store.state.socket_id
    },
  },
  watch: {
    shield(value) {
      if (value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    },
    socketId(value) {
      this.$store.dispatch('joinRoom', { socket_id: value, room_name: 'jobroom', })
    }
  },
  beforeDestroy() {
    this.$store.dispatch('leaveRoom', { socket_id: this.$socket.id, room_name: 'jobroom' })
  },
  mounted() {
    if (this.$socket.connected) {
      this.$store.dispatch('joinRoom', { socket_id: this.$socket.id, room_name: 'jobroom' })
    } else {
      this.$socket.on('connect', () => {
        this.$store.dispatch('joinRoom', { socket_id: this.$socket.id, room_name: 'jobroom' })
      })
    }
  }
}
</script>
<style scoped>
.modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
</style>

