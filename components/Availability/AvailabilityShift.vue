<template>
  <div class="availability-shift rounded-lg shadow-lg">
    <form class="w-full p-5">
      <div class="relative flex flex-col">
        <div class="relative flex flex-row flex-wrap justify-start">
          <div
            v-if="shifts_error"
            class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
          >Select atleast one shift</div>
          <div class="text-sm leading-loose mr-2">The shifts I am available for</div>
          <div
            class="py-2 px-1 rounded-lg text-sm bg-grey-lighter leading-tight"
          >Select all that apply</div>
        </div>
        <div class="flex flex-row flex-wrap justify-around md:justify-start mt-5">
          <div
            class="relative border border-solid rounded-lg p-5 m-2 w-full sm:w-1/4 md:w-1/6 text-sm md:text-base text-center cursor-pointer"
            :class="selectedShifts.includes(item.id) ? 'bg-yellow-dark': 'hover:bg-yellow-dark'"
            style="box-sizing:content-box;"
            v-for="item in shifts"
            :key="item.id"
            @click="select(item.id)"
          >{{item.name}}</div>
        </div>
      </div>

      <button
        class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl py-4 px-6 md:p-6 rounded-lg mt-4 md:mt-10 mb-5"
        @click.prevent="update"
      >Update</button>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedShifts: [],
      shifts_error: false
    };
  },
  computed: {
    shifts() {
      return this.$store.state.availability.shifts;
    }
  },
  created() {
    this.$axios.$get(`/api/v1/me`).then(res => {
      this.selectedShifts = res.data.user.locum_detail.shifts.map(
        shift => shift.id
      );
    });
  },
  methods: {
    select(id) {
      let shiftId = this.selectedShifts.find(item => item === id);
      if (!shiftId) {
        this.selectedShifts.push(id);
      } else {
        let shiftIndex = this.selectedShifts.findIndex(item => item === id);
        this.selectedShifts.splice(shiftIndex, 1);
      }
    },
    update() {
      this.shifts_error = false;

      if (this.selectedShifts.length === 0) {
        this.shifts_error = true;
      } else {
        this.$axios
          .$put(`/api/v1/locum/me/shifts`, { shift_id: this.selectedShifts })
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Shift updated!"]
            });
          });
      }
    }
  }
};
</script>
<style scoped>
.availability-shift {
  max-width: 800px;
}
</style>


