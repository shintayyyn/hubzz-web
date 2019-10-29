<template>
  <section class="related-jobs-section">
    <!-- change to path,query -->
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <!-- :to="{ name: 'my-practice-index-practiceId-index-related-jobs-index', params: { ...$route.params}, query: {...$route.query, job_status: 'Allocated'}}" -->
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Allocated`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.job_status || ($route.query.job_status && $route.query.job_status.toLowerCase() === 'allocated')? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Ongoing`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'ongoing'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Available`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'available'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Matched`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'matched'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Applied`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'applied'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Unsuccessful`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'unsuccessful'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Declined`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'declined'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Cancelled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'cancelled'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Withdrawn`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'withdrawn'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Completed`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'completed'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&job_status=Approved`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'approved'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
      <nuxt-child
        :invoiceStatusList="invoiceStatusList"
        :practiceTypeList="practiceTypeList"
        :shifts="shifts"
        :rates="rates"
      />
    </div>
  </section>
</template>
<script>
const invoiceStatusList = [
  {
    label: "All",
    value: ""
  },
  {
    label: "To Be Invoice",
    value: "To Be Invoice"
  },
  {
    label: "Disputed",
    value: "Disputed"
  },
  {
    label: "Invoiced",
    value: "Invoiced"
  }
];
const practiceTypeList = [
  {
    label: "All",
    value: ""
  },
  {
    label: "Platform",
    value: "Platform"
  },
  {
    label: "Private",
    value: "Private"
  }
];
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  middleware: "isVerified",
  data() {
    return {
      invoiceStatusList,
      practiceTypeList,
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