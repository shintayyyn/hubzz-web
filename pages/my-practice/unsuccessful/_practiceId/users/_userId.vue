<template>
  <div class="modal shadow-lg">
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
.modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
  scroll-behavior: smooth;
}

@media screen and (min-width: 1200px) {
  .modal {
    width: 70%;
  }
}
</style>