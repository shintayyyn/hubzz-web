<template>
  <section class="sessions-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          to="/sessions?status=Allocated"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'allocated') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          to="/sessions?status=Ongoing"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'ongoing' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Ongoing</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          to="/sessions?status=Live"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'live' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Live</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="'/sessions?status=Applied'"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'applied' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          to="/sessions?status=Unfilled"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'unfilled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unfilled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          to="/sessions?status=Declined"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'declined' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Declined</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          to="/sessions?status=Cancelled"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'cancelled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          to="/sessions?status=Completed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'completed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          to="/sessions?status=Approved"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'approved' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Approved</nuxt-link>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child :invoiceStatusList="invoiceStatusList" :shifts="shifts" :rates="rates" />
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
  middleware: "isVerified",
  components: {
    AppConfirmationModal
  },
  data() {
    return {
      confirmation_modal: false,
      invoiceStatusList,
      shifts: [],
      rates: []
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
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
  },
  watch: {
    $route(value) {
      if (["jobs-index-id"].includes(value.name)) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
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

