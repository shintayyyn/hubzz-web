<template>
  <div class="flex flex-col items-start px-2 max-w-3xl">
    <!-- <nuxt-link
      :to="{ path: `/my-practice/platform/${$route.params.practiceId}/users`, query: {...$route.query}}"
      class="cursor-pointer"
    >
      <svgicon name="left-arrow" height="32" width="32" />
    </nuxt-link> -->

    <div class="flex flex-col w-full mt-4">
      <div class="text-md md:text-lg font-bold">User</div>

      <div class="rounded-lg border p-4 mt-4">
        <div class="flex flex-col">
          <div class="body-info">
            <div class="text-sm sm:text-md">Name</div>
            <div
              class="font-bold text-md md:text-lg"
            >{{ user.personal_detail.first_name }} {{ user.personal_detail.last_name }}</div>
            <div class="text-sm sm:text-md mb-4 md:mb-8">{{ user.practice_detail.practice_role }}</div>
            <div class="font-bold text-md md:text-lg">Surgery</div>
            <div
              class="text-sm sm:text-md mb-4 md:mb-8"
            >{{ user.practice_detail.practice.surgery.name }}</div>
            <div class="font-bold text-md md:text-lg">Email</div>
            <div class="text-sm sm:text-md">{{ user.email ? user.email : '(none)' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null
    };
  },
  async asyncData({ app, params }) {
    try {
      const { userId } = params;

      const user = await app.$axios
        .get(`/api/v1/locum/practice-users/${userId}`)
        .then(response => {
          return response.data.data.user;
        });

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
