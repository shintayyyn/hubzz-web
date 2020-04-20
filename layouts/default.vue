<template>
  <section>
    <div v-if="$store.state.toggled_sidebar" class="shield" @click="close" />
    <AppHeader />
    <AppSideBar @modal="signout_modal = $event" />
    <div
      :class="
        $route.name === 'messages-slug' || $route.name === 'messages-new'
          ? 'content-message'
          : 'content'
      "
    >
      <AppNotification />
      <JobNotification />
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
      <nuxt
        class="mb-4"
        :class="
          $route.name === 'messages-slug' || $route.name === 'messages-new'
            ? 'md:mt-20'
            : 'mt-16'
        "
      />
    </div>
  </section>
</template>
<script>
import AppSideBar from "@/components/AppSideBar"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppNotification from "@/components/AppNotification"
import JobNotification from "@/components/JobNotification"
import AppHeader from "@/components/AppHeader"

export default {
  transitions: "page",
  components: {
    AppSideBar,
    AppConfirmationModal,
    AppNotification,
    JobNotification,
    AppHeader
  },
  data () {
    return {
      signout_modal: false
    }
  },
  computed: {
    user_verification () {
      return this.$store.state.user_verification
    },
    user_deactivated_modal () {
      return this.$store.state.user_deactivated_modal
    }
  },
  middleware: "isNotAuthenticated",
  watch: {
    $route (value) {
      if (value) {
        this.$store.commit("TOGGLE_SIDEBAR", false)
        document.body.style.overflow = "auto"
      }
    }
  },
  mounted () {
    // EMAIL DEACTIVATED
    this.$socket.on(
      "Locum Notification Account Deactivated",
      this.userDeactivated
    )
    this.$socket.on(
      "Practice Notification Account Deactivated",
      this.userDeactivated
    )
    // LOCUM
    this.$socket.on(
      "User Notification Email Verified",
      this.getLocumVerification
    )
    this.$socket.on(
      "User Notification Email Pending",
      this.getLocumVerification
    )
    this.$socket.on(
      "Locum Notification Number Pending",
      this.getLocumVerification
    )
    this.$socket.on(
      "Locum Notification Number Rejected",
      this.getLocumVerification
    )
    this.$socket.on(
      "Locum Notification Number Verified",
      this.getLocumVerification
    )
    this.$socket.on(
      "Locum Notification Compliance Approved",
      this.getLocumVerification
    )
    this.$socket.on(
      "Locum Notification Compliance Rejected",
      this.getLocumVerification
    )
    this.$socket.on(
      "Locum Notification Compliance Pending",
      this.getLocumVerification
    )
    this.$socket.on(
      "Locum Notification Compliance Expiring",
      this.getLocumVerification
    )
    this.$socket.on(
      "Locum Notification Compliance Expired",
      this.getLocumVerification
    )

    // PRACTICE
    this.$socket.on(
      "Practice Notification Document Created",
      this.getPracticeVerification
    )
    this.$socket.on(
      "Practice Notification Document Updated",
      this.getPracticeVerification
    )
    this.$socket.on(
      "Practice Notification Rates Update",
      this.getPracticeVerification
    )
    this.$socket.on(
      "Practice Notification User Update",
      this.getPracticeVerification
    )
    this.$socket.on(
      "Practice Notification Practice Update",
      this.getPracticeVerification
    )
  },
  destroyed () {
    this.removeListener()
  },
  methods: {
    async logout () {
      await this.$auth.logout()
      this.$auth.$storage.setUniversal("_token.local", "")
      this.$router.push("/")
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
    removeListener () {
      // EMAIL DEACTIVATED
      this.$socket.removeListener(
        "Locum Notification Account Deactivated",
        this.userDeactivated
      )
      this.$socket.removeListener(
        "Practice Notification Account Deactivated",
        this.userDeactivated
      )
      // LOCUM
      this.$socket.removeListener(
        "User Notification Email Verified",
        this.getLocumVerification
      )
      this.$socket.removeListener(
        "User Notification Email Pending",
        this.getLocumVerification
      )
      this.$socket.removeListener(
        "Locum Notification Number Pending",
        this.getLocumVerification
      )
      this.$socket.removeListener(
        "Locum Notification Number Rejected",
        this.getLocumVerification
      )
      this.$socket.removeListener(
        "Locum Notification Number Verified",
        this.getLocumVerification
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Approved",
        this.getLocumVerification
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Rejected",
        this.getLocumVerification
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Pending",
        this.getLocumVerification
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Expiring",
        this.getLocumVerification
      )
      this.$socket.removeListener(
        "Locum Notification Compliance Expired",
        this.getLocumVerification
      )

      // PRACTICE
      this.$socket.removeListener(
        "Practice Notification Document Created",
        this.getPracticeVerification
      )
      this.$socket.removeListener(
        "Practice Notification Document Updated",
        this.getPracticeVerification
      )
      this.$socket.removeListener(
        "Practice Notification Rates Update",
        this.getPracticeVerification
      )
      this.$socket.removeListener(
        "Practice Notification User Update",
        this.getPracticeVerification
      )
      this.$socket.removeListener(
        "Practice Notification Practice Update",
        this.getPracticeVerification
      )
    },
    close () {
      this.$store.commit("TOGGLE_SIDEBAR", false)
      document.body.style.overflow = "auto"
    },
    refresh () {
      window.location.reload()
    }
  }
}
</script>

<style>
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
  @media screen and (min-width: 1200px) {
    .content,
    .content-message {
      margin-left: 200px;
    }
  }

  @media screen and (min-width: 480px) {
    .content,
    .content-message {
      padding: 1px 5% 0;
    }
  }

  @media screen and (min-width: 320px) {
    .content,
    .content-message {
      padding: 1px 3% 0;
    }
  }
</style>
