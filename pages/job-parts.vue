<template>
  <section class="sessions-section">
    <div class="relative flex-col w-full lg:w-1/8 sm:w-1/4">
      <AppLoading :loading="loading" spinner />

      <div class="flex flex-row justify-start overflow-x-auto">
        <div class="flex flex-col mb-2">
          <label for="search" class="text-xs sm:text-sm">Job number</label>

          <div class="flex flex-row justify-start">
            <input
              v-model="search"
              type="text"
              class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full shadow-none"
            >
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="noFoundJob" class="text-xs text-red-500">
              No matching job number
            </div>
          </transition>
        </div>
      </div>

      <div class="flex justify-start">
        <div
          class="bg-yellow-500 hover:text-white cursor-pointer shadow-lg rounded-lg px-2 py-1 font-bold mb-5 min-w-sm"
          @click="findJobNumber"
        >
          Search
        </div>
      </div>
    </div>

    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div v-for="tab in tabs" :key="tab.title" class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="tab.route"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="tab.active ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          {{ tab.title }}
        </nuxt-link>
      </div>
    </div>

    <div class="mt-5">
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
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppLoading from "@/components/Base/AppLoading"

export default {
  transition: (to, from) => {
    if (
      (to.name === 'job-parts-index' && from.name === 'sessions-index')
      || (from.name === 'job-parts-index' && to.name === 'sessions-index')
    ) {
      return {
        name: '',
        mode: 'out-in',
      }
    }
    
    return {
      name: 'page',
      mode: 'out-in',
    }
  },

  middleware: "isVerified",

  components: {
    AppConfirmationModal,
    AppLoading,
  },

  data () {
    return {
      search: null,
      noFoundJob: false,
      loading: false,
      confirmation_modal: false,
      invoiceStatusList: [
        {
          label: "All",
          value: "",
        },
        {
          label: "To Be Invoice",
          value: "To Be Invoice",
        },
        {
          label: "Disputed",
          value: "Disputed",
        },
        {
          label: "Invoiced",
          value: "Invoiced",
        },
      ],
    }
  },

  computed: {
    practice () {
      return this.$auth.loggedIn && this.$auth.user.practice_detail
        ? this.$auth.user.practice_detail.practice
        : null
    },

    authPermissions () {
      return this.$store.getters["permissions"]
    },

    tabs () {
      const { query, } = this.$route

      const { status = "Allocated", } = query

      const tabs = []

      if (this.practice && this.practice.type === "Spoke") {
        tabs.push(
          ...[
            {
              title: "Pending",
              route: {
                name: "sessions-index",
                query: {
                  status: "Pending",
                },
              },
              active: status && status.toLowerCase() === "Pending".toLowerCase(),
            },
          ]
        )
      }

      tabs.push(
        ...[
          {
            title: "Allocated",
            route: {
              name: "job-parts-index",
              query: {
                status: "Allocated",
              },
            },
            active: status && status.toLowerCase() === "Allocated".toLowerCase(),
          },
          {
            title: "Ongoing",
            route: {
              name: "job-parts-index",
              query: {
                status: "Ongoing",
              },
            },
            active: status && status.toLowerCase() === "Ongoing".toLowerCase(),
          },
          {
            title: "Live",
            route: {
              name: "sessions-index",
              query: {
                status: "Live",
              },
            },
            active: status && status.toLowerCase() === "Live".toLowerCase(),
          },
          {
            title: "Applied",
            route: {
              name: "sessions-index",
              query: {
                status: "Applied",
              },
            },
            active: status && status.toLowerCase() === "Applied".toLowerCase(),
          },
          {
            title: "Unfilled",
            route: {
              name: "sessions-index",
              query: {
                status: "Unfilled",
              },
            },
            active: status && status.toLowerCase() === "Unfilled".toLowerCase(),
          },
          {
            title: "Withdrawn",
            route: {
              name: "job-parts-index",
              query: {
                status: "Withdrawn",
              },
            },
            active: status && status.toLowerCase() === "Withdrawn".toLowerCase(),
          },
          {
            title: "Cancelled",
            route: {
              name: "job-parts-index",
              query: {
                status: "Cancelled",
              },
            },
            active: status && status.toLowerCase() === "Cancelled".toLowerCase(),
          },
          {
            title: "Completed",
            route: {
              name: "job-parts-index",
              query: {
                status: "Completed",
              },
            },
            active: status && status.toLowerCase() === "Completed".toLowerCase(),
          },
          {
            title: "Approved",
            route: {
              name: "job-parts-index",
              query: {
                status: "Approved",
              },
            },
            active: status && status.toLowerCase() === "Approved".toLowerCase(),
          },
        ]
      )

      return tabs
    },
  },

  watch: {
    authPermissions (value) {
      if (!this.CheckPermissions(value).hasPermission) {
        this.confirmation_modal = true
      }
    },
  },

  methods: {
    goTo () {
      this.confirmation_modal = false
      setTimeout(() => {
        this.$router.push("/")
      }, 500)
    },

    async findJobNumber () {
      if (!this.search) {
        return
      }

      this.loading = true

      let resJob = await this.findJob()
      let resJobPart = await this.findJobParts()
      let job = null
      let urlPath = null
      this.noFoundJob = false

      this.loading = false

      if (resJob.length > 0) {
        job = resJob[0]
        urlPath = `/sessions/${job.id}`
      }

      if (resJobPart.length > 0) {
        job = resJobPart[0]
        urlPath = `/sessions/${job.job.id}/job-parts/${job.id}`
      }

      if (resJob.length > 0 || resJobPart.length > 0) {
        this.$router.push({
          path: `/sessions`,
          query: { status: job.status, },
        })

        setTimeout(() => {
          this.$router.push({
            path: urlPath,
            query: { status: job.status, },
          })
        }, 500)
      }

      if (resJob.length === 0 && resJobPart.length === 0) {
        this.noFoundJob = true
      }
    },

    findJob () {
      return this.$axios
        .$get(`/api/v1/practice/jobs`, {
          params: {
            status: ["Pending", "Allocated", "Live", "Applied", "Unfilled",],
            job_number: this.search,
          },
        })
        .then(res => {
          return res.data.jobs
        })
        .catch(err => {
          console.log("job err", err.response)
          return []
        })
    },

    findJobParts () {
      return this.$axios
        .$get(`/api/v1/practice/job-parts`, {
          params: {
            status: [
              "Ongoing",
              "Withdrawn",
              "Cancelled",
              "Completed",
              "Approved",
              "Terminated",
            ],
            job_part_number: this.search,
          },
        })
        .then(res => {
          return res.data.job_parts
        })
        .catch(err => {
          console.log("job part err", err.response)
          return []
        })
    },
    
  },
}
</script>
