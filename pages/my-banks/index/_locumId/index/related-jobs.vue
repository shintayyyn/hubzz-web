<template>
  <section class="sessions-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Allocated`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.jobStatus || ($route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'allocated') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Ongoing`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'ongoing' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Ongoing</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Live`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'live' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Live</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Applied`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'applied' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Unfilled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'unfilled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unfilled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Withdrawn`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'withdrawn' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Cancelled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'cancelled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Completed`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'completed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Approved`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'approved' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Approved</nuxt-link>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child :invoiceStatusList="invoiceStatusList" />
    </div>
    <AppConfirmationModal
      :label="'You\'ve been revoked to view this Page'"
      :confirmLabel="'OK'"
      :modal="confirmation_modal"
      @confirm="goTo"
    />
  </section>
</template>
<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
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
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  middleware: "isVerified",
  components: {
    AppConfirmationModal
  },
  data() {
    return {
      confirmation_modal: false,
      invoiceStatusList,
      practice: ""
    };
  },
  created() {
    this.practice = this.$auth.user.practice_detail.practice;
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  watch: {
    authPermissions(value) {
      if (!this.CheckPermissions(value).hasPermission) {
        this.confirmation_modal = true;
      }
    }
  },
  methods: {
    goTo() {
      this.confirmation_modal = false;
      setTimeout(() => {
        this.$router.push("/");
      }, 500);
    }
  }
};
</script>

