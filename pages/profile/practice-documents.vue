<template>
  <section>
    <nuxt-child :practice="practice" />
  </section>
</template>
<script>
export default {
  async asyncData({ app, redirect, error }) {
    // const variation_response =
    if (app.$auth.user.domain === "Practice") {
      let permissions = app.$auth.user.practice_detail.role.permissions.map(
        permission => permission.name
      );
      if (permissions.includes("View Profile Practice Document")) {
        try {
          const [
            practice,
          ] = await Promise.all([
            app.$axios.$get(`/api/v1/practice/me/practice`).then(res => {
              const practice = res.data.practice;
              return practice;
            }),
          ]);

          return {
            practice
          };
        } catch (err) {
          if (err.response && err.response.status === 401) {
            error(err.response.data);
            return;
          }
          throw err;
        }
      } else if (permissions.includes("View Profile Practice")) {
        redirect("/profile");
      } else if (permissions.includes("View Profile Users")) {
        redirect(`/profile/users`);
      } else {
        error({ statusCode: 401, message: "Your Practice is Not Authorized" });
      }
    }
  },
};
</script>
