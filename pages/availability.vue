<template>
  <section class="relative">
    <div class="px-0 md:px-10">
      <div class="text-sm font-bold">I'm available for...</div>
    </div>
    <div class="px-0 md:px-10 mt-5">
      <AvailabilityShift />
    </div>
    <div class="px-0 md:px-10 mt-5">
      <div class="text-sm font-bold">When I won't be available</div>
      <div
        class="text-sm"
      >Add a date range from the + button below or click on a date to add or remove</div>
    </div>
    <div class="px-0 md:px-10 my-5">
      <div class="availability-calendar relative rounded-lg shadow-lg p-5">
        <!-- @update="update" -->
        <AvailabilityCalendar @open="open" />
        <div class="absolute bottom-0 right-0 m-5">
          <div
            class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-400 font-semibold cursor-pointer shadow-md hover:text-white"
            @click="add"
          >+</div>
        </div>
      </div>
    </div>
    <div class="add-unavailable-date-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="add-unavailable-date-modal shadow-lg" v-if="modal">
        <AddUnavailableDateModal
          @close="close"
          :unavailableDate="unavailableDate"
          :appointmentDate="appointmentDate"
          :allocatedDate="allocatedDate"
          :type="type"
        />
      </div>
    </transition>
  </section>
</template>
<script>
import AvailabilityShift from '@/components/Availability/AvailabilityShift'
import AvailabilityCalendar from '@/components/Availability/AvailabilityCalendar'
import AddUnavailableDateModal from '@/components/Availability/AddUnavailableDateModal'
export default {
  components: {
    AvailabilityShift,
    AvailabilityCalendar,
    AddUnavailableDateModal
  },
  middleware: 'isVerified',
  data() {
    return {
      shifts: [],
      modal: false,
      // passing prop to modal
      type: '',
      unavailableDate: null,
      appointmentDate: null,
      allocatedDate: null
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
      this.unavailableDate = null
      this.appointmentDate = null
      document.body.style.overflow = 'hidden'
      this.type = 'range'
      this.modal = true
    },
    open(unavailableDate, appointmentDate, allocatedDate) {
      this.unavailableDate = unavailableDate
      this.appointmentDate = appointmentDate
      this.allocatedDate = allocatedDate
      document.body.style.overflow = 'hidden'
      this.type = 'solo'
      this.modal = true
    },
    close() {
      this.modal = false
      document.body.style.overflow = 'auto'
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
.add-unavailable-date-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
.add-unavailable-date-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .add-unavailable-date-modal {
    width: 80%;
  }
}
</style>

