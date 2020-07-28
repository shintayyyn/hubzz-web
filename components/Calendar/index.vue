<template>
  <section>
    <div class="relative calendar bg-white border border-solid shadow-md my-4 rounded-lg lg:max-w-6xl">
      <div class="relative flex flex-row flex-wrap w-full h-full">
        <div
          class="relative w-full lg:w-2/3 px-2 md:px-5 pb-4"
          :class="authPermissions.includes('Create Sessions Job') ? 'pt-5' : 'pt-2'"
        >
          <PerMonth v-if="$store.state.calendar.view_type === 'per_month'" />
          <PerWeek v-if="$store.state.calendar.view_type === 'per_week'" />
        </div>

        <div class="w-full lg:w-1/3">
          <Info />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import PerMonth from "@/components/Calendar/PerMonth"
import PerWeek from "@/components/Calendar/PerWeek"
import Info from "@/components/Calendar/Info"

export default {
  components: {
    PerMonth,
    PerWeek,
    Info,
  },
  
  computed: {
    loading () {
      return this.$store.state.calendar.loading
    },

    create_job_modal () {
      return this.$store.state.calendar.create_job_modal
    },

    authPermissions () {
      return this.$store.getters["permissions"]
    },

    canCreateJob () {
      if (this.$auth.user.domain === "Locum") {
        return false
      } else if (
        !this.authPermissions.includes("Create Sessions Job")
        || (
          this.$auth.user.practice_detail.practice.type === "Spoke"
          && this.$auth.user.practice_detail.practice.parent_practice_id
          && !this.$auth.user.practice_detail.practice.allow_surgery_create_sessions
        )
      ) {
        return false
      }
      
      return true
    },
  },

  created () {
    this.$store.commit("calendar/SET_DATE_TODAY")
  },
}
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
