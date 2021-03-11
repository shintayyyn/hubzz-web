<template>
    <div class="w-full">
      <!-- <div>
        <svgicon
          name="left-arrow"
          height="32"
          width="32"
          class="mb-2 cursor-pointer"
          @click="$router.push('/hub-surgery-management')"
        />
      </div> -->

      <div 
        v-if="!$route.params.permJobId && !$route.params.invoiceId && !$route.params.locumId && !$route.params.jobId && !$route.params.sessionId && !$route.params.jobPartId" 
        class="flex overflow-x-auto border-b border-sunglow"
      >
        <nuxt-link
          v-if="relationshipIsActive == 'Active' && authPermissions.includes('View Surgery Management')"
          :to="{ path: `/hub-surgery-management/${$route.params.id}`}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id' ? 'border-b-4 border-sunglow' : 'text-gray-600'"
        >
          Surgery Profile
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active' && authPermissions.includes('View Surgery Sessions')"
          :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-sessions` }"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-sessions' || $route.name.includes('hub-surgery-management-id-surgery-sessions-index') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
        >
          Surgery Sessions
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active' && authPermissions.includes('View Surgery Billings')"
          :to="{path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums`, query: {...$route.query}}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-billings' || $route.name.includes('hub-surgery-management-id-surgery-billings') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
        >
          Surgery Billing
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active' && authPermissions.includes('View Surgery Banks')"
          :to="{path: `/hub-surgery-management/${$route.params.id}/surgery-banks`, query: {...$route.query}}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-banks' ? 'border-b-4 border-sunglow'	: 'text-gray-600'"
        >
          Surgery Banks
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active' && authPermissions.includes('View Surgery Permanent Jobs')"
          :to="{path: `/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs`}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-permanent-jobs-index' ? 'border-b-4 border-sunglow'	: 'text-gray-600'"
        >
          Surgery Salaried Roles
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active' && authPermissions.includes('Request for Termination Surgery Management')"
          :to="{ path: `/hub-surgery-management/${$route.params.id}/request-for-termination`, query: {...$route.query}}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-request-for-termination' ? 'border-b-4 border-sunglow'	: 'text-gray-600'"
        >
          Request For Termination
        </nuxt-link>
      </div>

      <nuxt-child
        :practiceSurgery="practiceSurgery"
        @updateSurgery="updateSurgeryHandler"
      />
    </div>
</template>

<script>
export default {
  data () {
    return {
      practiceSurgery: "",
      surgeryManagementPermissions: [],
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },

    relationshipIsActive () {
      if (
        this.practiceSurgery.invitation_accepted_at
        || this.practiceSurgery.termination_requested_at
      ) {
        return 'Active'
      }

      if (
        this.practiceSurgery.invitation_rejected_at
        || this.practiceSurgery.terminated_at
      ) {
        return 'Inactive'
      }

      return ''
    },
  },

  async asyncData ({ app, params, error, }) {
    try {
      const response = await app.$axios.get(`/api/v1/practice/me/practice-surgeries/${params.id}`)

      const practiceSurgery = response.data.data.practice_surgery

      return {
        practiceSurgery,
      }
    } catch (err) {
      return error(err)
    }
  },

  created () {
    this.surgeryManagementPermissions = this.authPermissions.filter(item => item.includes('View Surgery'))
    let toRedirect = ''
    if (this.surgeryManagementPermissions.find(item => item === 'View Surgery Management') === undefined) {
      console.log('redirecting')
      switch (this.surgeryManagementPermissions[0]) {
      case "View Surgery Sessions":
        toRedirect = "surgery-sessions"
        break
      case "View Surgery Billings":
        toRedirect = "surgery-billings/invoices-from-locums"
        break
      case "View Surgery Banks":
        toRedirect = "surgery-banks"
        break
      case "View Surgery Permanent Jobs":
        toRedirect = "surgery-permanent-jobs"
        break
      default:
        toRedirect = ''
      }
      this.$router.push(`/hub-surgery-management/${this.$route.params.id}/${toRedirect}`)
    }
  },

  methods: {
    getPracticeSurgery () {
      this.$axios.get(`/api/v1/practice/me/practice-surgeries/${this.$route.params.id}`).then((response) => {
        this.practiceSurgery = response.data.data.practice_surgery
      })
    },

    updateSurgeryHandler () {
      this.getPracticeSurgery()
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
      width: 80%;
    }
  }
</style>
