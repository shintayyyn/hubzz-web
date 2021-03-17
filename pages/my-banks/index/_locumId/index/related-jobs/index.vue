<template>
  <section class="sessions-section">
    <div v-if="!$route.params.jobId" class="flex flex-row justify-start overflow-x-auto mb-4 pt-1 border-b border-gray-500">
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Allocated`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="!$route.query.jobStatus || ($route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'allocated') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >Allocated</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Ongoing`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'ongoing' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >Ongoing</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Available`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && ['available', 'public', 'bank'].includes($route.query.jobStatus.toLowerCase()) ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >Available</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Applied`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'applied' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >Applied</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Unsuccessful`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'unsuccessful' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >Unsuccessful</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Withdrawn`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'withdrawn' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >Withdrawn</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Cancelled`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'cancelled' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >Cancelled</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Completed`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'completed' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >Completed</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Approved`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'approved' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >Approved</nuxt-link>
    </div>
    <div class="">
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
    value: null
  },
  {
    label: "To Be Invoiced",
    value: "To Be Invoiced"
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
    AppConfirmationModal,
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
    },
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

