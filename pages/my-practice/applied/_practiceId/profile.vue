<template>
  <MyPracticeProfile :practice="practice" />
</template>
<script>
import MyPracticeProfile from "@/components/MyPractice/MyPracticeProfile";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    MyPracticeProfile
  },
  async asyncData({ app, error, params }) {
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
      console.log(err);
    }
  }
};
</script>