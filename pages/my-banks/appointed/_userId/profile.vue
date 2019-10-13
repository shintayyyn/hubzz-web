<template>
  <div>
    <MyLocumProfile :user="user" />
  </div>
</template>
<script>
import MyLocumProfile from "@/components/MyBanks/MyLocumProfile";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    MyLocumProfile
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/practice/locums/${params.userId}`
      );
      const user =
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

