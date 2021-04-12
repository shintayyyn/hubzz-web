<template>
  <section>
    <div class="sidebar relative" :class="{'toggled-left': $store.state.toggled_sidebar}">
      <div class="sidebar-nav pt-8 xl:pt-10">
        <div class="flex flex-row justify-center pb-4">
          <div class="flex justify-center">
            <img src="~/assets/images/hubzz_logo.png" class="w-3/5">
          </div>
          
          <button
            class="absolute top-0 right-0 my-2 mx-3 close-button cursor-pointer focus:outline-none text-2xl font-bold text-sunglow hover:text-sunglow-dark transition-hover"
            @click="close"
          >
            <svgicon name="times-solid" class="fill-current" width="18" />
          </button>
        </div>
        

        <div v-for="(navigationTab, index) in navigationTabs" :key="index" class="text-sm relative">
          <span v-if="navigationTab.active" class="absolute ml-3 mt-4 bg-sunglow p-1.5 h-1.5 rounded-sm" />

          <nuxt-link
            :to="navigationTab.route"
            :event="$route.path.includes(navigationTab.route) ? '' : 'click'"
            class="block no-underline pl-4 py-3 mx-4 transition-hover"
            :class="navigationTab.active ? 'text-white font-bold' : 'text-gray-500 hover:text-white hover:font-bold'"
          >
            <span>{{ navigationTab.navigationTabTitle }}</span>
          </nuxt-link>
        </div>

        <div class="text-sm relative ml-4">
          <button
            class="block no-underline p-4 transition-hover focus:outline-none text-gray-500 hover:text-white hover:font-bold"
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
      user: null,
      signout_modal: false,
      confirmation_modal: false,
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

    navigationTabs () {
      if (!this.user) {
        return []
      }

      const { domain, status: accountStatus, } = this.user

      if (domain === "Locum") {
        const locumTabList = []

        locumTabList.push({
          navigationTabTitle: "Dashboard",
          route: "/dashboard",
          active: `/${this.$route.path.split('/')[1]}` === '/dashboard',
        })

        locumTabList.push({
          navigationTabTitle: "Profile",
          route: "/account",
          active: `/${this.$route.path.split('/')[1]}` === '/account',
        })

        locumTabList.push({
          navigationTabTitle: "Compliance",
          route: "/compliance",
          active: `/${this.$route.path.split('/')[1]}` === '/compliance',
        })

        if (this.view_locum_jobs) {
          locumTabList.push({
            navigationTabTitle: "Availability",
            route: "/availability",
            active: `/${this.$route.path.split('/')[1]}` === '/availability',
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus)
          && this.view_locum_jobs
        ) {
          locumTabList.push({
            navigationTabTitle: "My Practice",
            route: "/my-practice",
            active: `/${this.$route.path.split('/')[1]}` === '/my-practice',
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus)
          && this.view_locum_jobs
        ) {
          // locumTabList.push({
          //   navigationTabTitle: "Jobs",
          //   route: "/jobs",
          //   active: `/${this.$route.path.split('/')[1]}` === '/jobs' || `/${this.$route.path.split('/')[1]}` === '/locum-job-parts',
          // })

          locumTabList.push({
            navigationTabTitle: "Jobs",
            route: "/locum-job-parts",
            active:['/jobs','/locum-job-parts' ,'/locum-job-reports',].includes(`/${this.$route.path.split('/')[1]}`),
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus)
          && this.view_permanent_jobs
        ) {
          locumTabList.push({
            navigationTabTitle: "Salaried Roles",
            route: "/permanent-jobs",
            active: `/${this.$route.path.split('/')[1]}` === '/permanent-jobs',
          })
        }

        if (
          ["Active", "Dormant",].includes(accountStatus)
          && this.view_locum_jobs
        ) {
          locumTabList.push({
            navigationTabTitle: "Billing",
            route: "/locum-billing",
            active: `/${this.$route.path.split('/')[1]}` === '/locum-billing'
              || this.$route.name === 'locum-billing-form-as'
              || this.$route.name === 'locum-billing-solo-forms'

              || this.$route.name.includes('locum-billing-private-to-be-invoiced')
              || this.$route.name.includes('locum-billing-private-invoiced')
              || this.$route.name.includes('locum-billing-private-invoices')
              || this.$route.name.includes('locum-billing-private-solo-forms')
              || this.$route.name.includes('locum-billing-private-form-as')
              || this.$route.name.includes('locum-billing-private-form-bs')

              || `/${this.$route.path.split('/')[1]}` === '/locum-billing-reports',
          })
        }

        // if (["Active", "Dormant",].includes(accountStatus)) {
        //   locumTabList.push({
        //     navigationTabTitle: "Reports",
        //     route: "/locum-reports",
        //     active: `/${this.$route.path.split('/')[1]}` === '/locum-reports',
        //   })
        // }

        locumTabList.push({
          navigationTabTitle: "Invite",
          route: "/invite",
          active: `/${this.$route.path.split('/')[1]}` === '/invite',
        })

        locumTabList.push({
          navigationTabTitle: "FAQs",
          route: "/faq",
          active: `/${this.$route.path.split('/')[1]}` === '/faq',
        })

        locumTabList.push({
          navigationTabTitle: "Terms and Conditions",
          route: "/terms-and-conditions",
          active: `/${this.$route.path.split('/')[1]}` === '/terms-and-conditions',
        })

        locumTabList.push({
          navigationTabTitle: "Contact Us",
          route: "/contact-us",
          active: `/${this.$route.path.split('/')[1]}` === '/contact-us',
        })

        return locumTabList
      }

      if (domain === "Practice") {
        const practiceUser = this.$auth.user

        const practice = practiceUser.practice_detail
          ? practiceUser.practice_detail.practice
          : null

        const {
          status: practiceStatus = null,
          type: practiceType = null,
          hub_type: hubType = null,
          parent_practice_id: parentPracticeId = null,
        } = practice || {}

        const practiceTabList = []

        practiceTabList.push({
          navigationTabTitle: "Dashboard",
          route: "/dashboard",
          active: `/${this.$route.path.split('/')[1]}` === '/dashboard',
        })

        practiceTabList.push({
          navigationTabTitle: "Account",
          route: "/account",
          active: `/${this.$route.path.split('/')[1]}` === '/account',
        })

        if (this.authPermissions.includes("View Profile Practice")) {
          practiceTabList.push({
            navigationTabTitle: "Profile",
            route: "/profile",
            active: `/${this.$route.path.split('/')[1]}` === '/profile',
          })
        } else if (this.authPermissions.includes("View Profile Users")) {
          practiceTabList.push({
            navigationTabTitle: "Profile",
            route: "/profile/users",
            active: `/${this.$route.path.split('/')[1]}` === '/profile',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && practiceType === "Hub"
          && (this.authPermissions.includes("View Surgery Management") 
              || this.authPermissions.includes("View Surgery Sessions")
              || this.authPermissions.includes("View Surgery Billings")
              || this.authPermissions.includes("View Surgery Banks")
              || this.authPermissions.includes("View Surgery Permanent Jobs")
          )
        ) {
          practiceTabList.push({
            navigationTabTitle: "Surgery Management",
            route: "/hub-surgery-management",
            active: `/${this.$route.path.split('/')[1]}` === '/hub-surgery-management',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && practiceType === "Spoke"
          && (this.authPermissions.includes("View Surgery Management")
              || this.authPermissions.includes("View Surgery Sessions")
              || this.authPermissions.includes("View Surgery Billings")
              || this.authPermissions.includes("View Surgery Banks")
              || this.authPermissions.includes("View Surgery Permanent Jobs")
          )
        ) {
          practiceTabList.push({
            navigationTabTitle: "Surgery Management",
            route: "/spoke-surgery-management",
            active: `/${this.$route.path.split('/')[1]}` === '/spoke-surgery-management',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && practiceType === "Stand Alone"
          && (this.authPermissions.includes("View Surgery Management")
              || this.authPermissions.includes("View Surgery Sessions")
              || this.authPermissions.includes("View Surgery Billings")
              || this.authPermissions.includes("View Surgery Banks")
              || this.authPermissions.includes("View Surgery Permanent Jobs")
          )
          && this.eligibleToSpoke
        ) {
          practiceTabList.push({
            navigationTabTitle: "Surgery Management",
            route: "/spoke-surgery-management",
            active: `/${this.$route.path.split('/')[1]}` === '/spoke-surgery-management',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && hubType !== "Type 2"
          && this.authPermissions.includes("View My Banks")
        ) {
          practiceTabList.push({
            navigationTabTitle: "My Banks",
            route: "/my-banks",
            active: ['/my-banks', '/my-banks-reports',].includes(`/${this.$route.path.split('/')[1]}`),
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && hubType !== "Type 2"
          && (this.authPermissions.includes("View My Banks") === false && this.authPermissions.includes("View Practice Reports"))
        ) {
          practiceTabList.push({
            navigationTabTitle: "My Banks (Reports Only)",
            route: "/my-banks-reports",
            active: `/${this.$route.path.split('/')[1]}` === '/my-banks-reports',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && this.authPermissions.includes("View Sessions Job")
          && hubType !== "Type 2"
        ) {
          // practiceTabList.push({
          //   navigationTabTitle: "Sessions",
          //   route: "/sessions",
          //   active: `/${this.$route.path.split('/')[1]}` === '/sessions' || `/${this.$route.path.split('/')[1]}` === '/job-parts',
          // })

          practiceTabList.push({
            navigationTabTitle: "Sessions",
            route: "/job-parts",
            active: ['/sessions', '/job-parts', '/practice-job-reports',].includes(`/${this.$route.path.split('/')[1]}`) ,
          })
        }
        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && (this.authPermissions.includes("View Sessions Job") === false && this.authPermissions.includes("View Practice Reports"))
          && hubType !== "Type 2"
        ) {

          practiceTabList.push({
            navigationTabTitle: "Sessions (Reports Only)",
            route: "/practice-job-reports",
            active: `/${this.$route.path.split('/')[1]}` === '/practice-job-reports',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && this.authPermissions.includes("View Permanent Job")
        ) {
          practiceTabList.push({
            navigationTabTitle: "Salaried Roles",
            route: "/permanent-jobs",
            active: `/${this.$route.path.split('/')[1]}` === '/permanent-jobs',
          })
        }

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && this.authPermissions.includes("View Billings")
          && hubType !== "Type 2"
        ) {
          practiceTabList.push({
            navigationTabTitle: "Billing",
            route: "/practice-billing",
            active: `/${this.$route.path.split('/')[1]}` === '/practice-billing'
              || this.$route.name === 'practice-billing-form-as'
              || `/${this.$route.path.split('/')[1]}` === '/practice-billing-reports',
          })
        }
        
        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && (["Hub", "Stand Alone",].includes(practiceType) 
              || (practiceType === 'Spoke' && parentPracticeId !== null))
          && (this.authPermissions.includes("View Billings") === false && this.authPermissions.includes("View Practice Reports"))
          && hubType !== "Type 2"
        ) {
          practiceTabList.push({
            navigationTabTitle: "Billing (Reports Only)",
            route: "/practice-billing-reports",
            active: `/${this.$route.path.split('/')[1]}` === '/practice-billing-reports',
          })
        }

        // if (
        //   accountStatus === "Active"
        //   && ["Active", "Dormant",].includes(practiceStatus)
        //   && (["Hub", "Stand Alone",].includes(practiceType) 
        //     || (practiceType === 'Spoke' && parentPracticeId !== null))
        // ) {
        //   practiceTabList.push({
        //     navigationTabTitle: "Reports",
        //     route: "/practice-reports",
        //     active: `/${this.$route.path.split('/')[1]}` === '/practice-reports',
        //   })
        // }

        practiceTabList.push({
          navigationTabTitle: "Invite",
          route: "/invite",
          active: `/${this.$route.path.split('/')[1]}` === '/invite',
        })

        if (
          accountStatus === "Active"
          && ["Active", "Dormant",].includes(practiceStatus)
          && this.authPermissions.includes("View Role")
        ) {
          practiceTabList.push({
            navigationTabTitle: "Roles and Permissions",
            route: "/roles-and-permissions",
            active: `/${this.$route.path.split('/')[1]}` === '/roles-and-permissions',
          })
        }

        practiceTabList.push({
          navigationTabTitle: "FAQs",
          route: "/faq",
          active: `/${this.$route.path.split('/')[1]}` === '/faq',
        })

        practiceTabList.push({
          navigationTabTitle: "Terms and Conditions",
          route: "/terms-and-conditions",
          active: `/${this.$route.path.split('/')[1]}` === '/terms-and-conditions',
        })

        practiceTabList.push({
          navigationTabTitle: "Contact Us",
          route: "/contact-us",
          active: `/${this.$route.path.split('/')[1]}` === '/contact-us',
        })

        return practiceTabList
      }

      return []
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
      this.$auth.loggedIn
      && this.$auth.user.domain === "Practice"
      && this.$auth.user.practice_detail.practice.type === "Stand Alone"
      && this.authPermissions.includes("View Surgery Management")
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
      this.$socket.removeListener('Practice Notification Update Profile', this.updatePermissions)
      this.$socket.removeListener('Practice Notification Delete Profile', this.toggleConfirmationModal)
    },

    removeSocketListener () {
      this.$socket.removeListener('Practice Notification Update Profile', this.updatePermissions)
      this.$socket.removeListener('Practice Notification Delete Profile', this.toggleConfirmationModal)
    },

    toggleConfirmationModal () {
      this.confirmation_modal = true
    },

    updatePermissions (user) {
      if (
        user
        && user.practice_detail
        && user.practice_detail.permissions
        && user.practice_detail.permissions.length > 0
      ) {
        this.$store.commit("SET_PERMISSIONS", user.practice_detail.role.permissions)
      } else {
        this.$store.commit("SET_PERMISSIONS", [])
      }
    },

    getInit () {
      this.user = this.$auth.user
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
  background-color: rgb(2, 4, 12);
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
