<template>
  <section class="jobs-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <!--  -->
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Allocated`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.jobStatus || ($route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'allocated')? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Ongoing`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'ongoing'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Ongoing</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Available`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && ['available', 'public', 'bank'].includes($route.query.jobStatus.toLowerCase()) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Available</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Applied`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'applied'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Unsuccessful`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'unsuccessful'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unsuccessful</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Withdrawn`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'withdrawn'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Cancelled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'cancelled'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Completed`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'completed'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Approved`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'approved'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
  // middleware: "isVerified",
  data() {
    return {
      invoiceStatusList,
      practiceTypeList
    };
  }
};
</script>

