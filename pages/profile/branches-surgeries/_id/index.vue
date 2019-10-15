<template>
  <div class="modal-container shadow-lg">
    <div class="p-8 w-full">
      <div @click="$router.push('/profile/branches-surgeries')" class="mb-2 cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex overflow-x-auto">
          <nuxt-link
              :to="`/profile/branches-surgeries/${practice_id}`"
              class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="$route.name === 'profile-branches-surgeries-id-index' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >Profile</nuxt-link>
          <nuxt-link
              :to="`/profile/branches-surgeries/${practice_id}/surgery-sessions`"
              class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="$route.name.includes('profile-branches-surgeries-id-index-surgery-sessions') || $route.name === 'profile-branches-surgeries-create'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >Surgery Sessions</nuxt-link>
          <nuxt-link
              :to="`/profile/branches-surgeries/${practice_id}/surgery-billings`"
              class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
              :class="$route.name.includes('profile-branches-surgeries-id-index-surgery-billings')  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >Surgery Billing</nuxt-link>
      </div>
      <nuxt-child/>
    </div>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";

export default {
  components: {
    AppButton,

  },
  data() {
    return {
      practice_id: '',
    };
  },
  async asyncData({ app, route, store, params, error }) {
    try {
      const practice_id = params.id
      const response = await app.$axios.$get(
        `/api/v1/practice/me/practice-surgeries/${params.id}`
      );
      return {
        practice_id
      };
    } catch (err) {
      throw err;
    }
  },
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