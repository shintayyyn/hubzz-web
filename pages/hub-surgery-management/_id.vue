<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 w-full">
      <div>
        <svgicon
          name="left-arrow"
          height="32"
          width="32"
          class="mb-2 cursor-pointer"
          @click="$router.push('/hub-surgery-management')"
        />
      </div>

      <div class="flex overflow-x-auto">
        <nuxt-link
          :to="{ path: `/hub-surgery-management/${$route.params.id}`}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          Surgery Profile
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active' && authPermissions.includes('View Sessions Job')"
          :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-sessions` }"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-sessions' || $route.name.includes('hub-surgery-management-id-surgery-sessions-index') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          Surgery Sessions
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active' && authPermissions.includes('View Sessions Job') && authPermissions.includes('View Billings')"
          :to="{path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums`, query: {...$route.query}}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-billings' || $route.name.includes('hub-surgery-management-id-surgery-billings') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          Surgery Billing
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active'"
          :to="{path: `/hub-surgery-management/${$route.params.id}/surgery-banks`, query: {...$route.query}}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-banks' ? 'border rounded-lg border-yellow-500 bg-yellow-500'	: 'text-gray-600'"
        >
          Surgery Banks
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active' && authPermissions.includes('View Permanent Job')"
          :to="{path: `/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs`, query: {...$route.query}}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-permanent-jobs-index' ? 'border rounded-lg border-yellow-500 bg-yellow-500'	: 'text-gray-600'"
        >
          Surgery Permanent Jobs
        </nuxt-link>

        <nuxt-link
          v-if="relationshipIsActive == 'Active'"
          :to="{ path: `/hub-surgery-management/${$route.params.id}/request-for-termination`, query: {...$route.query}}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-request-for-termination' ? 'border rounded-lg border-yellow-500 bg-yellow-500'	: 'text-gray-600'"
        >
          Request For Termination
        </nuxt-link>
      </div>

      <nuxt-child
        :practiceSurgery="practiceSurgery"
        @updateSurgery="updateSurgeryHandler"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      practiceSurgery: "",
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
