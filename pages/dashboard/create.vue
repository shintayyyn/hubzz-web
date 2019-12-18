<template>
  <div class="modal-container shadow-lg">
    <JobDetailModalAppointment
      :job="null"
      @close="$router.push({ path: '/dashboard' })"
      v-if="locumUser && !practiceUser"
    />
    <CreateJobModal
      :job="null"
      @close="$router.push('/dashboard')"
      v-if="!locumUser && practiceUser"
    />
  </div>
</template>
<script>
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment";
import CreateJobModal from "@/components/CreateJobModal";
export default {
  middleware: "isVerified",
  components: {
    JobDetailModalAppointment,
    CreateJobModal
  },
  data() {
    return {
      locumUser: null,
      practiceUser: null
    };
  },
  async asyncData({ app, error }) {
    if (app.$auth.loggedIn) {
      if (app.$auth.user.domain === "Locum") {
        let locumUser = app.$auth.user;
        return {
          locumUser
        };
      }
      if (app.$auth.user.domain === "Practice") {
        let practiceUser = app.$auth.user;
        return {
          practiceUser
        };
      }
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>