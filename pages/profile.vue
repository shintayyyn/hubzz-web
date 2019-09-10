<template>
  <section class="profile-section">
    <!-- <div class="flex overflow-x-auto whitespace-no-wrap"> -->
    <div class="flex overflow-x-auto">
      <nuxt-link
        to="/profile/practice"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="['profile', 'profile-practice'].includes($route.name) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Practice</nuxt-link>
      <nuxt-link
        v-if="type !== 'Stand Alone'"
        to="/profile/branches-surgeries"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'profile-branches-surgeries' || $route.name === 'profile-branches-surgeries-create'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Branches / Surgeries</nuxt-link>
      <nuxt-link
        to="/profile/practice-documents"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'profile-practice-documents'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Practice Documents</nuxt-link>
      <nuxt-link
        v-if="$route.name === 'profile-branches-surgeries' || $route.name === 'profile-branches-surgeries-create'"
        to="/profile/branches-surgeries/create"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer hover:bg-yellow-500 rounded-lg whitespace-no-wrap"
      >Create</nuxt-link>
    </div>
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
export default {
  computed: {
    type() {
      return this.$store.state.profile.practice_type;
    }
  },
  async asyncData({ app, store, error }) {
    try {
      const responsePracticeType = await app.$axios.$get(
        `/api/v1/practice/me/practice-type`
      );
      let type =
        responsePracticeType.data &&
        responsePracticeType.data.practice &&
        responsePracticeType.data.practice.type
          ? responsePracticeType.data.practice.type
          : null;

      store.commit("profile/SET_PRACTICE_TYPE", type);
    } catch (err) {
      throw err;
    }
  }
};
</script>
