<template>
  <div>
    <div class="flex overflow-x-auto border-b border-sunglow">
      <template v-if="!isStandAloneWithoutHubOrSpoke">
        <nuxt-link
          :to="`/spoke-surgery-management`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'spoke-surgery-management-index' || ['spoke-surgery-management-index-hub-invitationId', 'spoke-surgery-management-index-create'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
        >My Hub</nuxt-link>
        <nuxt-link
          :to="{ name: 'spoke-surgery-management-spoke-siblings'}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('spoke-surgery-management-spoke-siblings') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
        >My Spoke Siblings</nuxt-link>
        <nuxt-link
          :to="{ name: 'spoke-surgery-management-hub-banks'}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('spoke-surgery-management-hub-banks') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
        >My Hub Banks</nuxt-link>
      </template>
      <nuxt-link
        :to="{ name: 'spoke-surgery-management-invitations-hub'}"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('spoke-surgery-management-invitations') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >Invitations</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div
        v-if="['spoke-surgery-management-index-invitationId', 'spoke-surgery-management-index-create'].includes($route.name)"
        class="shield"
        @click="$router.push('/spoke-surgery-management')"
      />
    </transition>
    <nuxt-child :isStandAloneWithoutHubOrSpoke="isStandAloneWithoutHubOrSpoke" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      practice: null,
      parent_surgery: null
    };
  },
  computed: {
    isStandAloneWithoutHubOrSpoke () {
      return (
        this.practice.type === "Stand Alone" &&
        this.parent_surgery.hub_practice_id === null &&
        this.parent_surgery.parent_practice_id === null
      );
    }
  },
  async asyncData ({ app, route, store, error }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('View Surgery Management') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

      let response = await app.$axios.$get(`/api/v1/practice/me/practice`);
      const practice = response.data.practice

      if (practice.status !== 'Active' && practice.status !== 'Dormant') {
        error({
          statusCode: 403,
          message: 'This function is unavailable on inactive practice.',
        })

        return
      }
      if (practice.type !== 'Spoke' && practice.type !== 'Stand Alone') {
        error({
          statusCode: 403,
          message: 'This function is unavailable on this practice.',
        })

        return
      }

      response = await app.$axios.$get(`/api/v1/practice/me/parent-surgery`);
      const parent_surgery = response.data.practice
      

      return {
        practice,
        parent_surgery,
      };
    } catch (err) {
      console.log("something went wrong", err);
    }
  },
  mounted () {
    if (
      this.isStandAloneWithoutHubOrSpoke &&
      this.$route.name === "spoke-surgery-management-index"
    ) {
      this.$router.push("/spoke-surgery-management/invitations/hub");
    }
  }
};
</script>