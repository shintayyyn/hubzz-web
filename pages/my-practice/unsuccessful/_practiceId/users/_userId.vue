<template>
  <div class="modal-container shadow-lg">
    <MyPracticeUserDetail
      :user="user"
      @close="$router.push(`/my-practice/unsuccessful/${$route.params.practiceId}/users`)"
    />
  </div>
</template>
<script>
import MyPracticeUserDetail from "@/components/MyPractice/MyPracticeUserDetail";
export default {
  components: {
    MyPracticeUserDetail
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/practices/${params.practiceId}/practice-users/${params.userId}`
      );
      let user =
        response.data && response.data.user ? response.data.user : null;

      return {
        user
      };
    } catch (err) {
      throw err;
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
    width: 70%;
  }
}
</style>