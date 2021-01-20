<template>
  <section class="jobs-section">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500">
        <!--  -->
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/platform/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Allocated`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="!$route.query.jobStatus || ($route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'allocated')? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/platform/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Ongoing`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'ongoing'  ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >Ongoing</nuxt-link>
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/platform/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Available`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && ['available', 'public', 'bank'].includes($route.query.jobStatus.toLowerCase()) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >Available</nuxt-link>
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/platform/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Applied`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'applied'  ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >Applied</nuxt-link>
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/platform/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Unsuccessful`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'unsuccessful'  ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >Unsuccessful</nuxt-link>
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/platform/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Withdrawn`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'withdrawn'  ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/platform/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Cancelled`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'cancelled'  ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/platform/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Completed`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'completed'  ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >Completed</nuxt-link>
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/platform/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Approved`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'approved'  ? 'border-b-4 border-gray-500' : 'text-gray-600'"
        >Approved</nuxt-link>
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

