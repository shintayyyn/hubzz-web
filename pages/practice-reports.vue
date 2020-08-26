<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-4xl">
      Reports [WORK IN PROGRESS]
    </div>

    <div class="text-sm md:text-xl">
      Practice Reports
    </div>

    <div class="flex flex-col">
      <nuxt-link
        v-for="practiceReport in practiceReports"
        :key="`practiceReports-${practiceReport.title}`"
        :to="practiceReport.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg shadow-lg hover:bg-gray-300 transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ practiceReport.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ practiceReport.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="black" />
          </div>
        </div>
      </nuxt-link>
    </div>
    <nuxt-link
      v-if="$route.name !== 'practice-reports'"
      class="shield z-511 fixed inset-0 opacity-50"
      to="/practice-reports"
    />
    <nuxt-child />
  </div>
</template>

<script>
export default {
  data () {
    return {
      practiceReports: [
        {
          title: 'REP-001',
          subtitle: 'Tax and NI Deductions',
          url: '/practice-reports/deductions',
        },
        {
          title: 'REP-002',
          subtitle: 'Payments',
          url: '/practice-reports/payments',
        },
        {
          title: 'REP-003',
          subtitle: 'Pension Contributions',
          url: '/practice-reports/pension-contributions',
        },
        // {
        //   title: 'REP-004',
        //   subtitle: 'Locums on System',
        //   url: '/practice-reports/locums',
        // },
        // {
        //   title: 'REP-005',
        //   subtitle: 'Locums Used/Bank',
        //   url: '/practice-reports/practice-locums',
        // },
        // {
        //   title: 'REP-006',
        //   subtitle: 'Locums Not Successful',
        //   url: '/practice-reports/practice-unsuccessful-locums',
        // },
        {
          title: 'REP-007',
          subtitle: 'Locums that have Declined',
          url: '/practice-reports/practice-declined-locums',
        },
        // {
        //   title: 'REP-008',
        //   subtitle: 'Compliance - Expiring',
        //   url: '/practice-reports/locum-compliance-documents',
        // },
        {
          title: 'REP-009',
          subtitle: 'Locums that Arrive Late',
          url: '/practice-reports/practice-late-locums',
        },
        // {
        //   title: 'REP-010',
        //   subtitle: 'Hubzz Invoices',
        //   url: '/practice-reports/practice-invoices',
        // },
      ],
    }
  },

  created () {
    const userPractice = this.$auth.user.practice_detail.practice
    if (userPractice.type === 'Spoke') {
      if (userPractice.allow_surgery_bill_locum === false) {
        this.practiceReports = this.practiceReports.filter(practiceReport => (practiceReport.title !== 'REP-001' && practiceReport.title !== 'REP-002' && practiceReport.title !== 'REP-003'))
      }
    }
  },
}
</script>
