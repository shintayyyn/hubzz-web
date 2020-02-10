<template>
  <section class="surgery-sessions-sections">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Pending`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'pending' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Pending</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Allocated`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.jobStatus || ($route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'allocated') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Allocated</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Ongoing`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'ongoing' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Ongoing</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Live`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'live' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Live</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Applied`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'applied' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Unfilled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'unfilled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Unfilled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Withdrawn`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'withdrawn' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Cancelled`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'cancelled' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Cancelled</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Completed`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'completed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Approved`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'approved' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Approved</nuxt-link>
      </div>
    </div>
    <div class="mt-5">
      <nuxt-child :shifts="shifts" :rates="rates" :spokePracticeId="spokePracticeId" />
    </div>
    <transition name="shield" mode="out-in">
      <div class="shield" v-if="create_job_surgery_modal" @click="close"></div>
    </transition>
    <transition name="slide" mode="out-in">
      <template v-if="create_job_surgery_modal">
        <div class="modal-container shadow-lg">
          <CreateJobModal :job="repost_job" />
        </div>
      </template>
    </transition>
  </section>
</template>
<script>
import CreateJobModal from "@/components/CreateJobModal";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    CreateJobModal
  },
  data() {
    return {
      shifts: [],
      rates: [],
      spokePracticeId: null
    };
  },
  computed: {
    create_job_surgery_modal() {
      return this.$store.state.calendar.create_job_surgery_modal;
    },
    repost_job() {
      return this.$store.state.calendar.repost_job;
    }
  },
  created() {
    this.$axios
      .$get(`/api/v1/practice/me/practice-surgeries/${this.$route.params.id}`)
      .then(res => {
        this.spokePracticeId =
          res.data &&
          res.data.practice_surgery &&
          res.data.practice_surgery.child_practice_id
            ? res.data.practice_surgery.child_practice_id
            : null;
      }),
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
  methods: {
    close() {
      this.$store.commit("calendar/CREATE_JOB_SURGERY_MODAL", false);
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 600;
}
.modal-container {
  z-index: 601;
}
@media (min-width: 1200px) {
  .modal-container {
    width: 70%;
  }
}
</style>

