<template>
  <div class="modal-container shadow-lg">
    <div class="flex flex-col items-start p-4 md:p-8 max-w-3xl">
      <nuxt-link
        :to="{ path: `/my-practice/${$route.params.practiceId}/users`, query: {...$route.query}}"
        class="cursor-pointer"
      >
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>
      <div class="flex flex-col w-full mt-4">
        <div class="text-md md:text-lg font-bold">User</div>
        <div class="rounded-lg shadow-lg p-4 md:p-8 mt-4">
          <div class="flex flex-col">
            <div class="body-info">
              <div
                class="font-bold text-md md:text-lg"
              >{{user.personal_detail.first_name}} {{user.personal_detail.last_name}}</div>
              <div class="text-sm sm:text-md mb-4 md:mb-8">{{user.practice_detail.practice_role}}</div>
              <div class="font-bold text-md md:text-lg">Surgery</div>
              <div class="text-sm sm:text-md mb-4 md:mb-8">{{user.practice_detail.practice.surgery.name}}</div>
              <div class="font-bold text-md md:text-lg">Email</div>
              <div class="text-sm sm:text-md" v-text="user.email ? user.email : `(none)`"></div>
              <!-- <div class="font-bold text-md md:text-lg">Phone number</div>
            <div
              class="text-sm sm:text-md mb-8"
              v-text="user.practice_detail.practice.phone_number ? user.practice_detail.practice.phone_number : `(none)`"
            ></div>
            <div class="font-bold text-md md:text-lg">Extra information</div>
            <div class="text-sm sm:text-md mb-8">{{user.practice_detail.practice.extra_information}}</div>
            <div class="font-bold text-md md:text-lg">Compliance documents</div>
            <div
              class="text-sm sm:text-md mb-8"
              v-if="!user.practice_detail.practice.gp_compliance_documents.length"
            >(none)</div>
            <div class="text-sm sm:text-md mb-8 flex flex-row flex-wrap" v-else>
              <div
                class="rounded-lg bg-yellow-500 p-2 m-1"
                v-for="item in user.practice_detail.practice.gp_compliance_documents"
                :key="item.id"
              >{{item.name}}</div>
            </div>
            <div class="font-bold text-md md:text-lg">Other documents</div>
            <div
              class="text-sm sm:text-md mb-8"
              v-if="!user.practice_detail.practice.others_compliance_documents.length"
            >(none)</div>
            <div class="text-sm sm:text-md mb-8 flex flex-row flex-wrap" v-else>
              <div
                class="rounded-lg bg-yellow-500 p-2 m-1"
                v-for="item in user.practice_detail.practice.others_compliance_documents"
                :key="item.id"
              >{{item.name}}</div>
            </div>
            <div class="font-bold text-md md:text-lg">Mandatory trainings</div>
            <div
              class="text-sm sm:text-md mb-8"
              v-if="!user.practice_detail.practice.mandatory_trainings.length"
            >(none)</div>
            <div class="text-sm sm:text-md mb-8 flex flex-row flex-wrap" v-else>
              <div
                class="rounded-lg bg-yellow-500 p-2 m-1"
                v-for="item in user.practice_detail.practice.mandatory_trainings"
                :key="item.id"
              >{{item.name}}</div>
              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/practice-users/${params.userId}`
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