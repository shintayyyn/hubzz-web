<template>
  <div>
    <div class="flex overflow-x-auto">
      <nuxt-link
        :to="`/spoke-surgery-management`"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'spoke-surgery-management-index' || ['spoke-surgery-management-index-hub-invitationId', 'spoke-surgery-management-index-create'].includes($route.name) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >My Hub</nuxt-link>
      <nuxt-link
        :to="{ name: 'spoke-surgery-management-spoke-siblings'}"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('spoke-surgery-management-spoke-siblings') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >My Spoke Siblings</nuxt-link>
      <nuxt-link
        :to="{ name: 'spoke-surgery-management-hub-banks'}"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('spoke-surgery-management-hub-banks') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >My Hub Banks</nuxt-link>
      <nuxt-link
        :to="{ name: 'spoke-surgery-management-invitations-hub'}"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('spoke-surgery-management-invitations') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Invitations</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div
        v-if="['spoke-surgery-management-index-invitationId', 'spoke-surgery-management-index-create'].includes($route.name)"
        class="shield"
        @click="$router.push('/spoke-surgery-management')"
      />
    </transition>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  data() {
    return {
      myPractice: ""
    };
  },
  async asyncData({ app, route, store }) {
    try {
      let response = await app.$axios.$get(`/api/v1/practice/me/practice`);
      const myPractice = response.data.practice;
      // console.log(myPractice)
      return {
        myPractice
      };
    } catch (err) {
      console.log("something went wrong", err);
    }
  },
  methods: {}
};
</script>

<style>
.shield {
  /* z-index: 509; */
}
</style>