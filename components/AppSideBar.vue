<template>
  <section>
    <div class="sidebar" :class="{'toggled-left': $store.state.toggled_sidebar}">
      <div class="sidebar-nav pt-8 xl:pt-20">
        <button class="close-button cursor-pointer focus:outline-none text-2xl font-bold text-yellow-500 px-4"
                @click="close"
        >
          X
        </button>
        <div v-for="(item, index) in lists" :key="index" class="text-sm relative">
          <span v-if="`/${$route.path.split('/')[1]}` == item.route"
                class="absolute inset-y-0 left-0 border-solid bg-sunglow w-1 h-full"
          />
          <nuxt-link v-if="hasPermissions(item.permissions ? item.permissions : [])" :to="item.route"
                     :event="isDisabled(item.route)" class="block no-underline p-4 transition-hover"
                     :class="`/${$route.path.split('/')[1]}` == item.route ? 'text-sunglow font-bold' : 'hover:text-sunglow hover:font-bold'"
          >
            <span>{{ item.name }}</span>
          </nuxt-link>
        </div>
        <div class="text-sm relative">
          <span v-if="`/${$route.path.split('/')[1]}` == '/sign-out'"
                class="absolute left-0 border-solid bg-sunglow w-1 h-full"
          />
          <button class="block no-underline p-4 transition-hover focus:outline-none"
                  :class="`/${$route.path.split('/')[1]}` == '/sign-out' ? 'text-sunglow font-bold' : 'hover:text-sunglow hover:font-bold'"
                  @click.prevent="signout_modal = true"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
    <AppConfirmationModal :label="'Proceed to sign-out?'" :confirmLabel="'Yes'" :cancelLabel="'Cancel'"
                          :modal="signout_modal" @confirm="logout" @cancel="signout_modal = false"
    />
    <AppConfirmationModal :label="'Your Profile Has Been Deleted, Contact Hubzz For More Info'" :confirmLabel="'Yes'"
                          :modal="confirmation_modal" @confirm="confirm"
    />
  </section>
</template>
<script>
  import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
  export default {
    components: {
      AppConfirmationModal
    },
    data () {
      return {
        signout_modal: false,
        confirmation_modal: false,
        lists: [],
        eligibleToSpoke: false
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
      }
    },

    watch: {
      view_locum_jobs () {
        this.getInit()
      },
      view_permanent_jobs () {
        this.getInit()
      }
    },
    async created () {
      if (
        this.$auth.loggedIn &&
        this.$auth.user.domain === "Practice" &&
        this.$auth.user.practice_detail.practice.type !== "Hub" &&
        this.authPermissions.includes("View Surgery Management")
      ) {
        console.log("practice", this.$auth.user.practice_detail.practice)
        await this.$axios
          .$get(`/api/v1/practice/me/parent-surgery/invitations-count`)
          .then(res => {
            if (res.data.count > 0) {
              this.eligibleToSpoke = true
            }
            console.log("eligible", this.eligibleToSpoke)
            this.getInit()

          })
          .finally(
          )
      } else {
        this.getInit()
        this.$store.dispatch("getViewJobsPermissions")
        console.log(this.view_locum_jobs)
        console.log(this.view_permanent_jobs)
      }
    },

    mounted () {
      this.$loggedOutBroadcastChannel.addEventListener('message', this.loggedOutHandler)
      this.addSocketListener()
    },

    destroyed () {
      this.$loggedOutBroadcastChannel.removeEventListener('message', this.loggedOutHandler)
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

      hasPermissions (permissions) {
        if (permissions && permissions.length) {
          let enable = false
          for (let i = 0; i < permissions.length; i++) {
            if (this.authPermissions.includes(permissions[i])) {
              enable = true
            }
          }
          return enable
        } else {
          return true
        }
      },

      getInit () {
        let domain = this.$auth.user.domain
        let accountStatus = this.$auth.user.status
        let practiceStatus =
          this.$auth.user.domain === "Practice" &&
            this.$auth.user.practice_detail.practice.status
            ? this.$auth.user.practice_detail.practice.status
            : null

        let hubType = ""
        // ============PRACTICE LIST====================
        if (domain === "Practice") {
          if (this.$auth.user.practice_detail.practice.type === "Hub") {
            hubType = this.$auth.user.practice_detail.practice.hub_type
            console.log("hub type", hubType)
          }
        }
        let addedLists = []
        let defaultLists = [
          { name: "Dashboard", route: "/dashboard", order: 1 },
          { name: "Account", route: "/account", order: 2 }
        ]
        let otherLists = [
          { name: "FAQ", route: "/faq" },
          { name: "Terms and Conditions", route: "/terms-and-conditions" },
          { name: "Contact Us", route: "/contact-us" }
        ]
        // let canViewLocumJobs = []
        if (domain === "Practice") {
          addedLists = [
            {
              name: "Profile",
              route: "/profile",
              permissions: ["View Profile Practice"],
              order: 3
            }
          ]
          if (
            ["Active", "Dormant"].includes(accountStatus) &&
            practiceStatus &&
            practiceStatus === "Active"
          ) {
            if (this.$auth.user.practice_detail.practice.type === "Hub") {
              console.log("hub")
              addedLists.push({
                name: "Surgery Management",
                route: "/hub-surgery-management",
                permissions: ["View Surgery Management"],
                order: 4
              })
            }
            if (this.$auth.user.practice_detail.practice.type === "Spoke") {
              console.log("spoke")
              addedLists.push({
                name: "Surgery Management",
                route: "/spoke-surgery-management",
                permissions: ["View Surgery Management"],
                order: 4
              })
            } else if (
              this.$auth.user.practice_detail.practice.type === "Stand Alone" &&
              this.eligibleToSpoke === true
            ) {
              console.log("stand alone")
              addedLists.push({
                name: "Surgery Management",
                route: "/spoke-surgery-management",
                permissions: ["View Surgery Management"],
                order: 4
              })
            }

            // if (this.$auth.user.practice_detail.practice.type !== 'Spoke' ||
            //     (this.$auth.user.practice_detail.practice.type === 'Spoke' &&
            //       !this.$auth.user.practice_detail.practice.parent_practice_id) ||
            //     (this.$auth.user.practice_detail.practice.type === 'Spoke' &&
            //       this.$auth.user.practice_detail.practice.parent_practice_id &&
            //       this.$auth.user.practice_detail.practice.allow_surgery_create_permanent_jobs === true)) {
            //   addedLists.push({ name: "Permanent Jobs", route: "/permanent-jobs" });
            // }

            addedLists.push({
              name: "Permanent Jobs",
              route: "/permanent-jobs",
              permissions: ["View Permanent Job"],
              order: 7
            })

            if (hubType !== "Type 2") {
              addedLists.push({
                name: "My Banks",
                route: "/my-banks",
                order: 5
              })
              addedLists.push({
                name: "Sessions",
                route: "/sessions",
                permissions: ["View Sessions Job"],
                order: 6
              })
              addedLists.push({
                name: "Billing",
                route: "/practice-billing",
                permissions: ["View Sessions Job"],
                order: 8
              })
            }
            addedLists.push({ name: "Invite", route: "/invite", order: 9 })
            addedLists.push({
              name: "Roles and Permissions",
              route: "/roles-and-permissions",
              permissions: ["View Role"],
              order: 10
            })
          }
        }
        // ============ LOCUMS LIST ================
        if (domain === "Locum") {
          addedLists.push({
            name: "Compliance",
            route: "/compliance",
            order: 3
          })
          if (this.view_locum_jobs) {
            addedLists.push({
              name: "Availability",
              route: "/availability",
              order: 4
            })
          }

          if (["Active", "Dormant"].includes(accountStatus)) {
            if (this.view_locum_jobs) {
              addedLists.push({
                name: "My Practice",
                route: "/my-practice",
                order: 5
              })
              addedLists.push({ name: "Jobs", route: "/jobs", order: 6 })
              addedLists.push({
                name: "Billing",
                route: "/locum-billing",
                order: 8
              })
            }
            if (this.view_permanent_jobs) {
              addedLists.push({
                name: "Permanent Jobs",
                route: "/permanent-jobs",
                order: 7
              })
            }
            addedLists.push({ name: "Invite", route: "/invite", order: 9 })
          }
        }

        this.lists = [...defaultLists, ...addedLists, ...otherLists]
        this.list = this.lists.sort((a, b) => a.order - b.order)
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
                text: [`${err.response.data.message}`]
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
                text: [`${err.response.data.message}`]
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
          console.log('err', err)
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
      }
    }
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

  @media screen and (min-width: 1200px) {
    .sidebar {
      z-index: 49;
      margin-left: 0;
    }

    .close-button {
      display: none;
    }
  }
</style>