<template>
  <section class="billing-section">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-sunglow">
      <nuxt-link
        v-if="authPermissions.includes('View Billings')"
        :to="{ path: '/practice-billing/invoices-from-locums' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('practice-billing-invoices-from-locums')
            || $route.name === 'practice-billing-form-as'
            || $route.name === 'practice-billing-solo-forms'
            ? 'border-b-4 border-sunglow'
            : 'text-gray-600'
        "
      >
        Invoices from Locums
      </nuxt-link>

      <!-- <nuxt-link
        :to="{ name: 'practice-billing-pension-forms-from-locums' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-pension-forms-from-locums') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >Pension forms from Locums</nuxt-link>-->

      <nuxt-link
        v-if="authPermissions.includes('View Billings')"
        :to="{ name: 'practice-billing-invoices-from-hubzz'}"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-hubzz') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >
        Invoices from hubzz
      </nuxt-link>

      <nuxt-link
        v-if="practice
          && (practice.type !== 'Spoke' 
          || (practice.type === 'Spoke' && !practice.parent_practice_id) 
          || (practice.type === 'Spoke' && practice.parent_practice_id && practice.allow_surgery_bill_hubzz))
          && authPermissions.includes('View Billings')"
        :to="{ name: 'practice-billing-invoicing-details' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoicing-details') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >
        Invoicing Details
      </nuxt-link>

      <nuxt-link
        v-if="authPermissions.includes('View Billings')"
        :to="{ name: 'practice-billing-finance-reports-hq-invoice' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-finance-reports') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >
        Finance Reports
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'practice-billing-reports' }"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-reports') ? 'border-b-4 border-sunglow' : 'text-gray-600'"
      >
        Reports
      </nuxt-link>
    </div>

    <div>
      <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
        <div class="flex flex-col">
          <nuxt-link
            v-for="practiceBillingReport in practiceBillingReports"
            :key="`practiceBillingReports-${practiceBillingReport.title}`"
            :to="practiceBillingReport.url"
            class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg shadow-lg hover:bg-gray-300 transition-hover my-2"
          >
            <div class="flex flex-no-wrap items-center text-sm w-full">
              <span class="px-2 whitespace-no-wrap font-semibold">{{ practiceBillingReport.title }}</span>
              <span class="px-2 w-full leading-tight flex items-center">{{ practiceBillingReport.subtitle }}</span>
              <div class="flex items-center px-1 md:px-0">
                <svgicon name="arrow-right" width="21" height="21" color="black" />
              </div>
            </div>
          </nuxt-link>
        </div>
        <nuxt-link
          v-if="$route.name !== 'practice-billing-reports'"
          class="shield z-511 fixed inset-0 opacity-50"
          to="/practice-billing-reports"
        />
        <nuxt-child />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  middleware: "isVerified",

  transition: (to, from) => {
    if (
      (from && from.name.includes('practice-billing'))
      || (to && to.name.includes('practice-billing'))
      || (from && from.name.includes('practice-billing-reports'))
      || (to && to.name.includes('practice-billing-reports'))
      || (from && from.name === 'practice-billing-form-as')
      || (to && to.name === 'practice-billing-form-as')
      || (from && from.name === 'practice-billing-solo-forms')
      || (to && to.name === 'practice-billing-solo-forms')
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
      practice: null,
      practiceBillingReports: [
        {
          title: 'REP-001',
          subtitle: 'Tax and NI Deductions',
          url: '/practice-billing-reports/deductions',
        },
        {
          title: 'REP-002',
          subtitle: 'Payments',
          url: '/practice-billing-reports/payments',
        },
        {
          title: 'REP-003',
          subtitle: 'Pension Contributions',
          url: '/practice-billing-reports/pension-contributions',
        },
        {
          title: 'REP-010',
          subtitle: 'Hubzz Invoices',
          url: '/practice-billing-reports/hubzz-invoices',
        },
      ],
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
  },

  async asyncData ({ app, store, error, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (!app.$auth.user || app.$auth.user.domain === 'Locum') {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })

        return
      }

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('View Practice Reports') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

      if (app.$auth.user.domain === 'Practice' 
        && app.$auth.user.practice_detail 
        && app.$auth.user.practice_detail.practice
        && app.$auth.user.practice_detail.practice.type === 'Spoke'
        && app.$auth.user.practice_detail.practice.parent_practice_id === null) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })

        return
      }

      return {
        practice: app.$auth.user && app.$auth.user.domain === 'Practice' && app.$auth.user.practice_detail
          ? app.$auth.user.practice_detail.practice
          : null,
      }
    } catch (err) {
      console.log('err', err.response || err)
      error(err)
    }
  },

  created () {
    if (
      this.$auth.user
      && this.$auth.user.practice_detail
      && this.$auth.user.practice_detail.practice
      && this.$auth.user.practice_detail.practice.type === 'Spoke'
      && !this.$auth.user.practice_detail.practice.allow_surgery_bill_locum
    ) {
      this.practiceReports = this.practiceReports
        .filter(practiceReport => !['REP-001', 'REP-002', 'REP-003', 'REP-010',].includes(practiceReport.title))
    }
  },

  mounted () {
    if (this.$route.name === "practice-billing") {
      this.$router.push("/practice-billing/invoices-from-locums")
    }
  },
}
</script>
