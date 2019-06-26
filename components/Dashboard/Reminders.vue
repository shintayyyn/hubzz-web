<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start">
      <div
        class="pr-4 my-4 w-full sm:w-1/2 lg:w-1/4"
        v-for="(item, index) in reminders"
        :key="index"
      >
        <nuxt-link :to="item.route">
          <div class="reminder-card rounded-lg shadow-lg p-4">
            <span class="leading-tight">
              <svgicon name="alert" height="20" width="20"/>
            </span>
            {{item.label}}
          </div>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      reminders: []
    }
  },
  created() {
    if (this.$auth.user.domain === 'Locum') {
      if (this.$auth.user.locum_detail.gmc_or_nmc_number.status === 'Pending') {
        this.reminders.push({ label: 'Complete your GMC / NMC Number', route: '/compliance' })
      }
      if (this.$auth.user.locum_detail.mpl_or_npl_number.status === 'Pending') {
        this.reminders.push({ label: 'Complete your MPL / NPL Number', route: '/compliance' })
      }
      if (this.$auth.user.locum_detail.shifts.length === 0) {
        this.reminders.push({ label: 'Complete your Availability Credentials', route: '/availability' })
      }
      if (this.$auth.user.locum_detail.compliance_documents.filter(document => document.status !== 'Pending').length === 0) {
        this.reminders.push({ label: 'Complete your Compliance documents', route: '/compliance' })
      }
      // ! ask arvi where to check billing address
      if (true) {
        this.reminders.push({ label: 'Complete your Billing address', route: '/billing' })
      }

    }
  },
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


