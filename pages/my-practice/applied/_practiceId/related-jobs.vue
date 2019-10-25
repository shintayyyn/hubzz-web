<template>
  <section class="related-jobs-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Allocated`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'allocated') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Ongoing`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'ongoing' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Ongoing</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_ongoing_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_ongoing_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Available`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'available' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Available</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_available_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_available_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Matched`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'matched' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Matched</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_matched_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_matched_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Applied`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'applied' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Unsuccessful`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'unsuccessful' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unsuccessful</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_unsuccessful_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_unsuccessful_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Declined`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'declined' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Declined</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_declined_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_declined_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Cancelled`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'cancelled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Withdrawn`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'withdrawn' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_withdrawn_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_withdrawn_jobs_count}}</div>
        </transition>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Completed`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'completed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
          :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs?status=Approved`"
          class="mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'approved' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Approved</nuxt-link>
        <transition name="fade">
          <div
            v-if="$store.state.jobs.practice_new_approved_jobs_count > 0"
            class="rounded-lg bg-red-600 text-white text-xs font-bold py-1 px-2 absolute right-0 top-0"
          >{{$store.state.jobs.practice_new_approved_jobs_count}}</div>
        </transition>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child
        :shifts="shifts"
        :rates="rates"
        :invoiceStatusList="invoiceStatusList"
        :practiceTypeList="practiceTypeList"
      />
    </div>
  </section>
</template>
<script>
import MyPracticeRelatedJobsTabs from "@/components/MyPractice/MyPracticeRelatedJobsTabs";
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
  components: {
    MyPracticeRelatedJobsTabs
  },
  middleware({ query, params, redirect, error }) {
    // if (!query.status) {
    //   redirect(
    //     `/my-practice/applied/${params.practiceId}/related-jobs?status=Allocated`
    //   );
    // }
    if (
      query.status &&
      ![
        "allocated",
        "ongoing",
        "available",
        "matched",
        "applied",
        "unsuccessful",
        "declined",
        "cancelled",
        "withdrawn",
        "completed",
        "approved"
      ].includes(query.status.toLowerCase())
    ) {
      return error({ status: 404, message: "This Job Status is Invalid" });
    }
  },
  data() {
    return {
      shifts: [],
      rates: [],
      invoiceStatusList,
      practiceTypeList,
      practiceType: "applied"
    };
  },
  watch: {
    $route(value) {
      console.log("route changed parent", value);
    }
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
