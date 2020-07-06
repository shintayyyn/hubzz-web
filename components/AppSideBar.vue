<template>
  <section>
    <div class="sidebar" :class="{'toggled-left': $store.state.toggled_sidebar}">
      <div class="sidebar-nav pt-8 xl:pt-20">
        <button
          class="close-button cursor-pointer focus:outline-none text-2xl font-bold text-yellow-500 px-4"
          @click="close"
        >
          X
        </button>

        <div v-for="(item, index) in lists" :key="index" class="text-sm relative">
          <span
            v-if="`/${$route.path.split('/')[1]}` == item.route"
            class="absolute inset-y-0 left-0 border-solid bg-sunglow w-1 h-full"
          />

          <nuxt-link
            :to="item.route"
            :event="isDisabled(item.route)"
            class="block no-underline p-4 transition-hover"
            :class="`/${$route.path.split('/')[1]}` == item.route ? 'text-sunglow font-bold' : 'hover:text-sunglow hover:font-bold'"
          >
            <span>{{ item.name }}</span>
          </nuxt-link>
        </div>

        <div class="text-sm relative">
          <span
            v-if="`/${$route.path.split('/')[1]}` == '/sign-out'"
            class="absolute left-0 border-solid bg-sunglow w-1 h-full"
          />

          <button
            class="block no-underline p-4 transition-hover focus:outline-none"
            :class="`/${$route.path.split('/')[1]}` == '/sign-out' ? 'text-sunglow font-bold' : 'hover:text-sunglow hover:font-bold'"
            @click.prevent="signout_modal = true"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Proceed to sign-out?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="signout_modal"
      @confirm="logout"
      @cancel="signout_modal = false"
    />

    <AppConfirmationModal
      :label="'Your Profile Has Been Deleted, Contact Hubzz For More Info'"
      :confirmLabel="'Yes'"
      :modal="confirmation_modal"
      @confirm="confirm"
    />
  </section>
</template>

<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"

export default {
  components: {
    AppConfirmationModal,
  },

  data () {
    return {
      signout_modal: false,
      confirmation_modal: false,
      lists: [],
      eligibleToSpoke: false,
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
    view_locum_jobs () {
      return this.$store.getters["getViewLocumJobs"]
    },
    view_permanent_jobs () {
      return this.$store.getters["getViewPermanentJobs"]
    },
  },

  watch: {
    view_locum_jobs () {
      this.getInit()
    },
    view_permanent_jobs () {
      this.getInit()
    },
  },

  async created () {
    if (
      this.$auth.loggedIn &&
      this.$auth.user.domain === "Practice" &&
      this.$auth.user.practice_detail.practice.type === "Stand Alone" &&
      this.authPermissions.includes("View Surgery Management")
    ) {
      let hasHubInvitation = false
      let hasSpokeInvitation = false

      await this.$axios
        .$get(`/api/v1/practice/me/parent-surgery/invitations-count`)
        .then(res => {
          hasHubInvitation = res.data.count > 0
        })

      await this.$axios
        .$get(`/api/v1/practice/me/practice-surgeries/spoke-invitations/count`)
        .then(res => {
          hasSpokeInvitation = res.data.count > 0
        })

      this.eligibleToSpoke = hasHubInvitation || hasSpokeInvitation
      this.getInit()
    } else {
      this.getInit()
      this.$store.dispatch("getViewJobsPermissions")
      console.log(this.view_locum_jobs)
      console.log(this.view_permanent_jobs)
    }
  },

  mounted () {
    this.$loggedOutBroadcastChannel.addEventListener(
      "message",
      this.loggedOutHandler
    )
    this.addSocketListener()
  },

  destroyed () {
    this.$loggedOutBroadcastChannel.removeEventListener(
      "message",
      this.loggedOutHandler
    )
    this.removeSocketListener()
  },

  methods: {
    addSocketListener () {
      this.$socket.removeListener(
        "Practice Notification Update Profile",
        this.updatePermissions
      )
      this.$socket.removeListener(
        "Practice Notification Delete Profile",
        this.toggleConfirmationModal
      )
    },

    removeSocketListener () {
      this.$socket.removeListener(
        "Practice Notification Update Profile",
        this.updatePermissions
      )
      this.$socket.removeListener(
        "Practice Notification Delete Profile",
        this.toggleConfirmationModal
      )
    },

    toggleConfirmationModal () {
      this.confirmation_modal = true
    },

    updatePermissions (user) {
      if (
        user &&
        user.practice_detail &&
        user.practice_detail.permissions &&
        user.practice_detail.permissions.length > 0
      ) {
        this.$store.commit(
          "SET_PERMISSIONS",
          user.practice_detail.role.permissions
        )
      } else {
        this.$store.commit("SET_PERMISSIONS", [])
      }
    },

    getInit () {
      const user = this.$auth.user

      const { domain, status: accountStatus, } = user

      if (domain === "Locum") {
        const locumTabList = []

        locumTabList.push({
          name: "Dashboard",
          route: "/dashboard",
        })

        locumTabList.push({
          name: "Account",
          route: "/account",
        })

        locumTabList.push({
          name: "Compliance",
          route: "/compliance",
        })

        if (this.view_locum_jobs) {
          locumTabList.push({
            name: "Availability",
            route: "/availability",
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus) &&
          this.view_locum_jobs
        ) {
          locumTabList.push({
            name: "My Practice",
            route: "/my-practice",
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus) &&
          this.view_locum_jobs
        ) {
          locumTabList.push({
            name: "Jobs",
            route: "/jobs",
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus) &&
          this.view_permanent_jobs
        ) {
          locumTabList.push({
            name: "Permanent Jobs",
            route: "/permanent-jobs",
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus) &&
          this.view_locum_jobs
        ) {
          locumTabList.push({
            name: "Billing",
            route: "/locum-billing",
          })
        }

        if (["Active", "Dormant",].includes(accountStatus)) {
          locumTabList.push({
            name: "Reports",
            route: "/locum-reports",
          })
        }

        locumTabList.push({
          name: "Invite",
          route: "/invite",
        })

        locumTabList.push({
          name: "FAQ",
          route: "/faq",
        })

        locumTabList.push({
          name: "Terms and Conditions",
          route: "/terms-and-conditions",
        })

        locumTabList.push({
          name: "Contact Us",
          route: "/contact-us",
        })

        this.lists = locumTabList
        return
      }

      if (domain === "Practice") {
        const practiceUser = this.$auth.user

        const practice = practiceUser.practice_detail ?
          practiceUser.practice_detail.practice :
          null

        const {
          status: practiceStatus = null,
          type: practiceType = null,
          hub_type: hubType = null,
        } = practice || {}

        const practiceTabList = []

        practiceTabList.push({
          name: "Dashboard",
          route: "/dashboard",
        })

        practiceTabList.push({
          name: "Account",
          route: "/account",
        })

        if (this.authPermissions.includes("View Profile Practice")) {
          practiceTabList.push({
            name: "Profile",
            route: "/profile",
          })
        } else if (this.authPermissions.includes("View Profile Users")) {
          practiceTabList.push({
            name: "Profile",
            route: "/profile/users",
          })
        }

        if (
          accountStatus === "Active" &&
          ["Active", "Dormant",].includes(practiceStatus) &&
          practiceType === "Hub" &&
          this.authPermissions.includes("View Surgery Management")
        ) {
          practiceTabList.push({
            name: "Surgery Management",
            route: "/hub-surgery-management",
          })
        }

        if (
          accountStatus === "Active" &&
          ["Active", "Dormant",].includes(practiceStatus) &&
          practiceType === "Spoke" &&
          this.authPermissions.includes("View Surgery Management")
        ) {
          practiceTabList.push({
            name: "Surgery Management",
            route: "/spoke-surgery-management",
          })
        }

        if (
          accountStatus === "Active" &&
          ["Active", "Dormant",].includes(practiceStatus) &&
          practiceType === "Stand Alone" &&
          this.authPermissions.includes("View Surgery Management") &&
          this.eligibleToSpoke
        ) {
          practiceTabList.push({
            name: "Surgery Management",
            route: "/spoke-surgery-management",
          })
        }

        if (
          accountStatus === "Active" &&
          ["Active", "Dormant",].includes(practiceStatus) &&
          hubType !== "Type 2"
        ) {
          practiceTabList.push({
            name: "My Banks",
            route: "/my-banks",
          })
        }

        if (
          accountStatus === "Active" &&
          ["Active", "Dormant",].includes(practiceStatus) &&
          this.authPermissions.includes("View Sessions Job") &&
          hubType !== "Type 2"
        ) {
          practiceTabList.push({
            name: "Sessions",
            route: "/sessions",
          })
        }

        if (
          accountStatus === "Active" &&
          ["Active", "Dormant",].includes(practiceStatus) &&
          this.authPermissions.includes("View Permanent Job")
        ) {
          practiceTabList.push({
            name: "Permanent Jobs",
            route: "/permanent-jobs",
          })
        }

        if (
          accountStatus === "Active" &&
          ["Active", "Dormant",].includes(practiceStatus) &&
          this.authPermissions.includes("View Sessions Job") &&
          this.authPermissions.includes("View Billings") &&
          hubType !== "Type 2"
        ) {
          practiceTabList.push({
            name: "Billing",
            route: "/practice-billing",
          })
        }

        if (
          accountStatus === "Active" &&
          ["Active", "Dormant",].includes(practiceStatus)
        ) {
          practiceTabList.push({
            name: "Reports",
            route: "/practice-reports",
          })
        }

        practiceTabList.push({
          name: "Invite",
          route: "/invite",
        })

        if (
          accountStatus === "Active" &&
          ["Active", "Dormant",].includes(practiceStatus) &&
          this.authPermissions.includes("View Role")
        ) {
          practiceTabList.push({
            name: "Roles and Permissions",
            route: "/roles-and-permissions",
          })
        }

        practiceTabList.push({
          name: "FAQ",
          route: "/faq",
        })

        practiceTabList.push({
          name: "Terms and Conditions",
          route: "/terms-and-conditions",
        })

        practiceTabList.push({
          name: "Contact Us",
          route: "/contact-us",
        })

        this.lists = practiceTabList
        return
      }
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

    async confirm () {
      await this.$auth.logout()
      this.$auth.$storage.setUniversal("_token.local", "")
      this.$router.push("/")
    },

    isDisabled (routeName) {
      return this.$route.path.includes(routeName) ? "" : "click"
    },

    close () {
      this.$store.commit("TOGGLE_SIDEBAR", false)
      document.body.style.overflow = "auto"
    },
  },
}
</script>

<style scoped>
.shield {
  z-index: 599;
}

.sidebar {
  position: fixed;
  margin-left: -200px;
  width: 200px;
  height: 100%;
  overflow: auto;
  border-right: solid 1px#ccc;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 55;
}

.toggled-left {
  margin-left: 0;
}

.close-button {
  display: block;
}

@media screen and (min-width: 1280px) {
  .sidebar {
    z-index: 49;
    margin-left: 0;
  }

  .close-button {
    display: none;
  }
}
</style>
