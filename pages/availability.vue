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
          <AvailabilityCalendar />
          <!-- @open="open"  -->
          <div class="absolute bottom-0 right-0 -my-2 -mx-1 md:-m-2">
            <nuxt-link :to="'/availability/create'">
              <div
                class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-500 font-semibold cursor-pointer shadow-md hover:text-white"
              >+</div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <nuxt-link :to="'/availability'">
          <transition name="fade" mode="out-in">
            <div
              class="shield"
              v-if="['availability-id','availability-create'].includes($route.name)"
            ></div>
          </transition>
        </nuxt-link>
      </transition>
      <nuxt-child
        :selectedDate="selectedDate"
        :unavailableDate="unavailableDate"
        :allocatedDate="allocatedDate"
        :ongoingDate="ongoingDate"
      />
    </template>
  </section>
</template>
<script>
import AvailabilityShift from "@/components/Availability/AvailabilityShift";
import AvailabilityCalendar from "@/components/Availability/AvailabilityCalendar";
export default {
  components: {
    AvailabilityShift,
    AvailabilityCalendar
  },
  data() {
    return {
      shifts: [],
      modal: false,
      type: "",
      selectedDate: null,
      unavailableDate: null,
      allocatedDate: null,
      ongoingDate: null
    };
  },
  created() {
    this.$store.dispatch("availability/getShifts");

    this.$store.commit("availability/SET_DATE_TODAY");
  },
  watch: {
    "$route.name"(value) {
      if (["availability-id", "availability-create"].includes(value)) {
        document.body.style.overflow = "hidden";
      } else if (!["availability-id", "availability-create"].includes(value)) {
        document.body.style.overflow = "auto";
      }
    }
  },
  methods: {
    // add() {
    //   this.unavailableDate = null;
    //   this.appointmentDate = null;
    //   document.body.style.overflow = "hidden";
    //   this.type = "range";
    //   this.modal = true;
    // }
    // open({ selectedDate, unavailableDate, allocatedDate, ongoingDate }) {
    //   this.selectedDate = selectedDate;
    //   this.unavailableDate = unavailableDate;
    //   this.allocatedDate = allocatedDate;
    //   this.ongoingDate = ongoingDate;
    //   this.$router.push({
    //     path: `/availability/${selectedDate}`
    //   });
    // }
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
/* .modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
} */
</style>

