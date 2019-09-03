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
              <svgicon name="alert" height="20" width="20" />
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
    this.$axios.$get('/api/v1/me').then(res => {
      if (res.data.user.domain === 'Locum') {
        if (res.data.user.locum_detail.gmc_or_nmc_number.status === 'Pending') {
          this.reminders.push({ label: 'Complete your GMC / NMC Number', route: '/compliance' })
        }
        if (res.data.user.locum_detail.mpl_or_npl_number.status === 'Pending') {
          this.reminders.push({ label: 'Complete your MPL / NPL Number', route: '/compliance' })
        }
        if (res.data.user.locum_detail.shifts.length === 0) {
          this.reminders.push({ label: 'Complete your Availability Credentials', route: '/availability' })
        }
        res.data.user.locum_detail.compliance_documents.forEach(document => {
          if ([1, 2, 3, 4].includes(document.compliance_document.id) && document.status !== "Approved") {
            this.reminders.push({ label: 'Complete your Compliance documents', route: '/compliance' })
          }
        })
        if (res.data.user.locum_detail.bank_account) {
          let isBillingComplete = true
          let bank_account = Object.entries(res.data.user.locum_detail.bank_account)
          let invoice_detail = Object.entries(res.data.user.locum_detail.invoice_detail)
          for (const [key, value] of bank_account) {
            if (!value) {
              isBillingComplete = false
            }
          }
          for (const [key, value] of invoice_detail) {
            if (key === 'ir35' && !value) {
              isBillingComplete = false
            }
            if (key === 'tax_year_end_date' && !value) {
              isBillingComplete = false
            }
            if (key === 'tax_year_end_month' && !value) {
              isBillingComplete = false
            }
            if (key === 'employment_type' && !value) {
              isBillingComplete = false
            }
          }
        }
      }
    })
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


