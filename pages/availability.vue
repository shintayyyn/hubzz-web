<template>
  <section class="relative">
    <div class="px-10">
      <div class="text-sm font-bold">I'm available for...</div>
    </div>
    <div class="px-10 mt-5">
      <AvailabilityShift/>
    </div>
    <div class="px-10 mt-5">
      <div class="text-sm font-bold">When I won't be available</div>
      <div
        class="text-sm"
      >Add a date range from the + button below or click on a date to add or remove</div>
    </div>
    <div class="px-10 my-5">
      <div class="availability-calendar relative rounded-lg shadow-lg p-5">
        <AvailabilityCalendar/>
        <div class="absolute pin-b pin-r m-5">
          <div
            class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-dark font-semibold cursor-pointer shadow-md hover:text-white"
            @click="add"
          >+</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AvailabilityShift from '@/components/Availability/AvailabilityShift'
import AvailabilityCalendar from '@/components/Availability/AvailabilityCalendar'
export default {
  components: {
    AvailabilityShift,
    AvailabilityCalendar
  },
  data() {
    return {
      shifts: [],
    }
  },
  created() {
    // get all shifts
    this.$store.dispatch('availability/getShifts')

    // set the selected date and date today
    this.$store.commit('availability/SET_DATE_TODAY')
  },
  methods: {
    add() {
      this.$store.commit('availability/UPDATE_SHIFT', null)
      document.body.style.overflow = 'hidden'
      this.$store.commit('availability/ADD_TYPE', 'range')
      this.$store.commit('TOGGLED_RIGHT', 'add-unavailable-date-modal')
      this.$store.commit('SET_ADDUNAVAILABLEDATE_MODAL', true)
      this.$store.commit('SET_ADDUNAVAILABLEDATE_SHIELD', true)
    }
  }
}
</script>
<style scoped>
.availability-calendar {
  height: 350px;
  max-width: 800px;
}
@media screen and (min-width: 568px) {
  .availability-calendar {
    height: 450px;
  }
}
@media screen and (min-width: 768px) {
  .availability-calendar {
    height: 600px;
  }
}
</style>

