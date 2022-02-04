<template>
  <section>
    <div v-if="$store.state.toggled_sidebar" class="shield" @click="close" />
    <AppHeader />
    <AppSideBar @modal="signout_modal = $event" />

    <div
      ref="scrollContainer"
      :class="
        $route.name === 'messages-slug' || $route.name === 'messages-create'
          ? 'content-message'
          : 'content'
      "
    >
      <AppNotification />

      <!-- <JobNotification /> -->
      
      <AppConfirmationModal
        :label="`User account ${user_verification.status ? user_verification.status : ''}`"
        :confirmLabel="'OK'"
        :modal="user_verification.modal"
        @confirm="refresh"
      />

      <AppConfirmationModal
        :label="`Your account has been deactivated`"
        :confirmLabel="'OK'"
        :modal="user_deactivated_modal"
        @confirm="logout"
      />

      <AppConfirmationModal
        :label="`Your Session is expiring in 5 minutes. Would you like to continue your session?`"
        :confirmLabel="'Log Out'"
        :cancelLabel="'Continue Session'"
        :modal="session_expiring"
        @confirm="logout"
        @cancel="getMe"
      />

      <nuxt
        class="xxl:ml-3 xl:ml-3 lg:ml-3 md:ml-3  mb-4"
        :class="
          $route.name === 'messages-slug' || $route.name === 'messages-create'
            ? 'md:mt-28'
            : 'mt-24'
        "
        @scrollToTop="scrollToTop()"
      />
    </div>
  </section>
</template>

<script>
import AppSideBar from "@/components/AppSideBar"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppNotification from "@/components/AppNotification"
// import JobNotification from "@/components/JobNotification"
import AppHeader from "@/components/AppHeader"
export default {
  transitions: "page",
  components: {
    AppSideBar,
    AppConfirmationModal,
    AppNotification,
    // JobNotification,
    AppHeader,
  },
  data () {
    return {
      signout_modal: false,
    }
  },
  computed: {
    user_verification () {
      return this.$store.state.user_verification
    },
    user_deactivated_modal () {
      return this.$store.state.user_deactivated_modal
    },
    session_expiring () {
      return this.$store.getters["sessionExpiring"]
    },
  },
  middleware: "isNotAuthenticated",
  watch: {
    $route (value) {
      if (value) {
        this.$store.commit("TOGGLE_SIDEBAR", false)
        document.body.style.overflow = "auto"
      }
    },
  },
  mounted () {
    // EMAIL DEACTIVATED
    this.$socket.on("Locum Notification Account Deactivated", this.userDeactivated)
    this.$socket.on("Practice Notification Account Deactivated", this.userDeactivated)
    // LOCUM
    this.$socket.on("Locum Notification Locum Status Updated", this.getLocumVerification)
    this.$socket.on("User Notification Email Verified", this.getLocumVerification)
    this.$socket.on("User Notification Email Pending", this.getLocumVerification)
    this.$socket.on("Locum Notification Number Pending", this.getLocumVerification)
    this.$socket.on("Locum Notification Number Rejected", this.getLocumVerification)
    this.$socket.on("Locum Notification Number Verified", this.getLocumVerification)
    this.$socket.on("Locum Notification Compliance Approved", this.getLocumVerification)
    this.$socket.on("Locum Notification Compliance Rejected", this.getLocumVerification)
    this.$socket.on("Locum Notification Compliance Pending", this.getLocumVerification)
    this.$socket.on("Locum Notification Compliance Expiring", this.getLocumVerification)
    this.$socket.on("Locum Notification Compliance Expired", this.getLocumVerification)

    // PRACTICE
    this.$socket.on("Practice Notification Document Created", this.getPracticeVerification)
    this.$socket.on("Practice Notification Document Updated", this.getPracticeVerification)
    this.$socket.on("Practice Notification Rates Update", this.getPracticeVerification)
    this.$socket.on("Practice Notification User Update", this.getPracticeVerification)
    this.$socket.on("Practice Notification Practice Update", this.getPracticeVerification)
  },
  destroyed () {
    // EMAIL DEACTIVATED
    this.$socket.removeListener("Locum Notification Account Deactivated", this.userDeactivated)
    this.$socket.removeListener("Practice Notification Account Deactivated", this.userDeactivated)
    // LOCUM
    this.$socket.removeListener("User Notification Email Verified", this.getLocumVerification)
    this.$socket.removeListener("User Notification Email Pending", this.getLocumVerification)
    this.$socket.removeListener("Locum Notification Number Pending", this.getLocumVerification)
    this.$socket.removeListener("Locum Notification Number Rejected", this.getLocumVerification)
    this.$socket.removeListener("Locum Notification Number Verified", this.getLocumVerification)
    this.$socket.removeListener("Locum Notification Compliance Approved", this.getLocumVerification)
    this.$socket.removeListener("Locum Notification Compliance Rejected", this.getLocumVerification)
    this.$socket.removeListener("Locum Notification Compliance Pending", this.getLocumVerification)
    this.$socket.removeListener("Locum Notification Compliance Expiring", this.getLocumVerification)
    this.$socket.removeListener("Locum Notification Compliance Expired", this.getLocumVerification)

    // PRACTICE
    this.$socket.removeListener("Practice Notification Document Created", this.getPracticeVerification)
    this.$socket.removeListener("Practice Notification Document Updated", this.getPracticeVerification)
    this.$socket.removeListener("Practice Notification Rates Update", this.getPracticeVerification)
    this.$socket.removeListener("Practice Notification User Update", this.getPracticeVerification)
    this.$socket.removeListener("Practice Notification Practice Update", this.getPracticeVerification)
  },

  methods: {
    scrollToTop () {
      console.log('scrollToTop layout default')
      this.$nextTick(() => {
        this.$emit('scrollToTop')
        this.$refs.scrollContainer.scrollTop = 0
      })
    },

    logout () {
      this.$axios
        .post("/api/v1/logout")
        .then(() => {
          this.$store.commit("billing/CLEAR_PRACTICE_BILLING_NOTIFICATION")
          this.$store.commit("billing/CLEAR_LOCUM_BILLING_NOTIFICATION")
          this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION")
          this.$store.commit("jobs/CLEAR_LOCUM_JOB_NOTIFICATION")
          console.log("Socket Logged Out")
          console.log("One Signal Logged Out")
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
        .finally(() => {
          this.$emit("modal", false)
          this.$store.commit("TOGGLE_SIDEBAR", false)
          return this.loggedOutHandler()
        })
        .then(() => {
          this.$loggedOutBroadcastChannel.postMessage()
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
    },

    async loggedOutHandler () {
      try {
        await this.$auth.logout()
        this.$auth.$storage.setUniversal("_token.local", "")
        this.$router.push("/")
      } catch (err) {
        console.log("err", err)
      }
    },

    async getMe () {
      await this.$axios.$patch(`/api/v1/me/update-token`).then(() => {
        this.$store.commit("SESSION_EXPIRING", false)
      })
      
    },

    userDeactivated () {
      this.CheckIfUserIsDeactivated()
    },

    getPracticeVerification () {
      this.CheckUserVerification()
    },

    getLocumVerification () {
      this.CheckUserVerification()
    },

    close () {
      this.$store.commit("TOGGLE_SIDEBAR", false)
      document.body.style.overflow = "auto"
    },

    refresh () {
      window.location.reload()
    },
  },
}
</script>

<style scope>
  .content {
    /* box-sizing: content-box; */
    padding: 10px 20px;
    height: 100%;
    scroll-behavior: smooth;
  }

  .content-message {
    padding: 0 20px;
  }

  .shield {
    z-index: 55;
  }

  .content,
  .content-message {
    padding: 1px 3% 0;
  }

  @media (min-width: 1281px) {
    .content,
    .content-message {
      margin-left: 200px;
    }
  }

  @media (min-width: 720px) {
    .content,
    .content-message {
      padding: 1px 1% 0;
    }
  }
</style>
