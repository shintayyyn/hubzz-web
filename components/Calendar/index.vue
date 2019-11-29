<template>
  <section>
    <div
      class="relative calendar bg-white border border-solid shadow-md my-4 rounded-lg lg:max-w-6xl"
    >
      <div class="relative flex flex-row flex-wrap w-full h-full">
        <div
          class="relative w-full lg:w-2/3 px-2 pb-5 pt-2 md:p-5"
          :class="authPermissions.includes('Create Sessions Job') ? 'pb-16 md:pb-20' : ''"
        >
          <PerMonth v-if="$store.state.calendar.view_type === 'per_month'" />
          <PerWeek v-if="$store.state.calendar.view_type === 'per_week'" />
          <div class="absolute md:mx-5 md:py-4 mx-2 right-0 mt-2 md:-mt-3">
            <nuxt-link
              v-if="
								$auth.user.domain === 'Locum' ||
									($auth.user.domain === 'Practice' && authPermissions.includes('Create Sessions Job'))
							"
              :to="{ path: '/dashboard/create' }"
              class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-500 font-semibold cursor-pointer shadow-md hover:text-white"
            >+</nuxt-link>
          </div>
        </div>
        <div class="w-full lg:w-1/3">
          <Info />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import PerMonth from "@/components/Calendar/PerMonth";
import PerWeek from "@/components/Calendar/PerWeek";
import Info from "@/components/Calendar/Info";

export default {
  components: {
    PerMonth,
    PerWeek,
    Info
  },
  created() {
    this.$store.commit("calendar/SET_DATE_TODAY");
  },
  computed: {
    loading() {
      return this.$store.state.calendar.loading;
    },
    create_job_modal() {
      return this.$store.state.calendar.create_job_modal;
    },
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  }
};
</script>
<style scoped>
.calendar {
  height: auto;
}
@media screen and (min-width: 991px) {
  .calendar {
    height: auto;
  }
}
</style>
