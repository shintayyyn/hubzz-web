<template>
  <div class="availability-shift rounded-lg shadow-lg">
    <form class="w-full p-5">
      <div class="relative flex flex-col">
        <div class="flex flex-row flex-wrap justify-start">
          <div class="text-sm leading-loose mr-2">The shifts I am available for</div>
          <div
            class="py-2 px-1 rounded-lg text-sm bg-grey-lighter leading-tight"
          >Select all that apply</div>
        </div>
        <div class="flex flex-row flex-wrap justify-start mt-5">
          <div
            class="relative border border-solid rounded-lg p-5 m-2 text-center cursor-pointer"
            :class="selectedShifts.includes(item.id) ? 'bg-yellow-dark': 'hover:bg-yellow-dark'"
            style="box-sizing:content-box;width:90px"
            v-for="item in shifts"
            :key="item.id"
            @click="select(item.id)"
          >{{item.name}}</div>
        </div>
      </div>

      <button
        class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg mt-10 mb-5"
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
    }
  },
  computed: {
    shifts() {
      return this.$store.state.availability.shifts
    }
  },
  created() {
    // get authenticated user's selected shift/s
    this.selectedShifts = this.$auth.user.locum_detail.shifts.map(shift => shift.id)
  },
  methods: {
    select(id) {
      let shiftId = this.selectedShifts.find(item => item === id)
      if (!shiftId) {
        this.selectedShifts.push(id)
      } else {
        let shiftIndex = this.selectedShifts.findIndex(item => item === id)
        this.selectedShifts.splice(shiftIndex, 1)
        // this.selectedShifts = this.selectedShifts.filter((item, index) => index !== shiftIndex)
      }
    },
    update() {
      // post request to api
      this.$axios.$put(`/api/v1/locum/me/shifts`, { shift_id: this.selectedShifts }).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Shift updated!' })
      })
    },
  }
}
</script>
<style scoped>
.availability-shift {
  max-width: 800px;
}
</style>


