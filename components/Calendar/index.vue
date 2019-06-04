<template>
  <div class="p-5 w-full">
    <div class="calendar border border-solid rounded-lg shadow-md">
      <div class="flex flex-row flex-wrap w-full h-full">
        <div class="relative w-full md:w-3/5">
          <PerMonth v-if="$store.state.calendar.view_type === 'per_month'"/>
          <PerWeek v-if="$store.state.calendar.view_type === 'per_week'"/>
          <div class="text-right mt-4 px-5">
            <div
              class="inline rounded-full bg-yellow-dark py-4 px-6 sm:py-4 sm:px-6 font-bold text-xl sm:text-2xl cursor-pointer hover:text-white"
              @click="create"
            >+</div>
          </div>
        </div>
        <div class="w-full md:w-2/5">
          <Info/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PerMonth from '@/components/Calendar/PerMonth'
import PerWeek from '@/components/Calendar/PerWeek'
import Info from '@/components/Calendar/Info'
export default {
  components: {
    PerMonth,
    PerWeek,
    Info
  },
  created() {
    // set the selected date and date today
    this.$store.commit('calendar/SET_DATE_TODAY')
  },
  methods: {
    create() {
      this.$store.commit('SET_CREATEJOB_SHIELD', true)
      let d = document.getElementsByClassName('create-job-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'hidden'
      this.$store.commit('SET_CREATEJOB_MODAL', true)
    }
  }
}
</script>
<style>
.calendar {
  height: 800px;
  max-width: 1000px;
}
@media screen and (min-width: 768px) {
  .calendar {
    height: 700px;
  }
}
</style>


