<template>
  <section class="relative">
    <div class="px-0 md:px-10">
      <div class="text-sm font-bold">I'm available for...</div>
    </div>
    <div class="px-0 md:px-10 mt-5">
      <AvailabilityShift />
    </div>
    <template v-if="['Active', 'Dormant'].includes($auth.user.status)">
      <div class="px-0 md:px-10 mt-5">
        <div class="text-sm font-bold">When I won't be available</div>
        <div
          class="text-sm"
        >Add a date range from the + button below or click on a date to add or remove</div>
      </div>
      <div class="px-0 md:px-10 my-4">
        <div class="availability-calendar relative rounded-lg shadow-lg p-5">
          <AvailabilityCalendar @open="open" />
          <div class="absolute bottom-0 right-0 -my-2 -mx-1 md:-m-2">
            <div
              class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-500 font-semibold cursor-pointer shadow-md hover:text-white"
              @click="add"
            >+</div>
          </div>
        </div>
      </div>
      <div class="shield" v-if="modal" @click="close"></div>
      <transition name="slide" mode="out-in">
        <div class="add-unavailable-date-modal shadow-lg" v-if="modal">
          <AddUnavailableDateModal
            @close="close"
            :unavailableDate="unavailableDate"
            :appointmentDate="appointmentDate"
            :allocatedDate="allocatedDate"
            :ongoingDate="ongoingDate"
            :partDate="partDate"
            :type="type"
          />
        </div>
      </transition>
    </template>
  </section>
</template>
<script>
import AvailabilityShift from "@/components/Availability/AvailabilityShift";
import AvailabilityCalendar from "@/components/Availability/AvailabilityCalendar";
import AddUnavailableDateModal from "@/components/Availability/AddUnavailableDateModal";
export default {
  components: {
    AvailabilityShift,
    AvailabilityCalendar,
    AddUnavailableDateModal
  },
  data() {
    return {
      shifts: [],
      modal: false,
      type: "",
      unavailableDate: null,
      appointmentDate: null,
      allocatedDate: null,
      ongoingDate: null,
      partDate: null
    };
  },
  created() {
    this.$store.dispatch("availability/getShifts");

    this.$store.commit("availability/SET_DATE_TODAY");
  },
  methods: {
    add() {
      this.unavailableDate = null;
      this.appointmentDate = null;
      document.body.style.overflow = "hidden";
      this.type = "range";
      this.modal = true;
    },
    open(
      unavailableDate,
      appointmentDate,
      allocatedDate,
      ongoingDate,
      partDate
    ) {
      this.unavailableDate = unavailableDate;
      this.appointmentDate = appointmentDate;
      this.allocatedDate = allocatedDate;
      this.ongoingDate = ongoingDate;
      this.partDate = partDate;
      document.body.style.overflow = "hidden";
      this.type = "solo";
      this.modal = true;
    },
    close() {
      this.modal = false;
      document.body.style.overflow = "auto";
    }
  }
};
</script>
<style scoped>
.availability-calendar {
  height: auto;
  max-width: 800px;
}
@media screen and (min-width: 568px) {
  .availability-calendar {
    height: 450px;
  }
}
@media screen and (min-width: 768px) {
  .availability-calendar {
    height: auto;
  }
}
.shield {
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

