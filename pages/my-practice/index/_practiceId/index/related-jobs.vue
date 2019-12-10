<template>
  <section class="related-jobs-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Allocated`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.job_status || ($route.query.job_status && $route.query.job_status.toLowerCase() === 'allocated')? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Ongoing`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'ongoing'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Ongoing</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Available`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'available'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Available</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Matched`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'matched'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Matched</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Applied`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'applied'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Unsuccessful`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'unsuccessful'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unsuccessful</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Declined`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'declined'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Declined</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Cancelled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'cancelled'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Withdrawn`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'withdrawn'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Completed`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'completed'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status ? $route.query.status : ''}&job_status=Approved`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.job_status && $route.query.job_status.toLowerCase() === 'approved'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Approved</nuxt-link>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child :invoiceStatusList="invoiceStatusList" :practiceTypeList="practiceTypeList" />
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
      practiceTypeList
    };
  }
};
</script>