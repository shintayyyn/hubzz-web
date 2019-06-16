<template>
  <section>
    <div class="calendar border border-solid shadow-md my-4 rounded-lg">
      <div class="flex flex-row flex-wrap w-full h-full">
        <div class="relative w-full lg:w-2/3 p-5 pb-20">
          <PerMonth v-if="$store.state.calendar.view_type === 'per_month'"/>
          <PerWeek v-if="$store.state.calendar.view_type === 'per_week'"/>
          <div class="absolute pin-b pin-r m-5">
            <div
              class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-dark font-semibold cursor-pointer shadow-md hover:text-white"
              @click="create"
            >+</div>
          </div>
        </div>
        <div class="w-full lg:w-1/3">
          <Info/>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import PerMonth from '@/components/Calendar/PerMonth'
import PerWeek from '@/components/Calendar/PerWeek'
import Info from '@/components/Calendar/Info'
export default {
  components: {
    PerMonth,
    PerWeek,
    Info,

  },
  created() {
    // set the selected date and date today
    this.$store.commit('calendar/SET_DATE_TODAY')
  },
  methods: {
    create() {
      if (this.$auth.user.domain === 'Locum') {
        this.$store.commit('TOGGLE_CREATE_APPOINTMENT_MODAL', true)
      } else {
        this.$store.commit('TOGGLE_CREATE_JOB_MODAL', true)
      }
      document.body.style.overflow = 'hidden'
    }
  }
}
</script>
<style>
.calendar {
  height: auto;
  max-width: 1000px;
}
@media screen and (min-width: 991px) {
  .calendar {
    height: auto;
  }
}
</style>


