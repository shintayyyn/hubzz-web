<template>
  <div>
    <div class="flex flex-row justify-start overflow-x-auto pb-3 mt-2">
      <nuxt-link
        :to="'/spoke-surgery-management/invitations/hub'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('spoke-surgery-management-invitations-hub') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Hub Invitations</nuxt-link>
      <template v-if="isStandAloneWithoutHubOrSpoke">
        <nuxt-link
          :to="'/spoke-surgery-management/invitations/stand-alone'"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('spoke-surgery-management-invitations-stand-alone') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Spoke Invitations</nuxt-link>
      </template>
      <template v-if="!isStandAloneWithoutHubOrSpoke">
        <nuxt-link
          :to="'/spoke-surgery-management/invitations/spoke'"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name.includes('spoke-surgery-management-invitations-spoke') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >My Invitations</nuxt-link>
      </template>
      <transition name="fade" mode="out-in">
        <nuxt-link
          v-if="$route.name.includes('spoke-surgery-management-invitations-spoke') && !hasParentPractice && !practiceHub"
          :to="'/spoke-surgery-management/invitations/spoke/create'"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer border rounded-lg border-yellow-500 bg-yellow-500 hover:text-white"
        >Invite</nuxt-link>
      </transition>
    </div>
    <nuxt-child :isStandAloneWithoutHubOrSpoke="isStandAloneWithoutHubOrSpoke" />
  </div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  props: ["isStandAloneWithoutHubOrSpoke"],
  async asyncData({ app, route, store }) {
    try {
      let res = await app.$axios.$get(`/api/v1/practice/me/parent-surgery`);

      let practiceHub =
        res.data && res.data.practice && res.data.practice.hub_practice
          ? res.data.practice.hub_practice
          : null;

      let hasParentPractice =
        res &&
        res.data &&
        res.data.practice &&
        res.data.practice.parent_practice_id
          ? res.data.practice.parent_practice_id
          : null;

      return {
        practiceHub,
        hasParentPractice: hasParentPractice ? true : false
      };
    } catch (err) {
      throw err;
    }
  },
  mounted() {
    this.addSocketListeners();
  },
  destroyed() {
    this.removeSocketListener();
  },
  methods: {
    async getInit() {
      let res = await this.$axios.$get(`/api/v1/practice/me/parent-surgery`);

      this.practiceHub =
        res.data && res.data.practice && res.data.practice.hub_practice
          ? res.data.practice.hub_practice
          : null;

      this.hasParentPractice =
        res &&
        res.data &&
        res.data.practice &&
        res.data.practice.parent_practice_id
          ? true
          : false;
    },
    addSocketListeners() {
      this.$socket.on("Practice Notification Create Hub", this.getInit);
      this.$socket.on("Practice Notification Delete Hub", this.getInit);
      this.$socket.on("Practice Notification Accept Surgery", this.getInit);
      this.$socket.on("Practice Notification Reject Hub", this.getInit);
    },
    removeSocketListener() {
      this.$socket.removeListener(
        "Practice Notification Create Hub",
        this.getInit
      );
      this.$socket.removeListener(
        "Practice Notification Delete Hub",
        this.getInit
      );
      this.$socket.removeListener(
        "Practice Notification Accept Surgery",
        this.getInit
      );
      this.$socket.removeListener(
        "Practice Notification Reject Hub",
        this.getInit
      );
    }
  }
};
</script>