<template>
  <div
    class="relative rounded-lg py-3 px-5 my-1 bg-white cursor-pointer hover:bg-grey-lighter"
    @click="select"
  >
    <div class="bg-pink absolute pin-l pin-t rounded-l-lg p-2 h-full"></div>
    <div class="ml-2">
      <div class="my-3 font-bold text-sm sm:text-md">Unavailable</div>
      <div class="my-3 text-xs xl:text-sm">Shifts: {{shifts}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['job'],
  computed: {
    shifts() {
      let shifts = []
      this.job.shifts.forEach(shift => {
        shifts.push(shift.name)
      })
      return shifts.join()
    }
  },
  methods: {
    select() {
      this.$router.push('/availability')
    }
  }
}
</script>
<style>
.info-card {
  height: 300px;
}
@media screen and (min-width: 768px) {
  .info-card {
    height: 600px;
  }
}
</style>


