<template>
  <section class="surgery-sessions-sections">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Allocated`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'allocated') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Ongoing`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'ongoing' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Ongoing</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Live`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'live' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Live</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Applied`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'applied' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Unfilled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'unfilled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unfilled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Declined`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'declined' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Declined</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Cancelled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'cancelled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Withdrawn`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'withdrawn' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Completed`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'completed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/profile/practice-spokes/${$route.params.id}/surgery-sessions?status=Approved`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'approved' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Approved</nuxt-link>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child :shifts="shifts" :rates="rates" />
    </div>
  </section>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  data() {
    return {
      shifts: [],
      rates: []
    };
  },
  created() {
    this.$axios.$get(`/api/v1/shifts`).then(res => {
      this.shifts = [];
      this.shifts.push({ label: "All", value: "" });
      res.data.shifts.forEach(item => {
        this.shifts.push({ label: item.name, value: item.id });
      });
    });
    this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
      this.rates = [];
      this.rates.push({ label: "All", value: "" });
      res.data.locum_detail_rate_types.forEach(item => {
        this.rates.push({ label: item.name, value: item.id });
      });
    });
  }
};
</script>

