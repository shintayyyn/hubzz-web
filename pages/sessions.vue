<template>
  <section class="sessions-tab">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          to="/sessions/live"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'sessions-live' || $route.name === 'sessions-live-id' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Live</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/sessions/applied"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'sessions-applied' || $route.name === 'sessions-applied-id' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/sessions/allocated"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'sessions-allocated' || $route.name === 'sessions-allocated-id' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/sessions/completed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'sessions-completed' || $route.name === 'sessions-completed-id' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/sessions/unfilled"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'sessions-unfilled' || $route.name === 'sessions-unfilled-id' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unfilled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/sessions/cancelled"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'sessions-cancelled' || $route.name === 'sessions-cancelled-id' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/sessions/declined"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'sessions-declined' || $route.name === 'sessions-declined-id' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Declined</nuxt-link>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
const tabs = [
  "sessions-live-id",
  "sessions-applied-id",
  "sessions-allocated-id",
  "sessions-completed-id",
  "sessions-unfilled-id",
  "sessions-cancelled-id",
  "sessions-declined-id"
];
export default {
  middleware: "isVerified",
  data() {
    return {
      tabs
    };
  },
  watch: {
    $route(value) {
      if (this.tabs.includes(value.name)) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }
};
</script>

