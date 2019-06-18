<template>
  <section v-if="!isNumberVerified || !isAvailabilityVerified">
    <div class="text-sm sm:text-base font-bold">Reminders</div>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="pr-8 my-4 w-full sm:w-1/2 md:w-1/4">
        <nuxt-link to="/account/profile">
          <div class="reminder-card rounded-lg shadow-lg p-4" v-if="!isNumberVerified">
            <span class="leading-tight">
              <svgicon name="alert" height="20" width="20"/>
            </span>
            Complete your Profile Credentials
          </div>
        </nuxt-link>
      </div>
      <div class="pr-8 my-4 w-full sm:w-1/2 md:w-1/4">
        <nuxt-link to="/availability">
          <div class="reminder-card rounded-lg shadow-lg p-4" v-if="!isAvailabilityVerified">
            <span class="leading-tight">
              <svgicon name="alert" height="20" width="20"/>
            </span>
            Completer your Availability Credentials
          </div>
        </nuxt-link>
      </div>
      <div class="pr-8 my-4 w-full sm:w-1/2 md:w-1/4">
        <nuxt-link to="/account/profile">
          <div class="reminder-card rounded-lg shadow-lg p-4" v-if="!isNumberVerified">
            <span class="leading-tight">
              <svgicon name="alert" height="20" width="20"/>
            </span>
            Complete your Profile Credentials
          </div>
        </nuxt-link>
      </div>
      <div class="pr-8 my-4 w-full sm:w-1/2 md:w-1/4">
        <nuxt-link to="/availability">
          <div class="reminder-card rounded-lg shadow-lg p-4" v-if="!isAvailabilityVerified">
            <span class="leading-tight">
              <svgicon name="alert" height="20" width="20"/>
            </span>
            Completer your Availability Credentials
          </div>
        </nuxt-link>
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
a {
  text-decoration: none;
  color: black;
}
.reminder-card {
  min-height: 130px;
}
</style>



