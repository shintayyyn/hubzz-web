<template>
  <section v-if="!isNumberVerified || !isAvailabilityVerified">
    <div class="text-sm sm:text-base font-bold">Reminders</div>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="p-4 w-full sm:w-1/2 md:w-1/4">
        <div class="reminder-card rounded-lg shadow-lg p-4" v-if="!isNumberVerified">
          <nuxt-link to="/account/profile">Complete your Profile Credentials</nuxt-link>
        </div>
      </div>
      <div class="p-4 w-full sm:w-1/2 md:w-1/4">
        <div class="reminder-card rounded-lg shadow-lg p-4" v-if="!isAvailabilityVerified">
          <nuxt-link to="/availability">Completer your Availability Credentials</nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  computed: {
    isNumberVerified() {
      return this.$auth.user.locum_detail.gmc_or_nmc_number.status === 'Verified' && this.$auth.user.locum_detail.mpl_or_npl_number.status === 'Verified'
    },
    isAvailabilityVerified() {
      return Boolean(this.$auth.user.locum_detail.shifts.length)
    }
  },
  created() {
    // console.log(this.$auth.user)
  }
}
</script>
<style scoped>
.reminder-card {
  min-height: 130px;
}
</style>



