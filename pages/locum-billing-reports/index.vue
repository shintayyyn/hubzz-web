<template>
  <section class="billing-section">
    <LocumBillingNavigationTabs />

    <div>
      <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
        <div class="flex flex-col">
          <nuxt-link
            v-for="locumBillingReport in locumBillingReports"
            :key="`locumBillingReports-${locumBillingReport.title}`"
            :to="locumBillingReport.url"
            class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg shadow-lg hover:bg-gray-300 transition-hover my-2"
          >
            <div class="flex flex-no-wrap items-center text-sm w-full">
              <span class="px-2 whitespace-no-wrap font-semibold">{{ locumBillingReport.title }}</span>
              <span class="px-2 w-full leading-tight flex items-center">{{ locumBillingReport.subtitle }}</span>
              <div class="flex items-center px-1 md:px-0">
                <svgicon name="arrow-right" width="21" height="21" color="black" />
              </div>
            </div>
          </nuxt-link>
        </div>

        <nuxt-link
          v-if="$route.name !== 'locum-billing-reports'"
          class="shield z-511 fixed inset-0 opacity-50"
          to="/locum-billing-reports"
        /> 
        <nuxt-child />
      </div>
    </div>
  </section>
</template>

<script>
import LocumBillingNavigationTabs from "@/components/LocumBilling/LocumBillingNavigationTabs"
  
export default {
  components: {
    LocumBillingNavigationTabs,
  },

  middleware: "isVerified",

  transition: (to, from) => {
    if (
      (from && from.name.includes('locum-billing'))
      || (to && to.name.includes('locum-billing'))
      || (from && from.name.includes('locum-billing-reports'))
      || (to && to.name.includes('locum-billing-reports'))
      || (from && from.name === 'locum-billing-form-as')
      || (to && to.name === 'locum-billing-form-as')
      || (from && from.name === 'locum-billing-solo-forms')
      || (to && to.name === 'locum-billing-solo-forms')
    ) {
      return {
        name: '',
        mode: 'out-in',
      }
    }
    
    return {
      name: 'page',
      mode: 'out-in',
    }
  },

  data () {
    return {
      locumBillingReports: [
        {
          title: 'REP-011',
          subtitle: 'NHS Pension Contributions',
          url: '/locum-billing-reports/locum-pension-contributions',
        },
        {
          title: 'REP-012',
          subtitle: 'Tax Reporting - Money Earned and Tax and NI Paid',
          url: '/locum-billing-reports/locum-invoice-tax-reports',
        },
        {
          title: 'REP-014',
          subtitle: 'Expenses',
          url: '/locum-billing-reports/locum-expenses',
        },
      ],
    }
  },
}
</script>
