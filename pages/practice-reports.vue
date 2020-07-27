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
        {
          title: 'REP-004',
          subtitle: 'Locums on System',
          url: '/practice-reports/locums',
        },
        {
          title: 'REP-005',
          subtitle: 'Locums Used/Bank',
          url: '/practice-reports/practice-locums',
        },
        {
          title: 'REP-006',
          subtitle: 'Locums Not Successful',
          url: '/practice-reports/practice-unsuccessful-locums',
        },
        {
          title: 'REP-007',
          subtitle: 'Locums that have Declined',
          url: '/practice-reports/practice-declined-locums',
        },
        {
          title: 'REP-008',
          subtitle: 'Compliance - Expiring',
          url: '/practice-reports/locum-compliance-documents',
        },
        {
          title: 'REP-009',
          subtitle: 'Locums that Arrive Late',
          url: '/practice-reports/practice-late-locums',
        },
        {
          title: 'REP-010',
          subtitle: 'Hubzz Invoices',
          url: '/practice-reports/practice-invoices',
        },
      ],
      locumReports: [
        {
          title: 'REP-011',
          subtitle: 'NHS Pension Contributions',
          url: '/practice-reports/locum-pension-contributions',
        },
        {
          title: 'REP-012',
          subtitle: 'Tax Reporting - Money Earnt and Tax and NI Paid',
          url: '/practice-reports/locum-invoices',
        },
        {
          title: 'REP-013',
          subtitle: 'Practices Worked',
          url: '/practice-reports/locum-practices',
        },
        {
          title: 'REP-014',
          subtitle: 'Expenses',
          url: '/practice-reports',
        },
      ],
      complianceReports: [
        {
          title: 'REP-015',
          subtitle: 'Onboarding - Documents Uploaded',
          url: '/practice-reports/locum-uploaded-documents',
        },
        {
          title: 'REP-016',
          subtitle: 'Expiry Report',
          url: '/practice-reports/locum-expiring-compliance-documents',
        },
        {
          title: 'REP-017',
          subtitle: 'Locum Lead Time for Compliance Completed',
          url: '/practice-reports/locum-completed-compliances',
        },
        {
          title: 'REP-018',
          subtitle: 'Practice Lead Time for Activation',
          url: '/practice-reports/activated-practices',
        },
      ],
      hqAnalyticsReports: [
        {
          title: 'REP-019',
          subtitle: 'Locums in an Area',
          url: '/practice-reports/locums-in-an-area',
        },
        {
          title: 'REP-020',
          subtitle: 'Locum Referrals',
          url: '/practice-reports/locum-referrals',
        },
        {
          title: 'REP-021',
          subtitle: 'Locum Practice Referrals',
          url: '/practice-reports/locum-practice-referrals',
        },
        {
          title: 'REP-023',
          subtitle: 'Locums Declined',
          url: '/practice-reports/declined-jobs',
        },
        {
          title: 'REP-024',
          subtitle: 'Practice Cancellations',
          url: '/practice-reports/cancelled-jobs',
        },
        {
          title: 'REP-025',
          subtitle: 'Jobs not Filled',
          url: '/practice-reports/unfilled-jobs',
        },
        {
          title: 'REP-026',
          subtitle: 'Sign Ups Locums',
          url: '/practice-reports/registered-locums',
        },
        {
          title: 'REP-027',
          subtitle: 'Sign Ups Practice',
          url: '/practice-reports/registered-practices',
        },
        {
          title: 'REP-028',
          subtitle: 'Session Notifications',
          url: '/practice-reports/job-parts',
        },
        {
          title: 'REP-029',
          subtitle: 'Locum Usage',
          url: '/practice-reports/locum-usages',
        },
      ],
      pricingReports: [
        {
          title: 'REP-030',
          subtitle: 'Hours Approved',
          url: '/practice-reports/locum-invoice-job-parts',
        },
        {
          title: 'REP-031',
          subtitle: 'Invoices',
          url: '/practice-reports/practice-invoice-items',
        },
      ],
    }
  },
}
</script>

<style>
  .report-modal {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 0%;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 2px #ffc72c;
    transition: all 0.3s ease-in-out;
    background-color:whitesmoke;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .report-modal {
      width: 80%;
    }
  }

  .page-overlap {
    min-width: 100%;
  }

  @media screen and (min-width: 768px) {
    .page-overlap {
      min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap {
      min-width: calc(100% - 200px);
    }
  }
</style>
