<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 w-full">
      <div>
        <svgicon
          name="left-arrow"
          height="32"
          width="32"
          @click="$router.push('/hub-surgery-management')"
          class="mb-2 cursor-pointer"
        />
      </div>
      <div class="flex overflow-x-auto">
        <nuxt-link
          :to="{ path: `/hub-surgery-management/${$route.params.id}` }"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Surgery Profile</nuxt-link>
        <nuxt-link
          v-if="relationshipIsActive == 'Active' "
          :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-sessions` }"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-sessions' || $route.name.includes('hub-surgery-management-id-surgery-sessions-index') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Surgery Sessions</nuxt-link>
        <nuxt-link
          v-if="relationshipIsActive == 'Active' && 
            (practice_surgery.allow_surgery_bill_locum === false || 
            practice_surgery.allow_surgery_bill_hubzz === false ||
            practice_surgery.allow_surgery_bill_locum === 0 ||
            practice_surgery.allow_surgery_bill_hubzz === 0)"
          :to="{path: `/hub-surgery-management/${$route.params.id}/surgery-billings/invoices-from-locums`, query: {...$route.query}}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-billings' || $route.name.includes('hub-surgery-management-id-surgery-billings') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Surgery Billing</nuxt-link>
        <nuxt-link
          v-if="relationshipIsActive == 'Active'"
          :to="{path: `/hub-surgery-management/${$route.params.id}/surgery-banks`, query: {...$route.query}}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-banks' ? 'border rounded-lg border-yellow-500 bg-yellow-500'	: 'text-gray-600'"
        >Surgery Banks</nuxt-link>
        <nuxt-link
          v-if="relationshipIsActive == 'Active'"
          :to="{path: `/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs`, query: {...$route.query}}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-surgery-permanent-jobs-index' ? 'border rounded-lg border-yellow-500 bg-yellow-500'	: 'text-gray-600'"
        >Surgery Permanent Jobs</nuxt-link>
        <nuxt-link
          v-if="relationshipIsActive == 'Active'"
          :to="{ path: `/hub-surgery-management/${$route.params.id}/request-for-termination`, query: {...$route.query}}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'hub-surgery-management-id-request-for-termination' ? 'border rounded-lg border-yellow-500 bg-yellow-500'	: 'text-gray-600'"
        >Request For Termination</nuxt-link>
      </div>
      <nuxt-child :practiceSurgery="practice_surgery" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      practice_surgery_id: "",
      practice_surgery: ""
    };
  },
  async asyncData({ app, route, store, params, error }) {
    try {
      const practice_surgery_id = params.id;
      const response = await app.$axios.$get(
        `/api/v1/practice/me/practice-surgeries/${params.id}`
      );
      const practice_surgery = response.data.practice_surgery;
      return {
        practice_surgery_id,
        practice_surgery
      };
    } catch (err) {
      throw err;
    }
  },
  computed: {
    relationshipIsActive: function() {
      let result = "";
      if (
        this.practice_surgery.invitation_accepted_at ||
        this.practice_surgery.termination_requested_at
      ) {
        result = "Active";
      }

      if (
        this.practice_surgery.invitation_rejected_at ||
        this.practice_surgery.terminated_at
      ) {
        result = "Inactive";
      }
      return result;
    }
  },
  methods: {
    activeRelationship() {
      let result = "";
      if (
        this.practice_surgery.invitation_accepted_at ||
        this.practice_surgery.termination_requested_at
      ) {
        result = "Active";
      }

      if (
        this.practice_surgery.invitation_rejected_at ||
        this.practice_surgery.terminated_at
      ) {
        result = "Inactive";
      }
      return result;
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
