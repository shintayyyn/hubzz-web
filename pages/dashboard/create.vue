<template>
  <div ref="modalContainer" class="modal-container shadow-lg">
    <JobDetailModalAppointment
      v-if="locumUser && !practiceUser"
      :job="null"
      @close="$router.push({ path: '/dashboard' })"
      @scrollTop="scrollToTop()"
    />

    <CreateJobModal
      v-if="!locumUser && practiceUser"
      :job="null"
      @close="$router.push({ path: '/dashboard' })"
    />
  </div>
</template>

<script>
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment"
import CreateJobModal from "@/components/CreateJobModal"

export default {
  middleware: "isVerified",
  
  components: {
    JobDetailModalAppointment,
    CreateJobModal,
  },

  data () {
    return {
      locumUser: null,
      practiceUser: null,
    }
  },

  async asyncData ({ app, }) {
    if (app.$auth.loggedIn) {
      if (app.$auth.user.domain === "Locum") {
        let locumUser = app.$auth.user
        return {
          locumUser,
        }
      }

      if (app.$auth.user.domain === "Practice") {
        let practiceUser = app.$auth.user
        return {
          practiceUser,
        }
      }
    }
  },

  methods: {
    scrollToTop () {
      this.$nextTick(() => {
        this.$refs.modalContainer.scrollTop = 0
      })
    },

  },

}
</script>

<style scoped>
  .modal-container {
    z-index: 510;
  }

  @media screen and (min-width: 1200px) {
    .modal-container {
      width: 90%;
    }
  }
</style>
