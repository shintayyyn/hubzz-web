<template>
  <section class="jobs-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          to="/jobs/allocated"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-allocated' || $route.name === 'jobs-allocated-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          to="/jobs/ongoing"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-ongoing' || $route.name === 'jobs-ongoing-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Ongoing</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_ongoing_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_ongoing_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/available"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-available' || $route.name === 'jobs-available-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :class="$route.name === 'jobs-matched' || $route.name === 'jobs-matched-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :class="$route.name === 'jobs-applied' || $route.name === 'jobs-applied-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :class="$route.name === 'jobs-unsuccessful' || $route.name === 'jobs-unsuccessful-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :class="$route.name === 'jobs-declined' || $route.name === 'jobs-declined-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :class="$route.name === 'jobs-cancelled' || $route.name === 'jobs-cancelled-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          to="/jobs/withdrawn"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-withdrawn' || $route.name === 'jobs-withdrawn-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_withdrawn_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_withdrawn_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/completed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-completed' || $route.name === 'jobs-completed-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_completed_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_completed_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          to="/jobs/approved"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'jobs-approved' || $route.name === 'jobs-approved-id'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Approved</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.locum_new_approved_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.locum_new_approved_jobs_count}}</div>
        </transition>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
const tabs = [
  "jobs-allocated-id",
  "jobs-available-id",
  "jobs-matched-id",
  "jobs-applied-id",
  "jobs-unsuccessful-id",
  "jobs-declined-id",
  "jobs-cancelled-id",
  "jobs-completed-id"
];
export default {
  middleware: "isVerified",
  data() {
    return {
      tabs
    };
  },
  // computed: {
  //   socketId() {
  //     return this.$store.state.socket_id
  //   },
  // },
  watch: {
    $route(value) {
      if (this.tabs.includes(value.name)) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
    // socketId(value) {
    //   this.$store.dispatch('joinRoom', { socket_id: value, room_name: 'jobroom', })
    // }
  },
  beforeDestroy() {
    this.$store.dispatch("leaveRoom", {
      socket_id: this.$socket.id,
      room_name: "jobroom"
    });
  },
  mounted() {
    if (this.$socket.connected) {
      this.$store.dispatch("joinRoom", {
        socket_id: this.$socket.id,
        room_name: "jobroom"
      });
    } else {
      this.$socket.on("connect", () => {
        this.$store.dispatch("joinRoom", {
          socket_id: this.$socket.id,
          room_name: "jobroom"
        });
      });
    }
  }
};
</script>

