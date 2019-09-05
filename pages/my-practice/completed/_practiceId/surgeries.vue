<template>
  <MyPracticeSurgeries :surgeries="surgeries" />
</template>
<script>
import MyPracticeSurgeries from "@/components/MyPractice/MyPracticeSurgeries";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    MyPracticeSurgeries
  },
  async asyncData({ app, error, params }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/practices/${params.practiceId}`
      );
      const practice =
        response.data && response.data.practice ? response.data.practice : null;
      let surgeries = [];
      surgeries.push(practice.surgery);
      return {
        surgeries
      };
    } catch (err) {
      console.log(err);
    }
  }
};
</script>