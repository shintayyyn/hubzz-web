<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8">
      <div @click="$router.push(`/my-practice/completed`)" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex flex-row justify-start mt-8">
        <MyPracticeTabs :practiceType="'completed'" />
      </div>
      <div class="mt-5">
        <nuxt-child :practice="practice" />
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
import MyPracticeTabs from "@/components/MyPractice/MyPracticeTabs";
export default {
  components: {
    MyPracticeTabs
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/practices/${params.practiceId}`
      );

      const practice =
        response.data && response.data.practice ? response.data.practice : null;

      return {
        practice
      };
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({
          status: 404,
          message: "This practice could not be found"
        });
      }
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
    width: 80%;
  }
}
</style>