<template>
  <section class="jobs-section">
    <!-- <JobsTabs />
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent" />
      </transition>
    </div>
    <nuxt-child />-->
    <div class="modal-shield" v-if="shield"></div>
    <div class="flex flex-row flex-wrap justify-start">
      <nuxt-link
        to="/jobs/allocated"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'jobs-allocated'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Allocated</nuxt-link>
      <nuxt-link
        to="/jobs/available"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'jobs-available'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Available</nuxt-link>
      <nuxt-link
        to="/jobs/matched"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'jobs-matched'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Matched</nuxt-link>
      <nuxt-link
        to="/jobs/applied"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'jobs-applied'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Applied</nuxt-link>
      <nuxt-link
        to="/jobs/unsuccessful"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'jobs-unsuccessful'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Unsuccessful</nuxt-link>
      <nuxt-link
        to="/jobs/declined"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'jobs-declined'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Declined</nuxt-link>
      <nuxt-link
        to="/jobs/cancelled"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'jobs-cancelled'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Cancelled</nuxt-link>
      <nuxt-link
        to="/jobs/completed"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name === 'jobs-completed'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Completed</nuxt-link>
    </div>
    <!-- <transition name="fade" mode="out-in">
      <div v-if="$route.name === 'jobs-id'" class="modal-shield"></div>
    </transition>-->
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
// import JobsTabs from '@/components/Jobs/JobsTabs'
// import Allocated from '@/components/Jobs/Allocated'
// import Available from '@/components/Jobs/Available'
// import Matched from '@/components/Jobs/Matched'
// import Applied from '@/components/Jobs/Applied'
// import Unsuccessful from '@/components/Jobs/Unsuccessful'
// import Declined from '@/components/Jobs/Declined'
// import Cancelled from '@/components/Jobs/Cancelled'
// import Completed from '@/components/Jobs/Completed'
import AppLoading from '@/components/Base/AppLoading'
export default {
  components: {
    AppLoading
    //   JobsTabs,
    //   Allocated,
    //   Available,
    //   Matched,
    //   Applied,
    //   Unsuccessful,
    //   Declined,
    //   Cancelled,
    //   Completed
  },
  middleware: 'isVerified',
  computed: {
    activeComponent() {
      return this.$route.query.job_status
    },
    shield() {
      return this.$store.state.jobs.modal_shield
    },
    socketId() {
      return this.$store.state.socket_id
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    }
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
  // created() {
  //   const query = {
  //     ...this.$route.query,
  //     job_status: this.$route.query.job_status || 'allocated'
  //   }
  //   this.$router.push({ query })
  // },
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

