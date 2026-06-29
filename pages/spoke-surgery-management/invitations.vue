<template>
  <div>
    <div class="flex flex-row justify-start overflow-x-auto pb-3 mt-2">
      <nuxt-link
        to="/spoke-surgery-management/invitations/hub"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="isActiveTab('spoke-surgery-management-invitations-hub')"
      >
        Hub Invitations
      </nuxt-link>

      <nuxt-link
        v-if="isStandAloneWithoutHubOrSpoke"
        to="/spoke-surgery-management/invitations/stand-alone"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="isActiveTab('spoke-surgery-management-invitations-stand-alone')"
      >
        Spoke Invitations
      </nuxt-link>

      <nuxt-link
        v-else
        to="/spoke-surgery-management/invitations/spoke"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="isActiveTab('spoke-surgery-management-invitations-spoke')"
      >
        My Invitations
      </nuxt-link>

      <transition name="fade" mode="out-in">
        <nuxt-link
          v-if="showInviteButton"
          to="/spoke-surgery-management/invitations/spoke/create"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer border rounded-lg border-yellow-500 bg-yellow-500 hover:text-white"
        >
          Invite
        </nuxt-link>
      </transition>
    </div>

    <nuxt-child
      :isStandAloneWithoutHubOrSpoke="isStandAloneWithoutHubOrSpoke"
    />
  </div>
</template>

<script>
const SOCKET_EVENTS = [
  "Practice Notification Create Hub",
  "Practice Notification Delete Hub",
  "Practice Notification Accept Surgery",
  "Practice Notification Reject Hub"
];

function extractHubData(res) {
  const practice = res?.data?.practice ?? null;
  return {
    practiceHub: practice?.hub_practice ?? null,
    hasParentPractice: !!practice?.parent_practice_id
  };
}

export default {
  transition: { name: "fade", mode: "out-in" },

  props: {
    isStandAloneWithoutHubOrSpoke: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      practiceHub: null,
      hasParentPractice: false
    };
  },

  computed: {
    showInviteButton() {
      return (
        this.$route.name.includes(
          "spoke-surgery-management-invitations-spoke"
        ) &&
        !this.hasParentPractice &&
        !this.practiceHub
      );
    }
  },

  async asyncData({ app }) {
    try {
      const res = await app.$axios.$get(`/api/v1/practice/me/parent-surgery`);
      return extractHubData(res);
    } catch (err) {
      throw err;
    }
  },

  mounted() {
    SOCKET_EVENTS.forEach(event => this.$socket.on(event, this.getInit));
  },

  destroyed() {
    SOCKET_EVENTS.forEach(event =>
      this.$socket.removeListener(event, this.getInit)
    );
  },

  methods: {
    isActiveTab(routeName) {
      return this.$route.name.includes(routeName)
        ? "border rounded-lg border-yellow-500 bg-yellow-500"
        : "text-gray-600";
    },

    async getInit() {
      try {
        const res = await this.$axios.$get(
          `/api/v1/practice/me/parent-surgery`
        );
        const { practiceHub, hasParentPractice } = extractHubData(res);
        this.practiceHub = practiceHub;
        this.hasParentPractice = hasParentPractice;
      } catch (err) {
        console.error("getInit error:", err);
      }
    }
  }
};
</script>
